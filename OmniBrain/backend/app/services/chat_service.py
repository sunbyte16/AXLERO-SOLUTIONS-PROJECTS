"""Chat and RAG orchestration service."""

import json
import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.logging import get_logger
from app.models.chat import Chat, Message, MessageRole
from app.models.user import User
from app.schemas import ChatResponse, CitationSchema, MessageCreate, MessageResponse
from app.services.rag_service import RAGService

logger = get_logger(__name__)


class ChatService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.rag = RAGService(db)

    async def create_chat(self, user: User, title: str = "New Chat") -> ChatResponse:
        chat = Chat(owner_id=user.id, title=title)
        self.db.add(chat)
        await self.db.flush()
        await self.db.refresh(chat)
        return ChatResponse.model_validate(chat)

    async def list_chats(self, user: User) -> list[ChatResponse]:
        result = await self.db.execute(
            select(Chat).where(Chat.owner_id == user.id).order_by(Chat.updated_at.desc())
        )
        return [ChatResponse.model_validate(c) for c in result.scalars().all()]

    async def get_messages(self, user: User, chat_id: uuid.UUID) -> list[MessageResponse]:
        chat = await self._get_user_chat(user, chat_id)
        return [self._to_message_response(m) for m in chat.messages]

    async def send_message(
        self, user: User, chat_id: uuid.UUID, data: MessageCreate
    ) -> MessageResponse:
        chat = await self._get_user_chat(user, chat_id)

        user_msg = Message(chat_id=chat.id, role=MessageRole.USER, content=data.content)
        self.db.add(user_msg)
        await self.db.flush()

        rag_result = await self.rag.generate_response(user, data.content)

        assistant_msg = Message(
            chat_id=chat.id,
            role=MessageRole.ASSISTANT,
            content=rag_result.answer,
            citations=json.dumps([c.model_dump() for c in rag_result.citations]),
            confidence_score=str(rag_result.confidence),
            agent_used=rag_result.agent_used,
        )
        self.db.add(assistant_msg)
        await self.db.flush()
        await self.db.refresh(assistant_msg)

        if chat.title == "New Chat":
            chat.title = data.content[:80] + ("..." if len(data.content) > 80 else "")

        return self._to_message_response(assistant_msg)

    async def _get_user_chat(self, user: User, chat_id: uuid.UUID) -> Chat:
        result = await self.db.execute(
            select(Chat)
            .options(selectinload(Chat.messages))
            .where(Chat.id == chat_id, Chat.owner_id == user.id)
        )
        chat = result.scalar_one_or_none()
        if chat is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
        return chat

    def _to_message_response(self, message: Message) -> MessageResponse:
        citations = None
        if message.citations:
            raw = json.loads(message.citations)
            citations = [CitationSchema(**c) for c in raw]
        return MessageResponse(
            id=message.id,
            role=message.role.value,
            content=message.content,
            citations=citations,
            confidence_score=message.confidence_score,
            agent_used=message.agent_used,
            created_at=message.created_at,
        )
