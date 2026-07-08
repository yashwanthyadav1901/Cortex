import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import ActivityType
from app.models.quiz import Quiz
from app.schemas import QuizGenerateRequest, QuizOut, QuizSubmitRequest
from app.services.activity import log_activity
from app.services.quiz import generate_questions
from app.utils import local_today

router = APIRouter(
    prefix="/quizzes",
    tags=["quizzes"],
    dependencies=[Depends(require_user)],
)


@router.post("/generate", response_model=QuizOut)
def generate_quiz(body: QuizGenerateRequest, db: Session = Depends(get_db)):
    questions = generate_questions(
        title=body.title,
        summary=body.summary,
        why=body.why,
        tasks=body.tasks,
    )
    quiz = Quiz(
        topic_slug=body.topic_slug,
        questions=questions,
        total=len(questions),
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


@router.get("", response_model=list[QuizOut])
def list_quizzes(topic_slug: str, db: Session = Depends(get_db)):
    rows = db.scalars(
        select(Quiz)
        .where(Quiz.topic_slug == topic_slug)
        .order_by(Quiz.created_at.desc())
    ).all()
    return rows


@router.post("/{quiz_id}/submit", response_model=QuizOut)
def submit_quiz(
    quiz_id: uuid.UUID,
    body: QuizSubmitRequest,
    db: Session = Depends(get_db),
):
    quiz = db.get(Quiz, quiz_id)
    if quiz is None:
        raise HTTPException(404, "Quiz not found")
    if quiz.score is not None:
        raise HTTPException(400, "Quiz already submitted")

    score = sum(
        1
        for ans, q in zip(body.answers, quiz.questions)
        if ans == q.get("correct")
    )
    quiz.score = score
    from datetime import datetime, timezone
    quiz.completed_at = datetime.now(timezone.utc)

    log_activity(db, ActivityType.topic_study)
    db.commit()
    db.refresh(quiz)
    return quiz
