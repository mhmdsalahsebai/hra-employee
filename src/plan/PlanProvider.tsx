import { useCallback, useState, type ReactNode } from "react";
import type { DimensionId } from "../data/dimensions";
import {
  computeEffort,
  computeStreak,
  isoDate,
  seedHistory,
  toDayLog,
  todayTasks,
  type DayLog,
  type PlanTask,
} from "../data/app";
import { PlanContext, type PlanValue } from "./planContextValue";

/* ───────────────────────────────────────────────────────────────────────────
   Shared plan state. Lifting task completion out of the Plan screen lets the
   work an employee does flow back into the Home preview and — the point of this
   loop — into the Report, which recognises effort per dimension.

   Everything the "journey impact" shows (streak, totals, per-dimension effort)
   derives from a persisted day-by-day activity log: today's toggles live in
   `cura-plan-tasks` stamped with their date; when a new day starts, the finished
   day is folded into `cura-plan-history` and the checklist resets. Nothing on
   screen is a hardcoded figure.
   ─────────────────────────────────────────────────────────────────────────── */

const TASKS_KEY = "cura-plan-tasks";
const HISTORY_KEY = "cura-plan-history";

interface StoredDay {
  date: string;
  done: Record<string, boolean>;
}

function readHistory(): DayLog[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw) as DayLog[];
  } catch {
    /* ignore unavailable storage */
  }
  // First run: seed the mock employee's past week, then persist so the log
  // only ever grows from real activity.
  const seed = seedHistory();
  persistHistory(seed);
  return seed;
}

function persistHistory(history: DayLog[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    /* ignore unavailable storage */
  }
}

/** Today's checklist: restore same-day toggles; when the stored day has passed,
 *  fold it into the history and start the day fresh. */
function readState(): { tasks: PlanTask[]; history: DayLog[] } {
  const history = readHistory();
  const today = isoDate();
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as StoredDay | Record<string, boolean>;
      // Legacy shape (a bare id→done map) predates day stamping — treat as today.
      const day: StoredDay =
        "date" in stored && typeof stored.date === "string"
          ? (stored as StoredDay)
          : { date: today, done: stored as Record<string, boolean> };

      const withDone = todayTasks.map((t) =>
        t.id in day.done ? { ...t, done: day.done[t.id] } : t,
      );
      if (day.date === today) return { tasks: withDone, history };

      // A new day: archive the finished one (if anything was done), reset tasks.
      const log = toDayLog(day.date, withDone);
      const nextHistory = log ? [...history.filter((d) => d.date !== log.date), log] : history;
      if (log) persistHistory(nextHistory);
      const fresh = todayTasks.map((t) => ({ ...t, done: false }));
      persistTasks(fresh);
      return { tasks: fresh, history: nextHistory };
    }
  } catch {
    /* ignore unavailable storage */
  }
  return { tasks: todayTasks, history };
}

function persistTasks(tasks: PlanTask[]) {
  try {
    const day: StoredDay = {
      date: isoDate(),
      done: Object.fromEntries(tasks.map((t) => [t.id, t.done])),
    };
    localStorage.setItem(TASKS_KEY, JSON.stringify(day));
  } catch {
    /* ignore unavailable storage */
  }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [{ tasks, history }, setState] = useState(readState);

  const toggle = useCallback((id: string) => {
    setState((prev) => {
      const tasks = prev.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      persistTasks(tasks);
      return { ...prev, tasks };
    });
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
