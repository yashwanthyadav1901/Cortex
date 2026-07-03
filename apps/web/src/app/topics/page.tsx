"use client";

import { useCallback, useEffect, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { del, get, patch, post } from "@/lib/api";
import type { Difficulty, Pillar, Topic, TopicStatus } from "@/types";

const PILLARS: { value: Pillar; label: string }[] = [
  { value: "system_design", label: "System Design" },
  { value: "ai", label: "AI" },
  { value: "dsa", label: "DSA" },
];

const NEXT_STATUS: Record<TopicStatus, TopicStatus> = {
  not_started: "in_progress",
  in_progress: "done",
  done: "not_started",
};

export default function TopicsPage() {
  const [pillar, setPillar] = useState<Pillar>("system_design");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const load = useCallback(async () => {
    setTopics(await get<Topic[]>(`/topics?pillar=${pillar}`));
  }, [pillar]);

  useEffect(() => {
    load();
  }, [load]);

  async function addTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await post<Topic>("/topics", { pillar, name: name.trim(), difficulty });
    setName("");
    load();
  }

  async function cycleStatus(topic: Topic) {
    const updated = await patch<Topic>(`/topics/${topic.id}`, {
      status: NEXT_STATUS[topic.status],
    });
    setTopics((ts) => ts.map((t) => (t.id === topic.id ? updated : t)));
  }

  async function remove(id: string) {
    await del(`/topics/${id}`);
    setTopics((ts) => ts.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Topics</h1>

      <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
        {PILLARS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPillar(p.value)}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium ${
              pillar === p.value
                ? "bg-white shadow-sm dark:bg-zinc-800"
                : "text-zinc-500"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
        {topics.map((t) => (
          <li key={t.id} className="flex items-center gap-3 py-3">
            <button
              onClick={() => cycleStatus(t)}
              title="Tap to advance status"
              className="shrink-0"
            >
              <StatusPill value={t.status} />
            </button>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.name}</span>
            <StatusPill value={t.difficulty} />
            <button
              onClick={() => remove(t.id)}
              className="px-1 text-zinc-300 hover:text-rose-500"
              aria-label={`Delete ${t.name}`}
            >
              ✕
            </button>
          </li>
        ))}
        {topics.length === 0 && (
          <li className="py-8 text-center text-sm text-zinc-400">
            No topics yet — add your first below.
          </li>
        )}
      </ul>

      <form onSubmit={addTopic} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New topic…"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
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
        <button className="rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">
          Add
        </button>
      </form>
    </div>
  );
}
