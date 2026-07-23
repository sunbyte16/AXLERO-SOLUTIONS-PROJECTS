"""Document ingestion and content extraction."""

from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader


@dataclass
class DocumentChunk:
    text: str
    page_number: int | None
    chunk_index: int
    metadata: dict[str, str]


CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


def _split_text(text: str, page_number: int | None = None) -> list[DocumentChunk]:
    words = text.split()
    chunks: list[DocumentChunk] = []
    start = 0
    index = 0

    while start < len(words):
        end = min(start + CHUNK_SIZE, len(words))
        chunk_text = " ".join(words[start:end])
        if chunk_text.strip():
            chunks.append(
                DocumentChunk(
                    text=chunk_text,
                    page_number=page_number,
                    chunk_index=index,
                    metadata={"page": str(page_number) if page_number else "unknown"},
                )
            )
            index += 1
        if end >= len(words):
            break
        start = end - CHUNK_OVERLAP

    return chunks


def extract_pdf(file_path: str) -> list[DocumentChunk]:
    reader = PdfReader(file_path)
    all_chunks: list[DocumentChunk] = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        all_chunks.extend(_split_text(text, page_number=i + 1))
    return all_chunks


def extract_text_file(file_path: str) -> list[DocumentChunk]:
    text = Path(file_path).read_text(encoding="utf-8", errors="ignore")
    return _split_text(text)


def extract_docx(file_path: str) -> list[DocumentChunk]:
    from docx import Document as DocxDocument

    doc = DocxDocument(file_path)
    text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    return _split_text(text)


async def process_document(document_id: str, file_path: str, file_type: str) -> int:
    """Extract, embed, and store document chunks. Returns chunk count."""
    ext = file_type.lower()

    if ext == "pdf":
        chunks = extract_pdf(file_path)
    elif ext in {"txt", "csv"}:
        chunks = extract_text_file(file_path)
    elif ext == "docx":
        chunks = extract_docx(file_path)
    else:
        chunks = extract_text_file(file_path) if Path(file_path).exists() else []

    if not chunks:
        return 0

    from embeddings.service import embed_and_store

    return await embed_and_store(document_id=document_id, chunks=chunks)
