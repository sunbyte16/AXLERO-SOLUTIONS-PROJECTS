"""RAG retrieval and generation pipeline."""

import json
import os
import re
import sqlite3
from pathlib import Path

from app.core.config import settings, PROJECT_ROOT, BACKEND_ROOT
from app.core.logging import get_logger

logger = get_logger(__name__)

LOCAL_CHUNKS_DIR = Path(PROJECT_ROOT) / "storage" / "chunks"
UPLOADS_DIR = Path(PROJECT_ROOT) / "storage" / "uploads"
DOCS_DIR = Path(PROJECT_ROOT) / "Docs"
DB_PATH = Path(BACKEND_ROOT) / "omnibrain.db"


def _get_doc_names_map() -> dict[str, str]:
    """Map document UUIDs/filenames to their human-friendly original filenames."""
    mapping: dict[str, str] = {}
    if DB_PATH.exists():
        try:
            conn = sqlite3.connect(str(DB_PATH))
            cur = conn.cursor()
            cur.execute("SELECT id, filename, original_filename FROM documents")
            for doc_id, fname, orig_name in cur.fetchall():
                if orig_name:
                    mapping[str(doc_id)] = orig_name
                    mapping[str(doc_id).replace("-", "")] = orig_name
                    if fname:
                        mapping[fname] = orig_name
                        mapping[Path(fname).stem] = orig_name
            conn.close()
        except Exception:
            pass
    return mapping


def _ensure_uploads_indexed():
    """Ensure any uploaded files in storage/uploads are processed into chunks."""
    if not UPLOADS_DIR.exists():
        return
    LOCAL_CHUNKS_DIR.mkdir(parents=True, exist_ok=True)

    try:
        from ingestion.processor import extract_pdf, extract_text_file, extract_docx
    except ImportError:
        return

    doc_map = _get_doc_names_map()

    for upload_file in UPLOADS_DIR.glob("*.*"):
        stem = upload_file.stem
        chunk_file = LOCAL_CHUNKS_DIR / f"{stem}.json"
        if not chunk_file.exists():
            ext = upload_file.suffix.lower().lstrip(".")
            chunks = []
            try:
                if ext == "pdf":
                    chunks = extract_pdf(str(upload_file))
                elif ext in {"txt", "csv"}:
                    chunks = extract_text_file(str(upload_file))
                elif ext == "docx":
                    chunks = extract_docx(str(upload_file))
            except Exception as e:
                logger.warning("auto_indexing_failed", file=str(upload_file), error=str(e))

            if chunks:
                orig_name = doc_map.get(stem, upload_file.name)
                chunk_data = [
                    {
                        "id": f"{stem}_{c.chunk_index}",
                        "document_id": stem,
                        "document_name": orig_name,
                        "text": c.text,
                        "page_number": c.page_number or 1,
                        "chunk_index": c.chunk_index,
                        **getattr(c, "metadata", {}),
                    }
                    for c in chunks
                ]
                chunk_file.write_text(json.dumps(chunk_data, indent=2), encoding="utf-8")
                logger.info("auto_indexed_upload", file=upload_file.name, count=len(chunk_data))


async def run_rag_pipeline(user_id: str, query: str) -> dict:
    """Execute the full RAG pipeline with agent orchestration."""
    from agents.supervisor import SupervisorAgent

    supervisor = SupervisorAgent()
    return await supervisor.run(user_id=user_id, query=query)


async def search_context(query: str, limit: int = 5) -> list[dict]:
    """Retrieve relevant chunks from Qdrant or local document storage."""
    _ensure_uploads_indexed()
    doc_map = _get_doc_names_map()
    results: list[dict] = []

    # 1. Try Qdrant if OpenAI API key is configured
    if settings.OPENAI_API_KEY:
        try:
            from openai import AsyncOpenAI
            from app.core.clients import get_qdrant

            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            embedding_resp = await client.embeddings.create(
                model="text-embedding-3-small",
                input=query,
            )
            vector = embedding_resp.data[0].embedding
            qdrant = get_qdrant()
            q_results = await qdrant.search(
                collection_name=settings.QDRANT_COLLECTION,
                query_vector=vector,
                limit=limit,
                score_threshold=0.25,
            )
            for hit in q_results:
                raw_id = hit.payload.get("document_id", "Doc")
                friendly_name = hit.payload.get("document_name") or doc_map.get(str(raw_id), f"Document {str(raw_id)[:8]}")
                results.append(
                    {
                        "text": hit.payload.get("text", ""),
                        "document_id": friendly_name,
                        "page_number": hit.payload.get("page_number", 1),
                        "score": float(hit.score),
                        "is_upload": True,
                    }
                )
        except Exception as e:
            logger.warning("qdrant_search_fallback", error=str(e))

    if results:
        return results

    # 2. Local chunk retrieval (from uploaded files in storage/chunks)
    words = [w.lower() for w in re.findall(r"\w+", query) if len(w) > 2]
    
    if LOCAL_CHUNKS_DIR.exists():
        for chunk_file in LOCAL_CHUNKS_DIR.glob("*.json"):
            try:
                data = json.loads(chunk_file.read_text(encoding="utf-8"))
                stem = chunk_file.stem
                friendly_name = doc_map.get(stem, chunk_file.name)
                
                for item in data:
                    text = item.get("text", "")
                    text_lower = text.lower()
                    doc_item_name = item.get("document_name") or friendly_name
                    
                    match_count = sum(1 for w in words if w in text_lower or w in doc_item_name.lower())
                    # Always include uploaded content with baseline score so user gets answers from uploaded PDFs
                    score = min(0.65 + (match_count / max(len(words), 1)) * 0.35, 0.99) if match_count > 0 else 0.60
                    
                    results.append(
                        {
                            "text": text,
                            "document_id": doc_item_name,
                            "page_number": item.get("page_number", 1),
                            "score": round(score, 2),
                            "is_upload": True,
                        }
                    )
            except Exception:
                pass

    # 3. Knowledge base fallback (from Docs/ folder if no uploaded documents match)
    if DOCS_DIR.exists() and len(results) < limit:
        for doc_path in DOCS_DIR.glob("*.md"):
            try:
                content = doc_path.read_text(encoding="utf-8", errors="ignore")
                sections = content.split("\n## ")
                for i, sec in enumerate(sections):
                    sec_text = sec if sec.startswith("## ") else f"## {sec}"
                    sec_lower = sec_text.lower()
                    match_count = sum(1 for w in words if w in sec_lower)
                    if match_count > 0 or len(results) == 0:
                        score = min(0.50 + (match_count / max(len(words), 1)) * 0.4, 0.90)
                        results.append(
                            {
                                "text": sec_text.strip()[:1000],
                                "document_id": doc_path.name,
                                "page_number": i + 1,
                                "score": round(score, 2),
                                "is_upload": False,
                            }
                        )
            except Exception:
                pass

    # Prioritize uploaded documents first, then score descending
    results.sort(key=lambda x: (x.get("is_upload", False), x["score"]), reverse=True)
    return results[:limit]
