import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import ActivityType, Project, ProjectStatus
from app.schemas import ProjectCreate, ProjectOut, ProjectUpdate
from app.services.activity import log_activity

router = APIRouter(
    prefix="/projects", tags=["projects"], dependencies=[Depends(require_user)]
)


def _get_or_404(db: Session, project_id: uuid.UUID) -> Project:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(404, "Project not found")
    return project


@router.get("", response_model=list[ProjectOut])
def list_projects(status: ProjectStatus | None = None, db: Session = Depends(get_db)):
    query = select(Project).order_by(Project.created_at)
    if status:
        query = query.where(Project.status == status)
    return db.scalars(query).all()


@router.post("", response_model=ProjectOut, status_code=201)
def create_project(body: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(**body.model_dump())
    db.add(project)
    if project.status in (ProjectStatus.in_progress, ProjectStatus.done):
        log_activity(db, ActivityType.project_work, topic_id=project.topic_id)
    db.commit()
    return project


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: uuid.UUID, body: ProjectUpdate, db: Session = Depends(get_db)
):
    project = _get_or_404(db, project_id)
    updates = body.model_dump(exclude_unset=True)
    became_active = (
        "status" in updates
        and updates["status"] in (ProjectStatus.in_progress, ProjectStatus.done)
        and project.status != updates["status"]
    )
    for field, value in updates.items():
        setattr(project, field, value)
    if became_active:
        log_activity(db, ActivityType.project_work, topic_id=project.topic_id)
    db.commit()
    return project


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: uuid.UUID, db: Session = Depends(get_db)):
    db.delete(_get_or_404(db, project_id))
    db.commit()
