import { useCallback, useState, type ReactNode } from "react";
import type { DimensionId } from "../data/dimensions";
import {
  computeEffort,
  journeyWeeks,
  streakDays,
  todayTasks,
  type PlanTask,
} from "../data/app";
import { PlanContext, type PlanValue } from "./planContextValue";

/* ───────────────────────────────────────────────────────────────────────────
   Shared plan state. Lifting task completion out of the Plan screen lets the
   work an employee does flow back into the Home preview and — the point of this
   loop — into the Report, which recognises effort per dimension.
   Persisted so toggles survive navigation and reloads.
   ─────────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = "cura-plan-tasks";

function readTasks(): PlanTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const map = JSON.parse(raw) as Record<string, boolean>;
      return todayTasks.map((t) => (t.id in map ? { ...t, done: map[t.id] } : t));
    }
  } catch {
    /* ignore unavailable storage */
  }
  return todayTasks;
}

function persist(tasks: PlanTask[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Object.fromEntries(tasks.map((t) => [t.id, t.done]))),
    );
  } catch {
    /* ignore unavailable storage */
  }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<PlanTask[]>(readTasks);

  const toggle = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      persist(next);
      return next;
    });
  }, []);

  const todayDone = tasks.filter((t) => t.done).length;
  const todayTotal = tasks.length;
  const effort = computeEffort(tasks);

  const activeDimensions = (Object.keys(effort) as DimensionId[])
    .filter((id) => (effort[id]?.done ?? 0) > 0)
    .sort((a, b) => (effort[b]?.done ?? 0) - (effort[a]?.done ?? 0));

  const totalCompleted = Object.values(effort).reduce((n, e) => n + (e?.done ?? 0), 0);

  const value: PlanValue = {
    tasks,
    toggle,
    todayDone,
    todayTotal,
    todayPct: todayTotal ? Math.round((todayDone / todayTotal) * 100) : 0,
    streakDays,
    journeyWeeks,
    effort,
    activeDimensions,
    totalCompleted,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
