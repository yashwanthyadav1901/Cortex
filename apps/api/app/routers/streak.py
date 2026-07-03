from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.schemas import ActivityCreate, StreakOut
from app.services.activity import log_activity
from app.services.streak import compute_streak

router = APIRouter(tags=["streak"], dependencies=[Depends(require_user)])


@router.get("/streak", response_model=StreakOut)
def get_streak(db: Session = Depends(get_db)):
    return compute_streak(db)


@router.post("/activity", response_model=StreakOut, status_code=201)
def record_activity(body: ActivityCreate, db: Session = Depends(get_db)):
    """Manual activity log (e.g. 'studied a topic today' from the dashboard)."""
    log_activity(
        db,
        body.activity_type,
        topic_id=body.topic_id,
        dsa_problem_id=body.dsa_problem_id,
        activity_date=body.activity_date,
    )
    db.commit()
    return compute_streak(db)
