import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import UserResource
from app.schemas import UserResourceCreate, UserResourceOut

router = APIRouter(
    prefix="/resources",
    tags=["resources"],
    dependencies=[Depends(require_user)],
)


@router.get("", response_model=list[UserResourceOut])
def list_resources(
    topic_slug: str,
    db: Session = Depends(get_db),
):
    query = (
        select(UserResource)
        .where(UserResource.topic_slug == topic_slug)
        .order_by(UserResource.created_at)
    )
    return db.scalars(query).all()


@router.post("", response_model=UserResourceOut, status_code=201)
def create_resource(body: UserResourceCreate, db: Session = Depends(get_db)):
    resource = UserResource(**body.model_dump())
    db.add(resource)
    db.commit()
    return resource


@router.delete("/{resource_id}", status_code=204)
def delete_resource(resource_id: uuid.UUID, db: Session = Depends(get_db)):
    resource = db.get(UserResource, resource_id)
    if resource is None:
        raise HTTPException(404, "Resource not found")
    db.delete(resource)
    db.commit()
