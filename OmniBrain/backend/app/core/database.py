"""Database engine and session management."""

import json
import time
import urllib.request
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


#region debug-point C:db-session-reporting
def _report_debug_event(hypothesis_id: str, msg: str, data: dict | None = None) -> None:
    try:
        debug_url = "http://127.0.0.1:7777/event"
        session_id = "register-500-error"
        with open(".dbg/register-500-error.env", "r", encoding="utf-8") as env_file:
            for line in env_file:
                if line.startswith("DEBUG_SERVER_URL="):
                    debug_url = line.split("=", 1)[1].strip() or debug_url
                elif line.startswith("DEBUG_SESSION_ID="):
                    session_id = line.split("=", 1)[1].strip() or session_id
        payload = {
            "sessionId": session_id,
            "runId": "pre-fix",
            "hypothesisId": hypothesis_id,
            "location": "backend/app/core/database.py",
            "msg": f"[DEBUG] {msg}",
            "data": data or {},
            "ts": int(time.time() * 1000),
        }
        request = urllib.request.Request(
            debug_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )
        urllib.request.urlopen(request, timeout=2).read()
    except Exception:
        pass
#endregion


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
            #region debug-point C:db-session-rollback
            _report_debug_event("C", "database session rollback triggered", {})
            #endregion
            await session.rollback()
            raise
