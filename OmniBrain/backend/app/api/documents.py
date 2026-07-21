"""Document API routes."""

import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas import DocumentResponse
from app.services.document_service import DocumentService
from app.services.indexing_service import IndexingService

router = APIRouter()


@router.post("", response_model=DocumentResponse, status_code=201)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DocumentResponse:
    doc = await DocumentService(db).upload(current_user, file)
    background_tasks.add_task(IndexingService().index_document, doc.id)
    return doc


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[DocumentResponse]:
    return await DocumentService(db).list_documents(current_user)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DocumentResponse:
    return await DocumentService(db).get_document(current_user, document_id)


@router.delete("/{document_id}", status_code=204)
async def delete_document(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    await DocumentService(db).delete_document(current_user, document_id)
