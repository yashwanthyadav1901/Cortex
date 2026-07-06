# Cortex

Personal learning-ops app for three pillars — **System Design**, **AI**, and **DSA**.
Curated roadmap flowcharts with deep-dive topics (vetted resources + linked projects),
a project catalog with detailed build specs, a DSA problem tracker, and a streak system.

## Structure

```
apps/api   FastAPI backend (SQLAlchemy + Alembic → Supabase Postgres)
apps/web   Next.js frontend (App Router, TypeScript, Tailwind, PWA)
           └── src/content/   curated roadmaps & project specs (edit freely)
```

## Setup

### Backend (`apps/api`)

```bash
cd apps/api
uv venv && uv pip install -e .
cp .env.example .env         # fill in DATABASE_URL, SUPABASE_URL, ALLOWED_EMAIL
uv run alembic upgrade head  # apply schema to Supabase
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend (`apps/web`)

```bash
cd apps/web
nvm use            # needs Node 22 (.nvmrc)
npm install
cp .env.local.example .env.local   # fill in API URL + Supabase project keys
npm run dev                        # http://localhost:3000
```

## Environment variables

| App | Var | What |
|---|---|---|
| api | `DATABASE_URL` | Supabase connection string (direct 5432, or session pooler if IPv6 fails) |
| api | `SUPABASE_URL` | Project URL — verifies login tokens via JWKS (ES256 signing keys) |
| api | `SUPABASE_JWT_SECRET` | Only for legacy HS256 projects; leave empty otherwise |
| api | `ALLOWED_EMAIL` | The only account allowed through auth |
| api | `CORS_ORIGINS` | Comma-separated allowed origins |
| api | `TIMEZONE` | IANA name (e.g. `Asia/Kolkata`) anchoring streak day boundaries; defaults to UTC |
| web | `NEXT_PUBLIC_API_URL` | FastAPI base URL, e.g. `http://localhost:8000` |
| web | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (auth) |
| web | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (auth) |

## Editing the roadmaps

All curated content lives in `apps/web/src/content/`:

- `roadmaps/{dsa,system-design,ai}.ts` — stages → topic nodes (summary, why, resources)
- `projects/{dsa,system-design,ai}.ts` — project specs (overview, milestones, stretch goals)

Node `slug`s are stable IDs — progress in the DB is keyed on them, so don't rename
a slug once you've started tracking it (edit titles/resources freely).
