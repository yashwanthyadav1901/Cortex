export type Pillar = "system_design" | "ai" | "dsa";
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

export interface Streak {
  current_streak: number;
  last_activity_date: string | null;
  active_today: boolean;
}

export interface PlanTopicItem {
  pillar: Pillar;
  name: string;
  action: string;
  est_hours: number;
  why: string;
}

export interface PlanJson {
  summary: string;
  total_hours: number;
  topics: PlanTopicItem[];
  project: { title: string; task: string; est_hours: number } | null;
  dsa_problems: { title: string; topic_tag: string; difficulty: Difficulty; why: string }[];
  daily_breakdown: { day: string; focus: string; est_hours: number }[];
}

export interface Plan {
  id: string;
  week_start_date: string;
  available_hours: number;
  generated_json: PlanJson;
  model: string | null;
  created_at: string;
}
