"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BLOG_POSTS } from "@/content/blog";
import { del, get, patch, post } from "@/lib/api";
import type { Microlearning } from "@/types";

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

type Tab = "learnings" | "blog";

function MicrolearningsTab() {
  const [items, setItems] = useState<Microlearning[]>([]);
  const [filterTag, setFilterTag] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTags, setNewTags] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editTags, setEditTags] = useState("");

  const load = useCallback(async () => {
    setItems(await get<Microlearning[]>("/microlearnings"));
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const allTags = useMemo(
    () => [...new Set(items.flatMap((i) => i.tags))].sort(),
    [items]
  );

  const visible = useMemo(
    () =>
      items.filter(
        (i) =>
          (!filterTag || i.tags.includes(filterTag)) &&
          (!search ||
            i.title.toLowerCase().includes(search.toLowerCase()) ||
            i.body.toLowerCase().includes(search.toLowerCase()))
      ),
    [items, filterTag, search]
  );

  function parseTags(input: string): string[] {
    return input
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    try {
      await post<Microlearning>("/microlearnings", {
        title: newTitle.trim(),
        body: newBody.trim(),
        tags: parseTags(newTags),
      });
      setNewTitle("");
      setNewBody("");
      setNewTags("");
      setShowAddForm(false);
      await load();
    } catch {}
  }

  function startEdit(item: Microlearning) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditBody(item.body);
    setEditTags(item.tags.join(", "));
    setExpandedId(null);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editTitle.trim() || !editBody.trim()) return;
    try {
      const updated = await patch<Microlearning>(
        `/microlearnings/${editingId}`,
        {
          title: editTitle.trim(),
          body: editBody.trim(),
          tags: parseTags(editTags),
        }
      );
      setItems((is) => is.map((i) => (i.id === editingId ? updated : i)));
      setEditingId(null);
    } catch {}
  }

  async function removeItem(id: string) {
    try {
      await del(`/microlearnings/${id}`);
      setItems((is) => is.filter((i) => i.id !== id));
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {showAddForm ? "Cancel" : "+ New"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={addItem}
          className="space-y-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            autoFocus
          />
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="What did you learn?"
            rows={4}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <div className="flex gap-2">
            <input
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              Add
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {allTags.length > 0 && (
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="space-y-3">
        {visible.map((item) => {
          if (editingId === item.id) {
            return (
              <div
                key={item.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <form onSubmit={saveEdit} className="space-y-2">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    autoFocus
                  />
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  <div className="flex flex-wrap gap-2">
                    <input
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="Tags (comma-separated)"
                      className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            );
          }

          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                  className="min-w-0 flex-1 text-left"
                >
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p
                    className={`mt-1 text-sm text-zinc-500 dark:text-zinc-400 ${
                      isExpanded ? "whitespace-pre-wrap" : "line-clamp-2"
                    }`}
                  >
                    {item.body}
                  </p>
                </button>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => startEdit(item)}
                    className="px-1 text-zinc-300 hover:text-indigo-500"
                    aria-label={`Edit ${item.title}`}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-1 text-zinc-300 hover:text-rose-500"
                    aria-label={`Delete ${item.title}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                {item.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className="rounded bg-zinc-100 px-1.5 py-0.5 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  >
                    {tag}
                  </button>
                ))}
                <span className="ml-auto">{timeAgo(item.created_at)}</span>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-400">
            {items.length === 0
              ? "No learnings yet — capture your first one above."
              : "Nothing matches your filters."}
          </p>
        )}
      </div>
    </div>
  );
}

function BlogTab() {
  return (
    <div className="space-y-3">
      {BLOG_POSTS.map((p) => (
        <Link
          key={p.slug}
          href={`/blog/${p.slug}`}
          className="block rounded-xl border border-zinc-200 p-5 transition hover:border-indigo-400 dark:border-zinc-800 dark:hover:border-indigo-500"
        >
          <h2 className="text-lg font-semibold">{p.title}</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {p.subtitle}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            <span>{p.date}</span>
            <span>·</span>
            <span>{p.readingTimeMins} min read</span>
            <span>·</span>
            <div className="flex gap-1.5">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function LearningsPage() {
  const [tab, setTab] = useState<Tab>("learnings");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Learnings</h1>

      <div className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-800">
        {(
          [
            ["learnings", "Microlearnings"],
            ["blog", "Blog"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              tab === key
                ? "bg-indigo-600 text-white"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "learnings" ? <MicrolearningsTab /> : <BlogTab />}
    </div>
  );
}
