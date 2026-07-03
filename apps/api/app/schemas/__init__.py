import uuid
from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from app.models import (
    ActivityType,
    Difficulty,
    Pillar,
    ProblemStatus,
    ProjectStatus,
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


# ---- Plans ----

class PlanGenerateRequest(BaseModel):
    available_hours: int


class PlanOut(_OrmModel):
    id: uuid.UUID
    week_start_date: date
    available_hours: int
    generated_json: dict[str, Any]
    model: str | None
    created_at: datetime
