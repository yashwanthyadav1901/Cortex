"use client";

import { useMemo, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { allNodes, ROADMAPS } from "@/content";
import { del, patch, post } from "@/lib/api";
import { invalidate, useApiQuery } from "@/lib/useApi";
import type { Difficulty, DsaProblem, ProblemStatus } from "@/types";

const DSA_TOPICS = allNodes(ROADMAPS.dsa).map((n) => ({
  slug: n.slug,
  title: n.title,
}));

export default function DsaPage() {
  const { data: problems = [], mutate } = useApiQuery<DsaProblem[]>(
    "/dsa-problems"
  );
  const [filterTag, setFilterTag] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "">("");
  const [filterStatus, setFilterStatus] = useState<ProblemStatus | "">("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState(DSA_TOPICS[0]?.slug ?? "");
  const [customTag, setCustomTag] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  // Fetch everything once (shared cache); filter client-side so the filter
  // dropdowns always offer the full set of options.
  const visible = useMemo(
    () =>
      problems.filter(
        (p) =>
          (!filterTag || p.topic_tag === filterTag) &&
          (!filterDifficulty || p.difficulty === filterDifficulty) &&
          (!filterStatus || p.status === filterStatus)
      ),
    [problems, filterTag, filterDifficulty, filterStatus]
  );

  const allTags = [...new Set(problems.map((p) => p.topic_tag))].sort();

  async function addProblem(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const resolvedTag = tag === "__other" ? customTag.trim() : tag;
    if (!resolvedTag) return;
    try {
      await post<DsaProblem>("/dsa-problems", {
        title: title.trim(),
        topic_tag: resolvedTag.toLowerCase().replace(/\s+/g, "_"),
        difficulty,
        url: url.trim() || null,
      });
      setTitle("");
      setUrl("");
      setCustomTag("");
      invalidate("/dsa-problems");
    } catch {}
  }

  async function toggleSolved(problem: DsaProblem) {
    const status: ProblemStatus = problem.status === "solved" ? "todo" : "solved";
    try {
      await mutate(
        async () => {
          const updated = await patch<DsaProblem>(
            `/dsa-problems/${problem.id}`,
            { status }
          );
          return problems.map((p) => (p.id === problem.id ? updated : p));
        },
        {
          optimisticData: problems.map((p) =>
            p.id === problem.id ? { ...p, status } : p
          ),
          rollbackOnError: true,
          revalidate: false,
        }
      );
      // Solving/unsolving logs a dsa activity → refresh the streak and the
      // activity-derived views, plus any topic-filtered problem lists.
      invalidate("/dsa-problems");
      invalidate("/streak");
      invalidate("/activity");
      invalidate("/analytics");
    } catch {}
  }

  async function remove(id: string) {
    try {
      await mutate(
        async () => {
          await del(`/dsa-problems/${id}`);
          return problems.filter((p) => p.id !== id);
        },
        {
          optimisticData: problems.filter((p) => p.id !== id),
          rollbackOnError: true,
          revalidate: false,
        }
      );
      invalidate("/dsa-problems");
    } catch {}
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">DSA Tracker</h1>

      <div className="flex flex-wrap gap-2">
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">All topics</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {DSA_TOPICS.find((d) => d.slug === t)?.title ?? t}
            </option>
          ))}
        </select>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | "")}
          className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">All difficulties</option>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ProblemStatus | "")}
          className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">All statuses</option>
          <option value="todo">todo</option>
          <option value="attempted">attempted</option>
          <option value="solved">solved</option>
        </select>
      </div>

      <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
        {visible.map((p) => (
          <li key={p.id} className="flex items-center gap-3 py-3">
            <button
              onClick={() => toggleSolved(p)}
              aria-label={p.status === "solved" ? "Mark unsolved" : "Mark solved"}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                p.status === "solved"
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {p.status === "solved" && "✓"}
            </button>
            <div className="min-w-0 flex-1">
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`truncate text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 ${
                    p.status === "solved" ? "text-zinc-400 line-through" : ""
                  }`}
                >
                  {p.title} ↗
                </a>
              ) : (
                <p
                  className={`truncate text-sm font-medium ${
                    p.status === "solved" ? "text-zinc-400 line-through" : ""
                  }`}
                >
                  {p.title}
                </p>
              )}
              <p className="text-xs text-zinc-400">
                {DSA_TOPICS.find((d) => d.slug === p.topic_tag)?.title ?? p.topic_tag}
                {p.date_solved && ` · solved ${p.date_solved}`}
              </p>
            </div>
            <StatusPill value={p.difficulty} />
            <button
              onClick={() => remove(p.id)}
              className="px-1 text-zinc-300 hover:text-rose-500"
              aria-label={`Delete ${p.title}`}
            >
              ✕
            </button>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="py-8 text-center text-sm text-zinc-400">
            Nothing here — adjust filters or add a problem below.
          </li>
        )}
      </ul>

      <form onSubmit={addProblem} className="flex flex-wrap gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Problem title…"
          className="min-w-0 flex-1 basis-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:basis-auto dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="leetcode.com/…"
          type="url"
          className="min-w-0 flex-1 basis-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:basis-auto dark:border-zinc-700 dark:bg-zinc-900"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-lg border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {DSA_TOPICS.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.title}
            </option>
          ))}
          <option value="__other">Other…</option>
        </select>
        {tag === "__other" && (
          <input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="custom tag"
            className="w-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        )}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="rounded-lg border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Add
        </button>
      </form>
    </div>
  );
}
