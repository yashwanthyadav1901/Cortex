"""roadmap progress: topic slugs, drop LLM plans

Revision ID: 0002
Revises: 0001
Create Date: 2026-07-04

"""
from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE topics ADD COLUMN slug text UNIQUE;
        DROP TABLE IF EXISTS plans;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE topics DROP COLUMN slug;
        CREATE TABLE plans (
            id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            week_start_date  date NOT NULL UNIQUE,
            available_hours  int NOT NULL,
            generated_json   jsonb NOT NULL,
            model            text,
            created_at       timestamptz NOT NULL DEFAULT now()
        );
        ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
        """
    )
