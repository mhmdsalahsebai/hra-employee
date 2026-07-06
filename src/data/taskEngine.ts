import type { DimensionId } from "./dimensions";
import type { PlanTask, TaskKind } from "./app";

/* ───────────────────────────────────────────────────────────────────────────
   The daily-task engine. The plan's checklist is generated, not authored:
   every day the engine looks at the employee's own results, targets the
   dimensions that most need work (weakest first), and rotates through a
   per-dimension library so the habits change day to day. Nothing is
   pre-checked and nothing appears before the assessment produces results —
   the journey's impact only ever shows work the employee actually did.
   ─────────────────────────────────────────────────────────────────────────── */

interface TaskTemplate {
  title: string;
  kind: TaskKind;
  durationMin: number;
}

/** Small, same-day-doable habits per dimension. Order matters only for the
 *  daily rotation; keep each list ≥ 3 so consecutive days don't repeat. */
const TASK_LIBRARY: Record<DimensionId, TaskTemplate[]> = {
  physical: [
    { title: "مشي خفيف لمدة 10 دقائق", kind: "exercise", durationMin: 10 },
    { title: "تمارين إطالة للرقبة والظهر", kind: "exercise", durationMin: 7 },
    { title: "اصعد الدرج بدل المصعد اليوم", kind: "exercise", durationMin: 5 },
    { title: "جهّز سريرك مبكرًا ونم قبل الساعة 11", kind: "reflection", durationMin: 5 },
    { title: "مشي قصير بعد وجبة الغداء", kind: "exercise", durationMin: 10 },
  ],
  psycho: [
    { title: "تمرين تنفّس لتهدئة التوتر", kind: "meditation", durationMin: 5 },
    { title: "اكتب ثلاثة أشياء أنت ممتن لها اليوم", kind: "reflection", durationMin: 5 },
    { title: "تأمل موجّه قصير قبل النوم", kind: "meditation", durationMin: 10 },
    { title: "دوّن ما يشغل بالك في ورقة ثم أغلقها", kind: "reflection", durationMin: 7 },
    { title: "ابتعد عن الشاشات ساعة قبل النوم", kind: "reflection", durationMin: 5 },
  ],
  financial: [
    { title: "سجّل مصروفات اليوم في ملاحظة واحدة", kind: "reflection", durationMin: 5 },
    { title: "اقرأ عن قاعدة 50/30/20 في الميزانية", kind: "reading", durationMin: 8 },
    { title: "راجع اشتراكاتك الشهرية وألغِ ما لا تستخدمه", kind: "reflection", durationMin: 10 },
    { title: "حوّل مبلغًا صغيرًا لحساب الادخار الآن", kind: "reflection", durationMin: 3 },
  ],
  intellectual: [
    { title: "اقرأ 10 صفحات من كتاب تحبه", kind: "reading", durationMin: 15 },
    { title: "استمع لحلقة بودكاست في موضوع جديد", kind: "reading", durationMin: 15 },
    { title: "تعلّم مهارة صغيرة من فيديو قصير", kind: "reading", durationMin: 10 },
    { title: "اكتب فكرة جديدة خطرت لك اليوم", kind: "reflection", durationMin: 5 },
  ],
  community: [
    { title: "قدّم مساعدة صغيرة لجار أو زميل", kind: "reflection", durationMin: 10 },
    { title: "ابحث عن فعالية مجتمعية هذا الأسبوع وسجّل فيها", kind: "reading", durationMin: 8 },
    { title: "شارك في نشاط تطوعي قريب منك", kind: "session", durationMin: 15 },
  ],
  social: [
    { title: "اتصل بصديق لم تكلمه منذ فترة", kind: "session", durationMin: 10 },
    { title: "تناول وجبة اليوم مع شخص تحبه دون هاتف", kind: "reflection", durationMin: 15 },
    { title: "أرسل رسالة تقدير لشخص يستحقها", kind: "reflection", durationMin: 5 },
  ],
  belonging: [
    { title: "شارك زميلًا اهتمامًا مشتركًا بينكما", kind: "session", durationMin: 10 },
    { title: "اكتب ما الذي يشعرك بالانتماء في محيطك", kind: "reflection", durationMin: 7 },
    { title: "انضم لمجموعة اهتمام داخل العمل أو خارجه", kind: "reading", durationMin: 10 },
  ],
  professional: [
    { title: "حدّد حدًّا واضحًا لانتهاء يوم عملك", kind: "reflection", durationMin: 5 },
    { title: "خذ استراحة 5 دقائق بعيدًا عن الشاشة منتصف اليوم", kind: "meditation", durationMin: 5 },
    { title: "رتّب أهم 3 مهام للغد قبل إغلاق يومك", kind: "reflection", durationMin: 8 },
    { title: "جرّب العمل بفترات تركيز قصيرة في مهمة واحدة", kind: "reading", durationMin: 10 },
  ],
  workplace: [
    { title: "ناقش مع مديرك أولوية واحدة تحتاج توضيحًا", kind: "session", durationMin: 10 },
    { title: "رتّب مساحة عملك لتقليل المشتتات", kind: "reflection", durationMin: 8 },
    { title: "قدّم شكرًا محددًا لزميل ساعدك", kind: "reflection", durationMin: 5 },
  ],
};

/** The slice of a dimension result the engine needs — kept structural so the
 *  data layer doesn't import from the assessment context. */
export interface TaskTarget {
  slug: DimensionId;
  /** 0–100, high = doing well. */
  score: number;
  complete: boolean;
}

/** How many dimensions each day's checklist covers (weakest gets a double). */
const DIMENSIONS_PER_DAY = 3;

function daysSinceEpoch(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Build today's checklist from the employee's own results: only completed
 *  dimensions qualify, the weakest ones are targeted first (the weakest gets
 *  two tasks), and the date rotates each dimension through its library so
 *  tomorrow's list differs from today's. Ids are stable within a day so
 *  toggles persist across reloads. */
export function buildDailyTasks(targets: TaskTarget[], date: string): PlanTask[] {
  const ready = targets.filter((t) => t.complete);
  if (ready.length === 0) return [];

  const picks = [...ready].sort((a, b) => a.score - b.score).slice(0, DIMENSIONS_PER_DAY);
  const day = daysSinceEpoch(date);

  const tasks: PlanTask[] = [];
  picks.forEach((target, rank) => {
    const library = TASK_LIBRARY[target.slug];
    const count = rank === 0 ? 2 : 1;
    for (let k = 0; k < count; k++) {
      const index = (day + k) % library.length;
      const template = library[index];
      tasks.push({
        id: `${target.slug}-${index}`,
        title: template.title,
        dimension: target.slug,
        kind: template.kind,
        durationMin: template.durationMin,
        done: false,
      });
    }
  });
  return tasks;
}
