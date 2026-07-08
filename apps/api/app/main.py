from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import bookmarks, chat, dsa_problems, flashcards, microlearnings, progress, projects, quizzes, settings, streak, todos, topics, user_resources

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
app.include_router(todos.router)
app.include_router(microlearnings.router)
app.include_router(user_resources.router)
app.include_router(settings.router)
app.include_router(bookmarks.router)
app.include_router(flashcards.router)
app.include_router(quizzes.router)
app.include_router(chat.router)


@app.get("/health")
def health():
    return {"status": "ok"}
