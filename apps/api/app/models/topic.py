import uuid
from datetime import datetime

from sqlalchemy import Enum, UniqueConstraint, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base, Difficulty, Pillar, TopicStatus


class Topic(Base):
    __tablename__ = "topics"
    __table_args__ = (UniqueConstraint("pillar", "name"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    pillar: Mapped[Pillar] = mapped_column(Enum(Pillar, name="pillar"), nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[TopicStatus] = mapped_column(
        Enum(TopicStatus, name="topic_status"),
        nullable=False,
        server_default=TopicStatus.not_started.value,
    )
    difficulty: Mapped[Difficulty] = mapped_column(
        Enum(Difficulty, name="difficulty"),
        nullable=False,
        server_default=Difficulty.medium.value,
    )
    notes: Mapped[str | None]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )
