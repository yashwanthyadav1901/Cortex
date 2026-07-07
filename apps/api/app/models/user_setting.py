from datetime import datetime

from sqlalchemy import JSON, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class UserSetting(Base):
    __tablename__ = "user_settings"

    key: Mapped[str] = mapped_column(Text, primary_key=True)
    value: Mapped[dict] = mapped_column(JSON, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )
