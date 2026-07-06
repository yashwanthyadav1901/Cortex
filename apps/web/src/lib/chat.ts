import { API_ERROR_EVENT, API_URL } from "./api";
import { supabase } from "./supabase";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatTopic {
  pillar: string;
  title: string;
  summary?: string;
  why?: string;
  tasks?: string[];
}

export interface ChatBody {
  topic?: ChatTopic;
  messages: ChatMessage[];
}

function emitApiError(message: string) {
  window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail: message }));
}

/**
 * POST to /chat and invoke `onToken` with each streamed text chunk. The JSON
 * helpers in api.ts call res.json(), so streaming needs its own fetch that
 * reads the response body incrementally.
 */
export async function streamChat(
  body: ChatBody,
  onToken: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "/login";
    throw new Error("Not signed in");
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    if ((err as Error)?.name === "AbortError") throw err;
    emitApiError("Network error — check your connection");
    throw err;
  }

  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  if (!res.ok || !res.body) {
    emitApiError(`Chat failed (${res.status})`);
    throw new Error(`Chat request failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) onToken(decoder.decode(value, { stream: true }));
  }
}
