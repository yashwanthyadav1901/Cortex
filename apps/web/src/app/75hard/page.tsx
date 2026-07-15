"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CHALLENGE_LEVELS,
  CHALLENGE_MILESTONES,
  CHALLENGE_TASKS,
  getLevel,
  getLevelProgress,
  type ChallengeTaskKey,
} from "@/content/challenge";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { get, patch, post } from "@/lib/api";
import type { ChallengeDay, ChallengeStatus } from "@/types";

// Confetti burst when all of a day's tasks are done — once per day,
// skipped for users who prefer reduced motion.
async function celebrateDay(dayNumber: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const guard = `cortex:75hard-confetti:${dayNumber}`;
  try {
    if (localStorage.getItem(guard)) return;
    localStorage.setItem(guard, "1");
  } catch {}
  const confetti = (await import("canvas-confetti")).default;
  const colors = ["#4f46e5", "#10b981", "#a5b4fc", "#6ee7b7"];
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.7 }, colors });
  setTimeout(
    () =>
      confetti({ particleCount: 50, spread: 100, origin: { y: 0.6 }, colors }),
    250
  );
}

function ContractPage({ onStart }: { onStart: () => void }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="stagger-children mx-auto max-w-lg space-y-8 py-8">
      <div className="text-center">
        <span className="text-5xl">💪</span>
        <h1 className="mt-4 text-3xl font-bold">75 Hard</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          The ultimate mental toughness challenge
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          What you&apos;re signing up for
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          75 Hard is not a fitness challenge — it&apos;s a{" "}
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            mental toughness program
          </span>
          . For the next 75 days, you will complete every single task below. No
          shortcuts, no substitutions, no excuses. If you miss even one task on
          any day, you start over from Day 1.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Daily requirements
        </h2>
        <ul className="space-y-3">
          {CHALLENGE_TASKS.map((task) => (
            <li key={task.key} className="flex items-center gap-3">
              <span className="text-lg">{task.icon}</span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {task.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          The journey
        </h2>
        <div className="space-y-3">
          {CHALLENGE_LEVELS.map((level) => (
            <div key={level.name} className="flex items-start gap-3">
              <span className="mt-0.5 text-lg">{level.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${level.textClass}`}>
                  {level.name}
                </p>
                <p className="text-xs text-zinc-500">
                  Day {level.dayStart}–{level.dayEnd}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-4 dark:border-indigo-800 dark:bg-indigo-950/50">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Your contract
        </h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          I commit to completing all 6 tasks every single day for 75 days. I
          understand there are no compromises, no substitutions, and no days
          off. If I fail to complete all tasks on any day, I will restart from
          Day 1 without hesitation. This is my choice. This is my commitment.
        </p>
        <label className="mt-4 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 accent-indigo-600"
          />
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            I agree to the terms of 75 Hard
          </span>
        </label>
      </div>

      <button
        onClick={onStart}
        disabled={!agreed}
        className="pressable w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Start 75 Hard Challenge
      </button>
    </div>
  );
}

function TrackingPage({
  today,
  status,
  onToggle,
}: {
  today: ChallengeDay;
  status: ChallengeStatus;
  onToggle: (key: ChallengeTaskKey) => void;
}) {
  const dayNumber = today.day_number;
  const level = getLevel(dayNumber);
  const levelProgress = getLevelProgress(dayNumber);
  const tasksComplete = CHALLENGE_TASKS.filter((t) => today[t.key]).length;
  // Only the task the user just tapped gets the check animation, so
  // already-done tasks don't all pop on page load.
  const [justToggled, setJustToggled] = useState<ChallengeTaskKey | null>(null);

  return (
    <div className="stagger-children space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">75 Hard</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg">{level.icon}</span>
            <span className={`text-sm font-semibold ${level.textClass}`}>
              {level.name}
            </span>
          </div>
        </div>
        <div
          className={`rounded-full px-4 py-2 text-sm font-bold ${level.bgClass} ${level.textClass}`}
        >
          Day {dayNumber}/75
        </div>
      </header>

      <div
        className={`rounded-xl border px-4 py-3 ${level.bgClass} ${level.borderClass}`}
      >
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className={level.textClass}>
            {level.icon} {level.name} — Day {levelProgress.current}/
            {levelProgress.total}
          </span>
          <span className={`text-xs ${level.textClass}`}>
            {levelProgress.percent}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/30 dark:bg-black/20">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `${levelProgress.percent}%`,
              backgroundColor:
                level.color === "blue"
                  ? "#3b82f6"
                  : level.color === "amber"
                    ? "#f59e0b"
                    : level.color === "purple"
                      ? "#a855f7"
                      : "#10b981",
            }}
          />
        </div>
      </div>

      <section
        className={`rounded-xl border px-4 py-4 transition-all duration-500 ${
          today.all_complete
            ? "border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] dark:border-emerald-500 dark:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            : "border-zinc-200 dark:border-zinc-800"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Today&apos;s tasks
          </h2>
          <span
            className={`text-xs font-semibold ${
              today.all_complete
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-zinc-400"
            }`}
          >
            {tasksComplete}/{CHALLENGE_TASKS.length}
          </span>
        </div>
        <ul className="space-y-2">
          {CHALLENGE_TASKS.map((task) => {
            const checked = today[task.key];
            const animate = checked && justToggled === task.key;
            return (
              <li key={task.key}>
                <button
                  onClick={() => {
                    setJustToggled(task.key);
                    onToggle(task.key);
                  }}
                  className={`pressable flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    checked
                      ? "bg-emerald-50 dark:bg-emerald-950/40"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                      checked
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    } ${animate ? "animate-check-reward" : ""}`}
                  >
                    {checked && (
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                          pathLength={24}
                          className={animate ? "animate-check-draw" : undefined}
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-lg">{task.icon}</span>
                  <span
                    className={`text-sm font-medium ${
                      checked
                        ? "text-emerald-700 line-through dark:text-emerald-400"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {task.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Milestones
        </h2>
        <div className="flex flex-wrap gap-2">
          {CHALLENGE_MILESTONES.map((m) => {
            const unlocked = dayNumber >= m.day;
            return (
              <div
                key={m.day}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  unlocked
                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950"
                    : "border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-800 dark:bg-zinc-900"
                }`}
              >
                <span className="text-lg">{unlocked ? m.icon : "🔒"}</span>
                <div>
                  <p
                    className={`font-semibold ${
                      unlocked
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-zinc-400"
                    }`}
                  >
                    Day {m.day} — {m.title}
                  </p>
                  <p className="text-xs text-zinc-500">{m.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Progress
        </h2>
        <div className="grid grid-cols-15 gap-1">
          {Array.from({ length: 75 }, (_, i) => {
            const day = i + 1;
            const gridDay = status.days.find((d) => d.day_number === day);
            const isToday = day === dayNumber;
            const complete = gridDay?.complete ?? false;
            const isPast = gridDay && !isToday;

            let cellClass =
              "flex h-8 w-full items-center justify-center rounded text-xs font-medium transition ";

            if (isToday) {
              cellClass += complete
                ? "bg-emerald-500 text-white ring-2 ring-emerald-400 ring-offset-1 dark:ring-offset-zinc-950"
                : "bg-indigo-500 text-white ring-2 ring-indigo-400 ring-offset-1 dark:ring-offset-zinc-950";
            } else if (complete) {
              cellClass +=
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300";
            } else if (isPast) {
              cellClass +=
                "bg-red-100 text-red-400 dark:bg-red-950 dark:text-red-500";
            } else {
              cellClass +=
                "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600";
            }

            return (
              <div key={day} className={cellClass} title={`Day ${day}`}>
                {day}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Stats
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Completed Days", value: status.total_completed },
            {
              label: "Current Streak",
              value: `${status.current_streak} day${status.current_streak === 1 ? "" : "s"}`,
            },
            {
              label: "Completion Rate",
              value: `${status.elapsed_days > 0 ? Math.round((status.total_completed / status.elapsed_days) * 100) : 0}%`,
            },
            {
              label: "Best Streak",
              value: `${status.best_streak} day${status.best_streak === 1 ? "" : "s"}`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <p className="text-xs text-zinc-400">{stat.label}</p>
              <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function SeventyFiveHardPage() {
  const [started, setStarted] = useState<boolean | null>(null);
  const [today, setToday] = useState<ChallengeDay | null>(null);
  const [status, setStatus] = useState<ChallengeStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTracking = useCallback(() => {
    Promise.all([
      get<ChallengeDay>("/challenge/today"),
      get<ChallengeStatus>("/challenge/status"),
    ]).then(([t, s]) => {
      setToday(t);
      setStatus(s);
    });
  }, []);

  useEffect(() => {
    get<{ started: boolean }>("/challenge/started")
      .then(({ started: s }) => {
        setStarted(s);
        if (s) loadTracking();
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [loadTracking]);

  async function handleStart() {
    await post("/challenge/start");
    setStarted(true);
    loadTracking();
  }

  async function handleToggle(key: ChallengeTaskKey) {
    if (!today) return;
    const updated = await patch<ChallengeDay>("/challenge/today", {
      [key]: !today[key],
    });
    if (updated.all_complete && !today.all_complete) {
      celebrateDay(updated.day_number);
    }
    setToday(updated);
    const s = await get<ChallengeStatus>("/challenge/status");
    setStatus(s);
  }

  if (loading) return <PageSkeleton variant="list" />;

  if (!started) return <ContractPage onStart={handleStart} />;

  if (!today || !status) return null;

  return (
    <TrackingPage today={today} status={status} onToggle={handleToggle} />
  );
}
