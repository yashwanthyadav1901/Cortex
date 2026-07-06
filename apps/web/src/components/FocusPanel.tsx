"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TopicChat from "@/components/TopicChat";
import { PILLAR_LABELS, pillarToSlug } from "@/content";
import type { RoadmapNode } from "@/content/types";
import { put } from "@/lib/api";
import type { Pillar, TopicProgress, TopicStatus } from "@/types";

function useTaskChecks(slug: string, count: number) {
  const key = `cortex:tasks:${slug}`;
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

function useTimer(slug: string) {
  const sessionKey = `cortex:focus:${slug}`;
  const totalKey = `cortex:focus-total:${slug}`;
  const [startedAt, setStartedAt] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem(sessionKey);
    return stored ? Number(stored) : null;
  });
  const [elapsed, setElapsed] = useState(0);
  const [stoppedTotal, setStoppedTotal] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem(totalKey) ?? "0");
  });

  useEffect(() => {
    if (!startedAt) return;
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  function start() {
    const now = Date.now();
    sessionStorage.setItem(sessionKey, String(now));
    setStartedAt(now);
  }

  function stop() {
    const total = stoppedTotal + elapsed;
    localStorage.setItem(totalKey, String(total));
    setStoppedTotal(total);
    sessionStorage.removeItem(sessionKey);
    setStartedAt(null);
    setElapsed(0);
  }

  function reset() {
    sessionStorage.removeItem(sessionKey);
    localStorage.removeItem(totalKey);
    setStartedAt(null);
    setElapsed(0);
    setStoppedTotal(0);
  }

  const totalSeconds = stoppedTotal + elapsed;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const display = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return { active: startedAt !== null, hasPrior: stoppedTotal > 0, start, stop, reset, display };
}

export default function FocusPanel({
  node,
  pillar,
  progress,
  onStatusChange,
}: {
  node: RoadmapNode;
  pillar: Pillar;
  progress: TopicProgress | undefined;
  onStatusChange: () => void;
}) {
  const tasks = node.tasks ?? [];
  const { checks, toggle, done: tasksDone } = useTaskChecks(
    node.slug,
    tasks.length
  );
  const timer = useTimer(node.slug);
  const [notes, setNotes] = useState(progress?.notes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesError, setNotesError] = useState(false);
  const [saving, setSaving] = useState(false);

  const status = progress?.status ?? "not_started";

  async function saveNotes() {
    try {
      await put(`/progress/${node.slug}`, {
        pillar,
        name: node.title,
        status: status === "not_started" ? "in_progress" : status,
        notes: notes || null,
      });
      setNotesError(false);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 1500);
    } catch {
      setNotesError(true);
    }
  }

  async function markDone() {
    setSaving(true);
    try {
      await put(`/progress/${node.slug}`, {
        pillar,
        name: node.title,
        status: "done" as TopicStatus,
        notes: notes || null,
      });
      timer.reset();
      onStatusChange();
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function startFocus() {
    timer.start();
    if (status === "not_started") {
      try {
        await put(`/progress/${node.slug}`, {
          pillar,
          name: node.title,
          status: "in_progress" as TopicStatus,
          notes: notes || null,
        });
        onStatusChange();
      } catch {}
    }
  }

  return (
    <div className="rounded-xl border-2 border-indigo-200 p-4 dark:border-indigo-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-zinc-400">
            {PILLAR_LABELS[pillar]} · ~{node.estHours}h
          </p>
          <Link
            href={`/roadmap/${pillarToSlug(pillar)}/${node.slug}`}
            className="text-lg font-bold hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {node.title}
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {(timer.active || timer.hasPrior) && (
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {timer.display}
            </span>
          )}
          {timer.active ? (
            <button
              onClick={timer.stop}
              className="rounded-full bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={startFocus}
              className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              {timer.hasPrior ? "Resume" : "Start focus"}
            </button>
          )}
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              {tasksDone}/{tasks.length} tasks
            </span>
          </div>
          <ul className="space-y-1">
            {tasks.map((task, i) => (
              <li key={i}>
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-start gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] transition ${
                      checks[i]
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {checks[i] && "✓"}
                  </span>
                  <span
                    className={`text-sm leading-snug ${
                      checks[i]
                        ? "text-zinc-400 line-through dark:text-zinc-500"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {task}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Notes</span>
          {notesSaved && (
            <span className="text-xs text-emerald-500">Saved</span>
          )}
          {notesError && (
            <span className="text-xs text-rose-500">Couldn&apos;t save</span>
          )}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder="Write what you learned…"
          rows={3}
          className="w-full resize-y rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm leading-relaxed placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none dark:border-zinc-800"
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={markDone}
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Mark done
        </button>
        <Link
          href={`/roadmap/${pillarToSlug(pillar)}/${node.slug}`}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:border-indigo-400 dark:border-zinc-700 dark:text-zinc-400"
        >
          Full topic →
        </Link>
      </div>

      <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <TopicChat pillar={pillar} node={node} trigger="inline" />
      </div>
    </div>
  );
}
