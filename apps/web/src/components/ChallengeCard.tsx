"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CHALLENGE_TASKS, getLevel } from "@/content/challenge";
import { get } from "@/lib/api";
import type { ChallengeDay } from "@/types";

export default function ChallengeCard() {
  const [started, setStarted] = useState<boolean | null>(null);
  const [today, setToday] = useState<ChallengeDay | null>(null);

  useEffect(() => {
    get<{ started: boolean }>("/challenge/started")
      .then(({ started: s }) => {
        setStarted(s);
        if (s) get<ChallengeDay>("/challenge/today").then(setToday);
      })
      .catch(() => {});
  }, []);

  if (started === null) return null;

  if (!started) {
    return (
      <Link
        href="/75hard"
        className="block rounded-xl border border-zinc-200 px-4 py-3 transition hover:border-indigo-400 dark:border-zinc-800"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">💪</span>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            75 Hard
          </span>
          <span className="ml-auto text-xs font-medium text-indigo-600 dark:text-indigo-400">
            Start challenge →
          </span>
        </div>
      </Link>
    );
  }

  if (!today) return null;

  const level = getLevel(today.day_number);
  const tasksComplete = CHALLENGE_TASKS.filter((t) => today[t.key]).length;
  const pct = Math.round((today.day_number / 75) * 100);

  return (
    <Link
      href="/75hard"
      className={`block rounded-xl border px-4 py-3 transition hover:border-indigo-400 ${
        today.all_complete
          ? "border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] dark:border-emerald-500 dark:shadow-[0_0_12px_rgba(16,185,129,0.1)]"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{level.icon}</span>
          <div>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              75 Hard
            </span>
            <span className={`ml-2 text-xs font-medium ${level.textClass}`}>
              {level.name}
            </span>
          </div>
        </div>
        <span
          className={`text-xs font-semibold ${
            today.all_complete
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-400"
          }`}
        >
          {tasksComplete}/{CHALLENGE_TASKS.length} tasks
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-medium text-zinc-500">
          Day {today.day_number}/75
        </span>
      </div>
    </Link>
  );
}
