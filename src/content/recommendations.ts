import type { DimensionResult } from "../assessment/useAssessment";
import { content, type ContentItem } from "../data/content";
import { dimensions, type DimensionId } from "../data/dimensions";
import type { Insight } from "../data/insights";

export interface RecommendedContent {
  item: ContentItem;
  /** The employee's own report finding this item was picked for — shown on the
   *  card so the recommendation explains itself. Absent on variety fillers. */
  why?: string;
}

export interface ContentRecommendations {
  items: RecommendedContent[];
  reason: string;
  personalized: boolean;
  focusDimension?: DimensionId;
}

function rotated<T>(items: T[], offset: number) {
  if (items.length < 2) return items;
  const start = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function freshFirst(items: ContentItem[], openedIds: Set<string>, offset: number) {
  const fresh = rotated(
    items.filter((item) => !openedIds.has(item.id)),
    offset,
  );
  const opened = rotated(
    items.filter((item) => openedIds.has(item.id)),
    offset,
  );
  return [...fresh, ...opened];
}

/** Strip parenthetical qualifiers so finding titles stay short on chips. */
const shortTitle = (title: string) => title.replace(/\(.*?\)/g, "").trim();

/**
 * Content matched to the employee's actual report findings. Flagged insights
 * arrive severity-ordered; each one claims the best unclaimed item tagged with
 * its id, so the most urgent findings fill the shelf first and every match
 * carries the finding it answers.
 */
function matchFindings(
  flagged: Insight[],
  openedIds: Set<string>,
  rotation: number,
  limit: number,
): RecommendedContent[] {
  const picks: RecommendedContent[] = [];
  flagged.forEach((insight, index) => {
    if (picks.length >= limit) return;
    const candidates = freshFirst(
      content.filter((item) => item.topics?.includes(insight.id)),
      openedIds,
      rotation + index,
    );
    const candidate = candidates.find(
      (item) => !picks.some((pick) => pick.item.id === item.id),
    );
    if (candidate) picks.push({ item: candidate, why: shortTitle(insight.title) });
  });
  return picks;
}

/**
 * Builds the recommendation shelf. The primary signal is the report's own
 * findings: every flagged insight pulls in the content tagged for it, most
 * urgent first. Dimension scores then fill the remaining slots (lowest-scoring
 * areas first) so the shelf stays full and varied, and before any results
 * exist it falls back to a rotating, deliberately diverse mix.
 */
export function buildContentRecommendations({
  results,
  insights = [],
  openedIds,
  rotation,
  limit = dimensions.length,
}: {
  results: DimensionResult[];
  /** The employee's derived report findings, severity-ordered. */
  insights?: Insight[];
  openedIds: string[];
  rotation: number;
  limit?: number;
}): ContentRecommendations {
  const opened = new Set(openedIds);
  const flagged = insights.filter((i) => i.severity !== "positive");
  const completed = results
    .filter((result) => result.complete)
    .sort((a, b) => a.score - b.score);
  const started = results.some((result) => result.answered > 0);

  // 1 — findings claim their matching content, most urgent first.
  const selected = matchFindings(flagged, opened, rotation, limit);

  // 2 — weakest completed dimensions (or a rotating mix) fill what's left.
  const completedOrder = completed.map((result) => result.slug);
  const dimensionOrder = completedOrder.length
    ? completedOrder
    : rotated(
        dimensions.map((dimension) => dimension.id),
        rotation,
      );
  dimensionOrder.forEach((dimension, index) => {
    if (selected.length >= limit) return;
    const candidates = freshFirst(
      content.filter((item) => item.dimension === dimension),
      opened,
      rotation + index,
    );
    const candidate = candidates.find(
      (item) => !selected.some((pick) => pick.item.id === item.id),
    );
    if (candidate) selected.push({ item: candidate });
  });

  if (selected.length < limit) {
    const remaining = freshFirst(
      content.filter((item) => !selected.some((pick) => pick.item.id === item.id)),
      opened,
      rotation,
    );
    selected.push(...remaining.slice(0, limit - selected.length).map((item) => ({ item })));
  }

  const matchedCount = selected.filter((pick) => pick.why).length;
  const topFindings = selected
    .slice(0, 3)
    .map((pick) => pick.why)
    .filter((why): why is string => why !== undefined);

  const focusDimension = completed[0]?.slug;
  const reason = matchedCount > 0
    ? `مختار لملاحظات تقريرك — منها: ${topFindings.join("، و")}`
    : completed.length > 0
      ? `مختار من نتائج ${completed.length.toLocaleString("en-US")} أبعاد مكتملة، ويزداد دقة مع إكمال التقييم`
      : started
        ? "اقتراحات متنوعة الآن، وتزداد دقتها مع اكتمال أبعادك"
        : "بداية متوازنة من موضوعات رفاهية مختلفة";

  return {
    items: selected,
    reason,
    personalized: matchedCount > 0 || completed.length > 0,
    focusDimension,
  };
}
