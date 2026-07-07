import uuid
from datetime import date, datetime

from sqlalchemy import Enum, Index, Integer, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base, TodoPriority, TodoStatus


class Todo(Base):
    __tablename__ = "todos"
    __table_args__ = (
        Index("idx_todos_filter", "status", "priority"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str | None]
    status: Mapped[TodoStatus] = mapped_column(
        Enum(TodoStatus, name="todo_status"),
        nullable=False,
        server_default=TodoStatus.pending.value,
    )
    priority: Mapped[TodoPriority] = mapped_column(
        Enum(TodoPriority, name="todo_priority"),
        nullable=False,
        server_default=TodoPriority.medium.value,
    )
    due_date: Mapped[date | None]
    category: Mapped[str | None]
    position: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )
