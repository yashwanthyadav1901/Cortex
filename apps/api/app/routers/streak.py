from datetime import timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import DailyActivityLog, DsaProblem, ProblemStatus, Project, ProjectStatus, Topic, TopicStatus
from app.schemas import ActivityCreate, ActivityOut, AnalyticsSummary, AnalyticsTotals, HeatmapDay, StreakOut, WeekComparison, WeeklySummary
from app.services.activity import log_activity
from app.services.streak import compute_streak
from app.utils import local_today

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


@router.get("/activity/heatmap", response_model=list[HeatmapDay])
def get_heatmap(
    months: int = Query(default=12, ge=1, le=24),
    db: Session = Depends(get_db),
):
    today = local_today()
    start = today - timedelta(days=months * 30)
    rows = db.execute(
        select(
            DailyActivityLog.activity_date,
            func.count().label("count"),
        )
        .where(DailyActivityLog.activity_date >= start)
        .group_by(DailyActivityLog.activity_date)
        .order_by(DailyActivityLog.activity_date)
    ).all()
    return [{"date": r.activity_date, "count": r.count} for r in rows]


@router.get("/activity/weekly-summary", response_model=WeeklySummary)
def get_weekly_summary(db: Session = Depends(get_db)):
    today = local_today()
    monday = today - timedelta(days=today.weekday())
    rows = db.execute(
        select(
            DailyActivityLog.activity_type,
            func.count().label("count"),
        )
        .where(DailyActivityLog.activity_date >= monday)
        .where(DailyActivityLog.activity_date <= today)
        .group_by(DailyActivityLog.activity_type)
    ).all()
    by_type = {r.activity_type.value: r.count for r in rows}
    total = sum(by_type.values())

    days_active = db.scalar(
        select(func.count(func.distinct(DailyActivityLog.activity_date)))
        .where(DailyActivityLog.activity_date >= monday)
        .where(DailyActivityLog.activity_date <= today)
    ) or 0

    return WeeklySummary(
        total_activities=total,
        days_active=days_active,
        activities_by_type=by_type,
    )


@router.get("/analytics/summary", response_model=AnalyticsSummary)
def get_analytics_summary(
    weeks: int = Query(default=8, ge=1, le=52),
    db: Session = Depends(get_db),
):
    today = local_today()
    start = today - timedelta(weeks=weeks)

    daily_rows = db.execute(
        select(DailyActivityLog.activity_date, func.count().label("count"))
        .where(DailyActivityLog.activity_date >= start)
        .group_by(DailyActivityLog.activity_date)
        .order_by(DailyActivityLog.activity_date)
    ).all()
    daily_counts = [{"date": r.activity_date, "count": r.count} for r in daily_rows]

    type_rows = db.execute(
        select(DailyActivityLog.activity_type, func.count().label("count"))
        .group_by(DailyActivityLog.activity_type)
    ).all()
    by_type = {r.activity_type.value: r.count for r in type_rows}

    pillar_rows = db.execute(
        select(Topic.pillar, func.count().label("count"))
        .where(Topic.status != TopicStatus.not_started)
        .where(Topic.slug.is_not(None))
        .group_by(Topic.pillar)
    ).all()
    by_pillar = {r.pillar.value: r.count for r in pillar_rows}

    def week_stats(week_start, week_end):
        total = db.scalar(
            select(func.count())
            .where(DailyActivityLog.activity_date >= week_start)
            .where(DailyActivityLog.activity_date <= week_end)
        ) or 0
        days = db.scalar(
            select(func.count(func.distinct(DailyActivityLog.activity_date)))
            .where(DailyActivityLog.activity_date >= week_start)
            .where(DailyActivityLog.activity_date <= week_end)
        ) or 0
        return WeekComparison(total=total, days_active=days)

    this_monday = today - timedelta(days=today.weekday())
    last_monday = this_monday - timedelta(weeks=1)
    last_sunday = this_monday - timedelta(days=1)

    topics_done = db.scalar(
        select(func.count()).select_from(Topic)
        .where(Topic.status == TopicStatus.done).where(Topic.slug.is_not(None))
    ) or 0
    topics_ip = db.scalar(
        select(func.count()).select_from(Topic)
        .where(Topic.status == TopicStatus.in_progress).where(Topic.slug.is_not(None))
    ) or 0
    dsa_solved = db.scalar(
        select(func.count()).select_from(DsaProblem)
        .where(DsaProblem.status == ProblemStatus.solved)
    ) or 0
    projects_done = db.scalar(
        select(func.count()).select_from(Project)
        .where(Project.status == ProjectStatus.done)
    ) or 0
    total_activities = db.scalar(
        select(func.count()).select_from(DailyActivityLog)
    ) or 0

    return AnalyticsSummary(
        daily_counts=daily_counts,
        by_type=by_type,
        by_pillar=by_pillar,
        this_week=week_stats(this_monday, today),
        last_week=week_stats(last_monday, last_sunday),
        totals=AnalyticsTotals(
            activities=total_activities,
            topics_done=topics_done,
            topics_in_progress=topics_ip,
            dsa_solved=dsa_solved,
            projects_done=projects_done,
        ),
    )


@router.get("/activity/today", response_model=list[ActivityOut])
def get_today_activities(db: Session = Depends(get_db)):
    today = local_today()
    return db.scalars(
        select(DailyActivityLog)
        .where(DailyActivityLog.activity_date == today)
        .order_by(DailyActivityLog.created_at)
    ).all()
