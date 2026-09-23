"""OmniBrain FastAPI application."""

import sys
from pathlib import Path
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings, PROJECT_ROOT, BACKEND_ROOT

# Ensure both PROJECT_ROOT (OmniBrain) and BACKEND_ROOT (OmniBrain/backend) are in sys.path
for p in [str(PROJECT_ROOT), str(BACKEND_ROOT)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app.api.router import api_router
from app.core.database import init_db
from app.core.logging import configure_logging, get_logger

configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application startup and shutdown lifecycle."""
    logger.info("starting_application", app_name=settings.APP_NAME, env=settings.APP_ENV)
    await init_db()
    yield
    logger.info("shutting_down_application")


app = FastAPI(
    title=settings.APP_NAME,
    description="Enterprise Agentic Multi-Modal RAG Orchestrator",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.APP_DEBUG else None,
    redoc_url="/redoc" if settings.APP_DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
