from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import DsaProblem, Plan, ProblemStatus, Project, Topic
from app.services.planner.llm import complete_json
from app.services.planner.prompts import SYSTEM_PROMPT, format_user_prompt
from app.services.streak import compute_streak


def week_start(today: date | None = None) -> date:
    today = today or date.today()
    return today - timedelta(days=today.weekday())  # Monday


def _build_context(db: Session) -> dict[str, object]:
    topics = db.scalars(select(Topic).order_by(Topic.pillar, Topic.name)).all()
    projects = db.scalars(select(Project).order_by(Project.created_at)).all()
    solved = db.scalars(
        select(DsaProblem)
        .where(DsaProblem.status == ProblemStatus.solved)
        .order_by(DsaProblem.date_solved.desc())
        .limit(20)
    ).all()

    topics_block = "\n".join(
        f"- [{t.pillar.value}] {t.name} — {t.status.value} ({t.difficulty.value})"
        for t in topics
    ) or "(none yet)"
    projects_block = "\n".join(
        f"- {p.title} — {p.status.value}" for p in projects
    ) or "(none yet)"
    problems_block = "\n".join(
        f"- {p.title} [{p.topic_tag}, {p.difficulty.value}] solved {p.date_solved}"
        for p in solved
    ) or "(none yet)"

    return {
        "topic_count": len(topics),
        "topics_block": topics_block,
        "projects_block": projects_block,
        "problems_block": problems_block,
        "streak": compute_streak(db).current_streak,
    }


def generate_weekly_plan(db: Session, available_hours: int) -> Plan:
    """Build progress context, ask the LLM for a plan, upsert it for this week."""
    start = week_start()
    context = _build_context(db)
    user_prompt = format_user_prompt(
        week_start_date=start.isoformat(),
        available_hours=available_hours,
        **context,
    )
    generated, model_id = complete_json(SYSTEM_PROMPT, user_prompt)

    db.execute(
        insert(Plan)
        .values(
            week_start_date=start,
            available_hours=available_hours,
            generated_json=generated,
            model=model_id,
        )
        .on_conflict_do_update(
            index_elements=[Plan.week_start_date],
            set_={
                "available_hours": available_hours,
                "generated_json": generated,
                "model": model_id,
            },
        )
    )
    db.commit()
    return db.scalars(select(Plan).where(Plan.week_start_date == start)).one()
