"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * The user's self-chosen "Today" list: an ordered set of roadmap node slugs
 * they want to work on. Persisted in localStorage (like focus timers and task
 * checks) so it survives reloads and stays until the user edits it or a topic
 * is marked done. This replaces the old auto-picker that decided the daily
 * focus for you.
 */
const KEY = "cortex:today";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(stored)) {
      return stored.filter((s): s is string => typeof s === "string");
    }
  } catch {}
  return [];
}

export interface TodayList {
  slugs: string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
}

export function useTodayList(): TodayList {
  const [slugs, setSlugs] = useState<string[]>(read);

  // Keep in sync if another tab edits the list.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSlugs(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((slug: string) => {
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((prev) => {
      if (!prev.includes(slug)) return prev;
      const next = prev.filter((s) => s !== slug);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { slugs, add, remove, has };
}
