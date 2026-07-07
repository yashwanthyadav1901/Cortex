"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { del, get, patch, post, put } from "@/lib/api";
import type { Todo, TodoPriority, TodoStatus } from "@/types";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<TodoStatus | "">("");
  const [filterPriority, setFilterPriority] = useState<TodoPriority | "">("");
  const [filterCategory, setFilterCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showDone, setShowDone] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add form state
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TodoPriority>("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<TodoPriority>("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Drag state
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

  function isOverdue(todo: Todo) {
    return (
      todo.due_date &&
      todo.status === "pending" &&
      new Date(todo.due_date) < new Date(new Date().toDateString())
    );
  }

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

    // Optimistic update
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
      <h1 className="text-2xl font-bold">Todos</h1>

      {/* Filters */}
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

      {/* Pending todos */}
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

      {/* Done section */}
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

      {/* Done-only view */}
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

      {/* Add form */}
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
