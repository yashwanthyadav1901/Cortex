"use client";

import { useEffect, useState } from "react";
import PlanCard from "@/components/PlanCard";
import { get } from "@/lib/api";
import type { Plan } from "@/types";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get<Plan[]>("/plans")
      .then((ps) => {
        setPlans(ps);
        if (ps.length > 0) setOpenId(ps[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-zinc-400">Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Plan History</h1>
      {plans.length === 0 && (
        <p className="py-8 text-center text-sm text-zinc-400">
          No plans yet — generate your first from the dashboard.
        </p>
      )}
      <ul className="space-y-3">
        {plans.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800"
          >
            <button
              onClick={() => setOpenId(openId === p.id ? null : p.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="text-sm font-semibold">Week of {p.week_start_date}</p>
                <p className="text-xs text-zinc-400">
                  {p.available_hours}h budget
                  {p.model && ` · ${p.model}`}
                </p>
              </div>
              <span className="text-zinc-400">{openId === p.id ? "▾" : "▸"}</span>
            </button>
            {openId === p.id && (
              <div className="border-t border-zinc-100 px-4 py-4 dark:border-zinc-900">
                <PlanCard plan={p.generated_json} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
