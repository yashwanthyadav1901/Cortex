"use client";

import { useCallback, useEffect, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { del, get, patch, post } from "@/lib/api";
import type { Difficulty, DsaProblem, ProblemStatus } from "@/types";

export default function DsaPage() {
  const [problems, setProblems] = useState<DsaProblem[]>([]);
  const [filterTag, setFilterTag] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "">("");
  const [filterStatus, setFilterStatus] = useState<ProblemStatus | "">("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterTag) params.set("topic_tag", filterTag);
    if (filterDifficulty) params.set("difficulty", filterDifficulty);
    if (filterStatus) params.set("status", filterStatus);
    setProblems(await get<DsaProblem[]>(`/dsa-problems?${params}`));
  }, [filterTag, filterDifficulty, filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const allTags = [...new Set(problems.map((p) => p.topic_tag))].sort();

  async function addProblem(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !tag.trim()) return;
    await post<DsaProblem>("/dsa-problems", {
      title: title.trim(),
      topic_tag: tag.trim().toLowerCase().replace(/\s+/g, "_"),
      difficulty,
    });
    setTitle("");
    load();
  }

  async function toggleSolved(problem: DsaProblem) {
    const status: ProblemStatus = problem.status === "solved" ? "todo" : "solved";
    const updated = await patch<DsaProblem>(`/dsa-problems/${problem.id}`, { status });
    setProblems((ps) => ps.map((p) => (p.id === problem.id ? updated : p)));
  }

  async function remove(id: string) {
    await del(`/dsa-problems/${id}`);
    setProblems((ps) => ps.filter((p) => p.id !== id));
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
              {t}
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
        {problems.map((p) => (
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
              <p
                className={`truncate text-sm font-medium ${
                  p.status === "solved" ? "text-zinc-400 line-through" : ""
                }`}
              >
                {p.title}
              </p>
              <p className="text-xs text-zinc-400">
                {p.topic_tag}
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
        {problems.length === 0 && (
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
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="topic tag"
          className="w-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
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
