"""flashcard_reviews: add topic_slug, make microlearning_id nullable

Revision ID: 0011
Revises: 0010
"""

from alembic import op
import sqlalchemy as sa

revision = "0011"
down_revision = "0010"


def upgrade() -> None:
    op.add_column(
        "flashcard_reviews",
        sa.Column("topic_slug", sa.Text(), nullable=True, unique=True),
    )
    op.alter_column("flashcard_reviews", "microlearning_id", nullable=True)
    op.drop_constraint(
        "flashcard_reviews_microlearning_id_key", "flashcard_reviews", type_="unique"
    )
    op.create_unique_constraint(
        "uq_flashcard_microlearning",
        "flashcard_reviews",
        ["microlearning_id"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_flashcard_microlearning", "flashcard_reviews", type_="unique")
    op.create_unique_constraint(
        "flashcard_reviews_microlearning_id_key",
        "flashcard_reviews",
        ["microlearning_id"],
    )
    op.alter_column("flashcard_reviews", "microlearning_id", nullable=False)
    op.drop_column("flashcard_reviews", "topic_slug")
