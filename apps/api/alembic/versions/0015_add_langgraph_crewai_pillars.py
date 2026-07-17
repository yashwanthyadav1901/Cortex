"""add langgraph and crewai pillars

Revision ID: 0015
Revises: 0014
Create Date: 2026-07-16

"""
from alembic import op

revision = "0015"
down_revision = "0014"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("COMMIT")
    op.execute("ALTER TYPE pillar ADD VALUE IF NOT EXISTS 'langgraph'")
    op.execute("ALTER TYPE pillar ADD VALUE IF NOT EXISTS 'crewai'")
    op.execute("BEGIN")


def downgrade() -> None:
    pass
