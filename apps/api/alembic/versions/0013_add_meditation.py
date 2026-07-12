"""add meditation column to challenge_days

Revision ID: 0013
Revises: 0012
"""

from alembic import op
import sqlalchemy as sa

revision = "0013"
down_revision = "0012"


def upgrade() -> None:
    op.add_column(
        "challenge_days",
        sa.Column("meditation", sa.Boolean(), nullable=False, server_default="false"),
    )


def downgrade() -> None:
    op.drop_column("challenge_days", "meditation")
