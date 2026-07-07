"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import TopicChat from "@/components/TopicChat";
import { findNode, PILLAR_SLUGS, projectsForNode } from "@/content";
import type { ResourceType } from "@/content/types";
import { del, get, post, put } from "@/lib/api";
import type { Bookmark, DsaProblem, TopicProgress, TopicStatus, UserResource } from "@/types";

const RESOURCE_ICONS: Record<ResourceType, string> = {
  video: "▶️",
  course: "🎓",
  article: "📄",
  book: "📚",
  docs: "📘",
  practice: "⌨️",
};

const STATUS_OPTIONS: { value: TopicStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

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

export default function TopicDetailPage() {
  const params = useParams<{ pillar: string; slug: string }>();
  const pillar = PILLAR_SLUGS[params.pillar];
  const found = pillar ? findNode(pillar, params.slug) : undefined;
  const [status, setStatus] = useState<TopicStatus>("not_started");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesError, setNotesError] = useState(false);

  const [dsaProblems, setDsaProblems] = useState<DsaProblem[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [userResources, setUserResources] = useState<UserResource[]>([]);
  const [newResTitle, setNewResTitle] = useState("");
  const [newResUrl, setNewResUrl] = useState("");
  const [newResNote, setNewResNote] = useState("");

  const loadResources = useCallback(async () => {
    try {
      setUserResources(
        await get<UserResource[]>(`/resources?topic_slug=${params.slug}`)
      );
    } catch {}
  }, [params.slug]);

  const tasks = found?.node.tasks ?? [];
  const { checks, toggle, done: tasksDone } = useTaskChecks(
    params.slug,
    tasks.length
  );

  useEffect(() => {
    get<Record<string, TopicProgress>>("/progress")
      .then((p) => {
        const entry = p[params.slug];
        if (entry) {
          setStatus(entry.status);
          setNotes(entry.notes ?? "");
        }
      })
      .catch(() => {});
    if (params.pillar === "dsa") {
      get<DsaProblem[]>(`/dsa-problems?topic_tag=${params.slug}`)
        .then(setDsaProblems)
        .catch(() => {});
    }
    loadResources();
    get<Bookmark[]>("/bookmarks")
      .then((bks) => {
        const found = bks.find((b) => b.slug === params.slug);
        if (found) { setBookmarked(true); setBookmarkId(found.id); }
      })
      .catch(() => {});
  }, [params.slug, params.pillar, loadResources]);

  if (!pillar || !found) {
    return (
      <p className="text-sm text-zinc-400">
        Topic not found.{" "}
        <Link href="/roadmap" className="text-indigo-500 underline">
          Back to roadmaps
        </Link>
      </p>
    );
  }

  const { node, stageTitle } = found;
  const projects = projectsForNode(node);

  async function updateStatus(next: TopicStatus) {
    if (!node) return;
    const prev = status;
    setSaving(true);
    setStatus(next);
    try {
      await put(`/progress/${node.slug}`, {
        pillar,
        name: node.title,
        status: next,
        notes: notes || null,
      });
    } catch {
      setStatus(prev);
    } finally {
      setSaving(false);
    }
  }

  async function saveNotes() {
    if (!node) return;
    try {
      await put(`/progress/${node.slug}`, {
        pillar,
        name: node.title,
        status,
        notes: notes || null,
      });
      setNotesError(false);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 1500);
    } catch {
      setNotesError(true);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/roadmap/${params.pillar}`} className="text-xs text-zinc-400">
          ← {stageTitle}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="text-2xl font-bold">{node.title}</h1>
          <button
            onClick={async () => {
              try {
                if (bookmarked && bookmarkId) {
                  await del(`/bookmarks/${bookmarkId}`);
                  setBookmarked(false);
                  setBookmarkId(null);
                } else {
                  const bk = await post<Bookmark>("/bookmarks", { slug: params.slug, type: "topic" });
                  setBookmarked(true);
                  setBookmarkId(bk.id);
                }
              } catch {}
            }}
            className={`text-lg transition ${bookmarked ? "text-indigo-500" : "text-zinc-300 hover:text-indigo-400"}`}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {bookmarked ? "🔖" : "🏷️"}
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-400">~{node.estHours}h of focused work</p>
      </div>

      <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            disabled={saving}
            onClick={() => updateStatus(opt.value)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              status === opt.value
                ? opt.value === "done"
                  ? "bg-emerald-500 text-white"
                  : opt.value === "in_progress"
                    ? "bg-blue-500 text-white"
                    : "bg-white shadow-sm dark:bg-zinc-800"
                : "text-zinc-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <section>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {node.summary}
        </p>
        <p className="mt-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200">
          <span className="font-semibold">Why it matters: </span>
          {node.why}
        </p>
      </section>

      {tasks.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              Learning tasks
            </h2>
            <span className="text-xs text-zinc-400">
              {tasksDone}/{tasks.length} done
            </span>
          </div>
          <ul className="space-y-1.5">
            {tasks.map((task, i) => (
              <li key={i}>
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition ${
                      checks[i]
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {checks[i] && "✓"}
                  </span>
                  <span
                    className={`text-sm leading-relaxed ${
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
        </section>
      )}

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            Notes
          </h2>
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
          className="w-full resize-y rounded-xl border border-zinc-200 bg-transparent px-4 py-3 text-sm leading-relaxed placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none dark:border-zinc-800"
          style={{ minHeight: "120px" }}
        />
      </section>

      <TopicChat pillar={pillar} node={node} trigger="floating" />

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Resources
        </h2>
        <ul className="space-y-2">
          {node.resources.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border border-zinc-200 px-4 py-3 transition hover:border-indigo-400 dark:border-zinc-800"
              >
                <span className="mt-0.5">{RESOURCE_ICONS[r.type]}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{r.title}</span>
                  <span className="block text-xs text-zinc-400">
                    {r.type}
                    {r.note ? ` — ${r.note}` : ""}
                  </span>
                </span>
                <span className="ml-auto text-zinc-300">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Your resources
        </h2>
        {userResources.length > 0 && (
          <ul className="mb-3 space-y-2">
            {userResources.map((r) => (
              <li key={r.id}>
                <div className="flex items-start gap-3 rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <span className="mt-0.5">🔗</span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1"
                  >
                    <span className="block text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                      {r.title}
                    </span>
                    {r.note && (
                      <span className="block text-xs text-zinc-400">{r.note}</span>
                    )}
                  </a>
                  <span className="text-zinc-300">↗</span>
                  <button
                    onClick={async () => {
                      try {
                        await del(`/resources/${r.id}`);
                        setUserResources((rs) => rs.filter((x) => x.id !== r.id));
                      } catch {}
                    }}
                    className="px-1 text-zinc-300 hover:text-rose-500"
                    aria-label={`Delete ${r.title}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newResTitle.trim() || !newResUrl.trim()) return;
            try {
              await post<UserResource>("/resources", {
                topic_slug: params.slug,
                title: newResTitle.trim(),
                url: newResUrl.trim(),
                note: newResNote.trim() || null,
              });
              setNewResTitle("");
              setNewResUrl("");
              setNewResNote("");
              await loadResources();
            } catch {}
          }}
          className="flex flex-wrap gap-2"
        >
          <input
            value={newResTitle}
            onChange={(e) => setNewResTitle(e.target.value)}
            placeholder="Title"
            className="min-w-0 flex-1 basis-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:basis-auto dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            value={newResUrl}
            onChange={(e) => setNewResUrl(e.target.value)}
            placeholder="https://…"
            type="url"
            className="min-w-0 flex-1 basis-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:basis-auto dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            value={newResNote}
            onChange={(e) => setNewResNote(e.target.value)}
            placeholder="Note (optional)"
            className="min-w-0 flex-1 basis-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:basis-auto dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Add
          </button>
        </form>
      </section>

      {dsaProblems.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              Practice problems
            </h2>
            <span className="text-xs text-zinc-400">
              {dsaProblems.filter((p) => p.status === "solved").length}/
              {dsaProblems.length} solved
            </span>
          </div>
          <ul className="space-y-1.5">
            {dsaProblems.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold text-white ${
                    p.status === "solved"
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {p.status === "solved" && "✓"}
                </span>
                <span className="min-w-0 flex-1">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block truncate text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 ${
                        p.status === "solved" ? "text-zinc-400 line-through" : ""
                      }`}
                    >
                      {p.title} ↗
                    </a>
                  ) : (
                    <span
                      className={`block truncate text-sm font-medium ${
                        p.status === "solved" ? "text-zinc-400 line-through" : ""
                      }`}
                    >
                      {p.title}
                    </span>
                  )}
                  {p.date_solved && (
                    <span className="text-xs text-zinc-400">
                      solved {p.date_solved}
                    </span>
                  )}
                </span>
                <StatusPill value={p.difficulty} />
              </li>
            ))}
          </ul>
          <Link
            href="/dsa"
            className="mt-2 block text-center text-xs text-indigo-500 hover:underline"
          >
            Manage in DSA Tracker →
          </Link>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            Projects that use this
          </h2>
          <ul className="space-y-2">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 transition hover:border-indigo-400 dark:border-zinc-800"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{p.title}</span>
                    <span className="block truncate text-xs text-zinc-400">
                      {p.tagline}
                    </span>
                  </span>
                  <StatusPill value={p.difficulty} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
