import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DimensionId } from "../data/dimensions";
import {
  computeEffort,
  computeStreak,
  isoDate,
  toDayLog,
  type DayLog,
} from "../data/app";
import { buildDailyTasks } from "../data/taskEngine";
import { useAssessment } from "../assessment/useAssessment";
import { PlanContext, type PlanValue } from "./planContextValue";

/* ───────────────────────────────────────────────────────────────────────────
   Shared plan state. Lifting task completion out of the Plan screen lets the
   work an employee does flow back into the Home preview and — the point of this
   loop — into the Report, which recognises effort per dimension.

   The checklist is generated each day from the employee's own results (see
   taskEngine.ts): weakest dimensions first, rotating through a task library so
   the habits change day to day. Everything the "journey impact" shows (streak,
   totals, per-dimension effort) derives from a persisted day-by-day activity
   log: today's toggles live in `cura-plan-day` stamped with their date and
   dimension; when a new day starts, the finished day is folded into
   `cura-plan-log` and the checklist regenerates. The history starts empty and
   only ever grows from real activity — nothing on screen is a seeded figure.
   ─────────────────────────────────────────────────────────────────────────── */

const DAY_KEY = "cura-plan-day";
const HISTORY_KEY = "cura-plan-log";
/** Pre-engine storage (static checklist + a seeded demo week) — cleared once. */
const LEGACY_KEYS = ["cura-plan-tasks", "cura-plan-history"];

interface StoredDay {
  date: string;
  /** Snapshot of the day's checklist — enough to fold it into the log later,
   *  even after the generated task set has moved on. */
  tasks: { id: string; dimension: DimensionId; done: boolean }[];
}

interface PlanState {
  history: DayLog[];
  /** Today's toggles by task id. */
  doneById: Record<string, boolean>;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore unavailable storage */
  }
}

/** Restore today's toggles; when the stored day has passed, fold its snapshot
 *  into the history and start the day fresh. */
function readState(today: string): PlanState {
  try {
    for (const key of LEGACY_KEYS) localStorage.removeItem(key);
  } catch {
    /* ignore unavailable storage */
  }

  const history = readJson<DayLog[]>(HISTORY_KEY) ?? [];
  const stored = readJson<StoredDay>(DAY_KEY);
  if (!stored || !Array.isArray(stored.tasks)) return { history, doneById: {} };

  if (stored.date === today) {
    return {
      history,
      doneById: Object.fromEntries(stored.tasks.map((t) => [t.id, t.done])),
    };
  }

  // A new day: archive the finished one (if anything was done), reset toggles.
  const log = toDayLog(stored.date, stored.tasks);
  const nextHistory = log ? [...history.filter((d) => d.date !== log.date), log] : history;
  if (log) writeJson(HISTORY_KEY, nextHistory);
  return { history: nextHistory, doneById: {} };
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const { results } = useAssessment();
  const today = isoDate();
  const [{ history, doneById }, setState] = useState(() => readState(today));

  // Today's checklist, generated from the employee's own results and overlaid
  // with the persisted toggles. Regenerates live as more dimensions complete.
  const tasks = useMemo(
    () =>
      buildDailyTasks(results, today).map((t) => ({
        ...t,
        done: doneById[t.id] ?? false,
      })),
    [results, today, doneById],
  );

  // Keep the stored day in sync with the current checklist, so a passed day
  // folds into the log from exactly what was on screen.
  useEffect(() => {
    if (tasks.length === 0) return;
    const snapshot: StoredDay = {
      date: today,
      tasks: tasks.map(({ id, dimension, done }) => ({ id, dimension, done })),
    };
    writeJson(DAY_KEY, snapshot);
  }, [tasks, today]);

  const toggle = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      doneById: { ...prev.doneById, [id]: !prev.doneById[id] },
    }));
  }, []);

  const todayDone = tasks.filter((t) => t.done).length;
  const todayTotal = tasks.length;
  const effort = computeEffort(history, tasks);

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
    streakDays: computeStreak(history, todayDone),
    effort,
    activeDimensions,
    totalCompleted,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
