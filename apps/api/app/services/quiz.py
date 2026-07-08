"""Generate quiz questions via the LLM service."""

import json
import re

from app.config import get_settings
from app.services.llm import stream_chat


def _collect(system: str, messages: list[dict]) -> str:
    return "".join(stream_chat(system, messages))


def generate_questions(
    title: str,
    summary: str | None = None,
    why: str | None = None,
    tasks: list[str] | None = None,
) -> list[dict]:
    system = (
        "You are a quiz generator. Generate exactly 5 multiple-choice questions "
        f"about the topic: {title}. Each question must have exactly 4 options "
        "(A-D) with one correct answer. Return ONLY valid JSON — no markdown, "
        "no code fences, no extra text. The JSON must be an array of objects: "
        '[{"question": "...", "options": ["A", "B", "C", "D"], "correct": 0, '
        '"explanation": "..."}] where correct is the 0-based index of the '
        "right answer."
    )

    context_parts = []
    if summary:
        context_parts.append(f"Topic summary: {summary}")
    if why:
        context_parts.append(f"Why it matters: {why}")
    if tasks:
        context_parts.append(f"Learning tasks: {'; '.join(tasks)}")

    user_msg = (
        f"Generate 5 quiz questions about: {title}\n\n"
        + "\n".join(context_parts)
    )

    messages = [{"role": "user", "content": user_msg}]

    for attempt in range(2):
        raw = _collect(system, messages)
        try:
            match = re.search(r"\[.*\]", raw, re.DOTALL)
            data = json.loads(match.group() if match else raw)
            if isinstance(data, list) and len(data) >= 1:
                return data[:5]
        except (json.JSONDecodeError, AttributeError):
            if attempt == 0:
                messages.append({"role": "assistant", "content": raw})
                messages.append({
                    "role": "user",
                    "content": "That wasn't valid JSON. Please return ONLY a JSON array.",
                })
                continue
            raise ValueError("Failed to generate valid quiz questions")
    raise ValueError("Failed to generate valid quiz questions")
