export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  readingTimeMins: number;
  hero: {
    intro: string;
  };
  sections: BlogSection[];
}

export type BlogSection =
  | BlogProseSection
  | BlogTableSection
  | BlogChecklistSection;

export interface BlogProseSection {
  kind: "prose";
  heading: string;
  content: string;
}

export interface BlogTableSection {
  kind: "table";
  heading: string;
  description?: string;
  columns: string[];
  rows: string[][];
}

export interface BlogChecklistSection {
  kind: "checklist";
  heading: string;
  description?: string;
  categories: ChecklistCategory[];
}

export interface ChecklistCategory {
  name: string;
  items: string[];
}
