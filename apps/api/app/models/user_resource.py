import uuid
from datetime import datetime

from sqlalchemy import Index, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class UserResource(Base):
    __tablename__ = "user_resources"
    __table_args__ = (Index("idx_user_resources_topic", "topic_slug"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    topic_slug: Mapped[str] = mapped_column(nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    url: Mapped[str] = mapped_column(nullable=False)
    note: Mapped[str | None]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
