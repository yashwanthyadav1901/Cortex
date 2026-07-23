import type { TodoPriority } from "@/types";

/** Dot color per priority — shared by todo rows, the quick-add form, and the sheet. */
export const PRIORITY_DOT: Record<string, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-400",
  low: "bg-zinc-300 dark:bg-zinc-600",
};

/** Order the quick-add priority toggle cycles through. */
export const PRIORITY_CYCLE: TodoPriority[] = ["medium", "high", "low"];

/** The editable fields of a todo — what add/edit flows submit. */
export interface TodoDraft {
  title: string;
  description: string | null;
  priority: TodoPriority;
  due_date: string | null;
  category: string | null;
}
