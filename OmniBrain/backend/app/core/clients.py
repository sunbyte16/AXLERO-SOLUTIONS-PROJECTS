"""External service clients."""

import redis.asyncio as aioredis
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, VectorParams

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_redis: aioredis.Redis | None = None
_qdrant: AsyncQdrantClient | None = None


async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis


async def check_redis() -> str:
    try:
        client = await get_redis()
        await client.ping()
        return "healthy"
    except Exception as exc:
        logger.warning("redis_health_check_failed", error=str(exc))
        return "unhealthy"


def get_qdrant() -> AsyncQdrantClient:
    global _qdrant
    if _qdrant is None:
        _qdrant = AsyncQdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
    return _qdrant


async def check_qdrant() -> str:
    try:
        client = get_qdrant()
        await client.get_collections()
        return "healthy"
    except Exception as exc:
        logger.warning("qdrant_health_check_failed", error=str(exc))
        return "unhealthy"


async def ensure_qdrant_collection() -> None:
    client = get_qdrant()
    collections = await client.get_collections()
    names = {c.name for c in collections.collections}
    if settings.QDRANT_COLLECTION not in names:
        await client.create_collection(
            collection_name=settings.QDRANT_COLLECTION,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
        logger.info("qdrant_collection_created", collection=settings.QDRANT_COLLECTION)


