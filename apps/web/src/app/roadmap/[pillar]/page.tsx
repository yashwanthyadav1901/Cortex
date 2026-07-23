"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import RoadmapFlow from "@/components/roadmap/RoadmapFlow";
import { SkeletonList } from "@/components/ui/Skeleton";
import { allNodes, PILLAR_SLUGS, ROADMAPS } from "@/content";
import { useApiQuery } from "@/lib/useApi";
import type { DsaProblem, TopicProgress } from "@/types";

export default function RoadmapPillarPage() {
  const params = useParams<{ pillar: string }>();
  const pillar = PILLAR_SLUGS[params.pillar];
  const { data: progress = {}, isLoading } =
    useApiQuery<Record<string, TopicProgress>>("/progress");
  const { data: dsaProblems } = useApiQuery<DsaProblem[]>(
    params.pillar === "dsa" ? "/dsa-problems" : null
  );
  const loaded = !isLoading;
  const dsaSolvedCount = dsaProblems
    ? {
        solved: dsaProblems.filter((p) => p.status === "solved").length,
        total: dsaProblems.length,
      }
    : null;

  if (!pillar) {
    return (
      <p className="text-sm text-zinc-400">
        Unknown roadmap.{" "}
        <Link href="/roadmap" className="text-indigo-500 underline">
          Back to roadmaps
        </Link>
      </p>
    );
  }

  const roadmap = ROADMAPS[pillar];
  const nodes = allNodes(roadmap);
  const done = nodes.filter((n) => progress[n.slug]?.status === "done").length;
  const pct = Math.round((done / nodes.length) * 100);
  const totalHours = nodes.reduce((sum, n) => sum + n.estHours, 0);

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 -mx-4 border-b border-zinc-100 bg-white/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8 dark:border-zinc-900 dark:bg-zinc-950/95">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/roadmap" className="text-xs text-zinc-400">
              ← Roadmaps
            </Link>
            <h1 className="text-xl font-bold">{roadmap.title}</h1>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {done}/{nodes.length} topics
            </span>
            {dsaSolvedCount && dsaSolvedCount.total > 0 && (
              <span className="block text-xs text-zinc-400">
                {dsaSolvedCount.solved}/{dsaSolvedCount.total} problems solved
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-zinc-500">
        {roadmap.description}{" "}
        <span className="text-zinc-400">(~{totalHours}h total)</span>
      </p>

      {loaded ? (
        <RoadmapFlow roadmap={roadmap} progress={progress} />
      ) : (
        <SkeletonList rows={5} className="py-2" />
      )}
    </div>
  );
}
