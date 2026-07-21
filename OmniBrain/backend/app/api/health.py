"""Health check endpoints."""

from fastapi import APIRouter
from sqlalchemy import text

from app.core.clients import check_qdrant, check_redis
from app.core.config import settings
from app.core.database import engine
from app.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    db_status = "healthy"
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        db_status = "unhealthy"

    redis_status = await check_redis()
    qdrant_status = await check_qdrant()

    overall = "healthy" if all(
        s == "healthy" for s in [db_status, redis_status, qdrant_status]
    ) else "degraded"

    return HealthResponse(
        status=overall,
        app_name=settings.APP_NAME,
        version="1.0.0",
        services={
            "database": db_status,
            "redis": redis_status,
            "qdrant": qdrant_status,
        },
    )
