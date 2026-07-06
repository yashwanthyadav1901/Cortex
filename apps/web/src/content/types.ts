import type { Pillar } from "@/types";

export type ResourceType =
  | "video"
  | "course"
  | "article"
  | "book"
  | "docs"
  | "practice";

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  note?: string;
}

export interface RoadmapNode {
  slug: string;
  title: string;
  /** What this topic is, in 1-2 sentences. */
  summary: string;
  /** Why it's worth learning. */
  why: string;
  estHours: number;
  resources: Resource[];
  /** Slugs of ProjectSpecs that exercise this topic. */
  projectSlugs?: string[];
  /** Concrete action items: read X, implement Y, explain Z. */
  tasks?: string[];
  /** Nodes in the same stage with the same row render side-by-side. */
  row?: number;
}

export interface RoadmapStage {
  title: string;
  nodes: RoadmapNode[];
}

export interface Roadmap {
  pillar: Pillar;
  title: string;
  description: string;
  stages: RoadmapStage[];
}

export interface ProjectSpec {
  slug: string;
  pillar: Pillar;
  title: string;
  tagline: string;
  difficulty: "easy" | "medium" | "hard";
  estHours: number;
  /** Detailed description of what the project is and why it's valuable. */
  overview: string;
  /** Concrete milestones, in build order. */
  buildSteps: string[];
  stretchGoals: string[];
  skills: string[];
  /** Roadmap nodes this project reinforces. */
  topicSlugs: string[];
}
