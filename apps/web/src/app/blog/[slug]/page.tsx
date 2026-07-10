"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DecisionMatrixTable from "@/components/blog/DecisionMatrixTable";
import DeploymentChecklist from "@/components/blog/DeploymentChecklist";
import { getBlogPost } from "@/content/blog";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const post = getBlogPost(params.slug);

  if (!post) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-400">Post not found.</p>
        <Link
          href="/blog"
          className="mt-4 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          &larr; Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-8 pb-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-block text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
      >
        &larr; Blog
      </Link>

      {/* Hero */}
      <header>
        <h1 className="text-2xl font-bold leading-tight md:text-3xl">
          {post.title}
        </h1>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
          {post.subtitle}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readingTimeMins} min read</span>
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
      </header>

      {/* Hero intro */}
      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.hero.intro}
        </ReactMarkdown>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Sections */}
      {post.sections.map((section, i) => (
        <section key={i} className="space-y-4">
          <h2 className="text-xl font-bold">{section.heading}</h2>

          {section.kind === "table" && (
            <>
              {section.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {section.description}
                </p>
              )}
              <DecisionMatrixTable section={section} />
            </>
          )}

          {section.kind === "checklist" && (
            <>
              {section.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {section.description}
                </p>
              )}
              <DeploymentChecklist section={section} postSlug={post.slug} />
            </>
          )}

          {section.kind === "prose" && (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-base prose-headings:font-semibold prose-p:leading-relaxed prose-strong:text-zinc-900 prose-li:leading-relaxed prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-indigo-600 prose-code:before:content-none prose-code:after:content-none dark:prose-strong:text-zinc-100 dark:prose-code:bg-zinc-800 dark:prose-code:text-indigo-400">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.content}
              </ReactMarkdown>
            </div>
          )}
        </section>
      ))}
    </article>
  );
}
