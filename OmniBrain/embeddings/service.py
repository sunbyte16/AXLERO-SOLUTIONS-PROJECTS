"""Embedding generation and Qdrant / Local storage."""

import json
import os
import uuid
from pathlib import Path

from app.core.clients import ensure_qdrant_collection, get_qdrant
from app.core.config import settings, PROJECT_ROOT
from app.core.logging import get_logger

logger = get_logger(__name__)

LOCAL_CHUNKS_DIR = Path(PROJECT_ROOT) / "storage" / "chunks"


async def _generate_embeddings(texts: list[str]) -> list[list[float]]:
    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is required for embedding generation")

    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=texts,
    )
    return [item.embedding for item in response.data]


async def embed_and_store(document_id: str, chunks: list) -> int:
    LOCAL_CHUNKS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Store locally for reliable fallback retrieval
    chunk_data = [
        {
            "id": str(uuid.uuid4()),
            "document_id": document_id,
            "text": chunk.text,
            "page_number": chunk.page_number,
            "chunk_index": chunk.chunk_index,
            **getattr(chunk, "metadata", {}),
        }
        for chunk in chunks
    ]
    
    chunk_file = LOCAL_CHUNKS_DIR / f"{document_id}.json"
    chunk_file.write_text(json.dumps(chunk_data, indent=2), encoding="utf-8")

    # If OpenAI and Qdrant are available, also store vectors
    if settings.OPENAI_API_KEY:
        try:
            await ensure_qdrant_collection()
            client = get_qdrant()
            texts = [c.text for c in chunks]
            embeddings = await _generate_embeddings(texts)

            from qdrant_client.models import PointStruct
            points = [
                PointStruct(
                    id=item["id"],
                    vector=embedding,
                    payload=item,
                )
                for item, embedding in zip(chunk_data, embeddings, strict=True)
            ]
            await client.upsert(collection_name=settings.QDRANT_COLLECTION, points=points)
            logger.info("embeddings_stored_qdrant", document_id=document_id, count=len(points))
        except Exception as e:
            logger.warning("qdrant_vector_store_skipped", error=str(e))

    logger.info("chunks_stored_locally", document_id=document_id, count=len(chunk_data))
    return len(chunk_data)
