"""Shared model utilities."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column


class TimestampMixin:
    """Created/updated timestamp columns."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


def uuid_pk() -> Mapped[uuid.UUID]:
    return mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
