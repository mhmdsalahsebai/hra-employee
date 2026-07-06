import { createContext } from "react";
import type { DimensionId } from "../data/dimensions";
import type { DimensionEffort, PlanTask } from "../data/app";

export interface PlanValue {
  tasks: PlanTask[];
  toggle: (id: string) => void;
  todayDone: number;
  todayTotal: number;
  todayPct: number;
  /** Consecutive active days, derived from the persisted activity log. */
  streakDays: number;
  /** Per-dimension effort (journey cumulative + today's live tasks). */
  effort: Partial<Record<DimensionId, DimensionEffort>>;
  /** Dimensions with at least one completed task, most progress first. */
  activeDimensions: DimensionId[];
  /** Total completed tasks across the whole journey. */
  totalCompleted: number;
}

export const PlanContext = createContext<PlanValue | null>(null);
