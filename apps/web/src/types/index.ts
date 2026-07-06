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

