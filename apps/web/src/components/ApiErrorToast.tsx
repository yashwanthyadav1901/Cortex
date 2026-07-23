"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { API_ERROR_EVENT, API_WAKING_EVENT } from "@/lib/api";

export default function ApiErrorToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [waking, setWaking] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setLeaving(true);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      setMessage(null);
      setLeaving(false);
    }, 200);
  }, []);

  useEffect(() => {
    function onError(e: Event) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      setLeaving(false);
      setMessage((e as CustomEvent<string>).detail || "Request failed");
      hideTimer.current = setTimeout(dismiss, 5000);
    }
    function onWaking(e: Event) {
      setWaking(Boolean((e as CustomEvent<boolean>).detail));
    }
    window.addEventListener(API_ERROR_EVENT, onError);
    window.addEventListener(API_WAKING_EVENT, onWaking);
    return () => {
      window.removeEventListener(API_ERROR_EVENT, onError);
      window.removeEventListener(API_WAKING_EVENT, onWaking);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, [dismiss]);

  // A real error takes precedence over the (informational) waking notice.
  if (message) {
    return (
      <button
        onClick={dismiss}
        className={`fixed inset-x-4 bottom-20 z-30 mx-auto max-w-sm rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white shadow-lg md:bottom-6 ${
          leaving ? "animate-toast-out" : "animate-toast-in"
        }`}
      >
        {message}
      </button>
    );
  }

  if (waking) {
    return (
      <div
        className="animate-toast-in fixed inset-x-4 bottom-20 z-30 mx-auto flex max-w-sm items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg md:bottom-6"
        role="status"
        aria-live="polite"
      >
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        Waking up the server — this can take up to a minute…
      </div>
    );
  }

  return null;
}
