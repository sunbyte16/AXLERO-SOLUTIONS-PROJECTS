"""Document upload and management service."""

import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import get_logger
from app.models.document import Document, DocumentStatus
from app.models.user import User
from app.schemas import DocumentResponse

logger = get_logger(__name__)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".csv", ".xlsx", ".png", ".jpg", ".jpeg"}


class DocumentService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.storage_path = Path(settings.STORAGE_PATH)
        self.storage_path.mkdir(parents=True, exist_ok=True)

    async def upload(self, user: User, file: UploadFile) -> DocumentResponse:
        if file.filename is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Filename required")

        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
            )

        content = await file.read()
        if len(content) > settings.max_upload_size_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit",
            )

        doc_id = uuid.uuid4()
        safe_name = f"{doc_id}{ext}"
        file_path = self.storage_path / safe_name
        file_path.write_bytes(content)

        document = Document(
            id=doc_id,
            owner_id=user.id,
            filename=safe_name,
            original_filename=file.filename,
            file_type=ext.lstrip("."),
            file_size=len(content),
            storage_path=str(file_path),
            status=DocumentStatus.PENDING,
        )
        self.db.add(document)
        await self.db.flush()
        await self.db.refresh(document)

        logger.info("document_uploaded", document_id=str(doc_id), user_id=str(user.id))
        return DocumentResponse.model_validate(document)

    async def list_documents(self, user: User) -> list[DocumentResponse]:
        result = await self.db.execute(
            select(Document).where(Document.owner_id == user.id).order_by(Document.created_at.desc())
        )
        return [DocumentResponse.model_validate(d) for d in result.scalars().all()]

    async def get_document(self, user: User, document_id: uuid.UUID) -> DocumentResponse:
        result = await self.db.execute(
            select(Document).where(Document.id == document_id, Document.owner_id == user.id)
        )
        document = result.scalar_one_or_none()
        if document is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        return DocumentResponse.model_validate(document)

    async def delete_document(self, user: User, document_id: uuid.UUID) -> None:
        result = await self.db.execute(
            select(Document).where(Document.id == document_id, Document.owner_id == user.id)
        )
        document = result.scalar_one_or_none()
        if document is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

        path = Path(document.storage_path)
        if path.exists():
            path.unlink()

        await self.db.delete(document)
