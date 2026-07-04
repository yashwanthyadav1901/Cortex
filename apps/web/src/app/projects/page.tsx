"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { PILLAR_LABELS, PROJECTS } from "@/content";
import { del, get, patch } from "@/lib/api";
import type { Pillar, Project, ProjectStatus } from "@/types";

const STATUSES: ProjectStatus[] = ["suggested", "in_progress", "done"];

export default function ProjectsPage() {
  const [tab, setTab] = useState<"catalog" | "mine">("catalog");
  const [pillarFilter, setPillarFilter] = useState<Pillar | "">("");
  const [mine, setMine] = useState<Project[]>([]);

  const loadMine = useCallback(async () => {
    setMine(await get<Project[]>("/projects"));
  }, []);

  useEffect(() => {
    loadMine();
  }, [loadMine]);

  const catalog = PROJECTS.filter(
    (p) => !pillarFilter || p.pillar === pillarFilter
  );
  const started = new Set(mine.map((m) => m.title));

  async function setStatus(project: Project, status: ProjectStatus) {
    const updated = await patch<Project>(`/projects/${project.id}`, { status });
    setMine((ps) => ps.map((p) => (p.id === project.id ? updated : p)));
  }

  async function remove(id: string) {
    await del(`/projects/${id}`);
    setMine((ps) => ps.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Projects</h1>

      <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
        {(["catalog", "mine"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium ${
              tab === t ? "bg-white shadow-sm dark:bg-zinc-800" : "text-zinc-500"
            }`}
          >
            {t === "catalog" ? "Catalog" : `Mine (${mine.length})`}
          </button>
        ))}
      </div>

      {tab === "catalog" && (
        <>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setPillarFilter("")}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                pillarFilter === ""
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              All
            </button>
            {(Object.keys(PILLAR_LABELS) as Pillar[]).map((p) => (
              <button
                key={p}
                onClick={() => setPillarFilter(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  pillarFilter === p
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {PILLAR_LABELS[p]}
              </button>
            ))}
          </div>

          <ul className="space-y-2">
            {catalog.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 transition hover:border-indigo-400 dark:border-zinc-800"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">
                        {p.title}
                      </span>
                      {started.has(p.title) && (
                        <span className="shrink-0 text-xs text-emerald-500">
                          ● started
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-xs text-zinc-400">
                      {p.tagline}
                    </span>
                    <span className="mt-1 block text-[11px] text-zinc-400">
                      {PILLAR_LABELS[p.pillar]} · ~{p.estHours}h
                    </span>
                  </span>
                  <StatusPill value={p.difficulty} />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "mine" && (
        <ul className="space-y-3">
          {mine.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{p.title}</p>
                  {p.description && (
                    <p className="mt-0.5 line-clamp-2 text-sm text-zinc-500">
                      {p.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => remove(p.id)}
                  className="text-zinc-300 hover:text-rose-500"
                  aria-label={`Delete ${p.title}`}
                >
                  ✕
                </button>
              </div>
              <div className="mt-3 flex gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(p, s)}
                    className={`rounded-full ${p.status === s ? "ring-2 ring-indigo-400" : "opacity-60"}`}
                  >
                    <StatusPill value={s} />
                  </button>
                ))}
              </div>
            </li>
          ))}
          {mine.length === 0 && (
            <li className="py-8 text-center text-sm text-zinc-400">
              Nothing started yet — pick one from the catalog.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
