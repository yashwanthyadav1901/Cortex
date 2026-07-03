"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-07-03

"""
from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TYPE pillar AS ENUM ('system_design', 'ai', 'dsa');
        CREATE TYPE topic_status AS ENUM ('not_started', 'in_progress', 'done');
        CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
        CREATE TYPE project_status AS ENUM ('suggested', 'in_progress', 'done');
        CREATE TYPE problem_status AS ENUM ('todo', 'attempted', 'solved');
        CREATE TYPE activity_type AS ENUM ('topic_study', 'project_work', 'dsa_solved');

        CREATE TABLE topics (
            id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            pillar       pillar NOT NULL,
            name         text NOT NULL,
            status       topic_status NOT NULL DEFAULT 'not_started',
            difficulty   difficulty NOT NULL DEFAULT 'medium',
            notes        text,
            created_at   timestamptz NOT NULL DEFAULT now(),
            updated_at   timestamptz NOT NULL DEFAULT now(),
            UNIQUE (pillar, name)
        );

        CREATE TABLE projects (
            id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            topic_id     uuid REFERENCES topics(id) ON DELETE SET NULL,
            title        text NOT NULL,
            description  text,
            status       project_status NOT NULL DEFAULT 'suggested',
            created_at   timestamptz NOT NULL DEFAULT now(),
            updated_at   timestamptz NOT NULL DEFAULT now()
        );

        CREATE TABLE dsa_problems (
            id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            title        text NOT NULL,
            topic_tag    text NOT NULL,
            difficulty   difficulty NOT NULL,
            status       problem_status NOT NULL DEFAULT 'todo',
            url          text,
            date_solved  date,
            created_at   timestamptz NOT NULL DEFAULT now()
        );
        CREATE INDEX idx_dsa_problems_filter
            ON dsa_problems (topic_tag, difficulty, status);

        CREATE TABLE daily_activity_log (
            id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            activity_date  date NOT NULL,
            activity_type  activity_type NOT NULL,
            topic_id       uuid REFERENCES topics(id) ON DELETE SET NULL,
            dsa_problem_id uuid REFERENCES dsa_problems(id) ON DELETE SET NULL,
            created_at     timestamptz NOT NULL DEFAULT now(),
            UNIQUE NULLS NOT DISTINCT
                (activity_date, activity_type, topic_id, dsa_problem_id)
        );
        CREATE INDEX idx_activity_date ON daily_activity_log (activity_date DESC);

        CREATE TABLE plans (
            id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            week_start_date  date NOT NULL UNIQUE,
            available_hours  int NOT NULL,
            generated_json   jsonb NOT NULL,
            model            text,
            created_at       timestamptz NOT NULL DEFAULT now()
        );

        -- Supabase exposes the public schema through its auto-generated REST API
        -- (PostgREST). RLS with no policies blocks that path entirely; our own
        -- API connects as the postgres role, which bypasses RLS.
        ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
        ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
        ALTER TABLE dsa_problems ENABLE ROW LEVEL SECURITY;
        ALTER TABLE daily_activity_log ENABLE ROW LEVEL SECURITY;
        ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS plans;
        DROP TABLE IF EXISTS daily_activity_log;
        DROP TABLE IF EXISTS dsa_problems;
        DROP TABLE IF EXISTS projects;
        DROP TABLE IF EXISTS topics;
        DROP TYPE IF EXISTS activity_type;
        DROP TYPE IF EXISTS problem_status;
        DROP TYPE IF EXISTS project_status;
        DROP TYPE IF EXISTS difficulty;
        DROP TYPE IF EXISTS topic_status;
        DROP TYPE IF EXISTS pillar;
        """
    )
