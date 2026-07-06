"""add ai_agents pillar

Revision ID: 0003
Revises: 0002
Create Date: 2026-07-05

"""
from alembic import op

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("COMMIT")
    op.execute("ALTER TYPE pillar ADD VALUE IF NOT EXISTS 'ai_agents'")
    op.execute("BEGIN")


def downgrade() -> None:
    pass
