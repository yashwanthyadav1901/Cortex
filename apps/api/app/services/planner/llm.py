"""Provider-agnostic LLM client.

Any OpenAI-compatible endpoint works — dev uses NVIDIA's API
(https://integrate.api.nvidia.com/v1). Swapping providers is an env change
(LLM_BASE_URL / LLM_API_KEY / LLM_MODEL), not a code change.
"""

import json
from typing import Any

from openai import OpenAI

from app.config import get_settings


def complete_json(system: str, user: str) -> tuple[dict[str, Any], str]:
    """Run a chat completion that must return a JSON object.

    Returns (parsed_json, model_id). Raises ValueError on unparseable output.
    """
    settings = get_settings()
    client = OpenAI(base_url=settings.llm_base_url, api_key=settings.llm_api_key)

    response = client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.4,
        max_tokens=4096,
    )
    text = response.choices[0].message.content or ""

    # Some models wrap JSON in markdown fences or add prose around it.
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end <= start:
        raise ValueError(f"LLM returned no JSON object: {text[:200]}")
    try:
        return json.loads(text[start : end + 1]), settings.llm_model
    except json.JSONDecodeError as exc:
        raise ValueError(f"LLM returned invalid JSON: {exc}") from exc
