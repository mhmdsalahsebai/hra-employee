import type { DimensionId } from "./dimensions";
import type { PlanTask, TaskKind } from "./app";
import type { Insight } from "./insights";
import { CATEGORY_DIMENSION } from "./planEngine";

/* ───────────────────────────────────────────────────────────────────────────
   The daily-task engine. The plan's checklist is generated, not authored:
   every day the engine reads the employee's own report findings first — a
   short-sleep flag produces sleep tasks, a sitting flag produces movement
   breaks — and rotates each finding through its own micro-action library so
   the habits change day to day. Dimension-level habits (weakest area first)
   fill the remaining slots. Nothing is pre-checked and nothing appears before
   the assessment produces results — the journey's impact only ever shows work
   the employee actually did.
   ─────────────────────────────────────────────────────────────────────────── */

interface TaskTemplate {
  title: string;
  kind: TaskKind;
  durationMin: number;
}

/** Same-day micro-actions per report finding (insight id → library). Each is
 *  the smallest real step toward that specific finding, phrased to be checked
 *  off today. Keep each list ≥ 2 so consecutive days don't repeat. */
const FINDING_TASKS: Record<string, TaskTemplate[]> = {
  /* Body & lifestyle */
  bmi: [
    { title: "امشِ 30 دقيقة اليوم — ولو على دفعتين", kind: "exercise", durationMin: 30 },
    { title: "طبّق قاعدة الطبق: نصف وجبتك الرئيسية خضار", kind: "reflection", durationMin: 5 },
    { title: "استبدل مشروبًا سكريًا واحدًا بالماء اليوم", kind: "reflection", durationMin: 2 },
  ],
  waist: [
    { title: "10 دقائق مشي سريع بعد وجبتك الرئيسية", kind: "exercise", durationMin: 10 },
    { title: "استبدل النشويات البيضاء بحبوب كاملة في وجبة واحدة", kind: "reflection", durationMin: 5 },
  ],
  sleep: [
    { title: "ثبّت موعد نومك الليلة واضبط منبّه استعداد قبله بساعة", kind: "reflection", durationMin: 5 },
    { title: "أبعد الهاتف عن غرفة النوم الليلة", kind: "reflection", durationMin: 2 },
    { title: "لا كافيين بعد الساعة 3 عصرًا اليوم", kind: "reflection", durationMin: 2 },
    { title: "خفّف الإضاءة والشاشات قبل نومك بساعة", kind: "reflection", durationMin: 5 },
  ],
  smoking: [
    { title: "أجّل سيجارتك الأولى ساعة كاملة عن موعدها المعتاد", kind: "reflection", durationMin: 5 },
    { title: "حدّد تاريخ إقلاعك واكتبه في مكان تراه يوميًا", kind: "reflection", durationMin: 5 },
    { title: "سجّل كل سيجارة اليوم: متى، وما الموقف الذي سبقها", kind: "reflection", durationMin: 5 },
  ],
  inactivity: [
    { title: "امشِ 10 دقائق في أي وقت من اليوم", kind: "exercise", durationMin: 10 },
    { title: "اصعد الدرج بدل المصعد في كل مرة اليوم", kind: "exercise", durationMin: 5 },
    { title: "5 تمارين قرفصاء على كرسي × 3 مرات خلال اليوم", kind: "exercise", durationMin: 6 },
  ],
  sitting: [
    { title: "قف وتحرّك دقيقتين كل نصف ساعة عمل", kind: "exercise", durationMin: 10 },
    { title: "حوّل مكالمة واحدة اليوم إلى مكالمة مشي", kind: "exercise", durationMin: 10 },
    { title: "قف أثناء اجتماعك أو مكالمتك القادمة", kind: "exercise", durationMin: 5 },
  ],
  nutrition: [
    { title: "أضف حصة خضار أو فاكهة إلى وجبتك القادمة", kind: "reflection", durationMin: 3 },
    { title: "اشرب 8 أكواب ماء موزّعة على اليوم", kind: "reflection", durationMin: 2 },
    { title: "تذوّق طعامك قبل إضافة الملح اليوم", kind: "reflection", durationMin: 2 },
  ],
  /* Screenings & chronic */
  "screening-gap": [
    { title: "احجز موعد فحص شامل: ضغط وسكر وكوليسترول", kind: "session", durationMin: 10 },
    { title: "حدّد أقرب مركز رعاية أولية لك واحفظ رقمه", kind: "reading", durationMin: 5 },
  ],
  "screening-single": [
    { title: "أضف الفحص الناقص إلى تقويمك واحجز موعدًا له", kind: "session", durationMin: 8 },
    { title: "اسأل عن باقة الفحص الوقائي في أقرب مركز صحي", kind: "reading", durationMin: 5 },
  ],
  "bp-never": [
    { title: "قس ضغط دمك اليوم — في صيدلية أو بجهاز منزلي", kind: "session", durationMin: 10 },
    { title: "سجّل قراءة ضغطك وتاريخها في هاتفك", kind: "reflection", durationMin: 3 },
  ],
  "chronic-condition": [
    { title: "تأكد من موعد متابعتك القادم — واحجزه إن لم يكن محجوزًا", kind: "session", durationMin: 8 },
    { title: "سجّل قياساتك المنزلية اليوم والتزم بجرعات علاجك", kind: "reflection", durationMin: 5 },
  ],
  "chronic-pain": [
    { title: "سجّل شدة ألمك اليوم ومتى يزداد", kind: "reflection", durationMin: 5 },
    { title: "5 دقائق إطالة لطيفة للمنطقة المتيبسة", kind: "exercise", durationMin: 5 },
  ],
  /* Mental health */
  anxiety: [
    { title: "تمرين تنفّس 4-7-8 — ثلاث مرات خلال اليوم", kind: "meditation", durationMin: 5 },
    { title: "تمرين التأريض 5-4-3-2-1 عند أول موجة قلق", kind: "meditation", durationMin: 5 },
    { title: "دوّن ما يقلقك وحدّد: ما الذي أملك تغييره فيه؟", kind: "reflection", durationMin: 7 },
  ],
  stress: [
    { title: "استراحة 5 دقائق بعيدًا عن الشاشة منتصف اليوم", kind: "meditation", durationMin: 5 },
    { title: "10 أنفاس بزفير أطول من الشهيق عند أول توتر", kind: "meditation", durationMin: 3 },
    { title: "امشِ 10 دقائق لتفريغ توتر اليوم", kind: "exercise", durationMin: 10 },
  ],
  depression: [
    { title: "نفّذ نشاطًا واحدًا كان يسعدك — ولو 15 دقيقة", kind: "reflection", durationMin: 15 },
    { title: "تواصل مع شخص قريب اليوم: رسالة أو اتصال", kind: "session", durationMin: 10 },
    { title: "اخرج لضوء النهار 10 دقائق صباحًا", kind: "exercise", durationMin: 10 },
  ],
  "emotional-regulation": [
    { title: "عند أول انفعال اليوم: توقّف، تنفّس، وسمِّ شعورك", kind: "meditation", durationMin: 3 },
    { title: "دوّن موقفًا أثارك وكيف تودّ الرد عليه غدًا", kind: "reflection", durationMin: 7 },
  ],
  /* Burnout */
  burnout: [
    { title: "حدّد ساعة انتهاء عملك اليوم والتزم بها", kind: "reflection", durationMin: 5 },
    { title: "خذ استراحة غداء كاملة بعيدًا عن مكتبك", kind: "reflection", durationMin: 20 },
    { title: "اكتب أكبر 3 مصادر استنزاف في يومك", kind: "reflection", durationMin: 8 },
  ],
  "burnout-ee": [
    { title: "فاصل تعافٍ 5 دقائق بين المهام الثقيلة اليوم", kind: "meditation", durationMin: 5 },
    { title: "أغلق بريد العمل بعد ساعة محددة الليلة", kind: "reflection", durationMin: 3 },
    { title: "اكتب ما أنهكك اليوم — وما الذي يمكن تفويضه", kind: "reflection", durationMin: 8 },
  ],
  "burnout-mild": [
    { title: "اختم يومك بكتابة أهم 3 مهام للغد ثم أغلق العمل", kind: "reflection", durationMin: 8 },
    { title: "خذ استراحتين قصيرتين بعيدًا عن الشاشة اليوم", kind: "meditation", durationMin: 10 },
  ],
  /* Financial */
  "financial-stress": [
    { title: "سجّل كل مصروف اليوم في ملاحظة واحدة", kind: "reflection", durationMin: 5 },
    { title: "راجع أكبر 3 بنود إنفاق هذا الشهر وحدّد بندًا للخفض", kind: "reflection", durationMin: 10 },
    { title: "ألغِ اشتراكًا واحدًا لا تستخدمه", kind: "reflection", durationMin: 5 },
  ],
  "financial-cushion": [
    { title: "فعّل تحويلًا تلقائيًا صغيرًا لحساب الطوارئ يوم الراتب", kind: "reflection", durationMin: 8 },
    { title: "افتح حسابًا منفصلًا لصندوق الطوارئ", kind: "reflection", durationMin: 10 },
  ],
  "financial-obligations": [
    { title: "اكتب التزاماتك الشهرية كاملة بالأرقام", kind: "reflection", durationMin: 10 },
    { title: "حدّد بند إنفاق واحدًا قابلًا للخفض فورًا", kind: "reflection", durationMin: 7 },
  ],
  retirement: [
    { title: "فعّل اقتطاعًا شهريًا للادخار طويل الأجل — ولو 5٪", kind: "reflection", durationMin: 10 },
    { title: "اقرأ عن خيارات الادخار التقاعدي المتاحة لك", kind: "reading", durationMin: 10 },
  ],
  "financial-planning": [
    { title: "اكتب هدفًا ماليًا واحدًا بمبلغ وتاريخ واضحين", kind: "reflection", durationMin: 7 },
    { title: "سجّل مصروفات اليوم قبل النوم", kind: "reflection", durationMin: 5 },
  ],
  /* Workplace & engagement */
  bullying: [
    { title: "وثّق كتابيًا آخر موقف مضايقة: التاريخ ومن حضر", kind: "reflection", durationMin: 10 },
    { title: "اطّلع على قناة الإبلاغ الآمنة في منظمتك", kind: "reading", durationMin: 8 },
  ],
  turnover: [
    { title: "اكتب الأسباب الثلاثة الأهم وراء رغبتك في المغادرة", kind: "reflection", durationMin: 10 },
    { title: "حدّد ما الذي لو تغيّر لبقيت — ورتّب محادثته مع مديرك", kind: "reflection", durationMin: 10 },
  ],
  recognition: [
    { title: "اطلب لقاءً دوريًا قصيرًا مع مديرك", kind: "session", durationMin: 10 },
    { title: "شارك إنجاز هذا الأسبوع مع مديرك أو فريقك", kind: "session", durationMin: 8 },
  ],
  "psych-safety": [
    { title: "شارك رأيًا واحدًا في اجتماع اليوم — ولو صغيرًا", kind: "session", durationMin: 5 },
    { title: "اكتب فكرة تحسين وشاركها مع زميل تثق به", kind: "reflection", durationMin: 8 },
  ],
  "engagement-low": [
    { title: "دوّن أكثر مهمة استنزفتك وأكثر مهمة أرضتك اليوم", kind: "reflection", durationMin: 7 },
    { title: "ابدأ يومك بالمهمة التي تستمتع بها أكثر", kind: "reflection", durationMin: 5 },
  ],
  "engagement-meaning": [
    { title: "اكتب من يستفيد من عملك اليوم — وكيف", kind: "reflection", durationMin: 7 },
    { title: "اربط مهمتك الرئيسية اليوم بأثرها النهائي", kind: "reflection", durationMin: 5 },
  ],
  "engagement-growth": [
    { title: "حدّد مهارة واحدة تريد تطويرها هذا الشهر", kind: "reflection", durationMin: 8 },
    { title: "خصّص 15 دقيقة تعلّم في مجالك اليوم", kind: "reading", durationMin: 15 },
  ],
  "engagement-belonging": [
    { title: "ابدأ حديثًا قصيرًا غير رسمي مع زميل اليوم", kind: "session", durationMin: 5 },
    { title: "قدّم شكرًا محددًا لزميل ساعدك", kind: "reflection", durationMin: 3 },
  ],
};

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

/** Today's checklist size, and how much of it findings may claim. */
const TASKS_PER_DAY = 4;
const FINDING_SLOTS = 3;

function daysSinceEpoch(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Parenthetical qualifiers make finding titles too long for a task chip. */
const shortTitle = (title: string) => title.replace(/\(.*?\)/g, "").trim();

/** Tasks aimed at the employee's own report findings, most urgent first.
 *  Each finding rotates through its micro-action library by date, and the
 *  task carries the finding it targets so the checklist explains itself. */
function findingTasks(insights: Insight[], day: number): PlanTask[] {
  const tasks: PlanTask[] = [];
  const seen = new Set<string>();
  for (const insight of insights) {
    if (tasks.length >= FINDING_SLOTS) break;
    if (insight.severity === "positive" || seen.has(insight.id)) continue;
    const library = FINDING_TASKS[insight.id];
    if (!library) continue;
    seen.add(insight.id);
    const index = day % library.length;
    const template = library[index];
    tasks.push({
      id: `f-${insight.id}-${index}`,
      title: template.title,
      dimension: CATEGORY_DIMENSION[insight.category],
      kind: template.kind,
      durationMin: template.durationMin,
      done: false,
      reason: shortTitle(insight.title),
    });
  }
  return tasks;
}

/** Build today's checklist from the employee's own results. Report findings
 *  come first — each urgent finding contributes the micro-action that targets
 *  it. Generic habits for the weakest dimensions fill the remaining slots.
 *  The date rotates every library so tomorrow's list differs from today's,
 *  and ids are stable within a day so toggles persist across reloads. */
export function buildDailyTasks(
  targets: TaskTarget[],
  date: string,
  insights: Insight[] = [],
): PlanTask[] {
  const ready = targets.filter((t) => t.complete);
  if (ready.length === 0) return [];

  const day = daysSinceEpoch(date);
  const tasks = findingTasks(insights, day);

  // Fill the remaining slots with weakest-dimension habits (the weakest gets
  // a double when findings left the checklist mostly empty).
  const picks = [...ready].sort((a, b) => a.score - b.score);
  const remaining = TASKS_PER_DAY - tasks.length;
  picks.forEach((target, rank) => {
    const library = TASK_LIBRARY[target.slug];
    const count = rank === 0 && remaining >= 3 ? 2 : 1;
    for (let k = 0; k < count; k++) {
      if (tasks.length >= TASKS_PER_DAY) return;
      const index = (day + k) % library.length;
      const template = library[index];
      const id = `${target.slug}-${index}`;
      if (tasks.some((t) => t.id === id)) continue;
      tasks.push({
        id,
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
