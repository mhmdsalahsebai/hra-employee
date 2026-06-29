import type { DimensionId } from "./dimensions";
import { totalQuestions } from "./hra";

/* ───────────────────────────────────────────────────────────────────────────
   Report-level narrative context: the trend baseline, peer benchmark, the
   clinician-style synthesis, and the cross-dimension patterns. The per-
   dimension scores/verdicts/advices come live from the assessment engine
   (useAssessment); these are the surrounding story.
   ─────────────────────────────────────────────────────────────────────────── */

/** Overall score at the previous assessment (drives the headline delta). */
export const prevOverall = 56;

/** "Better than N% of peers in your sector." */
export const percentile = 64;

/** Total questions in the assessment — proof of depth. */
export const answeredQuestions = totalQuestions;

/** Past wellbeing scores, oldest → newest. The live "now" point is appended by
 *  the report from the real overall score. */
export interface HistoryPoint {
  label: string;
  score: number;
}

export const pastHistory: HistoryPoint[] = [
  { label: "مارس", score: 50 },
  { label: "أبريل", score: 53 },
  { label: "مايو", score: prevOverall },
];

/* The clinician-style synthesis that used to live here is now derived live from
   the employee's actual answers — see summarizeInsights() in data/insights.ts. */

/** Cross-dimension patterns: the “we noticed” insights that connect two areas. */
export interface Pattern {
  id: string;
  /** "strength" tints it positively; "watch" flags something to address. */
  kind: "strength" | "watch";
  title: string;
  body: string;
  dims: [DimensionId, DimensionId];
}

export const patterns: Pattern[] = [
  {
    id: "stress-body",
    kind: "watch",
    title: "ضغط العمل ينعكس على جسدك",
    body: "غالبًا ما يصاحب الإجهاد المهني المرتفع تراجعٌ في النشاط البدني وجودة النوم. تحريك أحدهما يحرّك الآخر — خطوة بدنية صغيرة قد تخفّف شعورك بالإنهاك.",
    dims: ["professional", "physical"],
  },
  {
    id: "social-buffer",
    kind: "strength",
    title: "دعمك الاجتماعي درعٌ تتكئ عليه",
    body: "شبكة علاقاتك القوية وانتماؤك لفريقك مورد يقي من الاحتراق. الاتكاء عليه بوعي — بمحادثة أو طلب مساندة — يضاعف أثره وقت الضغط.",
    dims: ["community", "workplace"],
  },
];

/* ── Small numeric helpers ─────────────────────────────────────────────────── */

export interface DeltaMeta {
  diff: number;
  dir: "up" | "down" | "flat";
  /** e.g. "+٥" / "−٣" / "ثابت" — caller decides formatting around it. */
  abs: number;
}

/** Compare a current value to a baseline (previous score or benchmark). */
export function delta(current: number, base: number): DeltaMeta {
  const diff = current - base;
  return {
    diff,
    dir: diff > 0 ? "up" : diff < 0 ? "down" : "flat",
    abs: Math.abs(diff),
  };
}
