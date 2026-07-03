from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import DailyActivityLog
from app.schemas import StreakOut


def compute_streak(db: Session, today: date | None = None) -> StreakOut:
    """Count consecutive active days walking back from today.

    Today counts if active, but a quiet today doesn't break the streak —
    it isn't over until the day ends.
    """
    today = today or date.today()
    days = db.scalars(
        select(DailyActivityLog.activity_date)
        .distinct()
        .order_by(DailyActivityLog.activity_date.desc())
    ).all()

    if not days:
        return StreakOut(current_streak=0, last_activity_date=None, active_today=False)

    active_today = days[0] == today
    streak = 0
    expected = today if active_today else today - timedelta(days=1)
    for day in days:
        if day == expected:
            streak += 1
            expected -= timedelta(days=1)
        else:
            break

    return StreakOut(
        current_streak=streak,
        last_activity_date=days[0],
        active_today=active_today,
    )
