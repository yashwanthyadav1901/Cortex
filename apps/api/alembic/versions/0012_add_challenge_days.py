"""add challenge_days table

Revision ID: 0012
Revises: 0011
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "0012"
down_revision = "0011"


def upgrade() -> None:
    op.create_table(
        "challenge_days",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("challenge_date", sa.Date(), nullable=False, unique=True),
        sa.Column("day_number", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("wake_up_early", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("workout", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("learning", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("deep_work", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("reading", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("water", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("all_complete", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("idx_challenge_date", "challenge_days", ["challenge_date"])
    op.execute("ALTER TABLE challenge_days ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    op.drop_table("challenge_days")
