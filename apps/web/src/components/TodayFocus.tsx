"use client";

import { useEffect, useState } from "react";
import FocusPanel from "@/components/FocusPanel";
import { allNodes, findNodeGlobal, PILLAR_LABELS, ROADMAPS } from "@/content";
import type { TodayList } from "@/lib/todayList";
import type { Pillar, TopicProgress, TopicStatus } from "@/types";

// AI Agents first — the pillar being prioritized — then the rest, so the
// "Add topic" picker surfaces agent nodes at the top.
const PICKER_ORDER: Pillar[] = ["ai_agents", "system_design", "ai", "dsa"];

const STATUS_DOT: Record<TopicStatus, string> = {
  done: "bg-emerald-500",
  in_progress: "bg-blue-500",
  not_started: "bg-zinc-300 dark:bg-zinc-600",
};

export default function TodayFocus({
  today,
  progress,
  onStatusChange,
}: {
  today: TodayList;
  progress: Record<string, TopicProgress>;
  onStatusChange: () => void;
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState("");

  const { slugs, remove } = today;

  // A topic leaves the list once it's done (here or on the roadmap page).
  useEffect(() => {
    slugs.forEach((slug) => {
      if (progress[slug]?.status === "done") remove(slug);
    });
  }, [slugs, progress, remove]);

  const chosen = slugs
    .map((slug) => findNodeGlobal(slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const active =
    chosen.find((r) => r.node.slug === activeSlug) ?? chosen[0] ?? null;

  const q = query.trim().toLowerCase();
  const candidates = PICKER_ORDER.flatMap((pillar) =>
    allNodes(ROADMAPS[pillar])
      .filter((node) => !today.has(node.slug))
      .filter(
        (node) =>
          !q ||
          node.title.toLowerCase().includes(q) ||
          node.summary.toLowerCase().includes(q)
      )
      .map((node) => ({ pillar, node }))
  );

  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
        Focus
      </h2>

      {chosen.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">
            Nothing picked yet. Add what you want to work on today.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <ul className="space-y-1.5">
            {chosen.map(({ pillar, node }) => {
              const status = progress[node.slug]?.status ?? "not_started";
              const isActive = active?.node.slug === node.slug;
              return (
                <li
                  key={node.slug}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                    isActive
                      ? "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[status]}`}
                  />
                  <button
                    onClick={() => setActiveSlug(node.slug)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block text-xs text-zinc-400">
                      {PILLAR_LABELS[pillar]}
                    </span>
                    <span className="block truncate text-sm font-semibold">
                      {node.title}
                    </span>
                  </button>
                  {!isActive && (
                    <button
                      onClick={() => setActiveSlug(node.slug)}
                      className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-950"
                    >
                      Focus
                    </button>
                  )}
                  <button
                    onClick={() => remove(node.slug)}
                    aria-label={`Remove ${node.title} from today`}
                    className="shrink-0 rounded-full px-2 py-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>

          {active && (
            <FocusPanel
              key={active.node.slug}
              node={active.node}
              pillar={active.pillar}
              progress={progress[active.node.slug]}
              onStatusChange={onStatusChange}
            />
          )}
        </div>
      )}

      <div className="mt-2">
        {!picking ? (
          <button
            onClick={() => setPicking(true)}
            className="w-full rounded-xl border border-dashed border-zinc-300 py-2.5 text-sm font-medium text-zinc-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:hover:text-indigo-400"
          >
            + Add topic
          </button>
        ) : (
          <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
            <div className="mb-2 flex items-center gap-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics…"
                className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-transparent px-3 py-1.5 text-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700"
              />
              <button
                onClick={() => {
                  setPicking(false);
                  setQuery("");
                }}
                className="shrink-0 rounded-lg px-2 py-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Done
              </button>
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {candidates.length === 0 ? (
                <p className="px-1 py-2 text-xs text-zinc-400">
                  No matching topics.
                </p>
              ) : (
                candidates.map(({ pillar, node }) => (
                  <button
                    key={node.slug}
                    onClick={() => {
                      today.add(node.slug);
                      setActiveSlug(node.slug);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-zinc-400">
                        {PILLAR_LABELS[pillar]}
                      </span>
                      <span className="block truncate text-sm">
                        {node.title}
                      </span>
                    </span>
                    <span className="shrink-0 text-indigo-500">+</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
