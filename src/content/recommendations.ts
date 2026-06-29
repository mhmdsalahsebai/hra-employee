import type { DimensionResult } from "../assessment/useAssessment";
import { content, type ContentItem } from "../data/content";
import { dimensions, dimensionsById, type DimensionId } from "../data/dimensions";

export interface ContentRecommendations {
  items: ContentItem[];
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

/**
 * Builds a small recommendation shelf from actual assessment results.
 * Completed dimensions are safe to score, so the weakest completed result is
 * considered first. Before that point, a rotating cross-dimension mix keeps
 * the shelf useful without pretending that it is personalized.
 */
export function buildContentRecommendations({
  results,
  openedIds,
  rotation,
  limit = 4,
}: {
  results: DimensionResult[];
  openedIds: string[];
  rotation: number;
  limit?: number;
}): ContentRecommendations {
  const opened = new Set(openedIds);
  const completed = results
    .filter((result) => result.complete)
    .sort((a, b) => a.score - b.score);
  const started = results.some((result) => result.answered > 0);
  const completedOrder = completed.map((result) => result.slug);
  const dimensionOrder = completedOrder.length
    ? [completedOrder[0], ...rotated(completedOrder.slice(1), rotation)]
    : rotated(
        dimensions.map((dimension) => dimension.id),
        rotation,
      );
  const selected: ContentItem[] = [];

  // Give each priority dimension one slot before using a second item from the
  // same dimension. This keeps the shelf personal without making it repetitive.
  dimensionOrder.forEach((dimension, index) => {
    if (selected.length >= limit) return;
    const candidates = freshFirst(
      content.filter((item) => item.dimension === dimension),
      opened,
      rotation + index,
    );
    const candidate = candidates.find((item) => !selected.some((pick) => pick.id === item.id));
    if (candidate) selected.push(candidate);
  });

  if (selected.length < limit) {
    const remaining = freshFirst(
      content.filter((item) => !selected.some((pick) => pick.id === item.id)),
      opened,
      rotation,
    );
    selected.push(...remaining.slice(0, limit - selected.length));
  }

  const focusDimension = completed[0]?.slug;
  const reason = focusDimension
    ? `مختار حسب نتائج بُعدك ${dimensionsById[focusDimension].title}`
    : started
      ? "اقتراحات متنوعة الآن، وتزداد دقتها مع اكتمال أبعادك"
      : "بداية متوازنة من موضوعات رفاهية مختلفة";

  return {
    items: selected,
    reason,
    personalized: Boolean(focusDimension),
    focusDimension,
  };
}
