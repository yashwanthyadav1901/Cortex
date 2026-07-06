from datetime import date, datetime
from zoneinfo import ZoneInfo

from app.config import get_settings


def local_today() -> date:
    """Today in the configured timezone — the app's calendar-day anchor.

    Streaks and activity dates must not shift with the server's locale.
    """
    return datetime.now(ZoneInfo(get_settings().timezone)).date()
