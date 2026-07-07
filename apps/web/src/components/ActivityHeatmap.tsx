"use client";

import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import type { HeatmapDay } from "@/types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getColor(count: number, dark: boolean): string {
  if (count === 0) return dark ? "#27272a" : "#f4f4f5";
  if (count === 1) return dark ? "#065f46" : "#a7f3d0";
  if (count === 2) return dark ? "#059669" : "#34d399";
  return dark ? "#10b981" : "#059669";
}

export default function ActivityHeatmap() {
  const [days, setDays] = useState<HeatmapDay[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    get<HeatmapDay[]>("/activity/heatmap?months=12")
      .then(setDays)
      .catch(() => {});
  }, []);

  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  oneYearAgo.setDate(oneYearAgo.getDate() - oneYearAgo.getDay());

  const countMap = new Map(days.map((d) => [d.date, d.count]));

  const weeks: { date: Date; count: number }[][] = [];
  let currentWeek: { date: Date; count: number }[] = [];
  const cursor = new Date(oneYearAgo);

  while (cursor <= today) {
    const dateStr = cursor.toISOString().slice(0, 10);
    currentWeek.push({ date: new Date(cursor), count: countMap.get(dateStr) ?? 0 });
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
                fill={getColor(day.count, dark)}
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
