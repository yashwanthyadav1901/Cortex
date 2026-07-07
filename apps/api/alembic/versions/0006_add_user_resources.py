"""add user_resources table

Revision ID: 0006
Revises: 0005
Create Date: 2026-07-07

"""
from alembic import op

revision = "0006"
down_revision = "0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE user_resources (
            id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            topic_slug  text NOT NULL,
            title       text NOT NULL,
            url         text NOT NULL,
            note        text,
            created_at  timestamptz NOT NULL DEFAULT now()
        );
        CREATE INDEX idx_user_resources_topic ON user_resources (topic_slug);

        ALTER TABLE user_resources ENABLE ROW LEVEL SECURITY;
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS user_resources;")
