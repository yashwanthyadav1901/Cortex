import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import ActivityType, Difficulty, DsaProblem, ProblemStatus
from app.schemas import DsaProblemCreate, DsaProblemOut, DsaProblemUpdate
from app.services.activity import log_activity

router = APIRouter(
    prefix="/dsa-problems", tags=["dsa"], dependencies=[Depends(require_user)]
)


def _get_or_404(db: Session, problem_id: uuid.UUID) -> DsaProblem:
    problem = db.get(DsaProblem, problem_id)
    if problem is None:
        raise HTTPException(404, "Problem not found")
    return problem


@router.get("", response_model=list[DsaProblemOut])
def list_problems(
    topic_tag: str | None = None,
    difficulty: Difficulty | None = None,
    status: ProblemStatus | None = None,
    db: Session = Depends(get_db),
):
    query = select(DsaProblem).order_by(DsaProblem.created_at)
    if topic_tag:
        query = query.where(DsaProblem.topic_tag == topic_tag)
    if difficulty:
        query = query.where(DsaProblem.difficulty == difficulty)
    if status:
        query = query.where(DsaProblem.status == status)
    return db.scalars(query).all()


@router.post("", response_model=DsaProblemOut, status_code=201)
def create_problem(body: DsaProblemCreate, db: Session = Depends(get_db)):
    problem = DsaProblem(**body.model_dump())
    db.add(problem)
    db.commit()
    return problem


@router.patch("/{problem_id}", response_model=DsaProblemOut)
def update_problem(
    problem_id: uuid.UUID, body: DsaProblemUpdate, db: Session = Depends(get_db)
):
    problem = _get_or_404(db, problem_id)
    updates = body.model_dump(exclude_unset=True)
    newly_solved = (
        updates.get("status") == ProblemStatus.solved
        and problem.status != ProblemStatus.solved
    )
    for field, value in updates.items():
        setattr(problem, field, value)
    if newly_solved:
        problem.date_solved = date.today()
        log_activity(db, ActivityType.dsa_solved, dsa_problem_id=problem.id)
    db.commit()
    return problem


@router.delete("/{problem_id}", status_code=204)
def delete_problem(problem_id: uuid.UUID, db: Session = Depends(get_db)):
    db.delete(_get_or_404(db, problem_id))
    db.commit()
