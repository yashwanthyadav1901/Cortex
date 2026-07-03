import uuid
from datetime import date, datetime

from sqlalchemy import Enum, ForeignKey, Index, UniqueConstraint, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models import ActivityType, Base


class DailyActivityLog(Base):
    __tablename__ = "daily_activity_log"
    __table_args__ = (
        # Idempotent "mark as done": same activity for same entity same day = one row
        UniqueConstraint(
            "activity_date",
            "activity_type",
            "topic_id",
            "dsa_problem_id",
            postgresql_nulls_not_distinct=True,
        ),
        Index("idx_activity_date", "activity_date", postgresql_using="btree"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    activity_date: Mapped[date] = mapped_column(nullable=False)
    activity_type: Mapped[ActivityType] = mapped_column(
        Enum(ActivityType, name="activity_type"), nullable=False
    )
    topic_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("topics.id", ondelete="SET NULL")
    )
    dsa_problem_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("dsa_problems.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
