"""add flashcard_reviews table

Revision ID: 0009
Revises: 0008
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "0009"
down_revision = "0008"


def upgrade() -> None:
    op.create_table(
        "flashcard_reviews",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column(
            "microlearning_id",
            UUID(as_uuid=True),
            sa.ForeignKey("microlearnings.id", ondelete="CASCADE"),
            nullable=False,
            unique=True,
        ),
        sa.Column("ease_factor", sa.Float(), nullable=False, server_default="2.5"),
        sa.Column("interval_days", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("repetitions", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("next_review", sa.Date(), nullable=False, server_default=sa.text("CURRENT_DATE")),
        sa.Column("last_reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.execute("ALTER TABLE flashcard_reviews ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    op.drop_table("flashcard_reviews")
