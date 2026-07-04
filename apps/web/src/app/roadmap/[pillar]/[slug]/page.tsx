"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { findNode, PILLAR_SLUGS, projectsForNode } from "@/content";
import type { ResourceType } from "@/content/types";
import { get, put } from "@/lib/api";
import type { TopicStatus } from "@/types";

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

export default function TopicDetailPage() {
  const params = useParams<{ pillar: string; slug: string }>();
  const pillar = PILLAR_SLUGS[params.pillar];
  const found = pillar ? findNode(pillar, params.slug) : undefined;
  const [status, setStatus] = useState<TopicStatus>("not_started");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    get<Record<string, TopicStatus>>("/progress").then((p) => {
      if (p[params.slug]) setStatus(p[params.slug]);
    });
  }, [params.slug]);

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
    setSaving(true);
    setStatus(next); // optimistic
    try {
      await put(`/progress/${node.slug}`, {
        pillar,
        name: node.title,
        status: next,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/roadmap/${params.pillar}`} className="text-xs text-zinc-400">
          ← {stageTitle}
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{node.title}</h1>
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
