"use client";

import { useState } from "react";
import { post } from "@/lib/api";
import type { FlashcardDue } from "@/types";

const GRADES = [
  { quality: 1, label: "Again", color: "bg-rose-500 hover:bg-rose-600" },
  { quality: 3, label: "Good", color: "bg-blue-500 hover:bg-blue-600" },
  { quality: 5, label: "Easy", color: "bg-emerald-500 hover:bg-emerald-600" },
] as const;

interface Props {
  cards: FlashcardDue[];
  onComplete: () => void;
}

export default function FlashcardReview({ cards, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [grading, setGrading] = useState(false);

  if (cards.length === 0 || index >= cards.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-4xl">🎉</p>
        <p className="mt-3 text-lg font-semibold">All done!</p>
        <p className="mt-1 text-sm text-zinc-400">
          You reviewed {cards.length} card{cards.length === 1 ? "" : "s"}.
        </p>
      </div>
    );
  }

  const card = cards[index];

  async function grade(quality: number) {
    setGrading(true);
    try {
      await post(`/flashcards/${card.id}/review`, { quality });
    } catch {}
    setGrading(false);
    setRevealed(false);
    if (index + 1 >= cards.length) {
      onComplete();
    }
    setIndex((i) => i + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>
          {index + 1} / {cards.length}
        </span>
        <span className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            card.source === "topic"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          }`}>
            {card.source === "topic" ? "Roadmap" : "Learning"}
          </span>
          {card.tags.length > 0 && <span>{card.tags.join(", ")}</span>}
        </span>
      </div>

      <button
        onClick={() => !revealed && setRevealed(true)}
        className="w-full rounded-xl border border-zinc-200 p-6 text-left transition dark:border-zinc-800"
      >
        <p className="text-lg font-semibold">{card.title}</p>
        {revealed ? (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {card.body}
          </p>
        ) : (
          <p className="mt-3 text-sm text-zinc-400">Tap to reveal answer</p>
        )}
      </button>

      {revealed && (
        <div className="grid grid-cols-3 gap-2">
          {GRADES.map((g) => (
            <button
              key={g.quality}
              disabled={grading}
              onClick={() => grade(g.quality)}
              className={`rounded-lg py-3 text-sm font-semibold text-white transition disabled:opacity-50 ${g.color}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
