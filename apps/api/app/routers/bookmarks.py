import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import Bookmark
from app.schemas import BookmarkCreate, BookmarkOut

router = APIRouter(
    prefix="/bookmarks",
    tags=["bookmarks"],
    dependencies=[Depends(require_user)],
)


@router.get("", response_model=list[BookmarkOut])
def list_bookmarks(db: Session = Depends(get_db)):
    return db.scalars(select(Bookmark).order_by(Bookmark.created_at.desc())).all()


@router.post("", response_model=BookmarkOut, status_code=201)
def create_bookmark(body: BookmarkCreate, db: Session = Depends(get_db)):
    existing = db.scalars(
        select(Bookmark).where(Bookmark.slug == body.slug)
    ).first()
    if existing:
        return existing
    bookmark = Bookmark(slug=body.slug, type=body.type)
    db.add(bookmark)
    db.commit()
    return bookmark


@router.delete("/{bookmark_id}", status_code=204)
def delete_bookmark(bookmark_id: uuid.UUID, db: Session = Depends(get_db)):
    bookmark = db.get(Bookmark, bookmark_id)
    if bookmark is None:
        raise HTTPException(404, "Bookmark not found")
    db.delete(bookmark)
    db.commit()
