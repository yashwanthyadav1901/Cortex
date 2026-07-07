"use client";

import { useEffect, useState } from "react";
import { get, put } from "@/lib/api";
import type { WeeklySummary } from "@/types";

export default function WeeklyGoal() {
  const [goal, setGoal] = useState<number | null>(null);
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    get<{ key: string; value: number }>("/settings/weekly_goal")
      .then((s) => setGoal(s.value))
      .catch(() => {});
    get<WeeklySummary>("/activity/weekly-summary")
      .then(setSummary)
      .catch(() => {});
  }, []);

  async function saveGoal() {
    const val = parseInt(input, 10);
    if (!val || val <= 0) return;
    try {
      await put("/settings/weekly_goal", { value: val });
      setGoal(val);
      setEditing(false);
    } catch {}
  }

  if (!summary) return null;

  const pct = goal ? Math.min(100, Math.round((summary.total_activities / goal) * 100)) : 0;

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Weekly goal
        </h2>
        <span className="text-xs text-zinc-400">{summary.days_active} day{summary.days_active === 1 ? "" : "s"} active</span>
      </div>
      <div className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
        {goal && !editing ? (
          <>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">
                {summary.total_activities} / {goal} activities
              </span>
              <button
                onClick={() => { setInput(String(goal)); setEditing(true); }}
                className="text-xs text-zinc-400 hover:text-indigo-500"
              >
                edit
              </button>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-zinc-400">{pct}%</p>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              {editing ? "Update" : "Set"} weekly activity goal:
            </span>
            <input
              type="number"
              min="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 10"
              className="w-20 rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              onKeyDown={(e) => e.key === "Enter" && saveGoal()}
            />
            <button
              onClick={saveGoal}
              className="rounded-lg bg-indigo-600 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Save
            </button>
            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                cancel
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
