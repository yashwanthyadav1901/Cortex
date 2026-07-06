"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/** Recursively pull the plain text out of a rendered React subtree (for copy). */
function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function CopyButton({ getText, label }: { getText: () => string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(getText());
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      className="rounded-md px-2 py-1 text-[11px] font-medium text-zinc-400 transition hover:bg-zinc-700/60 hover:text-zinc-100"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ children }: { children?: ReactNode }) {
  return (
    <div className="my-2 overflow-hidden rounded-lg bg-zinc-900 dark:bg-black/50">
      <div className="flex items-center justify-end border-b border-white/5 px-2 py-1">
        <CopyButton
          label="Copy code"
          getText={() => nodeText(children).replace(/\n$/, "")}
        />
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-zinc-100">
        {children}
      </pre>
    </div>
  );
}

const components: Components = {
  a(props) {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 underline underline-offset-2 dark:text-indigo-400"
      >
        {props.children}
      </a>
    );
  },
  table(props) {
    return (
      <div className="overflow-x-auto">
        <table>{props.children}</table>
      </div>
    );
  },
  pre(props) {
    return <CodeBlock>{props.children}</CodeBlock>;
  },
  code(props) {
    // Inside a fenced block this <code> is a child of our <pre> (styled there);
    // standalone inline code gets a subtle chip.
    const isBlock = /language-/.test(props.className ?? "");
    if (isBlock) {
      return <code className="font-mono">{props.children}</code>;
    }
    return (
      <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.85em] dark:bg-zinc-800">
        {props.children}
      </code>
    );
  },
};

/** Renders assistant chat content as Markdown (GFM: tables, lists, code, links). */
export default function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-[''] prose-code:after:content-['']">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
