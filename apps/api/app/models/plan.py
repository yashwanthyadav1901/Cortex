import uuid
from datetime import date, datetime
from typing import Any

from sqlalchemy import func, text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    week_start_date: Mapped[date] = mapped_column(unique=True, nullable=False)
    available_hours: Mapped[int] = mapped_column(nullable=False)
    generated_json: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    model: Mapped[str | None]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
