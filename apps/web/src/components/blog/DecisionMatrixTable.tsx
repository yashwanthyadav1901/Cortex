"use client";

import ReactMarkdown from "react-markdown";
import type { BlogTableSection } from "@/content/blog/types";

export default function DecisionMatrixTable({
  section,
}: {
  section: BlogTableSection;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-900">
            {section.columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-t border-zinc-100 dark:border-zinc-800"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-3 align-top text-zinc-700 dark:text-zinc-300"
                >
                  <span className="prose prose-sm dark:prose-invert prose-p:m-0 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100">
                    <ReactMarkdown>{cell}</ReactMarkdown>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
