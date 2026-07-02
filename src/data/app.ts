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
  name: "مالك محمد",
  firstName: "مالك",
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

export interface PlanWeek {
  label: string;
  focus: DimensionId;
  done: number;
  total: number;
}

export const journeyWeeks: PlanWeek[] = [
  { label: "الأسبوع 1", focus: "psycho", done: 6, total: 6 },
  { label: "الأسبوع 2", focus: "professional", done: 4, total: 6 },
  { label: "الأسبوع 3", focus: "physical", done: 1, total: 6 },
  { label: "الأسبوع 4", focus: "financial", done: 0, total: 6 },
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
export function computeEffort(
  tasks: PlanTask[],
): Partial<Record<DimensionId, DimensionEffort>> {
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
