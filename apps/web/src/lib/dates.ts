// Local-timezone calendar-date helpers. `due_date` is a plain "YYYY-MM-DD"
// string end-to-end, so date logic must compare local-formatted strings —
// never `new Date("YYYY-MM-DD")`, which parses as UTC midnight.

export function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function localDateStr(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatLocalDate(d);
}

/** Humanized due-date label: "Today", "Tomorrow", "3d overdue", "Jul 16". */
export function formatDueLabel(dateStr: string): string {
  const today = localDateStr();
  if (dateStr === today) return "Today";
  if (dateStr === localDateStr(1)) return "Tomorrow";
  const [y, m, d] = dateStr.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  if (dateStr < today) {
    const [ty, tm, td] = today.split("-").map(Number);
    const days = Math.round(
      (new Date(ty, tm - 1, td).getTime() - due.getTime()) / 86_400_000
    );
    return days === 1 ? "Yesterday" : `${days}d overdue`;
  }
  return due.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(y !== new Date().getFullYear() ? { year: "numeric" } : {}),
  });
}
