import uuid
from datetime import date, datetime

from sqlalchemy import Index, UniqueConstraint, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class ChallengeDay(Base):
    __tablename__ = "challenge_days"
    __table_args__ = (
        UniqueConstraint("challenge_date"),
        Index("idx_challenge_date", "challenge_date", postgresql_using="btree"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    challenge_date: Mapped[date] = mapped_column(nullable=False)
    day_number: Mapped[int] = mapped_column(nullable=False, default=1)
    wake_up_early: Mapped[bool] = mapped_column(default=False)
    workout: Mapped[bool] = mapped_column(default=False)
    learning: Mapped[bool] = mapped_column(default=False)
    deep_work: Mapped[bool] = mapped_column(default=False)
    reading: Mapped[bool] = mapped_column(default=False)
    water: Mapped[bool] = mapped_column(default=False)
    meditation: Mapped[bool] = mapped_column(default=False)
    all_complete: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )
