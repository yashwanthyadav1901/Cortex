const STYLES: Record<string, string> = {
  not_started: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  todo: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  suggested: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  attempted: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  solved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  hard: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
};

export default function StatusPill({ value }: { value: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${
        STYLES[value] ?? STYLES.not_started
      }`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}
