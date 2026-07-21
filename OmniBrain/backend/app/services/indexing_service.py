"""Background document indexing service."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.core.logging import get_logger
from app.models.document import Document, DocumentStatus
from app.services.rag_service import RAGService

logger = get_logger(__name__)


class IndexingService:
    async def index_document(self, document_id: uuid.UUID) -> None:
        """Process and index a document in a background task."""
        engine = create_async_engine(settings.database_url)
        session_factory = async_sessionmaker(engine, expire_on_commit=False)

        async with session_factory() as session:
            result = await session.execute(select(Document).where(Document.id == document_id))
            document = result.scalar_one_or_none()
            if document is None:
                await engine.dispose()
                return

            document.status = DocumentStatus.PROCESSING
            await session.commit()

            try:
                rag = RAGService(session)
                chunk_count = await rag.process_document(
                    document_id=str(document.id),
                    file_path=document.storage_path,
                    file_type=document.file_type,
                )
                document.status = DocumentStatus.INDEXED
                document.chunk_count = chunk_count
                logger.info("document_indexed", document_id=str(document_id), chunks=chunk_count)
            except Exception as exc:
                document.status = DocumentStatus.FAILED
                document.error_message = str(exc)
                logger.error("document_index_failed", document_id=str(document_id), error=str(exc))

            await session.commit()

        await engine.dispose()
