import type { DimensionId } from "./dimensions";

/* Mock user / organization context. In production this comes from the session
   created when the employee's organization activates their subscription. */

export interface User {
  name: string;
  firstName: string;
  avatar: string;
  org: string;
  role: string;
  /** Overall wellbeing score (0–100). */
  overallScore: number;
  assessmentCompleted: boolean;
  lastAssessment: string;
}

export const currentUser: User = {
  name: "مالك محمد",
  firstName: "مالك",
  avatar: "/images/malik-avatar.webp",
  org: "شركة نسيج",
  role: "أخصائية موارد بشرية",
  overallScore: 72,
  assessmentCompleted: true,
  lastAssessment: "قبل 6 أيام",
};

/* ── Deliverable 3: the personalized plan / journey ───────────────────────── */

export type TaskKind =
  | "meditation"
  | "reading"
  | "exercise"
  | "reflection"
  | "session";

export interface PlanTask {
  id: string;
  title: string;
  dimension: DimensionId;
  kind: TaskKind;
  durationMin: number;
  done: boolean;
}

export const todayTasks: PlanTask[] = [
  {
    id: "t1",
    title: "تمرين تنفّس لتهدئة التوتر",
    dimension: "psycho",
    kind: "meditation",
    durationMin: 5,
    done: true,
  },
  {
    id: "t2",
    title: "مشي خفيف لمدة 10 دقائق",
    dimension: "physical",
    kind: "exercise",
    durationMin: 10,
    done: false,
  },
  {
    id: "t3",
    title: "اكتب ثلاثة أشياء أنت ممتن لها اليوم",
    dimension: "psycho",
    kind: "reflection",
    durationMin: 5,
    done: false,
  },
  {
    id: "t4",
    title: "حدّد حدًّا واضحًا لانتهاء يوم عملك",
    dimension: "professional",
    kind: "reading",
    durationMin: 8,
    done: false,
  },
];

/* ── Plan → report feedback: effort the employee has invested per dimension ─── */

export interface DimensionEffort {
  /** Tasks completed toward this dimension (journey + today). */
  done: number;
  /** Tasks planned toward this dimension. */
  total: number;
}

/** One past day of plan activity — the unit the journey's impact is built from.
 *  Days are appended as they end, so streaks, totals and per-dimension effort
 *  all derive from what the employee actually did. */
export interface DayLog {
  /** Local calendar date, "YYYY-MM-DD". */
  date: string;
  byDimension: Partial<Record<DimensionId, DimensionEffort>>;
}

/** Local (not UTC) calendar date — a task done at 11pm belongs to that day. */
export function isoDate(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function shiftDate(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/** Roll the logged history and today's live tasks into per-dimension effort, so
 *  the report can recognise the work an employee is already putting in. Only
 *  dimensions with activity appear. */
export function computeEffort(
  history: DayLog[],
  tasks: PlanTask[],
): Partial<Record<DimensionId, DimensionEffort>> {
  const acc: Partial<Record<DimensionId, DimensionEffort>> = {};
  const bump = (id: DimensionId, done: number, total: number) => {
    const cur = acc[id] ?? { done: 0, total: 0 };
    acc[id] = { done: cur.done + done, total: cur.total + total };
  };
  for (const day of history)
    for (const [id, e] of Object.entries(day.byDimension))
      bump(id as DimensionId, e.done, e.total);
  for (const t of tasks) bump(t.dimension, t.done ? 1 : 0, 1);
  return acc;
}

/** Consecutive active days ending today (or yesterday — today isn't "broken"
 *  until it ends without activity). History holds active days only. */
export function computeStreak(history: DayLog[], todayDone: number): number {
  const active = new Set(history.map((d) => d.date));
  const today = new Date();
  let streak = todayDone > 0 ? 1 : 0;
  for (let back = 1; active.has(isoDate(shiftDate(today, -back))); back++) streak++;
  return streak;
}

/** Fold a finished day's tasks into a log entry — or null if nothing was done,
 *  so empty days never pad the history (and correctly break the streak). */
export function toDayLog(date: string, tasks: PlanTask[]): DayLog | null {
  if (!tasks.some((t) => t.done)) return null;
  const byDimension: DayLog["byDimension"] = {};
  for (const t of tasks) {
    const cur = byDimension[t.dimension] ?? { done: 0, total: 0 };
    byDimension[t.dimension] = { done: cur.done + (t.done ? 1 : 0), total: cur.total + 1 };
  }
  return { date, byDimension };
}

/** Demo seed: the week of activity this mock employee already has behind them
 *  (assessment was 6 days ago). Written once to storage on first run — from
 *  then on the history is purely what the user actually does. */
export function seedHistory(): DayLog[] {
  const today = new Date();
  const days: [number, DayLog["byDimension"]][] = [
    [-6, { psycho: { done: 2, total: 2 } }],
    [-5, { psycho: { done: 2, total: 2 } }],
    [-4, { psycho: { done: 2, total: 2 }, professional: { done: 1, total: 2 } }],
    [-3, { professional: { done: 2, total: 2 } }],
    [-2, { professional: { done: 1, total: 2 }, physical: { done: 1, total: 2 } }],
    [-1, { physical: { done: 1, total: 3 } }],
  ];
  return days.map(([offset, byDimension]) => ({
    date: isoDate(shiftDate(today, offset)),
    byDimension,
  }));
}

/* ── Deliverable 2: free expert consultations ─────────────────────────────── */

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialty: DimensionId;
  rating: number;
  sessions: number;
  nextSlots: string[];
  /** Headshot for the avatar — makes the consultation feel human and inviting. */
  avatar: string;
}

export const experts: Expert[] = [
  {
    id: "e1",
    name: "د. ليان القحطاني",
    title: "أخصائية نفسية إكلينيكية",
    specialty: "psycho",
    rating: 4.9,
    sessions: 320,
    nextSlots: ["اليوم 5:00 م", "اليوم 7:30 م", "غدًا 10:00 ص"],
    avatar:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=256&h=256&fit=crop&crop=faces",
  },
  {
    id: "e2",
    name: "أ. فهد العتيبي",
    title: "مدرب رفاهية وظيفية",
    specialty: "professional",
    rating: 4.8,
    sessions: 210,
    nextSlots: ["غدًا 12:00 م", "غدًا 4:00 م", "الأحد 9:00 ص"],
    avatar:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&h=256&fit=crop&crop=faces",
  },
  {
    id: "e3",
    name: "د. نورة الزهراني",
    title: "استشارية تغذية علاجية",
    specialty: "physical",
    rating: 5.0,
    sessions: 268,
    nextSlots: ["اليوم 6:15 م", "غدًا 11:00 ص", "غدًا 3:30 م"],
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&h=256&fit=crop&crop=faces",
  },
  {
    id: "e4",
    name: "د. سعود المطيري",
    title: "مستشار مالي معتمد",
    specialty: "financial",
    rating: 4.7,
    sessions: 184,
    nextSlots: ["غدًا 1:00 م", "الأحد 10:30 ص", "الأحد 5:00 م"],
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=256&fit=crop&crop=faces",
  },
];

/** A stable doctor headshot for consultations scoped to a program's own expert. */
export const fallbackExpertAvatar =
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=256&h=256&fit=crop&crop=faces";
