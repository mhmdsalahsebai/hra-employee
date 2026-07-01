import {
  CATEGORY_META,
  type CategoryMeta,
  type Insight,
  type InsightCategory,
  type InsightSummary,
} from "./insights";
import { dimensionsById, type Dimension, type DimensionId } from "./dimensions";

/* ───────────────────────────────────────────────────────────────────────────
   The plan engine. The Report derives specific findings from every answer
   (BMI, burnout sub-scales, depression / anxiety, lifestyle, financial and
   workplace flags) and pairs each with one concrete recommendation. This turns
   that same evidence into an actionable plan: every finding the employee sees
   in their report becomes a step here, ordered by urgency and routed to the
   right kind of help — professional support for the critical, a self-driven
   habit for the rest. The plan and the report read from one source of truth.
   ─────────────────────────────────────────────────────────────────────────── */

/** Which wellbeing dimension each insight area belongs to — so a finding keeps
 *  the same accent and can deep-link into its dimension screen. */
export const CATEGORY_DIMENSION: Record<InsightCategory, DimensionId> = {
  body: "physical",
  chronic: "physical",
  screening: "physical",
  burnout: "professional",
  mental: "psycho",
  lifestyle: "physical",
  financial: "financial",
  workplace: "workplace",
  engagement: "workplace",
};

export interface PlanFocusItem {
  insight: Insight;
  area: CategoryMeta;
  dimension: Dimension;
  /** The one concrete next step (the report's recommendation, or a fallback). */
  step: string;
  /** Critical findings → professional support rather than a self-driven habit. */
  needsExpert: boolean;
}

export interface PlanAreaGroup {
  category: InsightCategory;
  area: CategoryMeta;
  dimension: Dimension;
  items: PlanFocusItem[];
}

export interface DerivedPlan {
  /** Every actionable finding, severity-ordered (excludes positives). */
  items: PlanFocusItem[];
  /** Critical findings — routed to expert support. */
  priority: PlanFocusItem[];
  /** Warning + info findings — self-driven steps. */
  actions: PlanFocusItem[];
  /** Self-driven steps grouped by area, most urgent area first. */
  actionGroups: PlanAreaGroup[];
  /** Positive findings worth maintaining. */
  wins: Insight[];
  critical: number;
  warning: number;
  info: number;
  /** Total findings the plan addresses. */
  flagged: number;
  /** Distinct wellbeing areas the plan touches. */
  areaCount: number;
}

const FALLBACK_STEP = "افتح هذا البُعد لمراجعة التوصيات التفصيلية والبدء بخطوة صغيرة.";

function toItem(insight: Insight): PlanFocusItem {
  return {
    insight,
    area: CATEGORY_META[insight.category],
    dimension: dimensionsById[CATEGORY_DIMENSION[insight.category]],
    step: insight.recommendation ?? FALLBACK_STEP,
    needsExpert: insight.severity === "critical",
  };
}

/** Group items by area, preserving the incoming severity order so the most
 *  urgent area surfaces first and each area keeps its findings together. */
function groupByArea(items: PlanFocusItem[]): PlanAreaGroup[] {
  const order: InsightCategory[] = [];
  const buckets = new Map<InsightCategory, PlanFocusItem[]>();
  for (const item of items) {
    const cat = item.insight.category;
    if (!buckets.has(cat)) {
      buckets.set(cat, []);
      order.push(cat);
    }
    buckets.get(cat)!.push(item);
  }
  return order.map((cat) => ({
    category: cat,
    area: CATEGORY_META[cat],
    dimension: dimensionsById[CATEGORY_DIMENSION[cat]],
    items: buckets.get(cat)!,
  }));
}

export function buildPlan(summary: InsightSummary): DerivedPlan {
  const flagged = summary.insights.filter((i) => i.severity !== "positive");
  const items = flagged.map(toItem); // summary.insights arrives severity-ordered
  const priority = items.filter((i) => i.insight.severity === "critical");
  const actions = items.filter((i) => i.insight.severity !== "critical");
  const wins = summary.insights.filter((i) => i.severity === "positive");

  return {
    items,
    priority,
    actions,
    actionGroups: groupByArea(actions),
    wins,
    critical: summary.critical,
    warning: summary.warning,
    info: flagged.length - summary.critical - summary.warning,
    flagged: flagged.length,
    areaCount: new Set(flagged.map((i) => i.category)).size,
  };
}
