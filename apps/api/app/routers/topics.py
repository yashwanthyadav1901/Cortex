import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import ActivityType, Pillar, Topic, TopicStatus
from app.schemas import TopicCreate, TopicOut, TopicUpdate
from app.services.activity import log_activity

router = APIRouter(prefix="/topics", tags=["topics"], dependencies=[Depends(require_user)])


def _get_or_404(db: Session, topic_id: uuid.UUID) -> Topic:
    topic = db.get(Topic, topic_id)
    if topic is None:
        raise HTTPException(404, "Topic not found")
    return topic


@router.get("", response_model=list[TopicOut])
def list_topics(
    pillar: Pillar | None = None,
    status: TopicStatus | None = None,
    db: Session = Depends(get_db),
):
    query = select(Topic).order_by(Topic.created_at)
    if pillar:
        query = query.where(Topic.pillar == pillar)
    if status:
        query = query.where(Topic.status == status)
    return db.scalars(query).all()


@router.post("", response_model=TopicOut, status_code=201)
def create_topic(body: TopicCreate, db: Session = Depends(get_db)):
    topic = Topic(**body.model_dump())
    db.add(topic)
    db.commit()
    return topic


@router.patch("/{topic_id}", response_model=TopicOut)
def update_topic(topic_id: uuid.UUID, body: TopicUpdate, db: Session = Depends(get_db)):
    topic = _get_or_404(db, topic_id)
    updates = body.model_dump(exclude_unset=True)
    became_active = (
        "status" in updates
        and updates["status"] in (TopicStatus.in_progress, TopicStatus.done)
        and topic.status != updates["status"]
    )
    for field, value in updates.items():
        setattr(topic, field, value)
    if became_active:
        log_activity(db, ActivityType.topic_study, topic_id=topic.id)
    db.commit()
    return topic


@router.delete("/{topic_id}", status_code=204)
def delete_topic(topic_id: uuid.UUID, db: Session = Depends(get_db)):
    db.delete(_get_or_404(db, topic_id))
    db.commit()
