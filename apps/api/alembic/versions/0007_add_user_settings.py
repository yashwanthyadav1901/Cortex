"""add user_settings table

Revision ID: 0007
Revises: 0006
"""

from alembic import op
import sqlalchemy as sa

revision = "0007"
down_revision = "0006"


def upgrade() -> None:
    op.create_table(
        "user_settings",
        sa.Column("key", sa.Text(), primary_key=True),
        sa.Column("value", sa.JSON(), nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.execute("ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    op.drop_table("user_settings")
