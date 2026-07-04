"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { allNodes, PILLAR_LABELS, pillarToSlug, ROADMAPS } from "@/content";
import { get, post } from "@/lib/api";
import type { ActivityType, Pillar, Streak, TopicStatus } from "@/types";

const PILLAR_ICONS: Record<Pillar, string> = {
  system_design: "🏗️",
  ai: "🤖",
  dsa: "🧩",
};

export default function Dashboard() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [progress, setProgress] = useState<Record<string, TopicStatus>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([
        get<Streak>("/streak"),
        get<Record<string, TopicStatus>>("/progress"),
      ]);
      setStreak(s);
      setProgress(p);
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

  if (loading) return <p className="text-sm text-zinc-400">Loading…</p>;

  // First in-progress node per pillar, else first not-started one.
  const upNext = (Object.keys(ROADMAPS) as Pillar[]).map((pillar) => {
    const nodes = allNodes(ROADMAPS[pillar]);
    const node =
      nodes.find((n) => progress[n.slug] === "in_progress") ??
      nodes.find((n) => (progress[n.slug] ?? "not_started") === "not_started");
    const done = nodes.filter((n) => progress[n.slug] === "done").length;
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

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Up next
        </h2>
        <div className="space-y-2">
          {upNext.map(({ pillar, node, done, total }) => (
            <Link
              key={pillar}
              href={
                node
                  ? `/roadmap/${pillarToSlug(pillar)}/${node.slug}`
                  : `/roadmap/${pillarToSlug(pillar)}`
              }
              className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 transition hover:border-indigo-400 dark:border-zinc-800"
            >
              <span className="text-xl">{PILLAR_ICONS[pillar]}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-zinc-400">
                  {PILLAR_LABELS[pillar]} · {done}/{total}
                </span>
                <span className="block truncate text-sm font-semibold">
                  {node ? node.title : "All done 🎉"}
                </span>
                {node && progress[node.slug] === "in_progress" && (
                  <span className="text-xs text-blue-500">continue →</span>
                )}
              </span>
              <span className="text-zinc-300">→</span>
            </Link>
          ))}
        </div>
      </section>

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
        <p className="mt-2 text-center text-xs text-zinc-400">
          Marking roadmap topics and DSA problems logs activity automatically.
        </p>
      </section>
    </div>
  );
}
