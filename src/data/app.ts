import type { DimensionId } from "./dimensions";

/* Mock user / organization context. In production this comes from the session
   created when the employee's organization activates their subscription. */

export interface User {
  name: string;
  firstName: string;
  org: string;
  role: string;
  /** Overall wellbeing score (0–100). */
  overallScore: number;
  assessmentCompleted: boolean;
  lastAssessment: string;
}

export const currentUser: User = {
  name: "سلمى المالكي",
  firstName: "سلمى",
  org: "شركة نسيج",
  role: "أخصائية موارد بشرية",
  overallScore: 72,
  assessmentCompleted: true,
  lastAssessment: "قبل ٦ أيام",
};

/* ── Deliverable 3: the personalized plan / journey ───────────────────────── */

export type TaskKind = "meditation" | "reading" | "exercise" | "reflection" | "session";

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
    title: "مشي خفيف لمدة ١٠ دقائق",
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

export interface PlanWeek {
  label: string;
  focus: DimensionId;
  done: number;
  total: number;
}

export const journeyWeeks: PlanWeek[] = [
  { label: "الأسبوع ١", focus: "psycho", done: 6, total: 6 },
  { label: "الأسبوع ٢", focus: "professional", done: 4, total: 6 },
  { label: "الأسبوع ٣", focus: "physical", done: 1, total: 6 },
  { label: "الأسبوع ٤", focus: "financial", done: 0, total: 6 },
];

export const streakDays = 6;

/* ── Plan → report feedback: effort the employee has invested per dimension ─── */

export interface DimensionEffort {
  /** Tasks completed toward this dimension (journey + today). */
  done: number;
  /** Tasks planned toward this dimension. */
  total: number;
}

/** Roll the 4-week journey and today's live tasks into per-dimension effort, so
 *  the report can recognise the work an employee is already putting in. Only
 *  dimensions with planned activity appear. */
export function computeEffort(tasks: PlanTask[]): Partial<Record<DimensionId, DimensionEffort>> {
  const acc: Partial<Record<DimensionId, DimensionEffort>> = {};
  const bump = (id: DimensionId, done: number, total: number) => {
    const cur = acc[id] ?? { done: 0, total: 0 };
    acc[id] = { done: cur.done + done, total: cur.total + total };
  };
  for (const w of journeyWeeks) bump(w.focus, w.done, w.total);
  for (const t of tasks) bump(t.dimension, t.done ? 1 : 0, 1);
  return acc;
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
}

export const experts: Expert[] = [
  {
    id: "e1",
    name: "د. ليان القحطاني",
    title: "أخصائية نفسية إكلينيكية",
    specialty: "psycho",
    rating: 4.9,
    sessions: 320,
    nextSlots: ["اليوم ٥:٠٠ م", "اليوم ٧:٣٠ م", "غدًا ١٠:٠٠ ص"],
  },
  {
    id: "e2",
    name: "أ. فهد العتيبي",
    title: "مدرب رفاهية وظيفية",
    specialty: "professional",
    rating: 4.8,
    sessions: 210,
    nextSlots: ["غدًا ١٢:٠٠ م", "غدًا ٤:٠٠ م", "الأحد ٩:٠٠ ص"],
  },
];
