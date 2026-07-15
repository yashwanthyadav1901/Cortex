"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { allNodes, BLOG_POSTS, PILLAR_LABELS, pillarToSlug, PROJECTS, ROADMAPS } from "@/content";
import { get } from "@/lib/api";
import type { DsaProblem, Microlearning, Pillar, Todo } from "@/types";

interface SearchResult {
  title: string;
  subtitle: string;
  href: string;
  category: string;
  icon: string;
  titleMatch: boolean;
}

const CATEGORY_ORDER = ["Topics", "Projects", "Blog", "Todos", "Learnings", "DSA"];
const MAX_PER_GROUP = 5;

function buildStaticItems(): SearchResult[] {
  const items: SearchResult[] = [];
  for (const pillar of Object.keys(ROADMAPS) as Pillar[]) {
    for (const node of allNodes(ROADMAPS[pillar])) {
      items.push({
        title: node.title,
        subtitle: `${PILLAR_LABELS[pillar]} · ~${node.estHours}h`,
        href: `/roadmap/${pillarToSlug(pillar)}/${node.slug}`,
        category: "Topics",
        icon: "📚",
        titleMatch: false,
      });
    }
  }
  for (const proj of PROJECTS) {
    items.push({
      title: proj.title,
      subtitle: proj.tagline,
      href: `/projects/${proj.slug}`,
      category: "Projects",
      icon: "🛠️",
      titleMatch: false,
    });
  }
  for (const post of BLOG_POSTS) {
    items.push({
      title: post.title,
      subtitle: post.subtitle,
      href: `/blog/${post.slug}`,
      category: "Blog",
      icon: "✍️",
      titleMatch: false,
    });
  }
  return items;
}

const STATIC_ITEMS = buildStaticItems();

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [learnings, setLearnings] = useState<Microlearning[] | null>(null);
  const [dsaProblems, setDsaProblems] = useState<DsaProblem[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelectedIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";

    if (!todos) get<Todo[]>("/todos").then(setTodos).catch(() => {});
    if (!learnings) get<Microlearning[]>("/microlearnings").then(setLearnings).catch(() => {});
    if (!dsaProblems) get<DsaProblem[]>("/dsa-problems").then(setDsaProblems).catch(() => {});

    return () => { document.body.style.overflow = ""; };
  }, [open, todos, learnings, dsaProblems]);

  const close = useCallback(() => setOpen(false), []);

  const dynamicItems = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];
    if (todos) {
      for (const t of todos) {
        if (t.status === "done") continue;
        items.push({
          title: t.title,
          subtitle: t.category ?? t.priority,
          href: "/todos",
          category: "Todos",
          icon: "✅",
          titleMatch: false,
        });
      }
    }
    if (learnings) {
      for (const l of learnings) {
        items.push({
          title: l.title,
          subtitle: l.body.slice(0, 60) + (l.body.length > 60 ? "…" : ""),
          href: "/learnings",
          category: "Learnings",
          icon: "📝",
          titleMatch: false,
        });
      }
    }
    if (dsaProblems) {
      for (const p of dsaProblems) {
        items.push({
          title: p.title,
          subtitle: `${p.topic_tag} · ${p.difficulty}`,
          href: "/dsa",
          category: "DSA",
          icon: "🧩",
          titleMatch: false,
        });
      }
    }
    return items;
  }, [todos, learnings, dsaProblems]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const allItems = [...STATIC_ITEMS, ...dynamicItems];
    const matched = allItems
      .map((item) => {
        const inTitle = item.title.toLowerCase().includes(q);
        const inSub = item.subtitle.toLowerCase().includes(q);
        if (!inTitle && !inSub) return null;
        return { ...item, titleMatch: inTitle };
      })
      .filter(Boolean) as SearchResult[];

    matched.sort((a, b) => {
      if (a.titleMatch !== b.titleMatch) return a.titleMatch ? -1 : 1;
      return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    });

    const grouped = new Map<string, SearchResult[]>();
    for (const r of matched) {
      const group = grouped.get(r.category) ?? [];
      if (group.length < MAX_PER_GROUP) group.push(r);
      grouped.set(r.category, group);
    }

    const flat: SearchResult[] = [];
    for (const cat of CATEGORY_ORDER) {
      const group = grouped.get(cat);
      if (group) flat.push(...group);
    }
    return flat;
  }, [query, dynamicItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function navigate(result: SearchResult) {
    close();
    router.push(result.href);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigate(results[selectedIndex]);
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  let lastCategory = "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={close}>
      <div className="animate-fade-in fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="animate-scale-in relative z-10 w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <span className="text-zinc-400">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search topics, projects, todos…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
          />
          <kbd className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:border-zinc-700">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto">
          {query && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-zinc-400">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
          {!query && (
            <p className="px-4 py-8 text-center text-sm text-zinc-400">
              Type to search across all content
            </p>
          )}
          {results.map((r, i) => {
            const showHeader = r.category !== lastCategory;
            lastCategory = r.category;
            return (
              <div key={`${r.category}-${r.href}-${r.title}-${i}`}>
                {showHeader && (
                  <div className="px-4 pt-3 pb-1 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
                    {r.category}
                  </div>
                )}
                <button
                  data-idx={i}
                  onClick={() => navigate(r)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-100 ${
                    i === selectedIndex
                      ? "bg-indigo-50 dark:bg-indigo-950"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <span className="shrink-0">{r.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{r.title}</span>
                    <span className="block truncate text-xs text-zinc-400">{r.subtitle}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 text-[10px] text-zinc-400 dark:border-zinc-800">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
