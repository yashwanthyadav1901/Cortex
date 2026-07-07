"""add bookmarks table

Revision ID: 0008
Revises: 0007
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "0008"
down_revision = "0007"


def upgrade() -> None:
    op.create_table(
        "bookmarks",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("slug", sa.Text(), nullable=False, unique=True),
        sa.Column("type", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.execute("ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    op.drop_table("bookmarks")
