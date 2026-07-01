import { createContext } from "react";
import type { DimensionId } from "../data/dimensions";
import type { HraInsightBand } from "../data/hra";
import type { ScoreLevel } from "../lib/score";

export interface DimensionResult {
  slug: DimensionId;
  /** Raw summed score (drives the insight band). */
  raw: number;
  /** 0–100, high = doing well. */
  score: number;
  level: ScoreLevel;
  /** The real verdict + description + alert + advices for this band. */
  band: HraInsightBand;
  complete: boolean;
  answered: number;
  total: number;
}

export interface AssessmentValue {
  answers: Record<string, number>;
  setAnswer: (slug: string, value: number) => void;
  fillRandomAnswers: () => void;
  /** Dev-only: complete only the first N dimensions (partial state). */
  fillDimensions: (count: number) => void;
  resetAnswers: () => void;
  /** Results in dimension order. */
  results: DimensionResult[];
  resultBySlug: Record<DimensionId, DimensionResult>;
  /** Strongest first. */
  strengths: DimensionResult[];
  /** Weakest first. */
  focus: DimensionResult[];
  strongCount: number;
  attentionCount: number;
  overallScore: number;
  completedCount: number;
  totalDimensions: number;
  /** At least one question answered. */
  started: boolean;
  /** Every dimension complete → the full report/plan are ready. */
  hasResults: boolean;
  answeredQuestions: number;
  totalQuestions: number;
  /** 0–100 across the whole assessment. */
  progressPct: number;
}

export const AssessmentContext = createContext<AssessmentValue | null>(null);
