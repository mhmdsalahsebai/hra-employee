import { useCallback, useMemo, useState, type ReactNode } from "react";
import { dimensions, type DimensionId } from "../data/dimensions";
import {
  answeredCount,
  bandLevel,
  dimensionRaw,
  displayScore,
  findBand,
  hraBySlug,
  randomAssessmentAnswers,
} from "../data/hra";
import {
  AssessmentContext,
  type AssessmentValue,
  type DimensionResult,
} from "./assessmentContextValue";

/* ───────────────────────────────────────────────────────────────────────────
   The real HRA engine: holds the employee's answers and derives, per
   dimension, a raw score → score band → verdict, advices, and a 0–100 display
   score. This is what turns "answering questions" into "a report and a plan".
   Seeded with a believable profile and persisted to localStorage.
   ─────────────────────────────────────────────────────────────────────────── */

const KEY = "cura-hra-answers";

function read(): Record<string, number> {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Record<string, number>;
  } catch {
    /* ignore unavailable storage */
  }
  // Fresh employee — no answers yet. They build results by answering dimensions.
  return {};
}

function persist(answers: Record<string, number>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    /* ignore unavailable storage */
  }
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, number>>(read);

  const setAnswer = useCallback((slug: string, value: number) => {
    setAnswers((prev) => {
      const next = { ...prev, [slug]: value };
      persist(next);
      return next;
    });
  }, []);

  const resetAnswers = useCallback(() => {
    setAnswers({});
    persist({});
  }, []);

  const fillRandomAnswers = useCallback(() => {
    const next = randomAssessmentAnswers();
    setAnswers(next);
    persist(next);
  }, []);

  // Dev-only: complete just the first `count` dimensions, leaving the rest
  // unanswered — the partial state that exercises the report preview / ladder.
  const fillDimensions = useCallback((count: number) => {
    const next: Record<string, number> = {};
    for (const { id } of dimensions.slice(0, count)) {
      for (const q of hraBySlug[id].questions) {
        next[q.slug] = q.answers[Math.floor(Math.random() * q.answers.length)].value;
      }
    }
    setAnswers(next);
    persist(next);
  }, []);

  const value = useMemo<AssessmentValue>(() => {
    const results: DimensionResult[] = dimensions.map(({ id }) => {
      const d = hraBySlug[id];
      const raw = dimensionRaw(d, answers);
      const band = findBand(d, raw);
      const answered = answeredCount(d, answers);
      return {
        slug: d.slug as DimensionId,
        raw,
        score: displayScore(d, raw),
        level: bandLevel(d, band),
        band,
        answered,
        total: d.questions.length,
        complete: answered === d.questions.length,
      };
    });

    const resultBySlug = Object.fromEntries(results.map((r) => [r.slug, r])) as Record<
      DimensionId,
      DimensionResult
    >;
    const completed = results.filter((r) => r.complete);
    const byScoreDesc = [...completed].sort((a, b) => b.score - a.score);
    const answeredQuestions = results.reduce((n, r) => n + r.answered, 0);
    const totalQuestions = results.reduce((n, r) => n + r.total, 0);

    return {
      answers,
      setAnswer,
      fillRandomAnswers,
      fillDimensions,
      resetAnswers,
      results,
      resultBySlug,
      strengths: byScoreDesc,
      focus: [...byScoreDesc].reverse(),
      strongCount: completed.filter((r) => r.level === "good").length,
      attentionCount: completed.filter((r) => r.level === "attention").length,
      overallScore: completed.length
        ? Math.round(completed.reduce((n, r) => n + r.score, 0) / completed.length)
        : 0,
      completedCount: completed.length,
      totalDimensions: results.length,
      started: answeredQuestions > 0,
      hasResults: completed.length === results.length,
      answeredQuestions,
      totalQuestions,
      progressPct: totalQuestions ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
    };
  }, [answers, setAnswer, fillRandomAnswers, fillDimensions, resetAnswers]);

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}
