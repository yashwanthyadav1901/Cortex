import { supabase } from "./supabase";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Fired on request failures (except auth redirects); ApiErrorToast listens. */
export const API_ERROR_EVENT = "cortex:api-error";
/** Fired while the backend is waking (detail: true) and once it's up (false). */
export const API_WAKING_EVENT = "cortex:api-waking";

function emitApiError(message: string) {
  window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail: message }));
}

// The Render free tier sleeps after 15 min idle and takes ~30-60s to wake, so
// the first request after a nap either can't connect or gets a gateway error.
// Treat those as "backend is waking", retry with backoff, and let the UI show a
// distinct notice rather than the generic failure toast.
const WAKE_RETRY_STATUS = new Set([502, 503, 504]);
const WAKE_BACKOFFS_MS = [1500, 2500, 4000, 6000, 8000, 10000];
const WAKE_MAX_WAIT_MS = 60_000;
const WAKE_MAX_ATTEMPTS = WAKE_BACKOFFS_MS.length + 6;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Track concurrent waking requests so parallel calls raise/clear the notice once.
let wakingCount = 0;
function signalWaking(on: boolean) {
  window.dispatchEvent(new CustomEvent(API_WAKING_EVENT, { detail: on }));
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "/login";
    throw new Error("Not signed in");
  }

  const startedAt = Date.now();
  let attempt = 0;
  let wakingHere = false;
  const markWaking = () => {
    if (!wakingHere) {
      wakingHere = true;
      if (++wakingCount === 1) signalWaking(true);
    }
  };
  const canRetry = () =>
    attempt < WAKE_MAX_ATTEMPTS && Date.now() - startedAt < WAKE_MAX_WAIT_MS;
  const backoff = () =>
    WAKE_BACKOFFS_MS[Math.min(attempt, WAKE_BACKOFFS_MS.length - 1)];

  try {
    while (true) {
      let res: Response;
      try {
        res = await fetch(`${API_URL}${path}`, {
          ...init,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            ...init?.headers,
          },
        });
      } catch (err) {
        // Can't reach the host — most likely a sleeping backend spinning up.
        if (canRetry()) {
          markWaking();
          await sleep(backoff());
          attempt++;
          continue;
        }
        emitApiError("Network error — check your connection");
        throw err;
      }

      if (res.status === 401) {
        window.location.href = "/login";
        throw new Error("Session expired");
      }

      // Render returns a gateway error while the instance is still booting.
      if (WAKE_RETRY_STATUS.has(res.status) && canRetry()) {
        markWaking();
        await sleep(backoff());
        attempt++;
        continue;
      }

      if (!res.ok) {
        const body = await res.text();
        emitApiError(`Request failed (${res.status})`);
        throw new Error(body || `Request failed: ${res.status}`);
      }
      return res.status === 204 ? (undefined as T) : res.json();
    }
  } finally {
    if (wakingHere && --wakingCount === 0) signalWaking(false);
  }
}

export const get = <T>(path: string) => api<T>(path);
export const post = <T>(path: string, body?: unknown) =>
  api<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
export const patch = <T>(path: string, body: unknown) =>
  api<T>(path, { method: "PATCH", body: JSON.stringify(body) });
export const put = <T>(path: string, body: unknown) =>
  api<T>(path, { method: "PUT", body: JSON.stringify(body) });
export const del = (path: string) => api<void>(path, { method: "DELETE" });
