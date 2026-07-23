"use client";

import { useState } from "react";
import { patch, post } from "@/lib/api";
import { localDateStr } from "@/lib/dates";
import { invalidate, useApiQuery } from "@/lib/useApi";
import type { Todo } from "@/types";

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-400",
  low: "bg-zinc-300 dark:bg-zinc-600",
};

export default function TomorrowPlan() {
  const { data: all = [], mutate } = useApiQuery<Todo[]>(
    "/todos?status=pending"
  );
  const [input, setInput] = useState("");
  const tomorrow = localDateStr(1);

  const todos = all.filter((t) => t.due_date === tomorrow);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    await post("/todos", { title, due_date: tomorrow });
    setInput("");
    invalidate("/todos");
  }

  async function toggleDone(todo: Todo) {
    await mutate(
      async () => {
        await patch(`/todos/${todo.id}`, { status: "done" });
        return all.filter((t) => t.id !== todo.id);
      },
      {
        optimisticData: all.filter((t) => t.id !== todo.id),
        rollbackOnError: true,
        revalidate: false,
      }
    );
    invalidate("/todos");
  }

  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
        Tomorrow&apos;s plan
      </h2>

      {todos.length === 0 && !input ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-5 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">
            Plan your tomorrow — what do you need to get done?
          </p>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-2.5 dark:border-zinc-800"
            >
              <button
                onClick={() => toggleDone(todo)}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-300 transition hover:border-emerald-500 dark:border-zinc-600"
                aria-label={`Complete ${todo.title}`}
              />
              <span
                className={`mr-1 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[todo.priority]}`}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={addTodo} className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task for tomorrow…"
          className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-transparent px-4 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-800"
        />
        {input.trim() && (
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Add
          </button>
        )}
      </form>
    </section>
  );
}
