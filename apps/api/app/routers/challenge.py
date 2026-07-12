from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import ChallengeDay
from app.schemas import ChallengeDayOut, ChallengeDayUpdate, ChallengeStatusOut, ChallengeGridDay
from app.utils import local_today

router = APIRouter(prefix="/challenge", tags=["challenge"], dependencies=[Depends(require_user)])

TASK_FIELDS = ["wake_up_early", "workout", "learning", "deep_work", "reading", "water", "meditation"]


def _compute_day_number(db: Session, today) -> int:
    streak = 0
    check_date = today - timedelta(days=1)
    while True:
        row = db.scalar(
            select(ChallengeDay).where(ChallengeDay.challenge_date == check_date)
        )
        if row and row.all_complete:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break
    return streak + 1


def _get_or_create_today(db: Session) -> ChallengeDay:
    today = local_today()
    row = db.scalar(
        select(ChallengeDay).where(ChallengeDay.challenge_date == today)
    )
    if not row:
        day_number = _compute_day_number(db, today)
        row = ChallengeDay(challenge_date=today, day_number=day_number)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("/started")
def has_started(db: Session = Depends(get_db)) -> dict:
    count = db.scalar(select(ChallengeDay.id).limit(1))
    return {"started": count is not None}


@router.post("/start", response_model=ChallengeDayOut, status_code=201)
def start_challenge(db: Session = Depends(get_db)):
    existing = db.scalar(select(ChallengeDay.id).limit(1))
    if existing:
        raise HTTPException(400, "Challenge already started")
    return _get_or_create_today(db)


@router.get("/today", response_model=ChallengeDayOut)
def get_today(db: Session = Depends(get_db)):
    return _get_or_create_today(db)


@router.patch("/today", response_model=ChallengeDayOut)
def update_today(body: ChallengeDayUpdate, db: Session = Depends(get_db)):
    row = _get_or_create_today(db)
    updates = body.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(row, field, value)
    row.all_complete = all(getattr(row, f) for f in TASK_FIELDS)
    db.commit()
    db.refresh(row)
    return row


@router.get("/status", response_model=ChallengeStatusOut)
def get_status(db: Session = Depends(get_db)):
    today = local_today()
    today_row = _get_or_create_today(db)

    all_days = db.scalars(
        select(ChallengeDay).order_by(ChallengeDay.challenge_date)
    ).all()

    total_completed = sum(1 for d in all_days if d.all_complete)

    current_streak = 0
    check_date = today
    for d in reversed(all_days):
        if d.challenge_date == check_date and d.all_complete:
            current_streak += 1
            check_date -= timedelta(days=1)
        elif d.challenge_date == today and not d.all_complete:
            check_date -= timedelta(days=1)
        else:
            break

    best_streak = 0
    running = 0
    prev_date = None
    for d in all_days:
        if d.all_complete:
            if prev_date and d.challenge_date == prev_date + timedelta(days=1):
                running += 1
            else:
                running = 1
            best_streak = max(best_streak, running)
            prev_date = d.challenge_date
        else:
            running = 0
            prev_date = None

    start_date = all_days[0].challenge_date if all_days else today
    elapsed = (today - start_date).days + 1

    grid = [
        ChallengeGridDay(
            date=d.challenge_date,
            complete=d.all_complete,
            day_number=d.day_number,
        )
        for d in all_days
    ]

    return ChallengeStatusOut(
        day_number=today_row.day_number,
        total_completed=total_completed,
        today_complete=today_row.all_complete,
        current_streak=current_streak,
        best_streak=best_streak,
        elapsed_days=elapsed,
        start_date=start_date,
        days=grid,
    )
