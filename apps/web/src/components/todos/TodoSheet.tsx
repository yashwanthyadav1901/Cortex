"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { localDateStr } from "@/lib/dates";
import { PRIORITY_DOT, type TodoDraft } from "@/lib/todoUi";
import type { Todo, TodoPriority } from "@/types";

const PRIORITIES: TodoPriority[] = ["low", "medium", "high"];

const chip = (active: boolean) =>
  `pressable rounded-full border px-3 py-2 text-sm font-medium ${
    active
      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
      : "border-zinc-200 text-zinc-500 dark:border-zinc-700"
  }`;

/**
 * Mobile bottom sheet for adding / editing a todo. Rendered only while open
 * (parent mounts it conditionally, so it seeds fresh from `initial` each time).
 * Enter/exit slide is a CSS transition, so it's auto-neutralized under
 * prefers-reduced-motion by the global override in globals.css.
 */
export default function TodoSheet({
  mode,
  initial,
  onSubmit,
  onClose,
}: {
  mode: "add" | "edit";
  initial?: Todo | null;
  onSubmit: (draft: TodoDraft) => void | Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<TodoPriority>(
    initial?.priority ?? "medium"
  );
  const [dueDate, setDueDate] = useState(initial?.due_date ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");

  // Drive the slide-in: mount with the panel offscreen, then flip on next frame.
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function close() {
    setShow(false);
    setTimeout(onClose, 250);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      priority,
      due_date: dueDate || null,
      category: category.trim() || null,
    });
    close();
  }

  const dateChips: [string, string][] = [
    ["No date", ""],
    ["Today", localDateStr()],
    ["Tomorrow", localDateStr(1)],
  ];

  // Portal to <body> so the sheet escapes the page's transformed / view-transition
  // subtree (which otherwise traps its stacking order below the fixed bottom nav).
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      />
      <form
        onSubmit={submit}
        className={`absolute inset-x-0 bottom-0 space-y-3 rounded-t-2xl border-t border-zinc-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl transition-transform duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        <h2 className="text-base font-semibold">
          {mode === "add" ? "New todo" : "Edit todo"}
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          autoFocus
          className="w-full rounded-lg border border-zinc-300 px-3 py-3 text-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />

        <div>
          <p className="mb-1.5 text-xs font-medium text-zinc-400">Priority</p>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex items-center gap-1.5 ${chip(priority === p)}`}
              >
                <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[p]}`} />
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-zinc-400">Due</p>
          <div className="flex flex-wrap items-center gap-2">
            {dateChips.map(([label, value]) => (
              <button
                key={label}
                type="button"
                onClick={() => setDueDate(value)}
                className={chip(dueDate === value)}
              >
                {label}
              </button>
            ))}
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (optional)"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={!title.trim()}
            className="pressable flex-1 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
          >
            {mode === "add" ? "Add todo" : "Save"}
          </button>
          <button
            type="button"
            onClick={close}
            className="pressable rounded-lg px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
