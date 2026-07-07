"""add todos table

Revision ID: 0004
Revises: 0003
Create Date: 2026-07-07

"""
from alembic import op

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TYPE todo_priority AS ENUM ('low', 'medium', 'high');
        CREATE TYPE todo_status AS ENUM ('pending', 'done');

        CREATE TABLE todos (
            id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            title       text NOT NULL,
            description text,
            status      todo_status NOT NULL DEFAULT 'pending',
            priority    todo_priority NOT NULL DEFAULT 'medium',
            due_date    date,
            category    text,
            position    integer NOT NULL DEFAULT 0,
            created_at  timestamptz NOT NULL DEFAULT now(),
            updated_at  timestamptz NOT NULL DEFAULT now()
        );
        CREATE INDEX idx_todos_filter ON todos (status, priority);

        ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS todos;
        DROP TYPE IF EXISTS todo_status;
        DROP TYPE IF EXISTS todo_priority;
        """
    )
