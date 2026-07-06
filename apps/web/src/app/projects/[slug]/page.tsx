"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { findNodeGlobal, getProject, PILLAR_LABELS, pillarToSlug } from "@/content";
import { get, post } from "@/lib/api";
import type { Project } from "@/types";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const project = getProject(params.slug);
  const [alreadyStarted, setAlreadyStarted] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    get<Project[]>("/projects")
      .then((mine) => {
        if (project && mine.some((m) => m.title === project.title)) {
          setAlreadyStarted(true);
        }
      })
      .catch(() => {});
  }, [project]);

  if (!project) {
    return (
      <p className="text-sm text-zinc-400">
        Project not found.{" "}
        <Link href="/projects" className="text-indigo-500 underline">
          Back to projects
        </Link>
      </p>
    );
  }

  const linkedTopics = project.topicSlugs
    .map((slug) => ({ slug, found: findNodeGlobal(slug) }))
    .filter((t) => t.found);

  async function startProject() {
    if (!project) return;
    setStarting(true);
    try {
      await post<Project>("/projects", {
        title: project.title,
        description: project.tagline,
        status: "in_progress",
      });
      router.push("/projects");
    } catch {
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/projects" className="text-xs text-zinc-400">
          ← Projects
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{project.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <StatusPill value={project.difficulty} />
          <span>{PILLAR_LABELS[project.pillar]}</span>
          <span>· ~{project.estHours}h</span>
        </div>
      </div>

      <button
        onClick={startProject}
        disabled={starting || alreadyStarted}
        className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {alreadyStarted
          ? "✓ Already in your projects"
          : starting
            ? "Starting…"
            : "Start this project"}
      </button>

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Overview
        </h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {project.overview}
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Build milestones
        </h2>
        <ol className="space-y-2">
          {project.buildSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {i + 1}
              </span>
              <span className="pt-0.5 text-zinc-700 dark:text-zinc-300">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Stretch goals
        </h2>
        <ul className="space-y-1.5">
          {project.stretchGoals.map((goal, i) => (
            <li key={i} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="text-indigo-400">◆</span>
              {goal}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Skills you&apos;ll practice
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {linkedTopics.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            Related roadmap topics
          </h2>
          <ul className="space-y-2">
            {linkedTopics.map(({ slug, found }) => (
              <li key={slug}>
                <Link
                  href={`/roadmap/${pillarToSlug(found!.pillar)}/${slug}`}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium transition hover:border-indigo-400 dark:border-zinc-800"
                >
                  {found!.node.title}
                  <span className="ml-auto text-xs text-zinc-400">
                    {PILLAR_LABELS[found!.pillar]} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
