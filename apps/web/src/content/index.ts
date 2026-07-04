import type { Pillar } from "@/types";
import { aiProjects } from "./projects/ai";
import { dsaProjects } from "./projects/dsa";
import { systemDesignProjects } from "./projects/system-design";
import { aiRoadmap } from "./roadmaps/ai";
import { dsaRoadmap } from "./roadmaps/dsa";
import { systemDesignRoadmap } from "./roadmaps/system-design";
import type { ProjectSpec, Roadmap, RoadmapNode } from "./types";

export const ROADMAPS: Record<Pillar, Roadmap> = {
  system_design: systemDesignRoadmap,
  ai: aiRoadmap,
  dsa: dsaRoadmap,
};

export const PROJECTS: ProjectSpec[] = [
  ...systemDesignProjects,
  ...aiProjects,
  ...dsaProjects,
];

export const PILLAR_LABELS: Record<Pillar, string> = {
  system_design: "System Design",
  ai: "AI",
  dsa: "DSA",
};

/** URL segment ↔ pillar mapping (pillar enum uses underscores). */
export const PILLAR_SLUGS: Record<string, Pillar> = {
  "system-design": "system_design",
  ai: "ai",
  dsa: "dsa",
};

export function pillarToSlug(pillar: Pillar): string {
  return pillar === "system_design" ? "system-design" : pillar;
}

export function getProject(slug: string): ProjectSpec | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function allNodes(roadmap: Roadmap): RoadmapNode[] {
  return roadmap.stages.flatMap((s) => s.nodes);
}

export function findNode(
  pillar: Pillar,
  slug: string
): { node: RoadmapNode; stageTitle: string } | undefined {
  for (const stage of ROADMAPS[pillar].stages) {
    const node = stage.nodes.find((n) => n.slug === slug);
    if (node) return { node, stageTitle: stage.title };
  }
  return undefined;
}

/** Search every pillar's roadmap for a node (projects can link cross-pillar topics). */
export function findNodeGlobal(
  slug: string
): { pillar: Pillar; node: RoadmapNode; stageTitle: string } | undefined {
  for (const pillar of Object.keys(ROADMAPS) as Pillar[]) {
    const found = findNode(pillar, slug);
    if (found) return { pillar, ...found };
  }
  return undefined;
}

/** Projects that reinforce a given roadmap node. */
export function projectsForNode(node: RoadmapNode): ProjectSpec[] {
  const linked = new Set(node.projectSlugs ?? []);
  return PROJECTS.filter(
    (p) => linked.has(p.slug) || p.topicSlugs.includes(node.slug)
  );
}
