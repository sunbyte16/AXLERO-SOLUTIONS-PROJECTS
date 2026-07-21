"""Chat API routes."""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas import ChatCreate, ChatResponse, MessageCreate, MessageResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("", response_model=ChatResponse, status_code=201)
async def create_chat(
    data: ChatCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ChatResponse:
    return await ChatService(db).create_chat(current_user, data.title)


@router.get("", response_model=list[ChatResponse])
async def list_chats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ChatResponse]:
    return await ChatService(db).list_chats(current_user)


@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
async def get_messages(
    chat_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[MessageResponse]:
    return await ChatService(db).get_messages(current_user, chat_id)


@router.post("/{chat_id}/messages", response_model=MessageResponse)
async def send_message(
    chat_id: uuid.UUID,
    data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    return await ChatService(db).send_message(current_user, chat_id, data)
