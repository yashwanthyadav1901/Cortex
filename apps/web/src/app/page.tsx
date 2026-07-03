"use client";

import { useCallback, useEffect, useState } from "react";
import PlanCard from "@/components/PlanCard";
import { get, post } from "@/lib/api";
import type { ActivityType, Plan, Streak } from "@/types";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Dashboard() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([
        get<Streak>("/streak"),
        get<Plan | null>("/plan/current"),
      ]);
      setStreak(s);
      setPlan(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function logActivity(type: ActivityType) {
    setStreak(await post<Streak>("/activity", { activity_type: type }));
  }

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      setPlan(await post<Plan>("/generate-plan", { available_hours: hours }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <p className="text-sm text-zinc-400">Loading…</p>;

  const today = DAY_NAMES[(new Date().getDay() + 6) % 7];
  const todayFocus = plan?.generated_json.daily_breakdown?.find(
    (d) => d.day.toLowerCase().startsWith(today.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Today</h1>
        {streak && (
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
              streak.active_today
                ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            🔥 {streak.current_streak} day{streak.current_streak === 1 ? "" : "s"}
          </div>
        )}
      </header>

      {error && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300">
          {error}
        </p>
      )}

      {todayFocus && (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/50">
          <h2 className="mb-1 text-xs font-semibold tracking-wide text-indigo-500 uppercase">
            {today}&apos;s focus
          </h2>
          <p className="text-sm font-medium">
            {todayFocus.focus}{" "}
            <span className="font-normal text-zinc-500">(~{todayFocus.est_hours}h)</span>
          </p>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Quick log
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["topic_study", "📚 Studied"],
              ["project_work", "🛠️ Built"],
              ["dsa_solved", "🧩 Solved"],
            ] as [ActivityType, string][]
          ).map(([type, label]) => (
            <button
              key={type}
              onClick={() => logActivity(type)}
              className="rounded-xl border border-zinc-200 py-3 text-sm font-medium hover:border-indigo-400 hover:bg-indigo-50 active:scale-95 dark:border-zinc-800 dark:hover:bg-indigo-950"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">This week&apos;s plan</h2>
          {plan && (
            <span className="text-xs text-zinc-400">
              wk of {plan.week_start_date}
            </span>
          )}
        </div>
        {plan ? (
          <PlanCard plan={plan.generated_json} />
        ) : (
          <p className="mb-3 text-sm text-zinc-500">
            No plan yet for this week. How many hours do you have?
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-900">
          <input
            type="number"
            min={1}
            max={80}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-20 rounded-lg border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <span className="text-sm text-zinc-500">hrs/week</span>
          <button
            onClick={generate}
            disabled={generating}
            className="ml-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {generating ? "Generating…" : plan ? "Regenerate" : "Generate plan"}
          </button>
        </div>
      </section>
    </div>
  );
}
