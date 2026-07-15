"use client";

import { useCallback, useEffect, useState } from "react";
import { get, patch, post } from "@/lib/api";
import { formatDueLabel, localDateStr } from "@/lib/dates";
import type { Todo } from "@/types";

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-400",
  low: "bg-zinc-300 dark:bg-zinc-600",
};

export default function TodayTasks() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [justDoneId, setJustDoneId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const all = await get<Todo[]>("/todos?status=pending");
    setTodos(all.filter((t) => t.due_date && t.due_date <= localDateStr(0)));
  }, []);

  // Refetch on focus so a dashboard left open across midnight rolls over.
  useEffect(() => {
    load().catch(() => {});
    const onFocus = () => load().catch(() => {});
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const today = localDateStr(0);
  const overdue = todos.filter((t) => t.due_date && t.due_date < today);
  const dueToday = todos.filter((t) => t.due_date === today);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    await post("/todos", { title, due_date: today });
    setInput("");
    await load();
  }

  async function completeTodo(todo: Todo) {
    await patch(`/todos/${todo.id}`, { status: "done" });
    setJustDoneId(todo.id);
    // Let the checkmark animation play before the row leaves.
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
      setJustDoneId(null);
    }, 550);
  }

  function renderRow(todo: Todo, showDate: boolean) {
    const done = justDoneId === todo.id;
    return (
      <li
        key={todo.id}
        className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-2.5 dark:border-zinc-800"
      >
        <button
          onClick={() => completeTodo(todo)}
          disabled={done}
          aria-label={`Complete ${todo.title}`}
          className={`pressable flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
            done
              ? "animate-check-reward border-emerald-500 bg-emerald-500 text-white"
              : "border-zinc-300 hover:border-emerald-500 dark:border-zinc-600"
          }`}
        >
          {done && (
            <svg
              className="h-2.5 w-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                pathLength={24}
                className="animate-check-draw"
              />
            </svg>
          )}
        </button>
        <span
          className={`mr-1 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[todo.priority]}`}
        />
        <span
          className={`min-w-0 flex-1 truncate text-sm font-medium ${
            done
              ? "text-zinc-400 line-through"
              : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          {todo.title}
        </span>
        {showDate && todo.due_date && (
          <span className="shrink-0 text-xs font-medium text-rose-500">
            {formatDueLabel(todo.due_date)}
          </span>
        )}
      </li>
    );
  }

  return (
    <>
      {overdue.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-rose-500 uppercase">
            Overdue
          </h2>
          <ul className="space-y-1.5">
            {overdue.map((todo) => renderRow(todo, true))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Due today
        </h2>
        {dueToday.length === 0 && !input ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-5 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500">
              Nothing due today — add a task or enjoy the headroom.
            </p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {dueToday.map((todo) => renderRow(todo, false))}
          </ul>
        )}
        <form onSubmit={addTodo} className="mt-2 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task for today…"
            className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-transparent px-4 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-800"
          />
          {input.trim() && (
            <button
              type="submit"
              className="pressable shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Add
            </button>
          )}
        </form>
      </section>
    </>
  );
}
