import uuid
from datetime import date, datetime

from sqlalchemy import Enum, Index, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base, Difficulty, ProblemStatus


class DsaProblem(Base):
    __tablename__ = "dsa_problems"
    __table_args__ = (
        Index("idx_dsa_problems_filter", "topic_tag", "difficulty", "status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    title: Mapped[str] = mapped_column(nullable=False)
    topic_tag: Mapped[str] = mapped_column(nullable=False)
    difficulty: Mapped[Difficulty] = mapped_column(
        Enum(Difficulty, name="difficulty"), nullable=False
    )
    status: Mapped[ProblemStatus] = mapped_column(
        Enum(ProblemStatus, name="problem_status"),
        nullable=False,
        server_default=ProblemStatus.todo.value,
    )
    url: Mapped[str | None]
    date_solved: Mapped[date | None]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
