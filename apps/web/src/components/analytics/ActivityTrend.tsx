"use client";

import { useState } from "react";
import { formatLocalDate } from "@/lib/dates";
import type { HeatmapDay } from "@/types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  data: HeatmapDay[];
  weeks: number;
}

export default function ActivityTrend({ data, weeks }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - weeks * 7);

  const countMap = new Map(data.map((d) => [d.date, d.count]));

  const days: { date: Date; dateStr: string; count: number }[] = [];
  const cursor = new Date(start);
  while (cursor <= today) {
    // Local date key — backend activity dates are keyed by the configured
    // local timezone, and toISOString() (UTC) would shift days in IST.
    const dateStr = formatLocalDate(cursor);
    days.push({ date: new Date(cursor), dateStr, count: countMap.get(dateStr) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  const maxCount = Math.max(1, ...days.map((d) => d.count));

  const padding = { top: 20, right: 12, bottom: 32, left: 28 };
  const chartWidth = Math.max(days.length * 14, 300);
  const chartHeight = 160;
  const svgWidth = chartWidth + padding.left + padding.right;
  const svgHeight = chartHeight + padding.top + padding.bottom;
  const barWidth = Math.max(4, (chartWidth / days.length) - 2);

  const yTicks: number[] = [];
  const step = maxCount <= 5 ? 1 : Math.ceil(maxCount / 4);
  for (let i = 0; i <= maxCount; i += step) yTicks.push(i);
  if (yTicks[yTicks.length - 1] < maxCount) yTicks.push(maxCount);

  const weekLabels: { x: number; label: string }[] = [];
  let lastWeek = -1;
  days.forEach((d, i) => {
    const weekNum = Math.floor(i / 7);
    if (weekNum !== lastWeek && d.date.getDay() === 1) {
      const x = padding.left + (i / days.length) * chartWidth;
      const month = d.date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      weekLabels.push({ x, label: month });
      lastWeek = weekNum;
    }
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="block"
        onMouseLeave={() => setTooltip(null)}
      >
        {yTicks.map((tick) => {
          const y = padding.top + chartHeight - (tick / maxCount) * chartHeight;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                x2={padding.left + chartWidth}
                y1={y}
                y2={y}
                className="stroke-zinc-200 dark:stroke-zinc-800"
                strokeWidth={1}
              />
              <text
                x={padding.left - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-zinc-400"
                fontSize={10}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {days.map((d, i) => {
          const x = padding.left + (i / days.length) * chartWidth;
          const barHeight = (d.count / maxCount) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          return (
            <rect
              key={d.dateStr}
              x={x}
              y={d.count > 0 ? y : padding.top + chartHeight - 1}
              width={barWidth}
              height={d.count > 0 ? barHeight : 1}
              rx={2}
              className={
                d.count > 0
                  ? "animate-bar-grow fill-indigo-500"
                  : "fill-zinc-200 dark:fill-zinc-800"
              }
              style={
                d.count > 0
                  ? ({
                      "--heat-delay": `${Math.min(i * 8, 400)}ms`,
                    } as React.CSSProperties)
                  : undefined
              }
              onMouseEnter={(e) => {
                const rect = (e.target as SVGRectElement).getBoundingClientRect();
                setTooltip({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 8,
                  text: `${DAY_LABELS[d.date.getDay()]} ${d.date.toLocaleDateString()}: ${d.count}`,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}

        {weekLabels.map((wl) => (
          <text
            key={wl.x}
            x={wl.x}
            y={svgHeight - 6}
            className="fill-zinc-400"
            fontSize={9}
          >
            {wl.label}
          </text>
        ))}
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
  );
}
