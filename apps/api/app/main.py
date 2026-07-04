from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import dsa_problems, progress, projects, streak, topics

app = FastAPI(title="Cortex API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(topics.router)
app.include_router(projects.router)
app.include_router(dsa_problems.router)
app.include_router(streak.router)
app.include_router(progress.router)


@app.get("/health")
def health():
    return {"status": "ok"}
