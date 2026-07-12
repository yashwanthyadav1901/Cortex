"use client";

import { getTodayThought } from "@/content/thoughts";

export default function DeepThought() {
  const thought = getTodayThought();

  return (
    <section className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-5 py-5 dark:border-indigo-800 dark:from-indigo-950/40 dark:via-zinc-950 dark:to-purple-950/30">
      <p className="text-center text-base leading-relaxed font-medium text-zinc-800 dark:text-zinc-200 italic">
        &ldquo;{thought.text}&rdquo;
      </p>
      {thought.author && (
        <p className="mt-2 text-center text-xs font-medium text-indigo-500 dark:text-indigo-400">
          — {thought.author}
        </p>
      )}
    </section>
  );
}
