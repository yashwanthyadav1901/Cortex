"use client";

import { useState } from "react";
import { useApiQuery } from "@/lib/useApi";
import type { HeatmapDay } from "@/types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getColor(count: number, isFuture: boolean, dark: boolean): string {
  if (isFuture) return dark ? "#1c1c1e" : "#fafafa";
  if (count === 0) return dark ? "#27272a" : "#f4f4f5";
  if (count === 1) return dark ? "#065f46" : "#a7f3d0";
  if (count === 2) return dark ? "#059669" : "#34d399";
  return dark ? "#10b981" : "#059669";
}

export default function ActivityHeatmap() {
  const { data: days = [] } = useApiQuery<HeatmapDay[]>("/activity/heatmap?months=12");
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const startDate = new Date(startOfYear);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const countMap = new Map(days.map((d) => [d.date, d.count]));

  const weeks: { date: Date; count: number; future: boolean }[][] = [];
  let currentWeek: { date: Date; count: number; future: boolean }[] = [];
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  const cursor = new Date(startDate);

  const todayStr = toDateStr(today);
  while (cursor <= endOfYear) {
    const dateStr = toDateStr(cursor);
    currentWeek.push({ date: new Date(cursor), count: countMap.get(dateStr) ?? 0, future: dateStr > todayStr });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const monthLabels: { label: string; week: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstDay = week[0].date;
    const month = firstDay.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTHS[month], week: wi });
      lastMonth = month;
    }
  });

  const cellSize = 12;
  const gap = 2;
  const step = cellSize + gap;
  const leftPad = 0;
  const topPad = 16;
  const dark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
        Activity
      </h2>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
        <svg
          width={leftPad + weeks.length * step}
          height={topPad + 7 * step}
          className="block"
          onMouseLeave={() => setTooltip(null)}
        >
          {monthLabels.map((m) => (
            <text
              key={`${m.label}-${m.week}`}
              x={leftPad + m.week * step}
              y={10}
              className="fill-zinc-400"
              fontSize={9}
            >
              {m.label}
            </text>
          ))}
          {weeks.map((week, wi) =>
            week.map((day, di) => (
              <rect
                key={`${wi}-${di}`}
                x={leftPad + wi * step}
                y={topPad + di * step}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={getColor(day.count, day.future, dark)}
                className={day.count > 0 ? "animate-heat-fill" : undefined}
                style={
                  day.count > 0
                    ? ({
                        "--heat-delay": `${Math.min(wi * 12, 500)}ms`,
                      } as React.CSSProperties)
                    : undefined
                }
                onMouseEnter={(e) => {
                  const rect = (e.target as SVGRectElement).getBoundingClientRect();
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top - 8,
                    text: `${day.date.toLocaleDateString()}: ${day.count} activit${day.count === 1 ? "y" : "ies"}`,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))
          )}
        </svg>
        {tooltip && (
          <div
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </section>
  );
}
