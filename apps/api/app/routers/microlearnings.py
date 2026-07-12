import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import Microlearning
from app.schemas import MicrolearningCreate, MicrolearningOut, MicrolearningUpdate

router = APIRouter(
    prefix="/microlearnings",
    tags=["microlearnings"],
    dependencies=[Depends(require_user)],
)


def _get_or_404(db: Session, ml_id: uuid.UUID) -> Microlearning:
    ml = db.get(Microlearning, ml_id)
    if ml is None:
        raise HTTPException(404, "Microlearning not found")
    return ml


@router.get("", response_model=list[MicrolearningOut])
def list_microlearnings(
    tag: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Microlearning).order_by(Microlearning.created_at.desc())
    if tag:
        query = query.where(Microlearning.tags.any(tag))
    if search:
        pattern = f"%{search}%"
        query = query.where(
            or_(Microlearning.title.ilike(pattern), Microlearning.body.ilike(pattern))
        )
    return db.scalars(query).all()


@router.post("", response_model=MicrolearningOut, status_code=201)
def create_microlearning(body: MicrolearningCreate, db: Session = Depends(get_db)):
    ml = Microlearning(**body.model_dump())
    db.add(ml)
    db.commit()
    return ml


@router.patch("/{ml_id}", response_model=MicrolearningOut)
def update_microlearning(
    ml_id: uuid.UUID, body: MicrolearningUpdate, db: Session = Depends(get_db)
):
    ml = _get_or_404(db, ml_id)
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(ml, field, value)
    db.commit()
    return ml


@router.delete("/{ml_id}", status_code=204)
def delete_microlearning(ml_id: uuid.UUID, db: Session = Depends(get_db)):
    db.delete(_get_or_404(db, ml_id))
    db.commit()
