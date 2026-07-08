export type Pillar = "system_design" | "ai" | "dsa" | "ai_agents";
export type TopicStatus = "not_started" | "in_progress" | "done";
export type Difficulty = "easy" | "medium" | "hard";
export type ProjectStatus = "suggested" | "in_progress" | "done";
export type ProblemStatus = "todo" | "attempted" | "solved";
export type ActivityType = "topic_study" | "project_work" | "dsa_solved";

export interface Topic {
  id: string;
  pillar: Pillar;
  name: string;
  status: TopicStatus;
  difficulty: Difficulty;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  topic_id: string | null;
  title: string;
  description: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  topic_tag: string;
  difficulty: Difficulty;
  status: ProblemStatus;
  url: string | null;
  date_solved: string | null;
  created_at: string;
}

export interface TopicProgress {
  status: TopicStatus;
  notes: string | null;
}

export interface Streak {
  current_streak: number;
  last_activity_date: string | null;
  active_today: boolean;
}

export type TodoPriority = "low" | "medium" | "high";
export type TodoStatus = "pending" | "done";

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  due_date: string | null;
  category: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Microlearning {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface UserResource {
  id: string;
  topic_slug: string;
  title: string;
  url: string;
  note: string | null;
  created_at: string;
}

export interface HeatmapDay {
  date: string;
  count: number;
}

export interface ActivityEntry {
  id: string;
  activity_date: string;
  activity_type: ActivityType;
  topic_id: string | null;
  dsa_problem_id: string | null;
  created_at: string;
}

export interface WeeklySummary {
  total_activities: number;
  days_active: number;
  activities_by_type: Record<string, number>;
}

export interface WeekComparison {
  total: number;
  days_active: number;
}

export interface AnalyticsSummary {
  daily_counts: HeatmapDay[];
  by_type: Record<string, number>;
  by_pillar: Record<string, number>;
  this_week: WeekComparison;
  last_week: WeekComparison;
  totals: {
    activities: number;
    topics_done: number;
    topics_in_progress: number;
    dsa_solved: number;
    projects_done: number;
  };
}

export interface Bookmark {
  id: string;
  slug: string;
  type: "topic" | "project";
  created_at: string;
}

export interface FlashcardDue {
  id: string;
  microlearning_id: string | null;
  topic_slug: string | null;
  title: string;
  body: string;
  tags: string[];
  source: "microlearning" | "topic";
  ease_factor: number;
  interval_days: number;
  repetitions: number;
}

export interface FlashcardStats {
  due_today: number;
  total: number;
  reviewed_today: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  topic_slug: string;
  questions: QuizQuestion[];
  score: number | null;
  total: number;
  completed_at: string | null;
  created_at: string;
}

export interface Recommendation {
  slug: string;
  title: string;
  pillar: string;
  reason: string;
}

