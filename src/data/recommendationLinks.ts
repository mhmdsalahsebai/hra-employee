import type { DimensionId } from "./dimensions";
import type { Insight } from "./insights";
import { CATEGORY_DIMENSION } from "./planEngine";
import { programs, programsById, type Program } from "./programs";
import { content, type ContentItem } from "./content";
import type { Metric } from "./metrics";

/* ───────────────────────────────────────────────────────────────────────────
   Shared "what should the employee do about this?" routing. The report already
   derives findings (insights) and sub-scale metrics; this maps each of them to
   the three concrete Cura deliverables — a guided program (the Cura solution), a
   topic-specific expert consultation, and matched content — so the report can
   link the analysis to action instead of just describing it.

   Everything is derived from the existing data: programs declare the insight ids
   they `treats`, experts live on each program, and content carries a dimension.
   ─────────────────────────────────────────────────────────────────────────── */

/** The wellbeing dimension a finding belongs to. */
export const dimensionForInsight = (insight: Insight): DimensionId =>
  CATEGORY_DIMENSION[insight.category];

/** The guided program that treats this finding, if any (the "Cura solution"). */
export function programForInsight(insightId: string): Program | undefined {
  return programs.find((p) => p.treats.includes(insightId));
}

/* Physical is the one dimension with several distinct programs, so map its
   metrics explicitly; every other dimension has a single program we can pick
   by its `dimension`. Trait dimensions have no program (→ undefined). */
const METRIC_PROGRAM: Record<string, string> = {
  activity: "fitness",
  sitting: "fitness",
  commute: "fitness",
  fitness: "fitness",
  sleep: "sleep",
  tobacco: "smoking",
  nutrition: "healthy-lifestyle",
  hydration: "healthy-lifestyle",
  screening: "healthy-lifestyle",
  bmi: "weight",
};

/** The guided program most relevant to a computed sub-scale metric, if any. */
export function programForMetric(metric: Metric): Program | undefined {
  const explicit = METRIC_PROGRAM[metric.id];
  if (explicit) return programsById[explicit];
  return programs.find((p) => p.dimension === metric.dimension);
}

/** A representative content item for a dimension, for a `/content?item=` link. */
export function contentForDimension(dimension: DimensionId): ContentItem | undefined {
  return content.find((item) => item.dimension === dimension);
}

/** Deep link to an instant consultation pre-scoped to a program's topic/expert. */
export const consultationHref = (program: Program): string =>
  `/consultation?program=${program.id}`;
