"""add microlearnings table

Revision ID: 0005
Revises: 0004
Create Date: 2026-07-07

"""
from alembic import op

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE microlearnings (
            id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            title       text NOT NULL,
            body        text NOT NULL,
            tags        text[] NOT NULL DEFAULT '{}',
            created_at  timestamptz NOT NULL DEFAULT now(),
            updated_at  timestamptz NOT NULL DEFAULT now()
        );
        CREATE INDEX idx_microlearnings_tags ON microlearnings USING GIN (tags);

        ALTER TABLE microlearnings ENABLE ROW LEVEL SECURITY;
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS microlearnings;")
