"use client";

import Link from "next/link";
import { pillarToSlug } from "@/content";
import type { Roadmap, RoadmapNode } from "@/content/types";
import type { TopicStatus } from "@/types";

export type ProgressMap = Record<string, TopicStatus>;

/** Group a stage's nodes: consecutive nodes sharing a `row` render side-by-side. */
function groupRows(nodes: RoadmapNode[]): RoadmapNode[][] {
  const rows: RoadmapNode[][] = [];
  let i = 0;
  while (i < nodes.length) {
    const node = nodes[i];
    const group = [node];
    while (
      node.row != null &&
      i + 1 < nodes.length &&
      nodes[i + 1].row === node.row
    ) {
      group.push(nodes[++i]);
    }
    rows.push(group);
    i++;
  }
  return rows;
}

const STATUS_STYLES: Record<TopicStatus, { card: string; dot: string }> = {
  not_started: {
    card: "border-zinc-200 dark:border-zinc-800",
    dot: "bg-zinc-300 dark:bg-zinc-600",
  },
  in_progress: {
    card: "border-blue-400 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/30",
    dot: "bg-blue-500",
  },
  done: {
    card: "border-emerald-400 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/30",
    dot: "bg-emerald-500",
  },
};

function Connector() {
  return (
    <div className="flex justify-center">
      <div className="h-5 w-0.5 bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function NodeCard({
  node,
  pillarSlug,
  status,
}: {
  node: RoadmapNode;
  pillarSlug: string;
  status: TopicStatus;
}) {
  const style = STATUS_STYLES[status];
  return (
    <Link
      href={`/roadmap/${pillarSlug}/${node.slug}`}
      className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl border-2 px-4 py-3 transition hover:border-indigo-400 active:scale-[0.99] ${style.card}`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${style.dot}`}
      >
        {status === "done" && "✓"}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{node.title}</span>
        <span className="block text-xs text-zinc-400">
          ~{node.estHours}h · {node.resources.length} resources
          {node.projectSlugs?.length
            ? ` · ${node.projectSlugs.length} project${node.projectSlugs.length > 1 ? "s" : ""}`
            : ""}
        </span>
      </span>
    </Link>
  );
}

export default function RoadmapFlow({
  roadmap,
  progress,
}: {
  roadmap: Roadmap;
  progress: ProgressMap;
}) {
  const pillarSlug = pillarToSlug(roadmap.pillar);
  return (
    <div>
      {roadmap.stages.map((stage, si) => (
        <div key={stage.title}>
          {si > 0 && <Connector />}
          <div className="flex justify-center">
            <span className="rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold tracking-wide text-white uppercase">
              {stage.title}
            </span>
          </div>
          {groupRows(stage.nodes).map((row, ri) => (
            <div key={ri}>
              <Connector />
              <div className={row.length > 1 ? "flex gap-2" : "flex"}>
                {row.map((node) => (
                  <NodeCard
                    key={node.slug}
                    node={node}
                    pillarSlug={pillarSlug}
                    status={progress[node.slug] ?? "not_started"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
