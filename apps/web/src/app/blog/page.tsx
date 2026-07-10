"use client";

import Link from "next/link";
import { BLOG_POSTS } from "@/content/blog";

export default function BlogIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Blog</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Deep dives on architecture, AI engineering, and production systems.
        </p>
      </div>

      <div className="space-y-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl border border-zinc-200 p-5 transition hover:border-indigo-400 dark:border-zinc-800 dark:hover:border-indigo-500"
          >
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {post.subtitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readingTimeMins} min read</span>
              <span>·</span>
              <div className="flex gap-1.5">
                {post.tags.map((tag) => (
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
    </div>
  );
}
