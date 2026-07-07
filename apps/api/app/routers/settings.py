from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import require_user
from app.db import get_db
from app.models import UserSetting
from app.schemas import SettingOut, SettingUpdate

router = APIRouter(
    prefix="/settings",
    tags=["settings"],
    dependencies=[Depends(require_user)],
)


@router.get("/{key}", response_model=SettingOut)
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.get(UserSetting, key)
    if setting is None:
        raise HTTPException(404, "Setting not found")
    return {"key": setting.key, "value": setting.value}


@router.put("/{key}", response_model=SettingOut)
def upsert_setting(key: str, body: SettingUpdate, db: Session = Depends(get_db)):
    setting = db.get(UserSetting, key)
    if setting is None:
        setting = UserSetting(key=key, value=body.value)
        db.add(setting)
    else:
        setting.value = body.value
    db.commit()
    db.refresh(setting)
    return {"key": setting.key, "value": setting.value}
