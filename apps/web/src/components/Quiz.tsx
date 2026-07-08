"use client";

import { useState } from "react";
import { post } from "@/lib/api";
import type { Quiz as QuizType, QuizQuestion } from "@/types";

interface Props {
  quiz: QuizType;
  onComplete: (updated: QuizType) => void;
}

export default function Quiz({ quiz, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(quiz.questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const q: QuizQuestion = quiz.questions[current];
  const selected = answers[current];
  const answered = selected !== null;

  function selectOption(idx: number) {
    if (answered) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = idx;
      return next;
    });
  }

  async function submitAll() {
    if (submitted) return;
    setSubmitted(true);
    try {
      const result = await post<QuizType>(`/quizzes/${quiz.id}/submit`, {
        answers: answers.map((a) => a ?? -1),
      });
      onComplete(result);
    } catch {
      setSubmitted(false);
    }
  }

  if (showResult) {
    const score = answers.reduce<number>(
      (acc, a, i) => acc + (a === quiz.questions[i].correct ? 1 : 0),
      0
    );
    return (
      <div className="space-y-4">
        <div className="py-8 text-center">
          <p className="text-4xl">
            {score === quiz.total ? "🎉" : score >= quiz.total / 2 ? "👍" : "📚"}
          </p>
          <p className="mt-3 text-2xl font-bold">
            {score}/{quiz.total}
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            {score === quiz.total
              ? "Perfect score!"
              : score >= quiz.total / 2
                ? "Good job!"
                : "Keep studying!"}
          </p>
        </div>
        <button
          onClick={submitAll}
          disabled={submitted}
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitted ? "Saving..." : "Save results"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>
          Question {current + 1} of {quiz.total}
        </span>
        <span>
          {answers.filter((a) => a !== null).length} answered
        </span>
      </div>

      <p className="text-sm font-semibold leading-relaxed">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = "border-zinc-200 dark:border-zinc-800";
          if (answered) {
            if (i === q.correct) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
            else if (i === selected) style = "border-rose-500 bg-rose-50 dark:bg-rose-950/30";
          } else if (i === selected) {
            style = "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30";
          }

          return (
            <button
              key={i}
              onClick={() => selectOption(i)}
              disabled={answered}
              className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${style}`}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
          {q.explanation}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-600 disabled:invisible"
        >
          Previous
        </button>
        {current < quiz.total - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={!answered}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => setShowResult(true)}
            disabled={answers.some((a) => a === null)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            See results
          </button>
        )}
      </div>
    </div>
  );
}
