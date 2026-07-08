from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import ActivityType, Topic, TopicStatus
from app.models.flashcard_review import FlashcardReview
from app.schemas import ProgressTopicOut, ProgressUpdate
from app.services.activity import log_activity

router = APIRouter(
    prefix="/progress", tags=["progress"], dependencies=[Depends(require_user)]
)


@router.get("")
def get_progress(
    db: Session = Depends(get_db),
) -> dict[str, dict[str, str | None]]:
    """Status and notes of every roadmap-linked topic, keyed by node slug."""
    rows = db.execute(
        select(Topic.slug, Topic.status, Topic.notes).where(Topic.slug.is_not(None))
    ).all()
    return {
        slug: {"status": status.value, "notes": notes}
        for slug, status, notes in rows
    }


@router.put("/{slug}", response_model=ProgressTopicOut)
def set_progress(slug: str, body: ProgressUpdate, db: Session = Depends(get_db)):
    """Upsert a roadmap node's status; logs streak activity when it becomes active."""
    previous = db.scalar(select(Topic.status).where(Topic.slug == slug))
    db.execute(
        insert(Topic)
        .values(
            slug=slug,
            pillar=body.pillar,
            name=body.name,
            status=body.status,
            notes=body.notes,
        )
        .on_conflict_do_update(
            index_elements=[Topic.slug],
            set_={"status": body.status, "name": body.name, "notes": body.notes},
        )
    )
    topic = db.scalars(select(Topic).where(Topic.slug == slug)).one()
    if body.status != previous and body.status in (
        TopicStatus.in_progress,
        TopicStatus.done,
    ):
        log_activity(db, ActivityType.topic_study, topic_id=topic.id)
    if body.notes:
        existing = db.scalar(
            select(FlashcardReview).where(FlashcardReview.topic_slug == slug)
        )
        if not existing:
            db.add(FlashcardReview(topic_slug=slug))
    db.commit()
    return topic
