import { hraData, type HraDimensionData, type HraInsightBand } from "./hra.generated";
import type { DimensionId } from "./dimensions";
import type { ScoreLevel } from "../lib/score";

export type { HraDimensionData, HraInsightBand, HraQuestion, HraAnswerOption } from "./hra.generated";
export { hraData };

export const hraBySlug = Object.fromEntries(hraData.map((d) => [d.slug, d])) as Record<
  DimensionId,
  HraDimensionData
>;

/** Total questions across the nine wellbeing dimensions. */
export const totalQuestions = hraData.reduce((n, d) => n + d.questions.length, 0);

/** Dimensions where a LOWER raw score is the healthier state (problem scales:
 *  burnout, emotional reactivity). Everything else: higher raw = better. */
const LOWER_IS_BETTER = new Set<DimensionId>(["professional", "psycho"]);

/** True when a HIGHER answer value is the healthier/positive end for this
 *  dimension. Used to orient the answer scale's faces (positive → smiling). */
export const higherIsBetter = (slug: DimensionId) => !LOWER_IS_BETTER.has(slug);

export const maxRaw = (d: HraDimensionData) =>
  d.questions.reduce((n, q) => n + Math.max(...q.answers.map((a) => a.value)), 0);

export const minRaw = (d: HraDimensionData) =>
  d.questions.reduce((n, q) => n + Math.min(...q.answers.map((a) => a.value)), 0);

export const dimensionRaw = (d: HraDimensionData, answers: Record<string, number>) =>
  d.questions.reduce((n, q) => n + (answers[q.slug] ?? 0), 0);

export const answeredCount = (d: HraDimensionData, answers: Record<string, number>) =>
  d.questions.filter((q) => answers[q.slug] !== undefined).length;

/** The score band (real verdict + advices) the raw score falls into. */
export function findBand(d: HraDimensionData, raw: number): HraInsightBand {
  return (
    d.insights.find((b) => raw >= b.minScore && raw <= b.maxScore) ??
    d.insights[d.insights.length - 1]
  );
}

/** Map a band to a calm three-level status, honouring the score direction. */
export function bandLevel(d: HraDimensionData, band: HraInsightBand): ScoreLevel {
  const idx = d.insights.indexOf(band);
  const last = d.insights.length - 1;
  const goodIdx = LOWER_IS_BETTER.has(d.slug as DimensionId) ? 0 : last;
  const badIdx = LOWER_IS_BETTER.has(d.slug as DimensionId) ? last : 0;
  if (idx === goodIdx) return "good";
  if (idx === badIdx) return "attention";
  return "moderate";
}

/** 0–100 where high always means "doing well", regardless of scale direction. */
export function displayScore(d: HraDimensionData, raw: number): number {
  const mn = minRaw(d);
  const mx = maxRaw(d);
  const norm = mx > mn ? ((raw - mn) / (mx - mn)) * 100 : 0;
  const v = LOWER_IS_BETTER.has(d.slug as DimensionId) ? 100 - norm : norm;
  return Math.round(Math.max(0, Math.min(100, v)));
}

/* ── Demo seeding ──────────────────────────────────────────────────────────
   Deterministic answers that yield a believable, varied profile so the
   "completed" state shows real computed scores without forcing 140 taps.
   Intensity is the position toward the high-raw end of each scale (0–1). */

const SEED_INTENSITY: Record<DimensionId, number> = {
  professional: 0.52, // moderate burnout
  psycho: 0.5, // balanced
  intellectual: 0.8, // open
  community: 0.82, // empathetic
  social: 0.62, // interactive
  belonging: 0.74, // diligent
  physical: 0.42, // weak — a focus area
  financial: 0.6, // moderate
  workplace: 0.84, // engaged
};

export function seedAnswers(): Record<string, number> {
  const answers: Record<string, number> = {};
  for (const d of hraData) {
    const t = SEED_INTENSITY[d.slug as DimensionId] ?? 0.6;
    for (const q of d.questions) {
      const vals = q.answers.map((a) => a.value);
      const target = Math.min(...vals) + t * (Math.max(...vals) - Math.min(...vals));
      const best = q.answers.reduce((p, c) =>
        Math.abs(c.value - target) < Math.abs(p.value - target) ? c : p,
      );
      answers[q.slug] = best.value;
    }
  }
  return answers;
}
