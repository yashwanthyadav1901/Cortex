from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.auth import require_user
from app.schemas import ChatRequest
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
