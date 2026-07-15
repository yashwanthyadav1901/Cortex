from datetime import date, datetime, timezone
from zoneinfo import ZoneInfo

from app.config import get_settings


def local_today() -> date:
    """Today in the configured timezone — the app's calendar-day anchor.

    Streaks and activity dates must not shift with the server's locale.
    """
    return datetime.now(ZoneInfo(get_settings().timezone)).date()


def local_day(dt: datetime) -> date:
    """Calendar day of a stored timestamp in the configured timezone.

    Naive datetimes are stored as UTC.
    """
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(ZoneInfo(get_settings().timezone)).date()
