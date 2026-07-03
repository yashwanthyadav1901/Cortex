import StatusPill from "@/components/ui/StatusPill";
import type { PlanJson } from "@/types";

const PILLAR_LABEL: Record<string, string> = {
  system_design: "System Design",
  ai: "AI",
  dsa: "DSA",
};

export default function PlanCard({ plan }: { plan: PlanJson }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {plan.summary}{" "}
        <span className="text-zinc-400 dark:text-zinc-500">
          · {plan.total_hours}h planned
        </span>
      </p>

      {plan.topics?.length > 0 && (
        <section>
          <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            Topics
          </h3>
          <ul className="space-y-1.5">
            {plan.topics.map((t, i) => (
              <li key={i} className="text-sm">
                <span className="text-zinc-400">{PILLAR_LABEL[t.pillar] ?? t.pillar}:</span>{" "}
                <span className="font-medium">{t.name}</span>{" "}
                <span className="text-zinc-400">
                  — {t.action}, ~{t.est_hours}h
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {plan.project && (
        <section>
          <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            Project
          </h3>
          <p className="text-sm">
            <span className="font-medium">{plan.project.title}</span>{" "}
            <span className="text-zinc-400">— ~{plan.project.est_hours}h</span>
          </p>
          <p className="text-sm text-zinc-500">{plan.project.task}</p>
        </section>
      )}

      {plan.dsa_problems?.length > 0 && (
        <section>
          <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            DSA problems
          </h3>
          <ul className="space-y-1.5">
            {plan.dsa_problems.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="font-medium">{p.title}</span>
                <StatusPill value={p.difficulty} />
                <span className="text-xs text-zinc-400">{p.topic_tag}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {plan.daily_breakdown?.length > 0 && (
        <section>
          <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            Week at a glance
          </h3>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {plan.daily_breakdown.map((d, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="w-10 shrink-0 font-medium text-zinc-500">{d.day}</span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {d.focus} <span className="text-zinc-400">({d.est_hours}h)</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
