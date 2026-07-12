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
    ai_agents = "ai_agents"


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


class TodoPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TodoStatus(str, enum.Enum):
    pending = "pending"
    done = "done"


from app.models.activity import DailyActivityLog  # noqa: E402
from app.models.bookmark import Bookmark  # noqa: E402
from app.models.challenge_day import ChallengeDay  # noqa: E402
from app.models.dsa_problem import DsaProblem  # noqa: E402
from app.models.microlearning import Microlearning  # noqa: E402
from app.models.project import Project  # noqa: E402
from app.models.quiz import Quiz  # noqa: E402
from app.models.todo import Todo  # noqa: E402
from app.models.topic import Topic  # noqa: E402
from app.models.user_resource import UserResource  # noqa: E402
from app.models.user_setting import UserSetting  # noqa: E402

__all__ = [
    "Base",
    "Pillar",
    "TopicStatus",
    "Difficulty",
    "ProjectStatus",
    "ProblemStatus",
    "ActivityType",
    "TodoPriority",
    "TodoStatus",
    "Topic",
    "Project",
    "DsaProblem",
    "DailyActivityLog",
    "ChallengeDay",
    "Todo",
    "Microlearning",
    "Quiz",
    "UserResource",
    "UserSetting",
    "Bookmark",
]
