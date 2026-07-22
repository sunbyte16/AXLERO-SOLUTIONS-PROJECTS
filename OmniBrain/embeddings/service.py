"""Embedding generation and Qdrant storage."""

import uuid

from qdrant_client.models import PointStruct

from app.core.clients import ensure_qdrant_collection, get_qdrant
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


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
    await ensure_qdrant_collection()
    client = get_qdrant()

    texts = [c.text for c in chunks]
    embeddings = await _generate_embeddings(texts)

    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={
                "document_id": document_id,
                "text": chunk.text,
                "page_number": chunk.page_number,
                "chunk_index": chunk.chunk_index,
                **chunk.metadata,
            },
        )
        for chunk, embedding in zip(chunks, embeddings, strict=True)
    ]

    await client.upsert(collection_name=settings.QDRANT_COLLECTION, points=points)
    logger.info("embeddings_stored", document_id=document_id, count=len(points))
    return len(points)
