import uuid
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import ActivityType, Microlearning, Topic
from app.models.flashcard_review import FlashcardReview
from app.schemas import FlashcardDue, FlashcardReviewRequest, FlashcardStats
from app.services.activity import log_activity
from app.services.flashcard import sm2
from app.utils import local_today

router = APIRouter(
    prefix="/flashcards",
    tags=["flashcards"],
    dependencies=[Depends(require_user)],
)


@router.get("/due", response_model=list[FlashcardDue])
def list_due(db: Session = Depends(get_db)):
    today = local_today()
    rows = db.execute(
        select(FlashcardReview)
        .where(FlashcardReview.next_review <= today)
        .order_by(FlashcardReview.next_review.asc())
    ).scalars().all()

    results = []
    for fr in rows:
        if fr.microlearning_id:
            ml = db.get(Microlearning, fr.microlearning_id)
            if not ml:
                continue
            results.append(FlashcardDue(
                id=fr.id,
                microlearning_id=fr.microlearning_id,
                topic_slug=None,
                title=ml.title,
                body=ml.body,
                tags=ml.tags,
                source="microlearning",
                ease_factor=fr.ease_factor,
                interval_days=fr.interval_days,
                repetitions=fr.repetitions,
            ))
        elif fr.topic_slug:
            topic = db.scalar(select(Topic).where(Topic.slug == fr.topic_slug))
            if not topic or not topic.notes:
                continue
            results.append(FlashcardDue(
                id=fr.id,
                microlearning_id=None,
                topic_slug=fr.topic_slug,
                title=topic.name,
                body=topic.notes,
                tags=[topic.pillar.value],
                source="topic",
                ease_factor=fr.ease_factor,
                interval_days=fr.interval_days,
                repetitions=fr.repetitions,
            ))
    return results


@router.get("/stats", response_model=FlashcardStats)
def get_stats(db: Session = Depends(get_db)):
    today = local_today()
    total = db.scalar(select(func.count()).select_from(FlashcardReview)) or 0
    due_today = db.scalar(
        select(func.count())
        .select_from(FlashcardReview)
        .where(FlashcardReview.next_review <= today)
    ) or 0
    reviewed_today = db.scalar(
        select(func.count())
        .select_from(FlashcardReview)
        .where(func.date(FlashcardReview.last_reviewed_at) == today)
    ) or 0
    return FlashcardStats(due_today=due_today, total=total, reviewed_today=reviewed_today)


@router.post("/{card_id}/review", response_model=FlashcardDue)
def review_card(
    card_id: uuid.UUID,
    body: FlashcardReviewRequest,
    db: Session = Depends(get_db),
):
    fr = db.get(FlashcardReview, card_id)
    if fr is None:
        raise HTTPException(404, "Flashcard not found")

    new_reps, new_interval, new_ef = sm2(
        body.quality, fr.repetitions, fr.ease_factor, fr.interval_days
    )
    fr.repetitions = new_reps
    fr.interval_days = new_interval
    fr.ease_factor = new_ef
    fr.next_review = local_today() + timedelta(days=new_interval)
    fr.last_reviewed_at = func.now()

    log_activity(db, ActivityType.topic_study)
    db.commit()
    db.refresh(fr)

    if fr.microlearning_id:
        ml = db.get(Microlearning, fr.microlearning_id)
        return FlashcardDue(
            id=fr.id,
            microlearning_id=fr.microlearning_id,
            topic_slug=None,
            title=ml.title,
            body=ml.body,
            tags=ml.tags,
            source="microlearning",
            ease_factor=fr.ease_factor,
            interval_days=fr.interval_days,
            repetitions=fr.repetitions,
        )
    else:
        topic = db.scalar(select(Topic).where(Topic.slug == fr.topic_slug))
        return FlashcardDue(
            id=fr.id,
            microlearning_id=None,
            topic_slug=fr.topic_slug,
            title=topic.name,
            body=topic.notes or "",
            tags=[topic.pillar.value],
            source="topic",
            ease_factor=fr.ease_factor,
            interval_days=fr.interval_days,
            repetitions=fr.repetitions,
        )
