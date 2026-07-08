import json
import re

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.auth import require_user
from app.schemas import ChatRequest, RecommendationOut, RecommendRequest
from app.services.llm import build_system_prompt, stream_chat

router = APIRouter(prefix="/chat", tags=["chat"], dependencies=[Depends(require_user)])


@router.post("")
def chat(body: ChatRequest) -> StreamingResponse:
    """Stream a topic-aware tutor answer as plain-text chunks.

    Stateless: the client resends the full message history each turn, so
    follow-up questions retain context without any server-side storage.
    """
    system = build_system_prompt(body.topic)
    messages = [m.model_dump() for m in body.messages]
    return StreamingResponse(
        stream_chat(system, messages),
        media_type="text/plain; charset=utf-8",
    )


@router.post("/recommend", response_model=RecommendationOut)
def recommend(body: RecommendRequest):
    done = [t for t in body.topics if body.progress.get(t["slug"]) == "done"]
    in_progress = [t for t in body.topics if body.progress.get(t["slug"]) == "in_progress"]
    not_started = [t for t in body.topics if body.progress.get(t["slug"], "not_started") == "not_started"]

    def fmt(items: list[dict]) -> str:
        if not items:
            return "(none)"
        return ", ".join(f"{t['title']} [{t['pillar']}]" for t in items)

    system = (
        "You are a learning advisor. Given the student's progress across 4 pillars "
        "(System Design, AI, DSA, AI Agents), recommend the single best topic to "
        "study next. Consider: prerequisites, balance across pillars, momentum "
        "(continue in-progress topics). Return ONLY valid JSON — no markdown, "
        'no code fences: {"slug": "...", "title": "...", "pillar": "...", '
        '"reason": "1-2 sentences"}'
    )

    user_msg = (
        f"Done: {fmt(done)}\n"
        f"In progress: {fmt(in_progress)}\n"
        f"Not started: {fmt(not_started)}"
    )

    raw = "".join(stream_chat(system, [{"role": "user", "content": user_msg}]))
    try:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        data = json.loads(match.group() if match else raw)
        return RecommendationOut(**data)
    except Exception:
        if not_started:
            pick = not_started[0]
        elif in_progress:
            pick = in_progress[0]
        else:
            pick = body.topics[0]
        return RecommendationOut(
            slug=pick["slug"],
            title=pick["title"],
            pillar=pick["pillar"],
            reason="Recommended based on your current progress.",
        )
