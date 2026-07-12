"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import ChallengeCard from "@/components/ChallengeCard";
import DeepThought from "@/components/DeepThought";

import SavedList from "@/components/SavedList";
import TodayFocus from "@/components/TodayFocus";

import { allNodes, PILLAR_LABELS, pillarToSlug, ROADMAPS } from "@/content";
import type { RoadmapNode } from "@/content/types";
import { get } from "@/lib/api";
import { useTodayList } from "@/lib/todayList";
import type { Pillar, Streak, TopicProgress } from "@/types";

interface CarryOverItem {
  pillar: Pillar;
  node: RoadmapNode;
  task: string;
  taskIndex: number;
}

function getCarryOverTasks(
  progress: Record<string, TopicProgress>
): CarryOverItem[] {
  const items: CarryOverItem[] = [];
  for (const pillar of Object.keys(ROADMAPS) as Pillar[]) {
    for (const node of allNodes(ROADMAPS[pillar])) {
      const status = progress[node.slug]?.status;
      if (status !== "in_progress" && status !== "done") continue;
      const tasks = node.tasks ?? [];
      if (tasks.length === 0) continue;
      try {
        const stored = JSON.parse(
          localStorage.getItem(`cortex:tasks:${node.slug}`) ?? "[]"
        );
        if (!Array.isArray(stored) || stored.length !== tasks.length) continue;
        tasks.forEach((task, i) => {
          if (!stored[i]) items.push({ pillar, node, task, taskIndex: i });
        });
      } catch {}
    }
  }
  return items;
}

const PILLAR_ICONS: Record<Pillar, string> = {
  system_design: "🏗️",
  ai: "🤖",
  dsa: "🧩",
  ai_agents: "🕵️",
};

export default function Dashboard() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const today = useTodayList();

  const load = useCallback(
    () =>
      Promise.all([
        get<Streak>("/streak"),
        get<Record<string, TopicProgress>>("/progress"),
      ])
        .then(([s, p]) => {
          setStreak(s);
          setProgress(p);
          setError(false);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-sm text-zinc-400">Loading…</p>;

  // Failed before anything loaded: show a retry screen instead of a
  // misleading empty dashboard. Later failures fall back to the toast.
  if (error && !streak) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-zinc-500">Couldn&apos;t reach the server.</p>
        <button
          onClick={() => {
            setLoading(true);
            load();
          }}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const carryOver = getCarryOverTasks(progress);

  const upNext = (Object.keys(ROADMAPS) as Pillar[]).map((pillar) => {
    const nodes = allNodes(ROADMAPS[pillar]);
    const node =
      nodes.find((n) => progress[n.slug]?.status === "in_progress") ??
      nodes.find(
        (n) =>
          (progress[n.slug]?.status ?? "not_started") === "not_started"
      );
    const done = nodes.filter(
      (n) => progress[n.slug]?.status === "done"
    ).length;
    return { pillar, node, done, total: nodes.length };
  });

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

      <DeepThought />

      <ChallengeCard />

      <TodayFocus today={today} progress={progress} onStatusChange={load} />

      {carryOver.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            Incomplete tasks
          </h2>
          <ul className="space-y-1">
            {carryOver.map((item) => (
              <li key={`${item.node.slug}-${item.taskIndex}`}>
                <Link
                  href={`/roadmap/${pillarToSlug(item.pillar)}/${item.node.slug}`}
                  className="flex items-start gap-3 rounded-lg px-2 py-2 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-300 dark:border-zinc-600" />
                  <span className="min-w-0">
                    <span className="block text-sm leading-snug text-zinc-700 dark:text-zinc-300">
                      {item.task}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {item.node.title}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Up next
        </h2>
        <div className="space-y-2">
          {upNext.map(({ pillar, node, done, total }) => (
            <div
              key={pillar}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 transition hover:border-indigo-400 dark:border-zinc-800"
            >
              <span className="text-xl">{PILLAR_ICONS[pillar]}</span>
              <Link
                href={
                  node
                    ? `/roadmap/${pillarToSlug(pillar)}/${node.slug}`
                    : `/roadmap/${pillarToSlug(pillar)}`
                }
                className="min-w-0 flex-1"
              >
                <span className="block text-xs text-zinc-400">
                  {PILLAR_LABELS[pillar]} · {done}/{total}
                </span>
                <span className="block truncate text-sm font-semibold">
                  {node ? node.title : "All done 🎉"}
                </span>
                {node && progress[node.slug]?.status === "in_progress" && (
                  <span className="text-xs text-blue-500">continue →</span>
                )}
              </Link>
              {node &&
                (today.has(node.slug) ? (
                  <span className="shrink-0 text-xs font-medium text-emerald-500">
                    ✓ Added
                  </span>
                ) : (
                  <button
                    onClick={() => today.add(node.slug)}
                    className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 dark:border-zinc-700 dark:text-indigo-400 dark:hover:bg-indigo-950"
                  >
                    + Today
                  </button>
                ))}
            </div>
          ))}
        </div>
      </section>

      <SavedList />

      <ActivityHeatmap />
    </div>
  );
}
