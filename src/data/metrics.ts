import { hraData } from "./hra.generated";
import { dimensions, type DimensionId } from "./dimensions";
import { scoreMeta, type ScoreLevel } from "../lib/score";
import type { PersonalInfoAnswers } from "./personalInfo";

/* ───────────────────────────────────────────────────────────────────────────
   The metrics engine. Where insights.ts surfaces *flags* (only when an answer
   crosses a problem threshold), this computes the full panel of named sub-scale
   metrics behind every dimension — always shown, scored 0–100 (higher = better)
   with a level and a short reading. Together they turn the 140 raw answers into
   a complete, measured picture across all nine dimensions, including the four
   trait dimensions (الفكري / المجتمعي / الاجتماعي / الشمولي) that previously
   surfaced no detail at all.

   Every score is derived live from the real answer scales — nothing hardcoded.
   ─────────────────────────────────────────────────────────────────────────── */

type Answers = Record<string, number>;

/** Real raw min/max for each question, read straight from its answer options.
 *  Reversed items are already baked so that, within a dimension, a higher raw
 *  value is the healthier direction — except the two distress dimensions. */
const SCALE: Record<string, { min: number; max: number }> = {};
for (const d of hraData) {
  for (const q of d.questions) {
    const vals = q.answers.map((a) => a.value);
    SCALE[q.slug] = { min: Math.min(...vals), max: Math.max(...vals) };
  }
}

/** Dimensions where a higher raw answer means *more distress* (worse). */
const LOWER_IS_BETTER = new Set<DimensionId>(["professional", "psycho"]);

export interface Metric {
  id: string;
  dimension: DimensionId;
  /** Short Arabic name of the sub-scale. */
  label: string;
  /** 0–100, normalised so higher always means "doing well". */
  score: number;
  level: ScoreLevel;
  /** One-line reading for the computed level. */
  reading: string;
  /** How many of the metric's questions were actually answered. */
  answered: number;
  total: number;
  /** Optional headline figure, e.g. a BMI value. */
  note?: string;
}

interface MetricDef {
  id: string;
  dimension: DimensionId;
  label: string;
  slugs: string[];
  read: Record<ScoreLevel, string>;
}

/* ── Sub-scale slug groups (mirroring the clinical groupings in insights.ts) ── */

const EE = [
  "WorkEmotionalExhaustion", "PatienceExhaustionWorkday", "MorningFatigueWorkday",
  "ColleagueInteractionEffort", "WorkBreakdown", "WorkFrustration", "DifficultWork",
  "DirectContactStress", "ApproachingBurnout",
];
const DP = [
  "DehumanizingColleagues", "IncreasedHardnessPeople", "FearIndifference",
  "IndifferenceColleaguesWellbeing", "BlamedForColleaguesProblems",
];
const PA = [
  "EmpathyColleagues", "HandleColleagueProblems", "PositiveImpactPeople", "VitalityEnergy",
  "CreateComfortableAtmosphere", "RefreshedWithColleagues", "ValuableAccomplishments",
  "EmotionalProblemssCalmly",
];
const DEPRESSION = [
  "SadnessDepressionFree", "LonelinessSadnessFree", "WorthlessnessFeelings",
  "InferiorityFeelings", "FrustrationHelplessness", "HelplessnessPassivity",
];
const ANXIETY = ["AnxietyNotProne", "FearAnxietyFree"];
const STRESS = ["StressNervousness", "EmotionalCollapse"];
const REACTIVITY = ["AngerTreatment", "ShameHiding"];

const ENGAGEMENT_VIGOUR = ["WorkEnthusiasm", "ImmersionFlow", "JobSatisfaction", "MorningMotivation"];
const ENGAGEMENT_MEANING = ["WorkMeaning", "PurposeMission", "ContributionToGoals"];
const ENGAGEMENT_GROWTH = ["GrowthOpportunities", "CareerPathClarity"];
const ENGAGEMENT_BELONGING = ["TeamBelonging", "RespectInclusion", "FeelLikeOutsider", "ProudRecommend"];

/** All questions of a dimension (used for the single-trait dimensions). */
const allOf = (slug: DimensionId): string[] =>
  hraData.find((d) => d.slug === slug)?.questions.map((q) => q.slug) ?? [];

const METRIC_DEFS: MetricDef[] = [
  /* ── المهني — أبعاد الاحتراق الوظيفي الثلاثة ─────────────────────────────── */
  {
    id: "ee", dimension: "professional", label: "الإنهاك العاطفي", slugs: EE,
    read: {
      good: "طاقتك النفسية في العمل متماسكة، ولا تُظهر إجاباتك إنهاكًا متراكمًا.",
      moderate: "تظهر بوادر إرهاق نفسي من العمل تستحق المراقبة وحماية وقت تعافيك.",
      attention: "إنهاك عاطفي مرتفع من العمل — من أبرز بوادر الاحتراق الوظيفي.",
    },
  },
  {
    id: "dp", dimension: "professional", label: "العلاقة مع الزملاء", slugs: DP,
    read: {
      good: "تتعامل مع زملائك بدفء وتواصل صحي دون تبلّد في المشاعر.",
      moderate: "بدأ بعض التباعد أو الجفاء في تعاملك مع الزملاء يظهر تحت الضغط.",
      attention: "تبلّد ملحوظ في المشاعر تجاه الزملاء — أحد أوجه الاحتراق الوظيفي.",
    },
  },
  {
    id: "pa", dimension: "professional", label: "الإحساس بالإنجاز", slugs: PA,
    read: {
      good: "تشعر بقيمة ما تنجزه وأثرك الإيجابي على من حولك في العمل.",
      moderate: "إحساسك بالإنجاز متذبذب — يحتاج لما يعيد إليك معنى أثرك.",
      attention: "تراجع واضح في الشعور بالإنجاز والكفاءة في عملك.",
    },
  },

  /* ── النفسي — مؤشرات الصحة النفسية ───────────────────────────────────────── */
  {
    id: "depression", dimension: "psycho", label: "المزاج والاكتئاب", slugs: DEPRESSION,
    read: {
      good: "مزاجك مستقر ولا تُظهر إجاباتك علامات حزن أو فقدان قيمة متكرّر.",
      moderate: "تظهر علامات مزاج منخفض أحيانًا تستحق الانتباه والرعاية الذاتية.",
      attention: "مؤشرات اكتئاب مرتفعة — استشارة الدعم النفسي خطوة فعّالة.",
    },
  },
  {
    id: "anxiety", dimension: "psycho", label: "القلق والتوجّس", slugs: ANXIETY,
    read: {
      good: "مستوى قلقك منخفض، وتواجه الأمور بهدوء نسبي.",
      moderate: "ميل ملحوظ للقلق والتوجّس قد يستنزف تركيزك وطاقتك.",
      attention: "مستوى قلق مرتفع يستحق تقنيات تهدئة ودعمًا مختصًا.",
    },
  },
  {
    id: "stress", dimension: "psycho", label: "التوتر والعصبية", slugs: STRESS,
    read: {
      good: "تتعامل مع الضغط دون توتر مفرط، وأعصابك متماسكة.",
      moderate: "توتر وعصبية ملحوظان — جسمك في حالة تأهب متكرّر.",
      attention: "توتر وعصبية مرتفعان قد يصلان لحدّ الإرهاق تحت الضغط.",
    },
  },
  {
    id: "reactivity", dimension: "psycho", label: "الاتزان الانفعالي", slugs: REACTIVITY,
    read: {
      good: "تتحكّم في ردود فعلك الانفعالية ولا تنساق خلف الغضب أو الانسحاب.",
      moderate: "حساسية انفعالية ملحوظة قد تُرهق علاقاتك أحيانًا.",
      attention: "شدّة في التفاعل الانفعالي تستحق وقفة تهدئة قبل ردّة الفعل.",
    },
  },

  /* ── أبعاد السمات — درجة واحدة لكل بُعد ───────────────────────────────────── */
  {
    id: "openness", dimension: "intellectual", label: "الانفتاح والفضول الفكري", slugs: allOf("intellectual"),
    read: {
      good: "فضول فكري وانفتاح عالٍ على الأفكار والتجارب الجديدة.",
      moderate: "انفتاح فكري متوسط — مساحة جيدة لاستكشاف المزيد.",
      attention: "ميل للتمسّك بالمألوف وقلة الانفتاح على الجديد.",
    },
  },
  {
    id: "agreeableness", dimension: "community", label: "التعاون والتعاطف", slugs: allOf("community"),
    read: {
      good: "لطف وتعاون وثقة عالية في تعاملك مع الآخرين.",
      moderate: "توازن بين التعاون والحزم في علاقاتك بالآخرين.",
      attention: "ميل للحذر أو الجفاء في التعامل مع الآخرين.",
    },
  },
  {
    id: "extraversion", dimension: "social", label: "الطاقة الاجتماعية", slugs: allOf("social"),
    read: {
      good: "طاقة اجتماعية عالية وراحة في التفاعل مع الناس.",
      moderate: "طاقة اجتماعية متوازنة بين الانبساط والحاجة للخصوصية.",
      attention: "ميل للانطواء وتفضيل العمل والوقت بمفردك.",
    },
  },
  {
    id: "conscientiousness", dimension: "belonging", label: "الانضباط والتنظيم", slugs: allOf("belonging"),
    read: {
      good: "انضباط ذاتي وتنظيم عالٍ والتزام واضح بالمهام والمواعيد.",
      moderate: "تنظيم مقبول مع مساحة لتحسين الانضباط وإدارة الوقت.",
      attention: "ضعف في التنظيم والالتزام يستحق عادات أكثر انضباطًا.",
    },
  },

  /* ── البدني — مؤشرات نمط الحياة ──────────────────────────────────────────── */
  {
    id: "activity", dimension: "physical", label: "النشاط البدني",
    slugs: ["VigorousActivityDays", "ModerateActivityDays", "WalkingDays", "StrengthTrainingDays"],
    read: {
      good: "مستوى نشاطك البدني جيد ويغطي توصيات الحركة الأسبوعية.",
      moderate: "نشاطك البدني متوسط — زيادة بسيطة منتظمة تصنع فرقًا.",
      attention: "مستوى نشاط بدني منخفض يضعف اللياقة ويرفع مخاطر صحية.",
    },
  },
  {
    id: "sitting", dimension: "physical", label: "الجلوس والخمول", slugs: ["SittingHours"],
    read: {
      good: "ساعات جلوسك ضمن الحدود الصحية ولا تُطيل الخمول.",
      moderate: "ساعات جلوس متوسطة — احرص على كسرها بحركة متكرّرة.",
      attention: "جلوس مطوّل يوميًا، وهو عامل خطر مستقل حتى مع الرياضة.",
    },
  },
  {
    id: "sleep", dimension: "physical", label: "جودة النوم", slugs: ["SleepDuration"],
    read: {
      good: "ساعات نومك كافية لتعافٍ جيد وتركيز ومناعة أقوى.",
      moderate: "نومك أقل قليلًا من الموصى به — استهدف 7–8 ساعات.",
      attention: "نوم غير كافٍ يرفع التوتر والوزن ويضعف التركيز.",
    },
  },
  {
    id: "nutrition", dimension: "physical", label: "نمط التغذية",
    slugs: ["FruitVegetableIntake", "FastFoodFrequency", "HighFatFoodPreference", "HighSaltFoodPreference", "WaterIntake"],
    read: {
      good: "عادات غذائية متوازنة في الخضار والماء وتقليل الدهون والملح.",
      moderate: "نمط غذائي مقبول مع عادات قليلة تستحق التحسين.",
      attention: "نمط غذائي يحتاج تحسينًا في عدة عادات تتراكم على صحتك.",
    },
  },
  {
    id: "screening", dimension: "physical", label: "الفحوصات الوقائية",
    slugs: ["BloodPressureCheck", "CholesterolCheck", "BloodSugarCheck"],
    read: {
      good: "تتابع فحوصاتك الوقائية الأساسية بانتظام — خط دفاع مبكر.",
      moderate: "بعض الفحوصات الوقائية تحتاج تحديثًا في زيارتك القادمة.",
      attention: "فحوصات وقائية أساسية لم تُجرَ، والاكتشاف المبكر هو الأهم.",
    },
  },
  {
    id: "tobacco", dimension: "physical", label: "الامتناع عن التدخين", slugs: ["TobaccoUse"],
    read: {
      good: "خلوّك من التبغ يحمي قلبك ورئتيك من أكبر خطر وقائي منفرد.",
      moderate: "تدخين متقطّع — أي خفض يعود بفائدة صحية سريعة.",
      attention: "تدخين منتظم؛ برامج الإقلاع تضاعف فرص نجاحك.",
    },
  },
  {
    id: "fitness", dimension: "physical", label: "اللياقة العامة", slugs: ["FitnessLevel"],
    read: {
      good: "تقيّم لياقتك العامة بمستوى جيد يدعم طاقتك اليومية.",
      moderate: "لياقة عامة متوسطة — قابلة للتحسّن بنشاط منتظم.",
      attention: "مستوى لياقة منخفض يستحق برنامج حركة متدرّجًا.",
    },
  },

  /* ── المالي — مؤشرات الاستقرار المالي ───────────────────────────────────── */
  {
    id: "fin-stress", dimension: "financial", label: "الضغط المالي",
    slugs: ["FinancialStressFeeling", "GeneralFinancialStress", "MonthlyExpenseWorry"],
    read: {
      good: "لا تشعر بضغط مالي يُذكر، ووضعك يمنحك راحة نفسية.",
      moderate: "ضغط مالي متوسط يظهر أحيانًا عند النفقات الشهرية.",
      attention: "ضغط مالي مرتفع من أقوى مسببات القلق واضطراب النوم.",
    },
  },
  {
    id: "fin-emergency", dimension: "financial", label: "الاستعداد للطوارئ",
    slugs: ["EmergencyConfidence", "EmergencyFund"],
    read: {
      good: "لديك شبكة أمان مالية تطمئنك أمام المصاريف المفاجئة.",
      moderate: "استعدادك للطوارئ هشّ بعض الشيء ويستحق التعزيز.",
      attention: "غياب صندوق طوارئ يجعل أي مصروف مفاجئ مصدر قلق.",
    },
  },
  {
    id: "fin-obligations", dimension: "financial", label: "تغطية الالتزامات",
    slugs: ["MeetFinancialObligations", "IncomeExceedsExpenses", "PaycheckToPaycheck"],
    read: {
      good: "دخلك يغطي التزاماتك بمرونة دون عيش من راتب لراتب.",
      moderate: "تغطية التزاماتك ممكنة لكن دون فائض مريح.",
      attention: "نفقاتك تقترب من دخلك أو تتجاوزه — فجوة تتراكم سريعًا.",
    },
  },
  {
    id: "fin-debt", dimension: "financial", label: "عبء الديون", slugs: ["DebtBurden"],
    read: {
      good: "عبء ديونك منخفض ولا يثقل ميزانيتك الشهرية.",
      moderate: "عبء ديون متوسط يستحق خطة سداد واضحة.",
      attention: "عبء ديون مرتفع يضغط على دخلك وراحتك النفسية.",
    },
  },
  {
    id: "fin-retirement", dimension: "financial", label: "الاستعداد للتقاعد", slugs: ["RetirementReadiness"],
    read: {
      good: "تشعر باطمئنان جيد تجاه استعدادك المالي للتقاعد.",
      moderate: "استعدادك للتقاعد متوسط — كل سنة ادخار مبكر تُحدث فرقًا.",
      attention: "ضعف الاستعداد للتقاعد؛ كل تأخير يكلّف أضعافه لاحقًا.",
    },
  },
  {
    id: "fin-planning", dimension: "financial", label: "التخطيط والوعي المالي",
    slugs: ["LongTermGoals", "DailySpendingAwareness", "SeekFinancialAdvice"],
    read: {
      good: "تضع أهدافًا مالية وتتابع إنفاقك — أساس أي استقرار مستدام.",
      moderate: "وعيك المالي مقبول مع مساحة لتخطيط أوضح.",
      attention: "غياب التخطيط ومتابعة الإنفاق يعيق أي تحسّن مالي.",
    },
  },
  {
    id: "fin-satisfaction", dimension: "financial", label: "الرضا المالي", slugs: ["FinancialSatisfaction"],
    read: {
      good: "راضٍ عن وضعك المالي الحالي بشكل عام.",
      moderate: "رضاك المالي متوسط — هناك ما تتمنّى تحسينه.",
      attention: "عدم رضا واضح عن وضعك المالي الحالي.",
    },
  },

  /* ── بيئة العمل — مؤشرات الاندماج والانتماء ──────────────────────────────── */
  {
    id: "wp-vigour", dimension: "workplace", label: "الحماس والاندماج", slugs: ENGAGEMENT_VIGOUR,
    read: {
      good: "حماس واندماج عاليان — مورد يقيك من الإجهاد ويغذّي أداءك.",
      moderate: "اندماجك الوظيفي متوسط مع فتور أحيانًا.",
      attention: "اندماج وظيفي منخفض يسبق غالبًا تراجع الأداء.",
    },
  },
  {
    id: "wp-meaning", dimension: "workplace", label: "معنى العمل", slugs: ENGAGEMENT_MEANING,
    read: {
      good: "ترى معنىً وهدفًا واضحًا في عملك يستحق جهدك.",
      moderate: "إحساسك بمعنى العمل متذبذب ويحتاج لما يقوّيه.",
      attention: "ضعف الإحساس بمعنى العمل — من أقوى مسببات الانفصال الوظيفي.",
    },
  },
  {
    id: "wp-growth", dimension: "workplace", label: "فرص النمو", slugs: ENGAGEMENT_GROWTH,
    read: {
      good: "ترى فرصًا حقيقية للتعلّم ومسارًا واضحًا لتقدّمك.",
      moderate: "فرص نموّك غير واضحة تمامًا وتستحق نقاشًا مع مديرك.",
      attention: "غياب مسار واضح للنمو يستنزف الدافع ويزيد التفكير بالمغادرة.",
    },
  },
  {
    id: "wp-belonging", dimension: "workplace", label: "الانتماء للفريق", slugs: ENGAGEMENT_BELONGING,
    read: {
      good: "تشعر بانتماء أصيل لفريقك وباحترام وإنصاف في التعامل.",
      moderate: "انتماؤك للفريق متوسط مع شعور أحيانًا بالتباعد.",
      attention: "ضعف الشعور بالانتماء يقلّل الأمان النفسي ويُضعف التعاون.",
    },
  },
  {
    id: "wp-recognition", dimension: "workplace", label: "التقدير ودعم المدير",
    slugs: ["EffortRecognized", "FairRecognition", "ManagerSupport"],
    read: {
      good: "تشعر بأن جهدك يُلاحَظ وأن مديرك يدعم تطوّرك.",
      moderate: "التقدير ودعم المدير متوسطان ويستحقان لقاءً دوريًا.",
      attention: "ضعف في التقدير ودعم المدير يستنزف الحماس مع الوقت.",
    },
  },
  {
    id: "wp-safety", dimension: "workplace", label: "الأمان النفسي للتعبير",
    slugs: ["SpeakUpSafety", "IdeaFearHesitation"],
    read: {
      good: "تشعر بالأمان للتعبير عن رأيك وطرح أفكارك بلا تردّد.",
      moderate: "أمانك في التعبير متوسط وقد تتردّد أحيانًا.",
      attention: "تردّد في التعبير عن الرأي يحدّ من مشاركتك وإبداعك.",
    },
  },
  {
    id: "wp-retention", dimension: "workplace", label: "الاستقرار الوظيفي", slugs: ["TurnoverIntention"],
    read: {
      good: "نيّتك للبقاء في منظمتك قوية ومستقرة.",
      moderate: "تفكّر أحيانًا في خيارات أخرى خارج منظمتك.",
      attention: "نية مرتفعة لترك العمل — غالبًا عرَض لأسباب أعمق.",
    },
  },
  {
    id: "wp-respect", dimension: "workplace", label: "بيئة محترمة وآمنة",
    slugs: ["WorkplaceBullying", "BullyingHandling"],
    read: {
      good: "بيئة عملك محترمة وخالية من المضايقة أو التنمّر.",
      moderate: "بعض المواقف غير المريحة تستحق الانتباه والمتابعة.",
      attention: "مؤشرات على تنمّر أو مضايقة في العمل لا ينبغي تجاهلها.",
    },
  },
];

/* ── Helpers ───────────────────────────────────────────────────────────────── */

/** Mean normalised position (0–1, higher raw) over the answered slugs, or null. */
function position(a: Answers, slugs: string[]): { f: number; answered: number } | null {
  let sum = 0;
  let n = 0;
  for (const s of slugs) {
    const v = a[s];
    const sc = SCALE[s];
    if (v === undefined || !sc || sc.max === sc.min) continue;
    sum += (v - sc.min) / (sc.max - sc.min);
    n += 1;
  }
  if (!n) return null;
  return { f: sum / n, answered: n };
}

const ar1 = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** BMI is its own metric: best in the normal range, worse either side. */
function bmiMetric(pi: PersonalInfoAnswers): Metric | null {
  const h = Number(pi.height);
  const w = Number(pi.weight);
  if (!(h > 80 && h < 260 && w > 25 && w < 400)) return null;
  const bmi = w / Math.pow(h / 100, 2);
  let score: number;
  let reading: string;
  if (bmi >= 35) {
    score = 22;
    reading = "سمنة مرتفعة ترفع مخاطر السكري وأمراض القلب — تستحق خطة إنقاص.";
  } else if (bmi >= 30) {
    score = 38;
    reading = "ضمن نطاق السمنة؛ التدخّل الآن أسهل من علاج مضاعفاتها لاحقًا.";
  } else if (bmi >= 25) {
    score = 62;
    reading = "زيادة في الوزن — مرحلة يسهل فيها العودة للنطاق الصحي.";
  } else if (bmi < 18.5) {
    score = 60;
    reading = "أقل من النطاق الصحي؛ قد يصاحبه نقص في الطاقة أو العناصر الغذائية.";
  } else {
    score = 90;
    reading = "وزنك ضمن النطاق الصحي — حافظ على هذا التوازن.";
  }
  return {
    id: "bmi", dimension: "physical", label: "مؤشر كتلة الجسم",
    score, level: scoreMeta(score).level, reading,
    answered: 1, total: 1, note: ar1(bmi),
  };
}

/* ── Public API ────────────────────────────────────────────────────────────── */

/** Every computed sub-scale metric, only for groups that have answers. */
export function computeMetrics(a: Answers, pi: PersonalInfoAnswers = {}): Metric[] {
  const out: Metric[] = [];
  for (const def of METRIC_DEFS) {
    const p = position(a, def.slugs);
    if (!p) continue;
    const f = LOWER_IS_BETTER.has(def.dimension) ? 1 - p.f : p.f;
    const score = Math.round(f * 100);
    const level = scoreMeta(score).level;
    out.push({
      id: def.id, dimension: def.dimension, label: def.label,
      score, level, reading: def.read[level], answered: p.answered, total: def.slugs.length,
    });
  }
  const bmi = bmiMetric(pi);
  if (bmi) out.push(bmi);
  return out;
}

export interface DimensionMetrics {
  dimension: DimensionId;
  metrics: Metric[];
  /** Average score across the dimension's metrics (0–100). */
  average: number;
  /** How many metrics need attention. */
  attention: number;
}

/** Metrics grouped by dimension, in the canonical dimension order. */
export function metricsByDimension(a: Answers, pi: PersonalInfoAnswers = {}): DimensionMetrics[] {
  const all = computeMetrics(a, pi);
  return dimensions
    .map((d) => {
      const metrics = all.filter((m) => m.dimension === d.id);
      const average = metrics.length
        ? Math.round(metrics.reduce((n, m) => n + m.score, 0) / metrics.length)
        : 0;
      const attention = metrics.filter((m) => m.level === "attention").length;
      return { dimension: d.id, metrics, average, attention };
    })
    .filter((g) => g.metrics.length > 0);
}

/** Total number of computed metrics for the given answers. */
export function countMetrics(a: Answers, pi: PersonalInfoAnswers = {}): number {
  return computeMetrics(a, pi).length;
}
