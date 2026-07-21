"""Chat and message database models."""

import enum
import uuid

from sqlalchemy import Enum, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class MessageRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Chat(Base, TimestampMixin):
    __tablename__ = "chats"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    title: Mapped[str] = mapped_column(String(255), default="New Chat")

    owner = relationship("User", back_populates="chats")
    messages = relationship(
        "Message", back_populates="chat", cascade="all, delete-orphan", order_by="Message.created_at"
    )


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    chat_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), index=True
    )
    role: Mapped[MessageRole] = mapped_column(Enum(MessageRole))
    content: Mapped[str] = mapped_column(Text)
    citations: Mapped[str | None] = mapped_column(Text, nullable=True)
    confidence_score: Mapped[str | None] = mapped_column(String(20), nullable=True)
    agent_used: Mapped[str | None] = mapped_column(String(100), nullable=True)

    chat = relationship("Chat", back_populates="messages")
