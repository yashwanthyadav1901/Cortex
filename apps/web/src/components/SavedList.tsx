"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { allNodes, getProject, PILLAR_LABELS, pillarToSlug, PROJECTS, ROADMAPS } from "@/content";
import { del, get } from "@/lib/api";
import type { Bookmark, Pillar } from "@/types";

function resolveBookmark(b: Bookmark): { title: string; href: string; subtitle: string } | null {
  if (b.type === "topic") {
    for (const pillar of Object.keys(ROADMAPS) as Pillar[]) {
      const node = allNodes(ROADMAPS[pillar]).find((n) => n.slug === b.slug);
      if (node) {
        return {
          title: node.title,
          href: `/roadmap/${pillarToSlug(pillar)}/${b.slug}`,
          subtitle: PILLAR_LABELS[pillar],
        };
      }
    }
  }
  if (b.type === "project") {
    const proj = getProject(b.slug) ?? PROJECTS.find((p) => p.slug === b.slug);
    if (proj) {
      return {
        title: proj.title,
        href: `/projects/${b.slug}`,
        subtitle: "Project",
      };
    }
  }
  return null;
}

export default function SavedList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    get<Bookmark[]>("/bookmarks")
      .then(setBookmarks)
      .catch(() => {});
  }, []);

  if (bookmarks.length === 0) return null;

  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
        Saved for later
      </h2>
      <ul className="space-y-1.5">
        {bookmarks.map((b) => {
          const resolved = resolveBookmark(b);
          if (!resolved) return null;
          return (
            <li
              key={b.id}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-2.5 dark:border-zinc-800"
            >
              <span className="text-sm">🔖</span>
              <Link href={resolved.href} className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                  {resolved.title}
                </span>
                <span className="text-xs text-zinc-400">{resolved.subtitle}</span>
              </Link>
              <button
                onClick={async () => {
                  try {
                    await del(`/bookmarks/${b.id}`);
                    setBookmarks((prev) => prev.filter((x) => x.id !== b.id));
                  } catch {}
                }}
                className="px-1 text-zinc-300 hover:text-rose-500"
                aria-label={`Remove ${resolved.title}`}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
