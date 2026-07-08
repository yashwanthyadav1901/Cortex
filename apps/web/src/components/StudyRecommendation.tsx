"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { allNodes, PILLAR_LABELS, pillarToSlug, ROADMAPS } from "@/content";
import { get, post } from "@/lib/api";
import type { Pillar, Recommendation, TopicProgress } from "@/types";

const CACHE_KEY = "cortex:recommendation";

export default function StudyRecommendation() {
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRec = useCallback(async (force = false) => {
    if (!force) {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          setRec(JSON.parse(cached));
          setLoading(false);
          return;
        }
      } catch {}
    }

    setLoading(true);
    try {
      const progress = await get<Record<string, TopicProgress>>("/progress");

      const topics: { slug: string; title: string; pillar: string }[] = [];
      const progressMap: Record<string, string> = {};
      for (const pillar of Object.keys(ROADMAPS) as Pillar[]) {
        for (const node of allNodes(ROADMAPS[pillar])) {
          topics.push({ slug: node.slug, title: node.title, pillar: PILLAR_LABELS[pillar] });
          progressMap[node.slug] = progress[node.slug]?.status ?? "not_started";
        }
      }

      const result = await post<Recommendation>("/chat/recommend", {
        progress: progressMap,
        topics,
      });
      setRec(result);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));
    } catch {
      setRec(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRec();
  }, [fetchRec]);

  if (loading) {
    return (
      <section className="animate-pulse rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-3 w-48 rounded bg-zinc-100 dark:bg-zinc-900" />
      </section>
    );
  }

  if (!rec) return null;

  const pillarSlug = Object.entries(PILLAR_LABELS).find(
    ([, label]) => label === rec.pillar
  )?.[0] as Pillar | undefined;

  const href = pillarSlug
    ? `/roadmap/${pillarToSlug(pillarSlug)}/${rec.slug}`
    : `/roadmap`;

  return (
    <section className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              Recommended
            </span>
          </div>
          <Link href={href} className="mt-1 block text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400">
            {rec.title}
          </Link>
          <p className="mt-0.5 text-xs text-zinc-400">{rec.reason}</p>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem(CACHE_KEY);
            fetchRec(true);
          }}
          className="shrink-0 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-900"
          aria-label="Refresh recommendation"
        >
          ↻
        </button>
      </div>
    </section>
  );
}
