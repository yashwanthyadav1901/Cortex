import uuid
from datetime import date, datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import Todo, TodoPriority, TodoStatus
from app.schemas import (
    TodoCreate,
    TodoLogsOut,
    TodoLogsSummary,
    TodoOut,
    TodoReorder,
    TodoUpdate,
)

router = APIRouter(
    prefix="/todos", tags=["todos"], dependencies=[Depends(require_user)]
)


def _get_or_404(db: Session, todo_id: uuid.UUID) -> Todo:
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(404, "Todo not found")
    return todo


@router.get("", response_model=list[TodoOut])
def list_todos(
    status: TodoStatus | None = None,
    priority: TodoPriority | None = None,
    category: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Todo).order_by(Todo.position)
    if status:
        query = query.where(Todo.status == status)
    if priority:
        query = query.where(Todo.priority == priority)
    if category:
        query = query.where(Todo.category == category)
    if search:
        query = query.where(Todo.title.ilike(f"%{search}%"))
    return db.scalars(query).all()


@router.post("", response_model=TodoOut, status_code=201)
def create_todo(body: TodoCreate, db: Session = Depends(get_db)):
    max_pos = db.scalar(select(func.coalesce(func.max(Todo.position), -1)))
    todo = Todo(**body.model_dump(), position=max_pos + 1)
    db.add(todo)
    db.commit()
    return todo


@router.patch("/{todo_id}", response_model=TodoOut)
def update_todo(
    todo_id: uuid.UUID, body: TodoUpdate, db: Session = Depends(get_db)
):
    todo = _get_or_404(db, todo_id)
    updates = body.model_dump(exclude_unset=True)
    old_status = todo.status
    for field, value in updates.items():
        setattr(todo, field, value)
    if "status" in updates:
        if updates["status"] == TodoStatus.done and old_status != TodoStatus.done:
            todo.completed_at = datetime.now(timezone.utc)
        elif updates["status"] == TodoStatus.pending and old_status == TodoStatus.done:
            todo.completed_at = None
    db.commit()
    return todo


@router.delete("/{todo_id}", status_code=204)
def delete_todo(todo_id: uuid.UUID, db: Session = Depends(get_db)):
    db.delete(_get_or_404(db, todo_id))
    db.commit()


@router.put("/reorder", response_model=list[TodoOut])
def reorder_todos(body: TodoReorder, db: Session = Depends(get_db)):
    for position, todo_id in enumerate(body.ids):
        todo = db.get(Todo, todo_id)
        if todo:
            todo.position = position
    db.commit()
    return db.scalars(select(Todo).order_by(Todo.position)).all()


@router.get("/logs", response_model=TodoLogsOut)
def get_logs(db: Session = Depends(get_db)):
    todos = list(
        db.scalars(
            select(Todo)
            .where(Todo.status == TodoStatus.done)
            .order_by(Todo.completed_at.desc().nullslast(), Todo.updated_at.desc())
        ).all()
    )

    now = datetime.now(timezone.utc)
    today = now.date()
    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)

    total_hours: list[float] = []
    on_time = 0
    overdue = 0
    no_deadline = 0
    this_week = 0
    this_month = 0

    for t in todos:
        done_at = t.completed_at or t.updated_at
        hours = (done_at - t.created_at).total_seconds() / 3600
        total_hours.append(hours)

        done_date = done_at.date()
        if done_date >= week_start:
            this_week += 1
        if done_date >= month_start:
            this_month += 1

        if t.due_date is None:
            no_deadline += 1
        elif done_date <= t.due_date:
            on_time += 1
        else:
            overdue += 1

    return TodoLogsOut(
        todos=[TodoOut.model_validate(t) for t in todos],
        summary=TodoLogsSummary(
            total_completed=len(todos),
            avg_completion_hours=sum(total_hours) / len(total_hours) if total_hours else 0,
            on_time_count=on_time,
            overdue_count=overdue,
            no_deadline_count=no_deadline,
            this_week=this_week,
            this_month=this_month,
        ),
    )
