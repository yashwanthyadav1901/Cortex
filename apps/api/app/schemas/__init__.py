import uuid
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

from app.models import (
    ActivityType,
    Difficulty,
    Pillar,
    ProblemStatus,
    ProjectStatus,
    TodoPriority,
    TodoStatus,
    TopicStatus,
)


class _OrmModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---- Topics ----

class TopicCreate(BaseModel):
    pillar: Pillar
    name: str
    status: TopicStatus = TopicStatus.not_started
    difficulty: Difficulty = Difficulty.medium
    notes: str | None = None


class TopicUpdate(BaseModel):
    name: str | None = None
    status: TopicStatus | None = None
    difficulty: Difficulty | None = None
    notes: str | None = None


class TopicOut(_OrmModel):
    id: uuid.UUID
    pillar: Pillar
    name: str
    status: TopicStatus
    difficulty: Difficulty
    notes: str | None
    created_at: datetime
    updated_at: datetime


# ---- Projects ----

class ProjectCreate(BaseModel):
    topic_id: uuid.UUID | None = None
    title: str
    description: str | None = None
    status: ProjectStatus = ProjectStatus.suggested


class ProjectUpdate(BaseModel):
    topic_id: uuid.UUID | None = None
    title: str | None = None
    description: str | None = None
    status: ProjectStatus | None = None


class ProjectOut(_OrmModel):
    id: uuid.UUID
    topic_id: uuid.UUID | None
    title: str
    description: str | None
    status: ProjectStatus
    created_at: datetime
    updated_at: datetime


# ---- DSA problems ----

class DsaProblemCreate(BaseModel):
    title: str
    topic_tag: str
    difficulty: Difficulty
    status: ProblemStatus = ProblemStatus.todo
    url: str | None = None


class DsaProblemUpdate(BaseModel):
    title: str | None = None
    topic_tag: str | None = None
    difficulty: Difficulty | None = None
    status: ProblemStatus | None = None
    url: str | None = None


class DsaProblemOut(_OrmModel):
    id: uuid.UUID
    title: str
    topic_tag: str
    difficulty: Difficulty
    status: ProblemStatus
    url: str | None
    date_solved: date | None
    created_at: datetime


# ---- Activity / streak ----

class ActivityCreate(BaseModel):
    activity_type: ActivityType
    topic_id: uuid.UUID | None = None
    dsa_problem_id: uuid.UUID | None = None
    activity_date: date | None = None  # defaults to today server-side


class StreakOut(BaseModel):
    current_streak: int
    last_activity_date: date | None
    active_today: bool


# ---- Roadmap progress ----

class ProgressUpdate(BaseModel):
    pillar: Pillar
    name: str
    status: TopicStatus
    notes: str | None = None


class ProgressTopicOut(_OrmModel):
    slug: str
    pillar: Pillar
    name: str
    status: TopicStatus
    notes: str | None


# ---- AI topic chat ----

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatTopic(BaseModel):
    pillar: str
    title: str
    summary: str | None = None
    why: str | None = None
    tasks: list[str] = []


class ChatRequest(BaseModel):
    topic: ChatTopic | None = None
    messages: list[ChatMessage]  # full history; last item is the new user question


# ---- Todos ----

class TodoCreate(BaseModel):
    title: str
    description: str | None = None
    priority: TodoPriority = TodoPriority.medium
    due_date: date | None = None
    category: str | None = None


class TodoUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: TodoStatus | None = None
    priority: TodoPriority | None = None
    due_date: date | None = None
    category: str | None = None


class TodoOut(_OrmModel):
    id: uuid.UUID
    title: str
    description: str | None
    status: TodoStatus
    priority: TodoPriority
    due_date: date | None
    category: str | None
    position: int
    created_at: datetime
    updated_at: datetime


class TodoReorder(BaseModel):
    ids: list[uuid.UUID]


# ---- Microlearnings ----

class MicrolearningCreate(BaseModel):
    title: str
    body: str
    tags: list[str] = []


class MicrolearningUpdate(BaseModel):
    title: str | None = None
    body: str | None = None
    tags: list[str] | None = None


class MicrolearningOut(_OrmModel):
    id: uuid.UUID
    title: str
    body: str
    tags: list[str]
    created_at: datetime
    updated_at: datetime


# ---- User resources ----

class UserResourceCreate(BaseModel):
    topic_slug: str
    title: str
    url: str
    note: str | None = None


class UserResourceOut(_OrmModel):
    id: uuid.UUID
    topic_slug: str
    title: str
    url: str
    note: str | None
    created_at: datetime


# ---- Activity endpoints ----

class HeatmapDay(BaseModel):
    date: date
    count: int


class ActivityOut(_OrmModel):
    id: uuid.UUID
    activity_date: date
    activity_type: ActivityType
    topic_id: uuid.UUID | None
    dsa_problem_id: uuid.UUID | None
    created_at: datetime


class WeeklySummary(BaseModel):
    total_activities: int
    days_active: int
    activities_by_type: dict[str, int]


# ---- User settings ----

class SettingOut(BaseModel):
    key: str
    value: dict | int | str | list | bool | None


class SettingUpdate(BaseModel):
    value: dict | int | str | list | bool | None


# ---- Bookmarks ----

class WeekComparison(BaseModel):
    total: int
    days_active: int


class AnalyticsTotals(BaseModel):
    activities: int
    topics_done: int
    topics_in_progress: int
    dsa_solved: int
    projects_done: int


class AnalyticsSummary(BaseModel):
    daily_counts: list[HeatmapDay]
    by_type: dict[str, int]
    by_pillar: dict[str, int]
    this_week: WeekComparison
    last_week: WeekComparison
    totals: AnalyticsTotals


class BookmarkCreate(BaseModel):
    slug: str
    type: Literal["topic", "project"]


class BookmarkOut(_OrmModel):
    id: uuid.UUID
    slug: str
    type: str
    created_at: datetime


# ---- Quizzes ----

class QuizGenerateRequest(BaseModel):
    topic_slug: str
    title: str
    summary: str | None = None
    why: str | None = None
    tasks: list[str] = []


class QuizSubmitRequest(BaseModel):
    answers: list[int]


class QuizOut(_OrmModel):
    id: uuid.UUID
    topic_slug: str
    questions: list[dict]
    score: int | None
    total: int
    completed_at: datetime | None
    created_at: datetime


# ---- Recommendations ----

class RecommendRequest(BaseModel):
    progress: dict[str, str]  # slug -> status
    topics: list[dict]  # [{slug, title, pillar}]


class RecommendationOut(BaseModel):
    slug: str
    title: str
    pillar: str
    reason: str


# ---- 75 Hard Challenge ----

class ChallengeDayOut(_OrmModel):
    id: uuid.UUID
    challenge_date: date
    day_number: int
    wake_up_early: bool
    workout: bool
    learning: bool
    deep_work: bool
    reading: bool
    water: bool
    meditation: bool
    all_complete: bool
    created_at: datetime
    updated_at: datetime


class ChallengeDayUpdate(BaseModel):
    wake_up_early: bool | None = None
    workout: bool | None = None
    learning: bool | None = None
    deep_work: bool | None = None
    reading: bool | None = None
    water: bool | None = None
    meditation: bool | None = None


class ChallengeGridDay(BaseModel):
    date: date
    complete: bool
    day_number: int


class ChallengeStatusOut(BaseModel):
    day_number: int
    total_completed: int
    today_complete: bool
    current_streak: int
    best_streak: int
    elapsed_days: int
    start_date: date
    days: list[ChallengeGridDay]
