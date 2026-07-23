"use client";

import ActivityTrend from "@/components/analytics/ActivityTrend";
import CountUp from "@/components/ui/CountUp";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { allNodes, PILLAR_LABELS, ROADMAPS } from "@/content";
import { useApiQuery } from "@/lib/useApi";
import type { AnalyticsSummary, Pillar, Streak } from "@/types";

const TYPE_CONFIG: Record<string, { label: string; color: string; darkColor: string }> = {
  topic_study: { label: "Topics studied", color: "bg-blue-500", darkColor: "bg-blue-400" },
  project_work: { label: "Projects worked", color: "bg-amber-500", darkColor: "bg-amber-400" },
  dsa_solved: { label: "Problems solved", color: "bg-emerald-500", darkColor: "bg-emerald-400" },
};

const PILLAR_COLORS: Record<string, string> = {
  system_design: "bg-indigo-500",
  ai: "bg-emerald-500",
  dsa: "bg-amber-500",
  ai_agents: "bg-violet-500",
};

export default function AnalyticsPage() {
  const { data, isLoading } = useApiQuery<AnalyticsSummary>(
    "/analytics/summary?weeks=8"
  );
  const { data: streak = null } = useApiQuery<Streak>("/streak");

  if (isLoading && !data) return <PageSkeleton variant="stats" />;
  if (!data) return <p className="text-sm text-zinc-400">Couldn&apos;t load analytics.</p>;

  const totalTopics = (Object.keys(ROADMAPS) as Pillar[]).reduce(
    (sum, p) => sum + allNodes(ROADMAPS[p]).length,
    0
  );

  const typeTotal = Object.values(data.by_type).reduce((a, b) => a + b, 0);

  const weekChange =
    data.last_week.total > 0
      ? Math.round(((data.this_week.total - data.last_week.total) / data.last_week.total) * 100)
      : data.this_week.total > 0
        ? 100
        : 0;

  return (
    <div className="stagger-children space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Activities", value: data.totals.activities, icon: "🔥" },
          { label: "Current Streak", value: streak?.current_streak ?? 0, icon: "⚡" },
          { label: "Topics Done", value: `${data.totals.topics_done}/${totalTopics}`, icon: "📚" },
          { label: "DSA Solved", value: data.totals.dsa_solved, icon: "🧩" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-zinc-200 px-4 py-4 dark:border-zinc-800"
          >
            <div className="flex items-center gap-2">
              <span>{card.icon}</span>
              <span className="text-2xl font-bold">
                {typeof card.value === "number" ? (
                  <CountUp value={card.value} />
                ) : (
                  card.value
                )}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Activity Trend */}
      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Activity trend (8 weeks)
        </h2>
        <ActivityTrend data={data.daily_counts} weeks={8} />
      </section>

      {/* Pillar Progress */}
      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Pillar progress
        </h2>
        <div className="space-y-3 rounded-xl border border-zinc-200 px-4 py-4 dark:border-zinc-800">
          {(Object.keys(ROADMAPS) as Pillar[]).map((pillar) => {
            const total = allNodes(ROADMAPS[pillar]).length;
            const active = data.by_pillar[pillar] ?? 0;
            const pct = total > 0 ? Math.round((active / total) * 100) : 0;
            return (
              <div key={pillar}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {PILLAR_LABELS[pillar]}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {active}/{total} ({pct}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${PILLAR_COLORS[pillar]} transition-[width] duration-500 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Activity by Type */}
      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Activity by type
        </h2>
        <div className="rounded-xl border border-zinc-200 px-4 py-4 dark:border-zinc-800">
          {typeTotal === 0 ? (
            <p className="text-center text-sm text-zinc-400">No activity yet</p>
          ) : (
            <>
              <div className="mb-3 flex h-4 overflow-hidden rounded-full">
                {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
                  const count = data.by_type[type] ?? 0;
                  const pct = (count / typeTotal) * 100;
                  if (pct === 0) return null;
                  return (
                    <div
                      key={type}
                      className={`${cfg.color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-4">
                {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
                  const count = data.by_type[type] ?? 0;
                  const pct = typeTotal > 0 ? Math.round((count / typeTotal) * 100) : 0;
                  return (
                    <div key={type} className="flex items-center gap-2 text-sm">
                      <span className={`inline-block h-3 w-3 rounded-full ${cfg.color}`} />
                      <span className="text-zinc-600 dark:text-zinc-300">
                        {cfg.label}: {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Weekly Comparison */}
      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          This week vs last week
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200 px-4 py-4 dark:border-zinc-800">
            <p className="text-xs text-zinc-400">This week</p>
            <p className="mt-1 text-2xl font-bold">{data.this_week.total}</p>
            <p className="text-xs text-zinc-400">
              {data.this_week.days_active} day{data.this_week.days_active === 1 ? "" : "s"} active
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 px-4 py-4 dark:border-zinc-800">
            <p className="text-xs text-zinc-400">Last week</p>
            <p className="mt-1 text-2xl font-bold">{data.last_week.total}</p>
            <p className="text-xs text-zinc-400">
              {data.last_week.days_active} day{data.last_week.days_active === 1 ? "" : "s"} active
            </p>
          </div>
        </div>
        {(data.this_week.total > 0 || data.last_week.total > 0) && (
          <div className="mt-2 text-center">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                weekChange > 0
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  : weekChange < 0
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {weekChange > 0 ? "↑" : weekChange < 0 ? "↓" : "→"}{" "}
              {weekChange === 0 ? "Same" : `${Math.abs(weekChange)}% ${weekChange > 0 ? "more" : "fewer"}`}
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
