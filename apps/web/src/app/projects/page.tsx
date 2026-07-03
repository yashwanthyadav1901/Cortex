"use client";

import { useCallback, useEffect, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { del, get, patch, post } from "@/lib/api";
import type { Project, ProjectStatus } from "@/types";

const STATUSES: ProjectStatus[] = ["suggested", "in_progress", "done"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const load = useCallback(async () => {
    setProjects(await get<Project[]>("/projects"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await post<Project>("/projects", {
      title: title.trim(),
      description: description.trim() || null,
    });
    setTitle("");
    setDescription("");
    load();
  }

  async function setStatus(project: Project, status: ProjectStatus) {
    const updated = await patch<Project>(`/projects/${project.id}`, { status });
    setProjects((ps) => ps.map((p) => (p.id === project.id ? updated : p)));
  }

  async function remove(id: string) {
    await del(`/projects/${id}`);
    setProjects((ps) => ps.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Projects</h1>

      <ul className="space-y-3">
        {projects.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium">{p.title}</p>
                {p.description && (
                  <p className="mt-0.5 text-sm text-zinc-500">{p.description}</p>
                )}
              </div>
              <button
                onClick={() => remove(p.id)}
                className="text-zinc-300 hover:text-rose-500"
                aria-label={`Delete ${p.title}`}
              >
                ✕
              </button>
            </div>
            <div className="mt-3 flex gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(p, s)}
                  className={`rounded-full ${p.status === s ? "ring-2 ring-indigo-400" : "opacity-60"}`}
                >
                  <StatusPill value={s} />
                </button>
              ))}
            </div>
          </li>
        ))}
        {projects.length === 0 && (
          <li className="py-8 text-center text-sm text-zinc-400">
            No projects yet — generated plans will suggest some, or add one below.
          </li>
        )}
      </ul>

      <form onSubmit={addProject} className="space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title…"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <div className="flex gap-2">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description (optional)"
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button className="rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
