"""Database engine and session management."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def _create_engine_for(url: str):
    return create_async_engine(
        url,
        echo=settings.APP_DEBUG,
        pool_pre_ping=True,
    )


engine = _create_engine_for(settings.database_url)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """SQLAlchemy declarative base."""


async def init_db() -> None:
    """Initialize database tables."""
    global engine, AsyncSessionLocal
    from app.models import user, document, chat  # noqa: F401

    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("database_initialized", database_url=settings.database_url)
    except Exception as exc:
        if not settings.can_fallback_to_local_sqlite:
            raise

        logger.warning(
            "database_primary_unavailable_falling_back_to_sqlite",
            database_url=settings.database_url,
            fallback_url=settings.local_sqlite_url,
            error=str(exc),
        )
        await engine.dispose()
        engine = _create_engine_for(settings.local_sqlite_url)
        AsyncSessionLocal = async_sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("database_initialized_with_sqlite_fallback", database_url=settings.local_sqlite_url)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Provide a database session for request scope."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


