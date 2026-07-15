"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/login") {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = "/login";
      } else {
        setReady(true);
      }
    });
  }, [pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <span className="animate-pulse-glow text-3xl font-semibold tracking-tight text-indigo-600 dark:text-indigo-400">
          Cortex
        </span>
        <span className="animate-fade-in text-xs text-zinc-400 [animation-delay:400ms]">
          Loading your day…
        </span>
      </div>
    );
  }
  return <div className="animate-fade-in">{children}</div>;
}
