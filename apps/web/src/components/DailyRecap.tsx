"use client";

import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import type { ActivityEntry } from "@/types";

const TYPE_ICONS: Record<string, string> = {
  topic_study: "📚",
  project_work: "🛠️",
  dsa_solved: "🧩",
};

const TYPE_LABELS: Record<string, string> = {
  topic_study: "topic studied",
  project_work: "project worked",
  dsa_solved: "problem solved",
};

export default function DailyRecap() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    get<ActivityEntry[]>("/activity/today")
      .then((a) => {
        setActivities(a);
        setExpanded(a.length > 0);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  const byType: Record<string, number> = {};
  for (const a of activities) {
    byType[a.activity_type] = (byType[a.activity_type] || 0) + 1;
  }

  const summary = Object.entries(byType)
    .map(([type, count]) => `${count} ${TYPE_LABELS[type] || type}${count > 1 ? "s" : ""}`)
    .join(", ");

  return (
    <section>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-2 flex w-full items-center justify-between"
      >
        <h2 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Today&apos;s recap
        </h2>
        <span className="text-xs text-zinc-400">{expanded ? "▾" : "▸"}</span>
      </button>
      {expanded && (
        <>
          {activities.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-200 px-4 py-4 text-center text-sm text-zinc-400 dark:border-zinc-800">
              No activity yet today — pick a topic below to get started!
            </p>
          ) : (
            <div className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-300">
                {activities.length} activit{activities.length === 1 ? "y" : "ies"} today
                {summary && `: ${summary}`}
              </p>
              <ul className="space-y-1">
                {activities.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{TYPE_ICONS[a.activity_type] || "•"}</span>
                    <span>{TYPE_LABELS[a.activity_type] || a.activity_type}</span>
                    <span className="ml-auto text-zinc-400">
                      {new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
