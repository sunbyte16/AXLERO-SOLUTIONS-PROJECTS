"""Background document indexing service."""

import uuid

from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.core.logging import get_logger
from app.models.document import Document, DocumentStatus
from app.services.rag_service import RAGService

logger = get_logger(__name__)


class IndexingService:
    async def index_document(self, document_id: uuid.UUID) -> None:
        """Process and index a document in a background task."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(Document).where(Document.id == document_id))
            document = result.scalar_one_or_none()
            if document is None:
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
                document.error_message = None
                logger.info("document_indexed", document_id=str(document_id), chunks=chunk_count)
            except Exception as exc:
                document.status = DocumentStatus.FAILED
                document.error_message = str(exc)
                logger.error("document_index_failed", document_id=str(document_id), error=str(exc))

            await session.commit()
