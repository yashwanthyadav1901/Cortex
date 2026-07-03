from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import Plan
from app.schemas import PlanGenerateRequest, PlanOut
from app.services.planner.generator import generate_weekly_plan, week_start

router = APIRouter(tags=["plans"], dependencies=[Depends(require_user)])


@router.post("/generate-plan", response_model=PlanOut)
def generate_plan(body: PlanGenerateRequest, db: Session = Depends(get_db)):
    if not 1 <= body.available_hours <= 80:
        raise HTTPException(422, "available_hours must be between 1 and 80")
    try:
        return generate_weekly_plan(db, body.available_hours)
    except ValueError as exc:
        raise HTTPException(502, f"Plan generation failed: {exc}") from exc


@router.get("/plan/current", response_model=PlanOut | None)
def current_plan(db: Session = Depends(get_db)):
    return db.scalars(select(Plan).where(Plan.week_start_date == week_start())).first()


@router.get("/plans", response_model=list[PlanOut])
def plan_history(db: Session = Depends(get_db)):
    return db.scalars(select(Plan).order_by(Plan.week_start_date.desc())).all()
