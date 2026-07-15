"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import CountUp from "@/components/ui/CountUp";
import { Skeleton, SkeletonList } from "@/components/ui/Skeleton";
import { del, get, patch, post, put } from "@/lib/api";
import { formatDueLabel, formatLocalDate, localDateStr } from "@/lib/dates";
import type { Todo, TodoLogs, TodoPriority, TodoStatus } from "@/types";

type Tab = "todos" | "logs";
type StatusFilter = "active" | "done" | "all";

/* ────────────────────── helpers ────────────────────── */

function isOverdue(todo: Todo) {
  // due_date is a plain YYYY-MM-DD string; compare against the local
  // date string to stay timezone-consistent (Date-parsing it would be UTC).
  return (
    todo.due_date && todo.status === "pending" && todo.due_date < localDateStr()
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

const PRIORITY_CYCLE: TodoPriority[] = ["medium", "high", "low"];

/* ────────────────────── TodosTab ────────────────────── */

interface PendingDelete {
  todo: Todo;
}

function TodosTab() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("active");
  const [filterPriority, setFilterPriority] = useState<TodoPriority | "">("");
  const [filterCategory, setFilterCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showDone, setShowDone] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Only the todo the user just checked gets the reward animation.
  const [justToggledId, setJustToggledId] = useState<string | null>(null);
  // Rows currently playing their exit (fade/collapse) animation.
  const [leavingIds, setLeavingIds] = useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDeleteRef = useRef<PendingDelete | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TodoPriority>("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showCustomDate, setShowCustomDate] = useState(false);

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
    load()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [load]);

  // If the user leaves the page during the undo window, commit the delete.
  useEffect(() => {
    return () => {
      if (pendingDeleteRef.current) {
        del(`/todos/${pendingDeleteRef.current.todo.id}`).catch(() => {});
      }
      if (deleteTimer.current) clearTimeout(deleteTimer.current);
    };
  }, []);

  const allCategories = useMemo(
    () => [...new Set(todos.map((t) => t.category).filter(Boolean))] as string[],
    [todos]
  );

  const matchesFilters = useCallback(
    (t: Todo) =>
      (!filterPriority || t.priority === filterPriority) &&
      (!filterCategory || t.category === filterCategory) &&
      (!search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (t.category ?? "").toLowerCase().includes(search.toLowerCase())),
    [filterPriority, filterCategory, search]
  );

  const pendingTodos = useMemo(
    () => todos.filter((t) => t.status === "pending").filter(matchesFilters),
    [todos, matchesFilters]
  );

  const doneTodos = useMemo(
    () => todos.filter((t) => t.status === "done").filter(matchesFilters),
    [todos, matchesFilters]
  );

  // Urgency groups for the pending list.
  const groups = useMemo(() => {
    const today = localDateStr();
    const overdue: Todo[] = [];
    const dueToday: Todo[] = [];
    const upcoming: Todo[] = [];
    const noDate: Todo[] = [];
    for (const t of pendingTodos) {
      if (!t.due_date) noDate.push(t);
      else if (t.due_date < today) overdue.push(t);
      else if (t.due_date === today) dueToday.push(t);
      else upcoming.push(t);
    }
    overdue.sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1));
    upcoming.sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1));
    return { overdue, dueToday, upcoming, noDate };
  }, [pendingTodos]);

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
      setShowCustomDate(false);
      await load();
    } catch {}
  }

  async function toggleStatus(todo: Todo) {
    const status: TodoStatus = todo.status === "done" ? "pending" : "done";
    try {
      const updated = await patch<Todo>(`/todos/${todo.id}`, { status });
      if (status === "done") {
        // Let the checkmark play, then fade the row out of the pending list.
        setJustToggledId(todo.id);
        setTimeout(() => {
          setLeavingIds((prev) => new Set(prev).add(todo.id));
        }, 350);
        setTimeout(() => {
          setTodos((ts) => ts.map((t) => (t.id === todo.id ? updated : t)));
          setLeavingIds((prev) => {
            const next = new Set(prev);
            next.delete(todo.id);
            return next;
          });
          setJustToggledId(null);
        }, 650);
      } else {
        setTodos((ts) => ts.map((t) => (t.id === todo.id ? updated : t)));
      }
    } catch {}
  }

  function commitPendingDelete() {
    if (deleteTimer.current) clearTimeout(deleteTimer.current);
    const pd = pendingDeleteRef.current;
    if (pd) {
      del(`/todos/${pd.todo.id}`).catch(() => load().catch(() => {}));
    }
    pendingDeleteRef.current = null;
    setPendingDelete(null);
  }

  function removeTodo(todo: Todo) {
    // Only one undo window at a time — flush any earlier pending delete.
    commitPendingDelete();
    setLeavingIds((prev) => new Set(prev).add(todo.id));
    setTimeout(() => {
      setTodos((ts) => ts.filter((t) => t.id !== todo.id));
      setLeavingIds((prev) => {
        const next = new Set(prev);
        next.delete(todo.id);
        return next;
      });
      const pd = { todo };
      pendingDeleteRef.current = pd;
      setPendingDelete(pd);
      deleteTimer.current = setTimeout(commitPendingDelete, 5000);
    }, 250);
  }

  function undoDelete() {
    if (deleteTimer.current) clearTimeout(deleteTimer.current);
    const pd = pendingDeleteRef.current;
    if (pd) {
      setTodos((ts) =>
        [...ts, pd.todo].sort((a, b) => a.position - b.position)
      );
    }
    pendingDeleteRef.current = null;
    setPendingDelete(null);
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

  /* ── reorder (No date group only) ── */

  async function persistOrder(orderedIds: string[]) {
    const newTodos = todos.map((t) => {
      const idx = orderedIds.indexOf(t.id);
      return idx !== -1 ? { ...t, position: idx } : t;
    });
    newTodos.sort((a, b) => a.position - b.position);
    setTodos(newTodos);
    try {
      await put<Todo[]>("/todos/reorder", { ids: orderedIds });
    } catch {
      await load();
    }
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
    const reordered = [...groups.noDate];
    const [dragged] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, dragged);
    dragItem.current = null;
    dragOverItem.current = null;
    await persistOrder(reordered.map((t) => t.id));
  }

  async function moveBy(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= groups.noDate.length) return;
    const reordered = [...groups.noDate];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    await persistOrder(reordered.map((t) => t.id));
  }

  /* ── rendering ── */

  function renderTodoItem(todo: Todo, index: number, draggable: boolean) {
    if (editingId === todo.id) {
      return (
        <li key={todo.id} className="py-3">
          <form
            onSubmit={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditingId(null);
            }}
            className="space-y-2"
          >
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
                className="pressable rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
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

    const checked = todo.status === "done" || justToggledId === todo.id;
    const leaving = leavingIds.has(todo.id);

    return (
      <li
        key={todo.id}
        className={`flex items-center gap-3 py-3 ${
          draggable ? "cursor-grab active:cursor-grabbing" : ""
        } ${leaving ? "animate-row-out" : ""}`}
        draggable={draggable}
        onDragStart={draggable ? () => handleDragStart(index) : undefined}
        onDragOver={draggable ? (e) => handleDragOver(e, index) : undefined}
        onDrop={draggable ? handleDrop : undefined}
      >
        <button
          onClick={() => toggleStatus(todo)}
          aria-label={checked ? "Mark pending" : "Mark done"}
          className={`pressable flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
            checked
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-zinc-300 hover:border-emerald-400 dark:border-zinc-700"
          } ${checked && justToggledId === todo.id ? "animate-check-reward" : ""}`}
        >
          {checked && (
            <svg
              className="h-3.5 w-3.5"
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
                className={
                  justToggledId === todo.id ? "animate-check-draw" : undefined
                }
              />
            </svg>
          )}
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
                {formatDueLabel(todo.due_date)}
              </span>
            )}
            {todo.description && <span className="truncate">— {todo.description}</span>}
          </div>
        </div>
        <StatusPill value={todo.priority} />
        {draggable && (
          <>
            <span className="hidden text-zinc-300 sm:block dark:text-zinc-700">⠿</span>
            <span className="flex flex-col sm:hidden">
              <button
                onClick={() => moveBy(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${todo.title} up`}
                className="px-1 text-xs leading-none text-zinc-300 disabled:opacity-30 dark:text-zinc-600"
              >
                ▲
              </button>
              <button
                onClick={() => moveBy(index, 1)}
                disabled={index === groups.noDate.length - 1}
                aria-label={`Move ${todo.title} down`}
                className="px-1 text-xs leading-none text-zinc-300 disabled:opacity-30 dark:text-zinc-600"
              >
                ▼
              </button>
            </span>
          </>
        )}
        <button
          onClick={() => removeTodo(todo)}
          className="px-1 text-zinc-300 hover:text-rose-500"
          aria-label={`Delete ${todo.title}`}
        >
          ✕
        </button>
      </li>
    );
  }

  function renderGroup(title: string, items: Todo[], draggable: boolean, accent?: string) {
    if (items.length === 0) return null;
    return (
      <section>
        <h3
          className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
            accent ?? "text-zinc-400"
          }`}
        >
          {title} · {items.length}
        </h3>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {items.map((t, i) => renderTodoItem(t, i, draggable))}
        </ul>
      </section>
    );
  }

  if (loading) return <SkeletonList rows={6} className="py-2" />;

  const noPendingVisible =
    groups.overdue.length +
      groups.dueToday.length +
      groups.upcoming.length +
      groups.noDate.length ===
    0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-800">
          {(
            [
              ["active", "Active"],
              ["done", "Done"],
              ["all", "All"],
            ] as [StatusFilter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`pressable rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                filterStatus === key
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
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
        <div className="stagger-children space-y-4">
          {renderGroup("Overdue", groups.overdue, false, "text-rose-500")}
          {renderGroup("Today", groups.dueToday, false)}
          {renderGroup("Upcoming", groups.upcoming, false)}
          {renderGroup(
            groups.overdue.length + groups.dueToday.length + groups.upcoming.length > 0
              ? "No date"
              : "Tasks",
            groups.noDate,
            true
          )}
          {noPendingVisible && (
            <p className="py-8 text-center text-sm text-zinc-400">
              {todos.length === 0
                ? "No todos yet — add one below."
                : "Nothing matches your filters."}
            </p>
          )}
        </div>
      )}

      {filterStatus !== "done" && doneTodos.length > 0 && (
        <div>
          <button
            onClick={() => setShowDone(!showDone)}
            className="mb-2 text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {showDone || filterStatus === "all" ? "▾" : "▸"} Completed (
            {doneTodos.length})
          </button>
          {(showDone || filterStatus === "all") && (
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

      {/* Quick add: single input; detail chips appear once there's text. */}
      <form onSubmit={addTodo} className="space-y-2">
        <div className="flex gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New todo…"
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
          {newTitle.trim() && (
            <button className="pressable shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              Add
            </button>
          )}
        </div>
        {newTitle.trim() && (
          <div className="animate-fade-in flex flex-wrap items-center gap-1.5">
            {(
              [
                ["Today", localDateStr()],
                ["Tomorrow", localDateStr(1)],
              ] as const
            ).map(([label, value]) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setNewDueDate(newDueDate === value ? "" : value);
                  setShowCustomDate(false);
                }}
                className={`pressable rounded-full border px-2.5 py-1 text-xs font-medium ${
                  newDueDate === value
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "border-zinc-200 text-zinc-500 hover:border-indigo-400 dark:border-zinc-700"
                }`}
              >
                {label}
              </button>
            ))}
            {showCustomDate ? (
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                autoFocus
                className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomDate(true)}
                className="pressable rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:border-indigo-400 dark:border-zinc-700"
              >
                📅 Pick date
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                setNewPriority(
                  PRIORITY_CYCLE[
                    (PRIORITY_CYCLE.indexOf(newPriority) + 1) % PRIORITY_CYCLE.length
                  ]
                )
              }
              className="pressable flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:border-indigo-400 dark:border-zinc-700"
            >
              <span
                className={`h-2 w-2 rounded-full ${PRIORITY_DOT[newPriority]}`}
              />
              {newPriority}
            </button>
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category"
              className="w-24 rounded-full border border-zinc-200 px-2.5 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        )}
      </form>

      {/* Undo-delete toast */}
      {pendingDelete && (
        <div className="animate-toast-in fixed inset-x-4 bottom-20 z-30 mx-auto flex max-w-sm items-center gap-3 rounded-xl bg-zinc-900 px-4 py-3 text-sm text-white shadow-lg md:bottom-6 dark:bg-zinc-100 dark:text-zinc-900">
          <span className="min-w-0 flex-1 truncate">
            Deleted &ldquo;{pendingDelete.todo.title}&rdquo;
          </span>
          <button
            onClick={undoDelete}
            className="pressable shrink-0 font-semibold text-indigo-400 dark:text-indigo-600"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

/* ────────────────────── LogsTab ────────────────────── */

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function LogsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
          >
            <Skeleton className="mb-2 h-3 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ))}
      </div>
      <SkeletonList rows={4} />
    </div>
  );
}

function LogsTab() {
  const [data, setData] = useState<TodoLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [expandedMonths, setExpandedMonths] = useState<Set<string> | null>(null);

  useEffect(() => {
    get<TodoLogs>("/todos/logs")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LogsSkeleton />;
  if (!data) return <p className="py-8 text-center text-sm text-zinc-400">Could not load logs.</p>;

  const { todos, summary } = data;

  const categories = [...new Set(todos.map((t) => t.category).filter(Boolean))] as string[];
  const visibleTodos = category ? todos.filter((t) => t.category === category) : todos;

  const grouped = new Map<string, Todo[]>();
  for (const t of visibleTodos) {
    const key = monthKey(t.completed_at ?? t.updated_at);
    const arr = grouped.get(key) ?? [];
    arr.push(t);
    grouped.set(key, arr);
  }
  const months = [...grouped.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  // Newest month expanded by default; older ones collapsed.
  const expanded = expandedMonths ?? new Set(months.slice(0, 1).map(([k]) => k));

  function toggleMonth(key: string) {
    const next = new Set(expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedMonths(next);
  }

  const onTimeRate =
    summary.on_time_count + summary.overdue_count > 0
      ? Math.round(
          (summary.on_time_count / (summary.on_time_count + summary.overdue_count)) * 100
        )
      : 100;

  const allHours = todos.map((t) => {
    const doneAt = t.completed_at ?? t.updated_at;
    return (
      (new Date(doneAt).getTime() - new Date(t.created_at).getTime()) / (1000 * 3600)
    );
  });
  const typicalHours = median(allHours);

  return (
    <div className="stagger-children space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total Completed",
            value: <CountUp value={summary.total_completed} />,
            sub: null,
          },
          {
            label: "Typical Time",
            value: formatDuration(typicalHours),
            sub: `avg ${formatDuration(summary.avg_completion_hours)}`,
          },
          { label: "On-Time Rate", value: `${onTimeRate}%`, sub: null },
          {
            label: "This Month",
            value: <CountUp value={summary.this_month} />,
            sub: null,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
          >
            <p className="text-xs text-zinc-400">{stat.label}</p>
            <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              {stat.value}
            </p>
            {stat.sub && <p className="text-xs text-zinc-400">{stat.sub}</p>}
          </div>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory("")}
            className={`pressable rounded-full border px-2.5 py-1 text-xs font-medium ${
              !category
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "border-zinc-200 text-zinc-500 hover:border-indigo-400 dark:border-zinc-700"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? "" : c)}
              className={`pressable rounded-full border px-2.5 py-1 text-xs font-medium ${
                category === c
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border-zinc-200 text-zinc-500 hover:border-indigo-400 dark:border-zinc-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {visibleTodos.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-400">
          No completed tasks yet. Complete a todo to see it here.
        </p>
      ) : (
        <div className="space-y-4">
          {months.map(([key, items]) => (
            <section key={key}>
              <button
                onClick={() => toggleMonth(key)}
                className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {expanded.has(key) ? "▾" : "▸"} {monthLabel(key)} · {items.length} task
                {items.length === 1 ? "" : "s"}
              </button>
              {expanded.has(key) && (
                <ul className="space-y-1.5">
                  {items.map((todo) => {
                    const doneAt = todo.completed_at ?? todo.updated_at;
                    const hours =
                      (new Date(doneAt).getTime() - new Date(todo.created_at).getTime()) /
                      (1000 * 3600);
                    // Compare local calendar days as strings — doneAt is a UTC
                    // timestamp, due_date a plain YYYY-MM-DD.
                    const wasOverdue =
                      todo.due_date && formatLocalDate(new Date(doneAt)) > todo.due_date;
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
              )}
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
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    get<Todo[]>("/todos?status=pending")
      .then((ts) =>
        setOverdueCount(
          ts.filter((t) => t.due_date && t.due_date < localDateStr()).length
        )
      )
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Todos</h1>
        {overdueCount > 0 && (
          <span className="animate-scale-in rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            {overdueCount} overdue
          </span>
        )}
      </div>

      <div className="relative flex rounded-lg border border-zinc-200 p-1 dark:border-zinc-800">
        {/* Sliding pill behind the active tab */}
        <span
          className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-md bg-indigo-600 transition-transform ease-out"
          style={{
            transform: tab === "logs" ? "translateX(100%)" : "translateX(0)",
            transitionDuration: "var(--dur-base)",
          }}
        />
        {(
          [
            ["todos", "Todos"],
            ["logs", "Logs"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative z-10 flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === key
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div key={tab} className="animate-fade-in">
        {tab === "todos" ? <TodosTab /> : <LogsTab />}
      </div>
    </div>
  );
}
