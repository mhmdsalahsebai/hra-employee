import { useCallback, useMemo, useState } from "react";
import type { DimensionResult } from "../assessment/useAssessment";
import type { Insight } from "../data/insights";
import { buildContentRecommendations } from "./recommendations";

const STORAGE_KEY = "cura-content-engagement";

interface ContentEngagement {
  openedIds: string[];
  rotation: number;
}

function readEngagement(): ContentEngagement {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { openedIds: [], rotation: 0 };
    const parsed = JSON.parse(raw) as Partial<ContentEngagement>;
    return {
      openedIds: Array.isArray(parsed.openedIds)
        ? parsed.openedIds.filter((id): id is string => typeof id === "string")
        : [],
      rotation: typeof parsed.rotation === "number" ? parsed.rotation : 0,
    };
  } catch {
    return { openedIds: [], rotation: 0 };
  }
}

function persistEngagement(engagement: ContentEngagement) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(engagement));
  } catch {
    /* Recommendations still work for the current session without storage. */
  }
}

/** Records opens that happen outside the home recommendation shelf. */
export function recordContentOpened(id: string) {
  const current = readEngagement();
  if (current.openedIds.includes(id)) return;
  persistEngagement({ ...current, openedIds: [...current.openedIds, id] });
}

function todayRotation() {
  const today = new Date();
  return Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86_400_000);
}

export function useContentRecommendations(results: DimensionResult[], insights?: Insight[]) {
  const [engagement, setEngagement] = useState<ContentEngagement>(readEngagement);
  const rotation = todayRotation() + engagement.rotation;

  const recommendations = useMemo(
    () =>
      buildContentRecommendations({
        results,
        insights,
        openedIds: engagement.openedIds,
        rotation,
      }),
    [engagement.openedIds, results, insights, rotation],
  );

  const markOpened = useCallback((id: string) => {
    setEngagement((current) => {
      if (current.openedIds.includes(id)) return current;
      const next = { ...current, openedIds: [...current.openedIds, id] };
      persistEngagement(next);
      return next;
    });
  }, []);

  const refresh = useCallback(() => {
    setEngagement((current) => {
      const next = { ...current, rotation: current.rotation + 1 };
      persistEngagement(next);
      return next;
    });
  }, []);

  return {
    ...recommendations,
    openedIds: engagement.openedIds,
    markOpened,
    refresh,
  };
}
