import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import Todo, TodoPriority, TodoStatus
from app.schemas import TodoCreate, TodoOut, TodoReorder, TodoUpdate

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
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(todo, field, value)
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
