import uuid
from datetime import date

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import ActivityType, DailyActivityLog
from app.utils import local_today


def log_activity(
    db: Session,
    activity_type: ActivityType,
    topic_id: uuid.UUID | None = None,
    dsa_problem_id: uuid.UUID | None = None,
    activity_date: date | None = None,
) -> None:
    """Record an activity for the streak. Idempotent per (day, type, entity)."""
    db.execute(
        insert(DailyActivityLog)
        .values(
            activity_date=activity_date or local_today(),
            activity_type=activity_type,
            topic_id=topic_id,
            dsa_problem_id=dsa_problem_id,
        )
        .on_conflict_do_nothing()
    )
