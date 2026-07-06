"""Topic-aware chat streaming, abstracted over two providers.

`LLM_PROVIDER` selects the backend at runtime: NVIDIA's OpenAI-compatible
endpoint in dev (free), Anthropic Claude in prod. Both are normalized to a
generator of text deltas so the router can stream either identically.
"""
from collections.abc import Iterator

from app.config import get_settings
from app.schemas import ChatTopic

MAX_TOKENS = 2048


def build_system_prompt(topic: ChatTopic | None) -> str:
    """A patient-tutor persona, grounded in the current roadmap topic if given."""
    base = (
        "You are a patient, encouraging tutor helping a self-taught engineer "
        "master technical topics. Explain clearly and concretely, use small "
        "examples, and prefer intuition before jargon. Keep answers focused and "
        "skip filler. If the learner is wrong, correct them kindly. Use Markdown."
    )
    if topic is None:
        return base

    lines = [base, "", f"The learner is currently studying: {topic.title} ({topic.pillar})."]
    if topic.summary:
        lines.append(f"Topic summary: {topic.summary}")
    if topic.why:
        lines.append(f"Why it matters: {topic.why}")
    if topic.tasks:
        joined = "; ".join(topic.tasks)
        lines.append(f"Their learning tasks for this topic: {joined}")
    lines.append(
        "Answer their questions in the context of this topic. Relate explanations "
        "back to it and, when helpful, to the learning tasks above."
    )
    return "\n".join(lines)


def stream_chat(system: str, messages: list[dict]) -> Iterator[str]:
    """Yield the model's answer as text chunks. `messages` is the shared
    OpenAI/Anthropic shape: [{"role": "user"|"assistant", "content": str}, ...]."""
    settings = get_settings()

    if settings.llm_provider == "anthropic":
        import anthropic

        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        # thinking disabled for snappy, low-latency tutor replies (tunable).
        with client.messages.stream(
            model=settings.anthropic_model,
            max_tokens=MAX_TOKENS,
            system=system,
            messages=messages,
            thinking={"type": "disabled"},
        ) as stream:
            yield from stream.text_stream
        return

    # Default: NVIDIA (OpenAI-compatible). System prompt goes in the array.
    from openai import OpenAI

    client = OpenAI(
        base_url=settings.nvidia_base_url,
        api_key=settings.nvidia_api_key,
    )
    stream = client.chat.completions.create(
        model=settings.nvidia_model,
        messages=[{"role": "system", "content": system}, *messages],
        max_tokens=MAX_TOKENS,
        stream=True,
    )
    for chunk in stream:
        if not chunk.choices:
            continue
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
