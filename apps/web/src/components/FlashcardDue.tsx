"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import type { FlashcardStats } from "@/types";

export default function FlashcardDue() {
  const [stats, setStats] = useState<FlashcardStats | null>(null);

  useEffect(() => {
    get<FlashcardStats>("/flashcards/stats").then(setStats).catch(() => {});
  }, []);

  if (!stats || stats.total === 0) return null;

  return (
    <section className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🃏</span>
          <span className="text-sm font-semibold">
            {stats.due_today > 0
              ? `${stats.due_today} card${stats.due_today === 1 ? "" : "s"} due`
              : "All caught up!"}
          </span>
        </div>
        {stats.due_today > 0 ? (
          <Link
            href="/review"
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Review
          </Link>
        ) : (
          <span className="text-xs text-zinc-400">
            {stats.reviewed_today} reviewed today
          </span>
        )}
      </div>
    </section>
  );
}
