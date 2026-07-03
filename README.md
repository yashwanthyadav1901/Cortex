# Cortex

Personal learning-ops app: generates a personalized weekly study plan across three
pillars — **System Design**, **AI**, and **DSA** — tracks progress, suggests projects,
and keeps you consistent with a streak system.

## Structure

```
apps/api   FastAPI backend (SQLAlchemy + Alembic → Supabase Postgres)
apps/web   Next.js frontend (App Router, TypeScript, Tailwind, PWA)
```

## Setup

### Backend (`apps/api`)

```bash
cd apps/api
uv sync                      # or: python -m venv .venv && pip install -e .
cp .env.example .env         # fill in DATABASE_URL, SUPABASE_JWT_SECRET, LLM_* vars
uv run alembic upgrade head  # apply schema to Supabase
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend (`apps/web`)

```bash
cd apps/web
npm install
cp .env.local.example .env.local   # fill in API URL + Supabase project keys
npm run dev                        # http://localhost:3000
```

## Environment variables

| App | Var | What |
|---|---|---|
| api | `DATABASE_URL` | Supabase direct connection string (port 5432 locally; pooler 6543 when deployed) |
| api | `SUPABASE_JWT_SECRET` | Project Settings → API → JWT Secret (verifies login tokens) |
| api | `ALLOWED_EMAIL` | Your email — the only account allowed through auth |
| api | `LLM_BASE_URL` | OpenAI-compatible endpoint. Dev: `https://integrate.api.nvidia.com/v1` |
| api | `LLM_API_KEY` | NVIDIA API key (build.nvidia.com) — swap for another provider later |
| api | `LLM_MODEL` | Model id, e.g. `meta/llama-3.3-70b-instruct` |
| web | `NEXT_PUBLIC_API_URL` | FastAPI base URL, e.g. `http://localhost:8000` |
| web | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (for auth) |
| web | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (for auth) |
