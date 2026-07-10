import type { BlogPost } from "./types";
import { aiAgentPlaybook } from "./ai-agent-playbook";

export const BLOG_POSTS: BlogPost[] = [aiAgentPlaybook];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
