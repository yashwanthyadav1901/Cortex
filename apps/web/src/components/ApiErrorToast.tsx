"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { API_ERROR_EVENT } from "@/lib/api";

export default function ApiErrorToast() {
  const [message, setMessage] = useState<string | null>(null);
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
    window.addEventListener(API_ERROR_EVENT, onError);
    return () => {
      window.removeEventListener(API_ERROR_EVENT, onError);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, [dismiss]);

  if (!message) return null;

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
