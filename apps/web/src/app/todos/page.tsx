"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { del, get, patch, post, put } from "@/lib/api";
import type { Todo, TodoLogs, TodoPriority, TodoStatus } from "@/types";

type Tab = "todos" | "logs";

/* ────────────────────── helpers ────────────────────── */

function isOverdue(todo: Todo) {
  return (
    todo.due_date &&
    todo.status === "pending" &&
    new Date(todo.due_date) < new Date(new Date().toDateString())
  );
}

function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

function monthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1);
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-400",
  low: "bg-zinc-300 dark:bg-zinc-600",
};

/* ────────────────────── TodosTab ────────────────────── */

function TodosTab() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<TodoStatus | "">("");
  const [filterPriority, setFilterPriority] = useState<TodoPriority | "">("");
  const [filterCategory, setFilterCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showDone, setShowDone] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TodoPriority>("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<TodoPriority>("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const load = useCallback(async () => {
    setTodos(await get<Todo[]>("/todos"));
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const allCategories = useMemo(
    () => [...new Set(todos.map((t) => t.category).filter(Boolean))] as string[],
    [todos]
  );

  const pendingTodos = useMemo(
    () =>
      todos
        .filter((t) => t.status === "pending")
        .filter(
          (t) =>
            (!filterPriority || t.priority === filterPriority) &&
            (!filterCategory || t.category === filterCategory) &&
            (!search || t.title.toLowerCase().includes(search.toLowerCase()))
        ),
    [todos, filterPriority, filterCategory, search]
  );

  const doneTodos = useMemo(
    () =>
      todos
        .filter((t) => t.status === "done")
        .filter(
          (t) =>
            (!filterPriority || t.priority === filterPriority) &&
            (!filterCategory || t.category === filterCategory) &&
            (!search || t.title.toLowerCase().includes(search.toLowerCase()))
        ),
    [todos, filterPriority, filterCategory, search]
  );

  const visible = useMemo(() => {
    if (filterStatus === "done") return doneTodos;
    if (filterStatus === "pending") return pendingTodos;
    return pendingTodos;
  }, [filterStatus, pendingTodos, doneTodos]);

  const showDoneSection = filterStatus !== "pending";

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await post<Todo>("/todos", {
        title: newTitle.trim(),
        priority: newPriority,
        due_date: newDueDate || null,
        category: newCategory.trim() || null,
      });
      setNewTitle("");
      setNewDueDate("");
      setNewCategory("");
      setNewPriority("medium");
      await load();
    } catch {}
  }

  async function toggleStatus(todo: Todo) {
    const status: TodoStatus = todo.status === "done" ? "pending" : "done";
    try {
      const updated = await patch<Todo>(`/todos/${todo.id}`, { status });
      setTodos((ts) => ts.map((t) => (t.id === todo.id ? updated : t)));
    } catch {}
  }

  async function removeTodo(id: string) {
    try {
      await del(`/todos/${id}`);
      setTodos((ts) => ts.filter((t) => t.id !== id));
    } catch {}
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? "");
    setEditPriority(todo.priority);
    setEditDueDate(todo.due_date ?? "");
    setEditCategory(todo.category ?? "");
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editTitle.trim()) return;
    try {
      const updated = await patch<Todo>(`/todos/${editingId}`, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        priority: editPriority,
        due_date: editDueDate || null,
        category: editCategory.trim() || null,
      });
      setTodos((ts) => ts.map((t) => (t.id === editingId ? updated : t)));
      setEditingId(null);
    } catch {}
  }

  function handleDragStart(index: number) {
    dragItem.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    dragOverItem.current = index;
  }

  async function handleDrop() {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const reordered = [...pendingTodos];
    const [dragged] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, dragged);

    const ids = reordered.map((t) => t.id);
    dragItem.current = null;
    dragOverItem.current = null;

    const newTodos = todos.map((t) => {
      const idx = ids.indexOf(t.id);
      return idx !== -1 ? { ...t, position: idx } : t;
    });
    newTodos.sort((a, b) => a.position - b.position);
    setTodos(newTodos);

    try {
      await put<Todo[]>("/todos/reorder", { ids });
    } catch {
      await load();
    }
  }

  function renderTodoItem(todo: Todo, index: number, draggable: boolean) {
    if (editingId === todo.id) {
      return (
        <li key={todo.id} className="py-3">
          <form onSubmit={saveEdit} className="space-y-2">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              autoFocus
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <div className="flex flex-wrap gap-2">
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as TodoPriority)}
                className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="Category"
                className="w-28 rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
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
        </li>
      );
    }

    return (
      <li
        key={todo.id}
        className={`flex items-center gap-3 py-3 ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
        draggable={draggable}
        onDragStart={draggable ? () => handleDragStart(index) : undefined}
        onDragOver={draggable ? (e) => handleDragOver(e, index) : undefined}
        onDrop={draggable ? handleDrop : undefined}
      >
        <button
          onClick={() => toggleStatus(todo)}
          aria-label={todo.status === "done" ? "Mark pending" : "Mark done"}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
            todo.status === "done"
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        >
          {todo.status === "done" && "✓"}
        </button>
        <div className="min-w-0 flex-1">
          <button
            onClick={() => startEdit(todo)}
            className={`block truncate text-left text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 ${
              todo.status === "done" ? "text-zinc-400 line-through" : ""
            } ${isOverdue(todo) ? "text-rose-600 dark:text-rose-400" : ""}`}
          >
            {todo.title}
          </button>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            {todo.category && (
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                {todo.category}
              </span>
            )}
            {todo.due_date && (
              <span className={isOverdue(todo) ? "font-medium text-rose-500" : ""}>
                {todo.due_date}
              </span>
            )}
            {todo.description && <span className="truncate">— {todo.description}</span>}
          </div>
        </div>
        <StatusPill value={todo.priority} />
        {draggable && (
          <span className="hidden text-zinc-300 sm:block dark:text-zinc-700">⠿</span>
        )}
        <button
          onClick={() => removeTodo(todo.id)}
          className="px-1 text-zinc-300 hover:text-rose-500"
          aria-label={`Delete ${todo.title}`}
        >
          ✕
        </button>
      </li>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TodoStatus | "")}
          className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">Active</option>
          <option value="pending">Pending only</option>
          <option value="done">Done only</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as TodoPriority | "")}
          className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">All priorities</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        {allCategories.length > 0 && (
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
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

      {filterStatus !== "done" && (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {visible.map((t, i) => renderTodoItem(t, i, true))}
          {visible.length === 0 && (
            <li className="py-8 text-center text-sm text-zinc-400">
              {todos.length === 0
                ? "No todos yet — add one below."
                : "Nothing matches your filters."}
            </li>
          )}
        </ul>
      )}

      {showDoneSection && doneTodos.length > 0 && filterStatus !== "done" && (
        <div>
          <button
            onClick={() => setShowDone(!showDone)}
            className="mb-2 text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {showDone ? "▾" : "▸"} Completed ({doneTodos.length})
          </button>
          {showDone && (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {doneTodos.map((t, i) => renderTodoItem(t, i, false))}
            </ul>
          )}
        </div>
      )}

      {filterStatus === "done" && (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {doneTodos.map((t, i) => renderTodoItem(t, i, false))}
          {doneTodos.length === 0 && (
            <li className="py-8 text-center text-sm text-zinc-400">
              No completed todos.
            </li>
          )}
        </ul>
      )}

      <form onSubmit={addTodo} className="flex flex-wrap gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New todo…"
          className="min-w-0 flex-1 basis-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:basis-auto dark:border-zinc-700 dark:bg-zinc-900"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as TodoPriority)}
          className="rounded-lg border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="rounded-lg border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category"
          className="w-28 rounded-lg border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Add
        </button>
      </form>
    </div>
  );
}

/* ────────────────────── LogsTab ────────────────────── */

function LogsTab() {
  const [data, setData] = useState<TodoLogs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get<TodoLogs>("/todos/logs")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="py-8 text-center text-sm text-zinc-400">Loading…</p>;
  if (!data) return <p className="py-8 text-center text-sm text-zinc-400">Could not load logs.</p>;

  const { todos, summary } = data;

  const grouped = new Map<string, Todo[]>();
  for (const t of todos) {
    const key = monthKey(t.completed_at ?? t.updated_at);
    const arr = grouped.get(key) ?? [];
    arr.push(t);
    grouped.set(key, arr);
  }
  const months = [...grouped.entries()].sort((a, b) => b[0].localeCompare(a[0]));

  const onTimeRate =
    summary.on_time_count + summary.overdue_count > 0
      ? Math.round(
          (summary.on_time_count / (summary.on_time_count + summary.overdue_count)) * 100
        )
      : 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Completed", value: summary.total_completed },
          { label: "Avg Time", value: formatDuration(summary.avg_completion_hours) },
          { label: "On-Time Rate", value: `${onTimeRate}%` },
          { label: "This Month", value: summary.this_month },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
          >
            <p className="text-xs text-zinc-400">{stat.label}</p>
            <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {todos.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-400">
          No completed tasks yet. Complete a todo to see it here.
        </p>
      ) : (
        <div className="space-y-6">
          {months.map(([key, items]) => (
            <section key={key}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {monthLabel(key)} · {items.length} task{items.length === 1 ? "" : "s"}
              </h3>
              <ul className="space-y-1.5">
                {items.map((todo) => {
                  const doneAt = todo.completed_at ?? todo.updated_at;
                  const hours =
                    (new Date(doneAt).getTime() - new Date(todo.created_at).getTime()) /
                    (1000 * 3600);
                  const wasOverdue =
                    todo.due_date && new Date(doneAt) > new Date(todo.due_date + "T23:59:59");
                  const tookLong = hours > 7 * 24;

                  return (
                    <li
                      key={todo.id}
                      className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-2.5 dark:border-zinc-800"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[todo.priority]}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {todo.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                          <span>
                            {new Date(doneAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          {todo.category && (
                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                              {todo.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-zinc-400">
                        {formatDuration(hours)}
                      </span>
                      {wasOverdue && (
                        <span className="shrink-0 rounded bg-rose-100 px-1.5 py-0.5 text-xs font-medium text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                          late
                        </span>
                      )}
                      {!wasOverdue && todo.due_date && (
                        <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                          on time
                        </span>
                      )}
                      {tookLong && !wasOverdue && (
                        <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                          slow
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────── Page ────────────────────── */

export default function TodosPage() {
  const [tab, setTab] = useState<Tab>("todos");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Todos</h1>

      <div className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-800">
        {(
          [
            ["todos", "Todos"],
            ["logs", "Logs"],
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

      {tab === "todos" ? <TodosTab /> : <LogsTab />}
    </div>
  );
}
