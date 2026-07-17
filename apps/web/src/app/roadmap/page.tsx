"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { allNodes, PILLAR_LABELS, pillarToSlug, ROADMAPS } from "@/content";
import { get } from "@/lib/api";
import type { Pillar, TopicProgress } from "@/types";

const PILLAR_ICONS: Record<Pillar, string> = {
  system_design: "🏗️",
  ai: "🤖",
  dsa: "🧩",
  ai_agents: "🕵️",
  langgraph: "🕸️",
  crewai: "⛵",
};

export default function RoadmapIndex() {
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({});

  useEffect(() => {
    get<Record<string, TopicProgress>>("/progress")
      .then(setProgress)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Roadmaps</h1>
      <p className="text-sm text-zinc-500">
        Curated learning paths. Tap a pillar, follow the flow, deep-dive into any
        topic.
      </p>
      <div className="space-y-3">
        {(Object.keys(ROADMAPS) as Pillar[]).map((pillar) => {
          const roadmap = ROADMAPS[pillar];
          const nodes = allNodes(roadmap);
          const done = nodes.filter((n) => progress[n.slug]?.status === "done").length;
          const inProgress = nodes.filter(
            (n) => progress[n.slug]?.status === "in_progress"
          ).length;
          const pct = nodes.length ? Math.round((done / nodes.length) * 100) : 0;
          return (
            <Link
              key={pillar}
              href={`/roadmap/${pillarToSlug(pillar)}`}
              className="card-lift block rounded-xl border border-zinc-200 p-4 hover:border-indigo-400 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{PILLAR_ICONS[pillar]}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{PILLAR_LABELS[pillar]}</p>
                  <p className="text-xs text-zinc-400">
                    {done}/{nodes.length} topics done
                    {inProgress > 0 && ` · ${inProgress} in progress`}
                  </p>
                </div>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {pct}%
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
