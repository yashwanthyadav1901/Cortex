"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import FlashcardReview from "@/components/FlashcardReview";
import { get } from "@/lib/api";
import type { FlashcardDue } from "@/types";

export default function ReviewPage() {
  const [cards, setCards] = useState<FlashcardDue[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    get<FlashcardDue[]>("/flashcards/due")
      .then(setCards)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-sm text-zinc-400">Loading...</p>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Review</h1>
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-600">
          ← Dashboard
        </Link>
      </header>

      {cards.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-4xl">✨</p>
          <p className="mt-3 text-lg font-semibold">No cards due</p>
          <p className="mt-1 text-sm text-zinc-400">
            Come back later or{" "}
            <Link href="/learnings" className="text-indigo-500 hover:underline">
              add new learnings
            </Link>
            .
          </p>
        </div>
      ) : (
        <FlashcardReview cards={cards} onComplete={load} />
      )}
    </div>
  );
}
