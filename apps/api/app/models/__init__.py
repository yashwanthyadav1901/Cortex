import enum
from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    type_annotation_map = {datetime: DateTime(timezone=True)}


class Pillar(str, enum.Enum):
    system_design = "system_design"
    ai = "ai"
    dsa = "dsa"


class TopicStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    done = "done"


class Difficulty(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class ProjectStatus(str, enum.Enum):
    suggested = "suggested"
    in_progress = "in_progress"
    done = "done"


class ProblemStatus(str, enum.Enum):
    todo = "todo"
    attempted = "attempted"
    solved = "solved"


class ActivityType(str, enum.Enum):
    topic_study = "topic_study"
    project_work = "project_work"
    dsa_solved = "dsa_solved"


from app.models.activity import DailyActivityLog  # noqa: E402
from app.models.dsa_problem import DsaProblem  # noqa: E402
from app.models.plan import Plan  # noqa: E402
from app.models.project import Project  # noqa: E402
from app.models.topic import Topic  # noqa: E402

__all__ = [
    "Base",
    "Pillar",
    "TopicStatus",
    "Difficulty",
    "ProjectStatus",
    "ProblemStatus",
    "ActivityType",
    "Topic",
    "Project",
    "DsaProblem",
    "DailyActivityLog",
    "Plan",
]
