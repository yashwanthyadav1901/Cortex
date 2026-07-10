"use client";

import { useState } from "react";
import type { BlogChecklistSection } from "@/content/blog/types";

function useCategoryChecks(slug: string, categoryIdx: number, count: number) {
  const key = `cortex:blog-checklist:${slug}:${categoryIdx}`;
  const [checks, setChecks] = useState<boolean[]>(() => {
    if (typeof window === "undefined") return Array(count).fill(false);
    try {
      const stored = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (Array.isArray(stored) && stored.length === count) return stored;
    } catch {}
    return Array(count).fill(false);
  });

  function toggle(i: number) {
    setChecks((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }

  return { checks, toggle, done: checks.filter(Boolean).length };
}

function CategoryGroup({
  name,
  items,
  slug,
  categoryIdx,
}: {
  name: string;
  items: string[];
  slug: string;
  categoryIdx: number;
}) {
  const { checks, toggle, done } = useCategoryChecks(
    slug,
    categoryIdx,
    items.length
  );
  const total = items.length;
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          {name}
        </h4>
        <span className="text-xs tabular-nums text-zinc-400">
          {done}/{total}
        </span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <button
              onClick={() => toggle(i)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                checks[i]
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-zinc-300 hover:border-indigo-400 dark:border-zinc-600 dark:hover:border-indigo-500"
              }`}
              aria-label={checks[i] ? `Uncheck: ${item}` : `Check: ${item}`}
            >
              {checks[i] && (
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6l3 3 5-5" />
                </svg>
              )}
            </button>
            <span
              className={`text-sm leading-relaxed transition ${
                checks[i]
                  ? "text-zinc-400 line-through dark:text-zinc-500"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DeploymentChecklist({
  section,
  postSlug,
}: {
  section: BlogChecklistSection;
  postSlug: string;
}) {
  return (
    <div className="space-y-4">
      {section.categories.map((cat, i) => (
        <CategoryGroup
          key={cat.name}
          name={cat.name}
          items={cat.items}
          slug={postSlug}
          categoryIdx={i}
        />
      ))}
    </div>
  );
}
