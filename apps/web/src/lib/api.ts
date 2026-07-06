import { supabase } from "./supabase";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Fired on request failures (except auth redirects); ApiErrorToast listens. */
export const API_ERROR_EVENT = "cortex:api-error";

function emitApiError(message: string) {
  window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail: message }));
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "/login";
    throw new Error("Not signed in");
  }

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
    emitApiError("Network error — check your connection");
    throw err;
  }

  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const body = await res.text();
    emitApiError(`Request failed (${res.status})`);
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const get = <T>(path: string) => api<T>(path);
export const post = <T>(path: string, body?: unknown) =>
  api<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
export const patch = <T>(path: string, body: unknown) =>
  api<T>(path, { method: "PATCH", body: JSON.stringify(body) });
export const put = <T>(path: string, body: unknown) =>
  api<T>(path, { method: "PUT", body: JSON.stringify(body) });
export const del = (path: string) => api<void>(path, { method: "DELETE" });
