import {
  Activity,
  Brain,
  Compass,
  Flame,
  HeartPulse,
  Scale,
  ShieldAlert,
  Stethoscope,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PersonalInfoAnswers } from "./personalInfo";

/* ───────────────────────────────────────────────────────────────────────────
   The detailed-insight engine. Where the dimension scores answer "how are you
   doing in area X?", this reads the *individual* answers (and personal info)
   and surfaces the specific clinical signals an employee actually cares about:
   obesity (BMI), chronic conditions, missed preventive screenings, the three
   burnout sub-scales, depression / anxiety / stress, plus lifestyle, financial
   and workplace red flags.

   Every finding is derived live from the answers — nothing here is hardcoded
   narrative. This is what turns "150 answered questions" into a real report.
   ─────────────────────────────────────────────────────────────────────────── */

export type InsightSeverity = "critical" | "warning" | "info" | "positive";

export type InsightCategory =
  | "body"
  | "chronic"
  | "screening"
  | "burnout"
  | "mental"
  | "lifestyle"
  | "financial"
  | "workplace"
  | "engagement";

export interface Insight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  /** Short, specific finding. */
  title: string;
  /** Plain-language explanation grounded in their own answers. */
  detail: string;
  /** One concrete next step. */
  recommendation?: string;
  /** Optional headline figure, e.g. "٢٩.٤" for a BMI. */
  metric?: string;
  metricLabel?: string;
}

export interface CategoryMeta {
  label: string;
  icon: LucideIcon;
}

export const CATEGORY_META: Record<InsightCategory, CategoryMeta> = {
  body: { label: "الوزن والقياسات", icon: Scale },
  chronic: { label: "الأمراض المزمنة", icon: HeartPulse },
  screening: { label: "الفحوصات الوقائية", icon: Stethoscope },
  burnout: { label: "الاحتراق الوظيفي", icon: Flame },
  mental: { label: "الصحة النفسية", icon: Brain },
  lifestyle: { label: "نمط الحياة", icon: Activity },
  financial: { label: "الضغط المالي", icon: Wallet },
  workplace: { label: "بيئة العمل", icon: ShieldAlert },
  engagement: { label: "الاندماج الوظيفي", icon: Compass },
};

const SEVERITY_RANK: Record<InsightSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
  positive: 3,
};

/* ── Small helpers ─────────────────────────────────────────────────────────── */

const ar = (n: number) => n.toLocaleString("ar-EG");
const ar1 = (n: number) =>
  n.toLocaleString("ar-EG", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

type Answers = Record<string, number>;

/** Mean of the answered slugs, or null when none are present. */
function mean(a: Answers, slugs: string[]): number | null {
  const vals = slugs.map((s) => a[s]).filter((v): v is number => v !== undefined);
  if (!vals.length) return null;
  return vals.reduce((n, v) => n + v, 0) / vals.length;
}

/** How many of the listed slugs sit at/under a threshold (a "flag" count). */
function countAtMost(a: Answers, slugs: string[], max: number): number {
  return slugs.filter((s) => a[s] !== undefined && a[s]! <= max).length;
}

/* ── 1. Body composition — BMI + waist (السمنة) ────────────────────────────── */

function analyzeBody(pi: PersonalInfoAnswers, out: Insight[]) {
  const h = Number(pi.height);
  const w = Number(pi.weight);
  if (h > 80 && h < 260 && w > 25 && w < 400) {
    const bmi = w / Math.pow(h / 100, 2);
    const metric = ar1(bmi);
    if (bmi >= 40) {
      out.push({
        id: "bmi", category: "body", severity: "critical",
        title: "سمنة مفرطة (الدرجة الثالثة)", metric, metricLabel: "مؤشر كتلة الجسم",
        detail: `مؤشر كتلة جسمك ${metric}، وهو ضمن نطاق السمنة المفرطة التي ترفع بشكل كبير مخاطر السكري وأمراض القلب وضغط الدم وآلام المفاصل.`,
        recommendation: "ننصح بشدة بمراجعة مختص تغذية أو طبيب لوضع خطة إنقاص وزن آمنة ومتدرجة.",
      });
    } else if (bmi >= 35) {
      out.push({
        id: "bmi", category: "body", severity: "critical",
        title: "سمنة من الدرجة الثانية", metric, metricLabel: "مؤشر كتلة الجسم",
        detail: `مؤشر كتلة جسمك ${metric}؛ هذا المستوى من السمنة يضاعف احتمالات الإصابة بأمراض مزمنة على المدى المتوسط.`,
        recommendation: "ابدأ بهدف واقعي: خسارة ٥٪ من وزنك خلال ٣ أشهر عبر تعديل التغذية وزيادة الحركة.",
      });
    } else if (bmi >= 30) {
      out.push({
        id: "bmi", category: "body", severity: "warning",
        title: "سمنة من الدرجة الأولى", metric, metricLabel: "مؤشر كتلة الجسم",
        detail: `مؤشر كتلة جسمك ${metric}، وهو ضمن نطاق السمنة. التدخّل الآن أسهل بكثير من علاج مضاعفاتها لاحقًا.`,
        recommendation: "استهدف عجزًا حراريًا بسيطًا مع ٣٠ دقيقة مشي يوميًا — أثره تراكمي وملموس.",
      });
    } else if (bmi >= 25) {
      out.push({
        id: "bmi", category: "body", severity: "warning",
        title: "زيادة في الوزن", metric, metricLabel: "مؤشر كتلة الجسم",
        detail: `مؤشر كتلة جسمك ${metric} (الوزن الطبيعي حتى ٢٤٫٩). أنت في مرحلة يسهل فيها العودة للنطاق الصحي.`,
        recommendation: "ضبط حصص الطعام والمشي المنتظم كفيلان غالبًا بإعادتك للنطاق الطبيعي.",
      });
    } else if (bmi < 18.5) {
      out.push({
        id: "bmi", category: "body", severity: "warning",
        title: "نقص في الوزن", metric, metricLabel: "مؤشر كتلة الجسم",
        detail: `مؤشر كتلة جسمك ${metric}، أقل من النطاق الصحي. قد يصاحب ذلك نقص في الطاقة أو في بعض العناصر الغذائية.`,
        recommendation: "راجع نمط تغذيتك، وفكّر باستشارة مختص للتأكد من كفاية السعرات والعناصر.",
      });
    } else {
      out.push({
        id: "bmi", category: "body", severity: "positive",
        title: "وزن ضمن النطاق الصحي", metric, metricLabel: "مؤشر كتلة الجسم",
        detail: `مؤشر كتلة جسمك ${metric}، ضمن النطاق الطبيعي. حافظ على هذا التوازن — فهو يحمي قلبك واستقلابك.`,
      });
    }

    // Central obesity — waist circumference, gender-specific risk thresholds.
    const waist = Number(pi.waistCircumference);
    const isFemale = pi.gender === "2";
    if (waist > 40 && waist < 200) {
      const high = isFemale ? 88 : 102;
      const elevated = isFemale ? 80 : 94;
      if (waist >= high) {
        out.push({
          id: "waist", category: "body", severity: "warning",
          title: "محيط خصر يدل على سمنة بطنية", metric: `${ar(waist)} سم`, metricLabel: "محيط الخصر",
          detail: `محيط خصرك ${ar(waist)} سم يتجاوز الحد الآمن (${ar(high)} سم). دهون البطن تحديدًا ترتبط بأقوى المخاطر على القلب والسكري.`,
          recommendation: "النشاط الهوائي المنتظم هو الأكثر فعالية في تقليل دهون محيط الخصر.",
        });
      } else if (waist >= elevated) {
        out.push({
          id: "waist", category: "body", severity: "info",
          title: "محيط خصر عند الحد التحذيري", metric: `${ar(waist)} سم`, metricLabel: "محيط الخصر",
          detail: `محيط خصرك ${ar(waist)} سم يقترب من حدّ الخطر (${ar(high)} سم). يستحق المتابعة قبل أن يتجاوزه.`,
        });
      }
    }
  }
}

/* ── 2. Chronic conditions (الأمراض المزمنة) ───────────────────────────────── */

const CONDITION_NAMES: Record<number, string> = {
  2: "السكري", 3: "ارتفاع ضغط الدم", 4: "أمراض القلب", 5: "التهاب المفاصل",
  6: "الربو", 7: "السرطان", 8: "مرض الانسداد الرئوي المزمن", 9: "هشاشة العظام", 10: "حالة مزمنة أخرى",
};

function analyzeChronic(a: Answers, out: Insight[]) {
  const cond = a.MedicalConditions;
  if (cond !== undefined && cond > 1 && CONDITION_NAMES[cond]) {
    const name = CONDITION_NAMES[cond];
    const severe = cond === 4 || cond === 7 || cond === 8; // heart / cancer / COPD
    out.push({
      id: "chronic-condition", category: "chronic",
      severity: severe ? "critical" : "warning",
      title: `حالة مزمنة مُشخّصة: ${name}`,
      detail: `أشرت إلى تشخيصك بـ${name}. تتطلب الحالات المزمنة متابعة منتظمة والتزامًا بالعلاج لتفادي المضاعفات.`,
      recommendation: "تأكد من المتابعة الدورية مع طبيبك والالتزام بالخطة العلاجية والقياسات المنزلية.",
    });
  }

  const pain = a.ChronicPain; // 1=always … 4=never
  if (pain !== undefined && pain <= 2) {
    out.push({
      id: "chronic-pain", category: "chronic",
      severity: pain === 1 ? "warning" : "info",
      title: pain === 1 ? "ألم مزمن يحدّ من نشاطك باستمرار" : "ألم مزمن يعيقك أحيانًا",
      detail: "الألم المزمن المتكرر يؤثر على الحركة والنوم والمزاج، وقد يكون علامة على حالة تستحق التقييم.",
      recommendation: "لا تتعايش مع الألم المستمر — استشر مختصًا لتحديد سببه وخيارات تخفيفه.",
    });
  }
}

/* ── 3. Preventive screenings (عدم عمل الفحوصات الدورية) ────────────────────── */

function analyzeScreening(a: Answers, out: Insight[]) {
  const missing: string[] = [];
  if (a.BloodPressureCheck !== undefined && a.BloodPressureCheck <= 1) missing.push("ضغط الدم");
  if (a.CholesterolCheck !== undefined && a.CholesterolCheck <= 1) missing.push("الكوليسترول");
  if (a.BloodSugarCheck !== undefined && a.BloodSugarCheck <= 1) missing.push("سكر الدم");

  if (missing.length >= 2) {
    out.push({
      id: "screening-gap", category: "screening", severity: "warning",
      title: "فحوصات وقائية أساسية لم تُجرَ", metric: ar(missing.length), metricLabel: "فحوصات ناقصة",
      detail: `لم تُجرِ فحص ${missing.join("، و")}. هذه الأمراض صامتة غالبًا، والاكتشاف المبكر هو خط الدفاع الأول.`,
      recommendation: "احجز فحصًا شاملًا بسيطًا — قياس الضغط والسكر والكوليسترول لا يستغرق سوى دقائق.",
    });
  } else if (missing.length === 1) {
    out.push({
      id: "screening-single", category: "screening", severity: "info",
      title: `فحص ${missing[0]} غير مُجرى`,
      detail: `لم تُجرِ فحص ${missing[0]} بعد. إجراؤه دوريًا يكشف أي خلل مبكرًا قبل ظهور الأعراض.`,
      recommendation: `أضف فحص ${missing[0]} إلى زيارتك الطبية القادمة.`,
    });
  }

  if (a.BloodPressureCheck !== undefined && a.BloodPressureCheck === 1 && missing.length < 2) {
    out.push({
      id: "bp-never", category: "screening", severity: "info",
      title: "لا تقيس ضغط دمك إطلاقًا",
      detail: "ارتفاع الضغط لا يُشعر بأعراض غالبًا. قياسه دوريًا عادة بسيطة تقي من مضاعفات خطيرة.",
    });
  }
}

/* ── 4. Burnout sub-scales (الاحتراق الوظيفي) ──────────────────────────────── */
/*  Professional answers are 0–6 frequency scales, baked so higher = worse.     */

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

function analyzeBurnout(a: Answers, out: Insight[]) {
  const ee = mean(a, EE);
  const dp = mean(a, DP);
  const pa = mean(a, PA); // high = low accomplishment = worse
  if (ee === null && dp === null && pa === null) return;

  const highEE = ee !== null && ee >= 3;
  const modEE = ee !== null && ee >= 1.8 && ee < 3;
  const highDP = dp !== null && dp >= 2.2;
  const highPA = pa !== null && pa >= 3;

  if (highEE && (highDP || highPA)) {
    const facets = [
      "الإنهاك العاطفي",
      highDP ? "تبلّد المشاعر تجاه الزملاء" : null,
      highPA ? "تراجع الإحساس بالإنجاز" : null,
    ].filter(Boolean);
    out.push({
      id: "burnout", category: "burnout", severity: "critical",
      title: "مؤشرات احتراق وظيفي واضحة",
      detail: `تجتمع لديك ${facets.join("، و")}، وهي الأبعاد الثلاثة الكلاسيكية للاحتراق الوظيفي. هذا إنهاك متراكم لا يزول بالراحة القصيرة وحدها.`,
      recommendation: "تحدّث مع مديرك حول حدود العبء، واطلب استشارة الدعم النفسي المجانية مبكرًا.",
    });
  } else if (highEE) {
    out.push({
      id: "burnout-ee", category: "burnout", severity: "warning",
      title: "إنهاك عاطفي مرتفع من العمل",
      detail: "إجاباتك تُظهر تعبًا نفسيًا متكررًا بسبب العمل (نفاد الصبر، إرهاق الصباح، الشعور بالاستنزاف). هذه بوادر مبكرة للاحتراق.",
      recommendation: "احمِ وقت تعافيك: فواصل قصيرة منتظمة، وفصل واضح بين العمل وما بعده.",
    });
  } else if (modEE || highDP || highPA) {
    out.push({
      id: "burnout-mild", category: "burnout", severity: "info",
      title: "ضغط مهني يستحق المراقبة",
      detail: "بعض مؤشرات الإجهاد المهني بدأت تظهر دون أن تصل لحدّ الاحتراق. الانتباه المبكر يمنع تفاقمها.",
    });
  }
}

/* ── 5. Mental health — depression / anxiety / stress ──────────────────────── */
/*  Psycho answers are 1–5, baked so higher = more distress.                    */

const DEPRESSION = [
  "SadnessDepressionFree", "LonelinessSadnessFree", "WorthlessnessFeelings",
  "InferiorityFeelings", "FrustrationHelplessness", "HelplessnessPassivity",
];
const ANXIETY = ["AnxietyNotProne", "FearAnxietyFree"];
const STRESS = ["StressNervousness", "EmotionalCollapse"];

function distress(
  a: Answers, slugs: string[], cfg: { id: string; titles: [string, string]; detail: string; rec: string },
  out: Insight[],
) {
  const m = mean(a, slugs);
  if (m === null) return;
  if (m >= 4) {
    out.push({
      id: cfg.id, category: "mental", severity: "critical",
      title: cfg.titles[0], detail: cfg.detail, recommendation: cfg.rec,
    });
  } else if (m >= 3.2) {
    out.push({
      id: cfg.id, category: "mental", severity: "warning",
      title: cfg.titles[1], detail: cfg.detail, recommendation: cfg.rec,
    });
  } else if (m >= 2.4) {
    out.push({
      id: cfg.id, category: "mental", severity: "info",
      title: cfg.titles[1], detail: cfg.detail,
    });
  }
}

function analyzeMental(a: Answers, out: Insight[]) {
  distress(a, DEPRESSION, {
    id: "depression",
    titles: ["مؤشرات اكتئاب مرتفعة", "علامات مزاج منخفض (اكتئاب خفيف)"],
    detail: "إجاباتك تشير إلى حزن أو شعور بقلة القيمة أو فقدان الدافع بشكل متكرر — وهي من علامات الاكتئاب.",
    rec: "لا تواجه هذا وحدك؛ استشارة مختص نفسي خطوة فعّالة، والدعم متاح ومجاني عبر التطبيق.",
  }, out);

  distress(a, ANXIETY, {
    id: "anxiety",
    titles: ["مستوى قلق مرتفع", "ميل للقلق والتوجّس"],
    detail: "تظهر لديك نزعة متكررة للقلق والخوف والتوجّس من الأمور — قد تستنزف طاقتك وتؤثر على تركيزك ونومك.",
    rec: "تمارين التنفّس والتأريض اليومية تخفّف القلق، ويفيد فيها الدعم المختص عند الاستمرار.",
  }, out);

  distress(a, STRESS, {
    id: "stress",
    titles: ["توتر وعصبية مرتفعان", "توتر وعصبية ملحوظان"],
    detail: "تشعر غالبًا بالتوتر والعصبية، وأحيانًا بأن أعصابك على وشك الانهيار تحت الضغط — جسمك في حالة تأهب مستمر.",
    rec: "أدخِل تقنيات استرخاء منتظمة (تنفّس، مشي، نوم كافٍ) لخفض هرمونات التوتر.",
  }, out);

  // Emotional regulation — anger reactivity + shame withdrawal (1–5, higher = worse).
  const reactivity = mean(a, ["AngerTreatment", "ShameHiding"]);
  if (reactivity !== null && reactivity >= 3.2) {
    out.push({
      id: "emotional-regulation", category: "mental",
      severity: reactivity >= 4 ? "warning" : "info",
      title: reactivity >= 4 ? "حساسية انفعالية مرتفعة" : "حساسية انفعالية ملحوظة",
      detail: "تظهر لديك نزعة للغضب من طريقة معاملة الآخرين والرغبة في الانسحاب عند الشعور بالخجل. شدّة التفاعل الانفعالي قد تُرهق علاقاتك وتزيد توترك الداخلي.",
      recommendation: "جرّب وقفة قصيرة قبل ردّة الفعل (تنفّس بطيء، وتسمية الشعور)، فهي تخفّف حدّة الانفعال وتعيد لك زمام الموقف.",
    });
  }
}

/* ── 6. Lifestyle — smoking, sleep, activity, nutrition ─────────────────────── */

function analyzeLifestyle(a: Answers, out: Insight[]) {
  const tob = a.TobaccoUse; // 1 daily … 4 no
  if (tob !== undefined && tob <= 2) {
    out.push({
      id: "smoking", category: "lifestyle", severity: tob === 1 ? "critical" : "warning",
      title: tob === 1 ? "تدخين يومي" : "تدخين متقطّع",
      detail: "التبغ أكبر سبب وقائي منفرد لأمراض القلب والرئة والسرطان. أي خفض في الاستهلاك يعود بفائدة سريعة.",
      recommendation: "برامج الإقلاع عن التدخين تضاعف فرص نجاحك — اطلب الدعم بدل الاعتماد على الإرادة وحدها.",
    });
  }

  const sleep = a.SleepDuration; // 1 <5h … 4 9h+
  if (sleep !== undefined && sleep <= 2) {
    out.push({
      id: "sleep", category: "lifestyle", severity: sleep === 1 ? "warning" : "info",
      title: sleep === 1 ? "نوم غير كافٍ (أقل من ٥ ساعات)" : "نوم أقل من الموصى به",
      detail: "قلة النوم ترفع التوتر والوزن وتضعف التركيز والمناعة، وتغذّي الإجهاد المهني والقلق.",
      recommendation: "استهدف ٧–٨ ساعات بمواعيد نوم ثابتة وتقليل الشاشات قبل النوم.",
    });
  }

  // Physical inactivity — combine the activity signals.
  const inactiveFlags = countAtMost(a, ["VigorousActivityDays", "ModerateActivityDays", "WalkingDays", "StrengthTrainingDays"], 2);
  const sitting = a.SittingHours; // 1 = 10h+
  const fitness = a.FitnessLevel; // 1 very poor
  if (inactiveFlags >= 3 || (fitness !== undefined && fitness <= 2)) {
    out.push({
      id: "inactivity", category: "lifestyle", severity: "warning",
      title: "مستوى نشاط بدني منخفض",
      detail: "إجاباتك تُظهر قلة في الحركة والتمارين، وهو ما يضعف اللياقة ويزيد مخاطر الوزن والقلب والمزاج المنخفض.",
      recommendation: "ابدأ بهدف بسيط: ١٥٠ دقيقة نشاط متوسط أسبوعيًا، ولو على دفعات قصيرة.",
    });
  } else if (sitting !== undefined && sitting === 1) {
    out.push({
      id: "sitting", category: "lifestyle", severity: "info",
      title: "جلوس مطوّل (١٠ ساعات أو أكثر يوميًا)",
      detail: "الجلوس الطويل عامل خطر مستقل حتى مع ممارسة الرياضة. الحركة المتكررة الخفيفة تكسر أثره.",
      recommendation: "قف وتحرّك ٢–٣ دقائق كل نصف ساعة خلال يوم العمل.",
    });
  }

  // Nutrition red flags.
  const nutritionFlags: string[] = [];
  if (a.FruitVegetableIntake !== undefined && a.FruitVegetableIntake <= 2) nutritionFlags.push("قلة الفواكه والخضروات");
  if (a.FastFoodFrequency !== undefined && a.FastFoodFrequency <= 2) nutritionFlags.push("تكرار الوجبات السريعة");
  if (a.HighFatFoodPreference !== undefined && a.HighFatFoodPreference <= 2) nutritionFlags.push("أطعمة عالية الدهون");
  if (a.HighSaltFoodPreference !== undefined && a.HighSaltFoodPreference <= 2) nutritionFlags.push("أطعمة عالية الملح");
  if (a.WaterIntake !== undefined && a.WaterIntake <= 1) nutritionFlags.push("شرب ماء غير كافٍ");
  if (nutritionFlags.length >= 2) {
    out.push({
      id: "nutrition", category: "lifestyle", severity: nutritionFlags.length >= 3 ? "warning" : "info",
      title: "نمط غذائي يحتاج تحسينًا",
      detail: `تظهر عدة مؤشرات: ${nutritionFlags.join("، ")}. هذه العادات تتراكم على الوزن والضغط والطاقة اليومية.`,
      recommendation: "غيّر عادة واحدة كل أسبوع — كزيادة حصة خضار أو استبدال مشروب غازي بالماء.",
    });
  }
}

/* ── 7. Financial stress (الضغط المالي) ────────────────────────────────────── */

function analyzeFinancial(a: Answers, out: Insight[]) {
  const stress = mean(a, ["FinancialStressFeeling", "GeneralFinancialStress"]); // 1 huge … 4 none
  const paycheck = a.PaycheckToPaycheck; // 1 always
  const fund = a.EmergencyFund; // 1 = none
  const debt = a.DebtBurden; // 1 huge

  if ((stress !== null && stress <= 1.5) || paycheck === 1 || debt === 1) {
    out.push({
      id: "financial-stress", category: "financial", severity: "warning",
      title: "ضغط مالي مرتفع",
      detail: "تشير إجاباتك إلى ضغط مالي ملموس وصعوبة في تغطية النفقات أو عبء ديون. الضغط المالي من أقوى مسببات القلق واضطراب النوم.",
      recommendation: "ابدأ بميزانية بسيطة وصندوق طوارئ صغير متنامٍ؛ والاستشارة المالية متاحة لمساعدتك.",
    });
  } else if (fund === 1 || (stress !== null && stress <= 2.5)) {
    out.push({
      id: "financial-cushion", category: "financial", severity: "info",
      title: "هشاشة في الاستعداد للطوارئ المالية",
      detail: "غياب صندوق طوارئ يجعل أي مصروف مفاجئ مصدر قلق. بناؤه تدريجيًا يمنحك راحة نفسية كبيرة.",
      recommendation: "خصّص مبلغًا تلقائيًا بسيطًا شهريًا لبناء صندوق طوارئ يغطي نفقات ٣ أشهر.",
    });
  }

  // Income vs. obligations — does the paycheck actually cover life? (1–4, low = worse)
  const obligations = a.MeetFinancialObligations;
  const surplus = a.IncomeExceedsExpenses;
  if ((obligations !== undefined && obligations <= 2) || surplus === 1) {
    out.push({
      id: "financial-obligations", category: "financial", severity: "warning",
      title: "النفقات تتجاوز الدخل",
      detail: "تشير إجاباتك إلى صعوبة في الوفاء بالالتزامات الشهرية أو أن دخلك لا يغطي نفقاتك. هذه الفجوة تتراكم سريعًا، وتغذّي القلق، وتدفع نحو الاستدانة.",
      recommendation: "راجع أكبر ثلاثة بنود إنفاق هذا الشهر، وحدّد بندًا واحدًا قابلًا للخفض فورًا، واطلب استشارة مالية مجانية لإعادة الترتيب.",
    });
  }

  // Retirement / long-horizon readiness.
  const retire = a.RetirementReadiness; // 1 = not ready … 4 = fully ready
  if (retire !== undefined && retire <= 2) {
    out.push({
      id: "retirement", category: "financial",
      severity: retire === 1 ? "warning" : "info",
      title: retire === 1 ? "غياب الاستعداد المالي للتقاعد" : "ضعف الاستعداد المالي للتقاعد",
      detail: "لا تشعر بالاطمئنان تجاه استعدادك المالي لمرحلة التقاعد. كل سنة تأخير في الادخار للتقاعد تكلّف أضعافها لاحقًا بسبب فقدان أثر التراكم.",
      recommendation: "ابدأ بادخار نسبة صغيرة ثابتة من دخلك في وعاء تقاعدي أو استثماري طويل الأجل، ولو ٥٪ شهريًا.",
    });
  }

  // Planning & money awareness — the habits behind stability.
  const planFlags = countAtMost(a, ["LongTermGoals", "DailySpendingAwareness", "SeekFinancialAdvice"], 2);
  if (planFlags >= 2) {
    out.push({
      id: "financial-planning", category: "financial", severity: "info",
      title: "غياب التخطيط والوعي المالي",
      detail: "لا تضع أهدافًا مالية طويلة الأجل ولا تتابع إنفاقك اليومي بدقة. الوعي بالأرقام هو الخطوة الأولى لأي تحسّن مالي مستدام.",
      recommendation: "دوّن مصروفك أسبوعًا كاملًا، وحدّد هدفًا ماليًا واحدًا واضحًا بمبلغ وموعد.",
    });
  }
}

/* ── 8. Workplace red flags ────────────────────────────────────────────────── */

function analyzeWorkplace(a: Answers, out: Insight[]) {
  const bully = a.WorkplaceBullying; // baked: 1 = experiencing bullying, 5 = not
  if (bully !== undefined && bully <= 2) {
    out.push({
      id: "bullying", category: "workplace", severity: "critical",
      title: "تعرّض لتنمّر أو مضايقة في العمل",
      detail: "أشرت إلى تعرّضك لمعاملة مهينة أو مضايقة في عملك. لهذا أثر مباشر على صحتك النفسية ولا ينبغي تجاهله.",
      recommendation: "وثّق ما يحدث وتواصل مع الموارد البشرية أو قناة الإبلاغ الآمنة — من حقّك بيئة آمنة.",
    });
  }

  const turnover = a.TurnoverIntention; // baked: low = strong intention to leave
  if (turnover !== undefined && turnover <= 2) {
    out.push({
      id: "turnover", category: "workplace", severity: "warning",
      title: "نية مرتفعة لترك العمل",
      detail: "تفكّر كثيرًا في ترك المنظمة. غالبًا ما يكون هذا عرَضًا لأسباب أعمق: ضعف التقدير أو غياب فرص النمو أو ضغط مستمر.",
      recommendation: "حدّد السبب الجذري قبل اتخاذ قرار، وناقش مسارك وفرص نموّك مع مديرك.",
    });
  }

  const recog = mean(a, ["EffortRecognized", "FairRecognition"]); // higher = better
  const support = a.ManagerSupport;
  const safety = a.SpeakUpSafety;
  if ((recog !== null && recog <= 2) || (support !== undefined && support <= 2)) {
    out.push({
      id: "recognition", category: "workplace", severity: "info",
      title: "ضعف في التقدير ودعم المدير",
      detail: "لا تشعر بأن جهدك يُلاحَظ أو أن مديرك يدعم تطوّرك بشكل كافٍ. نقص التقدير يستنزف الحماس مع الوقت.",
      recommendation: "اطلب لقاءً دوريًا قصيرًا مع مديرك لمناقشة الإنجازات والتطلّعات.",
    });
  } else if (safety !== undefined && safety <= 2) {
    out.push({
      id: "psych-safety", category: "workplace", severity: "info",
      title: "تردّد في التعبير عن الرأي",
      detail: "لا تشعر بالأمان الكافي للتعبير عن رأيك أو طرح أفكارك خوفًا من العواقب — ما يحدّ من مشاركتك وإبداعك.",
    });
  }
}

/* ── 9. Work engagement — vigour, meaning, growth, belonging ───────────────── */
/*  Engagement answers are 1–5, baked so higher = more engaged/positive.        */

const ENGAGEMENT_VIGOUR = ["WorkEnthusiasm", "ImmersionFlow", "JobSatisfaction", "MorningMotivation"];
const ENGAGEMENT_MEANING = ["WorkMeaning", "PurposeMission", "ContributionToGoals"];
const ENGAGEMENT_GROWTH = ["GrowthOpportunities", "CareerPathClarity"];
const ENGAGEMENT_BELONGING = ["TeamBelonging", "RespectInclusion", "FeelLikeOutsider", "ProudRecommend"];

function analyzeEngagement(a: Answers, out: Insight[]) {
  const vigour = mean(a, ENGAGEMENT_VIGOUR);
  const meaning = mean(a, ENGAGEMENT_MEANING);
  const growth = mean(a, ENGAGEMENT_GROWTH);
  const belonging = mean(a, ENGAGEMENT_BELONGING);

  if (vigour !== null && vigour <= 2.2) {
    out.push({
      id: "engagement-low", category: "engagement",
      severity: vigour <= 1.6 ? "warning" : "info",
      title: vigour <= 1.6 ? "اندماج وظيفي منخفض" : "فتور في الاندماج الوظيفي",
      detail: "إجاباتك تُظهر ضعفًا في الحماس والتحفّز والرضا عن عملك — تبدأ يومك دون تطلّع، وتشعر أن وقت العمل يثقل. فتور الاندماج يسبق غالبًا تراجع الأداء والرغبة في المغادرة.",
      recommendation: "حدّد ما استنزف شغفك تحديدًا (المهام؟ التقدير؟ العبء؟)، وغيّر عنصرًا واحدًا تملك التأثير فيه هذا الأسبوع.",
    });
  } else if (vigour !== null && vigour >= 3.8 && meaning !== null && meaning >= 3.8) {
    out.push({
      id: "engagement-high", category: "engagement", severity: "positive",
      title: "اندماج وظيفي مرتفع",
      detail: "تُظهر إجاباتك حماسًا وتحفّزًا ومعنىً واضحًا في عملك. هذا الاندماج مورد يقيك من الإجهاد ويغذّي أداءك — حافظ عليه.",
    });
  }

  if (meaning !== null && meaning <= 2.2) {
    out.push({
      id: "engagement-meaning", category: "engagement", severity: "warning",
      title: "ضعف الإحساس بمعنى العمل",
      detail: "لا تجد معنىً واضحًا أو قيمة في عملك، ولا ترى كيف يسهم فيما هو أكبر. غياب المعنى من أقوى مسببات الانفصال الوظيفي والإرهاق على المدى البعيد.",
      recommendation: "اربط مهامك اليومية بأثرها على المستفيد النهائي، وناقش مع مديرك كيف يخدم دورك أهداف المنظمة.",
    });
  }

  if (growth !== null && growth <= 2.2) {
    out.push({
      id: "engagement-growth", category: "engagement", severity: "info",
      title: "غياب مسار واضح للنمو",
      detail: "لا ترى فرصًا حقيقية للتعلّم أو مسارًا واضحًا لتقدّمك المهني. الشعور بالركود الوظيفي يستنزف الدافع ويزيد التفكير في المغادرة.",
      recommendation: "ضع خطة تطوّر فردية، واطلب من مديرك تحديد مهارة أو مشروع يفتح لك خطوتك التالية.",
    });
  }

  if (belonging !== null && belonging <= 2.2) {
    out.push({
      id: "engagement-belonging", category: "engagement",
      severity: belonging <= 1.6 ? "warning" : "info",
      title: "ضعف الشعور بالانتماء للفريق",
      detail: "لا تشعر بأنك جزء أصيل من فريقك أو بأنك تُعامَل بإنصاف، وقد تشعر أحيانًا بأنك غريب بينهم. ضعف الانتماء يقلّل الأمان النفسي ويُضعف التعاون والولاء.",
      recommendation: "ابحث عن نقطة تواصل صادقة واحدة في فريقك، ولا تتردّد في طرح ما يُشعرك بالإقصاء عبر قناة آمنة.",
    });
  }
}

/* ── Public API ────────────────────────────────────────────────────────────── */

export function deriveInsights(a: Answers, pi: PersonalInfoAnswers = {}): Insight[] {
  const out: Insight[] = [];
  analyzeBody(pi, out);
  analyzeChronic(a, out);
  analyzeScreening(a, out);
  analyzeBurnout(a, out);
  analyzeMental(a, out);
  analyzeLifestyle(a, out);
  analyzeFinancial(a, out);
  analyzeWorkplace(a, out);
  analyzeEngagement(a, out);
  return out.sort((x, y) => SEVERITY_RANK[x.severity] - SEVERITY_RANK[y.severity]);
}

export interface InsightSummary {
  insights: Insight[];
  critical: number;
  warning: number;
  /** Findings that need attention (critical + warning + info), excludes positives. */
  flagged: number;
  /** A dynamic, grounded narrative built from the strongest findings. */
  narrative: string;
}

const CONNECTORS = ["كما أن", "ويُلاحَظ أيضًا", "بالإضافة إلى ذلك", "ومن جهة أخرى"];

export function summarizeInsights(a: Answers, pi: PersonalInfoAnswers = {}): InsightSummary {
  const insights = deriveInsights(a, pi);
  const critical = insights.filter((i) => i.severity === "critical").length;
  const warning = insights.filter((i) => i.severity === "warning").length;
  const flagged = insights.filter((i) => i.severity !== "positive").length;

  const top = insights.filter((i) => i.severity === "critical" || i.severity === "warning").slice(0, 3);
  let narrative: string;
  if (!top.length) {
    narrative = flagged
      ? "لا توجد مؤشرات حرجة في إجاباتك، مع وجود نقاط بسيطة للمتابعة تجدها مفصّلة أدناه. خطوات صغيرة منتظمة كفيلة بإبقائها تحت السيطرة."
      : "تُظهر إجاباتك صورة صحية متّزنة بوجه عام — لا توجد مؤشرات تستدعي قلقًا حاليًا. حافظ على عاداتك الجيدة، فالاستمرارية هي ما يحمي هذا التوازن.";
  } else {
    const lead = top[0];
    const parts = [`أبرز ما يستحق انتباهك هو ${lead.title.replace(/\(.*?\)/g, "").trim()}.`];
    top.slice(1).forEach((i, idx) => {
      parts.push(`${CONNECTORS[idx % CONNECTORS.length]} ${i.title.replace(/\(.*?\)/g, "").trim()}.`);
    });
    parts.push(
      critical > 0
        ? "ننصح بالبدء بهذه النقاط مبكرًا — معالجتها الآن أبسط بكثير من علاج مضاعفاتها لاحقًا."
        : "هذه مؤشرات مبكرة قابلة للتحسين بخطوات صغيرة منتظمة تبدأ من خطتك.",
    );
    narrative = parts.join(" ");
  }

  return { insights, critical, warning, flagged, narrative };
}
