"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChatMarkdown from "@/components/ChatMarkdown";
import { PILLAR_LABELS } from "@/content";
import type { RoadmapNode } from "@/content/types";
import { streamChat, type ChatMessage } from "@/lib/chat";
import type { Pillar } from "@/types";

/**
 * Topic-aware tutor chat, presented as a slide-over drawer so the topic page
 * underneath never moves. History is ephemeral (component state) and resets
 * when the mounted `node` changes (parent mounts with key={node.slug}).
 */
export default function TopicChat({
  pillar,
  node,
  trigger = "inline",
}: {
  pillar: Pillar;
  node: RoadmapNode;
  trigger?: "inline" | "floating";
}) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // drives slide transition
  const [showTasks, setShowTasks] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const atBottomRef = useRef(true);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const tasks = node.tasks ?? [];
  const starters = [
    `Explain ${node.title} in simple terms`,
    `Give me a concrete example of ${node.title}`,
    `Quiz me on ${node.title}`,
    `What should I build to practice this?`,
  ];

  // --- open / close with slide animation + body scroll lock ---
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => setShown(true));
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => {
    setShown(false);
    setTimeout(() => setOpen(false), 250);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // --- smart auto-scroll: only stick to bottom if the user is already there ---
  useEffect(() => {
    if (atBottomRef.current && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  function onListScroll() {
    const el = listRef.current;
    if (!el) return;
    atBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  // --- auto-grow textarea ---
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  async function runStream(history: ChatMessage[]) {
    atBottomRef.current = true;
    setMessages([...history, { role: "assistant", content: "" }]);
    setError(false);
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await streamChat(
        {
          topic: {
            pillar,
            title: node.title,
            summary: node.summary,
            why: node.why,
            tasks,
          },
          messages: history,
        },
        (chunk) =>
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: last.content + chunk };
            return next;
          }),
        controller.signal
      );
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") setError(true);
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function send(text: string) {
    const t = text.trim();
    if (!t || streaming) return;
    const base = [...messages];
    // Drop a trailing empty assistant placeholder from a previous failure.
    if (base.length && base[base.length - 1].role === "assistant" && !base[base.length - 1].content) {
      base.pop();
    }
    setInput("");
    runStream([...base, { role: "user", content: t }]);
  }

  function retry() {
    const base = [...messages];
    while (base.length && base[base.length - 1].role === "assistant") base.pop();
    if (base.length) runStream(base);
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setError(false);
    setStreaming(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const lastIsEmptyAssistant =
    streaming &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    !messages[messages.length - 1].content;

  return (
    <>
      {trigger === "floating" ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask about this topic"
          aria-expanded={open}
          className="fixed right-4 bottom-24 z-30 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 active:scale-95 md:right-8 md:bottom-6"
        >
          💬 Ask
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-indigo-400"
        >
          💬 Ask about this topic
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={`Chat about ${node.title}`}>
          <div
            onClick={close}
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
              shown ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute right-0 bottom-0 left-0 flex h-[85dvh] flex-col rounded-t-2xl border-zinc-200 bg-white shadow-2xl transition-transform duration-300 ease-out md:top-0 md:left-auto md:h-full md:w-[420px] md:max-w-full md:rounded-none md:border-l dark:border-zinc-800 dark:bg-zinc-950 ${
              shown
                ? "translate-y-0 md:translate-x-0"
                : "translate-y-full md:translate-y-0 md:translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                  {PILLAR_LABELS[pillar]}
                </p>
                <h2 className="truncate text-sm font-bold">💬 {node.title}</h2>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={close}
                  aria-label="Close chat"
                  className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Pinned tasks reference */}
            {tasks.length > 0 && (
              <div className="border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
                <button
                  onClick={() => setShowTasks((v) => !v)}
                  className="flex w-full items-center justify-between text-[11px] font-semibold tracking-wide text-zinc-400 uppercase"
                >
                  <span>Learning tasks ({tasks.length})</span>
                  <span>{showTasks ? "▾" : "▸"}</span>
                </button>
                {showTasks && (
                  <ul className="mt-1.5 space-y-1">
                    {tasks.map((task, i) => (
                      <li key={i} className="flex gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="text-zinc-400">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Messages */}
            <div
              ref={listRef}
              onScroll={onListScroll}
              aria-live="polite"
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 ? (
                <div className="flex h-full flex-col justify-center">
                  <p className="mb-3 text-center text-sm text-zinc-500">
                    Ask anything about <span className="font-semibold">{node.title}</span>.
                  </p>
                  <div className="flex flex-col gap-2">
                    {starters.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-xl border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-600 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-indigo-400"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-indigo-600 px-3 py-2 text-sm whitespace-pre-wrap text-white">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="group">
                      {lastIsEmptyAssistant && i === messages.length - 1 ? (
                        <div className="flex gap-1 py-1" aria-label="Tutor is typing">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                        </div>
                      ) : (
                        <>
                          <ChatMarkdown content={m.content} />
                          {m.content && !(streaming && i === messages.length - 1) && (
                            <button
                              onClick={() => navigator.clipboard.writeText(m.content).catch(() => {})}
                              className="mt-1 text-[11px] text-zinc-400 opacity-0 transition group-hover:opacity-100 hover:text-zinc-600 dark:hover:text-zinc-300"
                            >
                              Copy
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )
                )
              )}

              {error && (
                <div className="flex items-center gap-2 text-sm text-rose-500">
                  <span>⚠️ Couldn&apos;t get a response.</span>
                  <button
                    onClick={retry}
                    className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-zinc-100 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-zinc-800">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder={`Ask about ${node.title}…`}
                  className="max-h-40 min-w-0 flex-1 resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm leading-relaxed placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none dark:border-zinc-800"
                />
                {streaming ? (
                  <button
                    onClick={() => abortRef.current?.abort()}
                    className="shrink-0 rounded-xl bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={() => send(input)}
                    disabled={!input.trim()}
                    aria-label="Send"
                    className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:opacity-40"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2 11 13" />
                      <path d="M22 2 15 22l-4-9-9-4Z" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-center text-[11px] text-zinc-400">
                Enter to send · Shift+Enter for a new line
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
