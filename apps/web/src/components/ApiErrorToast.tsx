"use client";

import { useEffect, useRef, useState } from "react";
import { API_ERROR_EVENT } from "@/lib/api";

export default function ApiErrorToast() {
  const [message, setMessage] = useState<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onError(e: Event) {
      setMessage((e as CustomEvent<string>).detail || "Request failed");
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setMessage(null), 5000);
    }
    window.addEventListener(API_ERROR_EVENT, onError);
    return () => {
      window.removeEventListener(API_ERROR_EVENT, onError);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  if (!message) return null;

  return (
    <button
      onClick={() => setMessage(null)}
      className="fixed inset-x-4 bottom-20 z-30 mx-auto max-w-sm rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white shadow-lg md:bottom-6"
    >
      {message}
    </button>
  );
}
