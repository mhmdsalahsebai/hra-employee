import { hraData } from "./hra.generated";
import type { DimensionId } from "./dimensions";
import { scoreMeta, type ScoreLevel } from "../lib/score";
import { computeMetrics } from "./metrics";
import type { PersonalInfoAnswers } from "./personalInfo";

/* ───────────────────────────────────────────────────────────────────────────
   The deep-analysis engine — the layer above metrics.ts.

   metrics.ts scores each *sub-scale on its own*; this file computes the
   composite indices that only exist when answers are read *across* scales and
   dimensions, each one grounded in the published instrument the questions come
   from:

   · مقياس ماسلاك MBI      → burnout sub-scale sums against published cut-offs
                              and the Leiter–Maslach engagement profiles.
   · توصية WHO للنشاط       → estimated weekly moderate-equivalent minutes vs
                              the 150-minute guideline (IPAQ-style arithmetic).
   · نموذج JD-R              → job demands vs job resources balance
                              (Demerouti & Bakker).
   · نية الدوران             → retention outlook weighted from turnover intent
                              plus its known drivers.
   · مخزون الصمود            → Hobfoll's Conservation of Resources: how many
                              recovery resources the person actually holds.
   · عوامل الخطر القلبية     → a risk-factor count in the style of clinical
                              cardiometabolic screening.
   · الطاقة الحيوية           → subjective vitality read across four scales
                              (Ryan & Frederick).
   · ضبط الذات               → cross-domain self-regulation (tasks / money /
                              emotions / habits — Moffitt's Dunedin evidence).
   · الحمل الجلوسي            → daily sitting + commute vs the Ekelund
                              activity offset.
   · الشخصية الخمسية         → NEO-FFI Big-Five positions + a work-style persona.
   · جودة القياس             → coverage + response consistency across
                              near-duplicate item groups.

   The cross-answer *findings* (patterns that need answers from several scales
   crossed together, plus the leverage-point ranking) live in findings.ts and
   reuse the helpers exported here.

   Everything is derived live from the stored answers; nothing is narrative
   filler. Answers store reversed items already baked, so within a dimension a
   higher raw value always points the same way (see LOWER_IS_BETTER).
   ─────────────────────────────────────────────────────────────────────────── */

type Answers = Record<string, number>;

/* ── Question lookup: scale range, title, dimension, answer labels ─────────── */

export interface QuestionRef {
  dim: DimensionId;
  title: string;
  min: number;
  max: number;
  labelOf: Map<number, string>;
}

export const QUESTIONS = new Map<string, QuestionRef>();
for (const d of hraData) {
  for (const q of d.questions) {
    const vals = q.answers.map((a) => a.value);
    QUESTIONS.set(q.slug, {
      dim: d.slug as DimensionId,
      title: q.title,
      min: Math.min(...vals),
      max: Math.max(...vals),
      labelOf: new Map(q.answers.map((a) => [a.value, a.title])),
    });
  }
}

/** Dimensions whose raw values grow with *distress* (higher = worse). */
export const DISTRESS_DIMS = new Set<DimensionId>(["professional", "psycho"]);

/** Age in years from the personal-info birth date, or null when unusable. */
export function ageOf(pi: PersonalInfoAnswers): number | null {
  if (!pi.birthDate) return null;
  const b = new Date(pi.birthDate);
  if (isNaN(b.getTime())) return null;
  const age = Math.floor((Date.now() - b.getTime()) / (365.25 * 24 * 3600 * 1000));
  return age >= 15 && age <= 90 ? age : null;
}

/** Normalised position of one answer on its own scale (0–1, toward high raw). */
export function pos(a: Answers, slug: string): number | null {
  const v = a[slug];
  const q = QUESTIONS.get(slug);
  if (v === undefined || !q || q.max === q.min) return null;
  return (v - q.min) / (q.max - q.min);
}

/** Mean position over the answered slugs (0–1), with answer coverage. */
export function meanPos(a: Answers, slugs: string[]): { f: number; n: number } | null {
  let sum = 0;
  let n = 0;
  for (const s of slugs) {
    const p = pos(a, s);
    if (p === null) continue;
    sum += p;
    n += 1;
  }
  return n ? { f: sum / n, n } : null;
}

/** Raw sum over the answered slugs. */
function rawSum(a: Answers, slugs: string[]): { sum: number; n: number } {
  let sum = 0;
  let n = 0;
  for (const s of slugs) {
    if (a[s] === undefined) continue;
    sum += a[s];
    n += 1;
  }
  return { sum, n };
}

export const clamp100 = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
const nums = (n: number) => n.toLocaleString("en-US");

/* ── Public shapes ─────────────────────────────────────────────────────────── */

export interface CompositeEvidence {
  label: string;
  /** Concrete figure or verbatim answer — the proof behind the verdict. */
  value: string;
  level?: ScoreLevel;
}

export interface CompositeIndex {
  id: string;
  /** Arabic name of the index. */
  label: string;
  /** 0–100, higher always = healthier. */
  score: number;
  level: ScoreLevel;
  /** One-line verdict. */
  headline: string;
  /** Grounded paragraph reading. */
  detail: string;
  /** The concrete numbers the verdict is built from. */
  evidence: CompositeEvidence[];
  /** Named scientific basis — never generic. */
  basis: string;
  /** Dimensions whose answers feed this index. */
  dims: DimensionId[];
}

export interface TraitScore {
  id: string;
  label: string;
  /** 0–100 position between the two poles — descriptive, not good/bad. */
  score: number;
  lowPole: string;
  highPole: string;
  reading: string;
}

export interface Persona {
  name: string;
  blurb: string;
}

/** Meta-quality of the measurement itself: coverage + response consistency
 *  across near-duplicate item groups (an individual-level reliability check). */
export interface MeasurementQuality {
  /** 0–100: share of the question bank actually answered. */
  coverage: number;
  /** 0–100: agreement between answers to items measuring the same construct. */
  consistency: number;
  level: ScoreLevel;
  reading: string;
}

export interface MetricExtreme {
  id: string;
  label: string;
  score: number;
  dimension: DimensionId;
}

export interface MetricExtremes {
  top: MetricExtreme[];
  bottom: MetricExtreme[];
  /** How many metrics the ranking covers. */
  total: number;
}

export interface DeepAnalysisResult {
  composites: CompositeIndex[];
  traits: TraitScore[];
  persona: Persona | null;
  quality: MeasurementQuality | null;
  /** The 5 strongest / 5 weakest of all computed sub-scale metrics. */
  extremes: MetricExtremes | null;
  /** How many answered questions the analysis is derived from. */
  answeredCount: number;
}

/* ── Slug groups (shared clinical groupings — keep in sync with metrics.ts) ── */

export const EE = [
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

const WP_RESOURCES = [
  "ManagerSupport", "EffortRecognized", "FairRecognition", "GrowthOpportunities",
  "CareerPathClarity", "SpeakUpSafety", "IdeaFearHesitation", "TeamBelonging",
  "RespectInclusion", "WorkMeaning", "PurposeMission", "BullyingHandling",
];
export const FIN_STRAIN = ["FinancialStressFeeling", "GeneralFinancialStress", "MonthlyExpenseWorry"];
export const VIGOUR = ["WorkEnthusiasm", "ImmersionFlow", "JobSatisfaction", "MorningMotivation"];
const RECOGNITION = ["EffortRecognized", "FairRecognition", "ManagerSupport"];
const GROWTH = ["GrowthOpportunities", "CareerPathClarity"];

/* ── 1. Burnout profile — Maslach Burnout Inventory ────────────────────────── */
/*  Professional items are the 22 MBI-HSS items on the 0–6 frequency scale,
    stored distress-oriented (reversed PA items baked). Sub-scale sums are read
    against the published MBI cut-offs; the combination is classified into the
    Leiter–Maslach profiles (Engaged / Overextended / Disengaged / Ineffective /
    Burnout).                                                                   */

interface BurnoutBand {
  label: string;
  level: ScoreLevel;
}

/** Band a sub-scale sum, scaling the cut-offs when items are missing. */
function band(sum: number, n: number, total: number, cuts: [number, number]): BurnoutBand {
  const k = n / total;
  if (sum >= cuts[1] * k) return { label: "مرتفع", level: "attention" };
  if (sum >= cuts[0] * k) return { label: "متوسط", level: "moderate" };
  return { label: "منخفض", level: "good" };
}

function burnoutComposite(a: Answers): CompositeIndex | null {
  const ee = rawSum(a, EE);
  const dp = rawSum(a, DP);
  const pa = rawSum(a, PA); // stored so higher = LESS accomplishment
  const answered = ee.n + dp.n + pa.n;
  if (answered < 11) return null; // need at least half the inventory

  // Published MBI-HSS cut-offs, scaled to this item count (EE 9/54, DP 5/30,
  // PA 8/48 — the classic 22-item split). PA is stored inverted, so the sum of
  // (max − stored) recovers the true accomplishment score.
  const eeBand = band(ee.sum, ee.n, 9, [17, 27]);
  const dpBand = band(dp.sum, dp.n, 5, [7, 13]);
  const paTrue = pa.n * 6 - pa.sum;
  const paBand: BurnoutBand =
    paTrue >= (39 * pa.n) / 8
      ? { label: "مرتفع", level: "good" }
      : paTrue >= (32 * pa.n) / 8
        ? { label: "متوسط", level: "moderate" }
        : { label: "منخفض", level: "attention" };

  const highEE = eeBand.level === "attention";
  const highDP = dpBand.level === "attention";
  const lowPA = paBand.level === "attention";

  let profile: string;
  let detail: string;
  if (highEE && highDP) {
    profile = "نمط الاحتراق الوظيفي";
    detail =
      "يجتمع لديك إنهاك عاطفي مرتفع مع تبلّد في المشاعر تجاه الزملاء — وهو التعريف الإكلينيكي للاحتراق الوظيفي في مقياس ماسلاك. هذا استنزاف متراكم لا تكفي معه راحة نهاية الأسبوع، ويستحق تدخلًا حقيقيًا في عبء العمل ودعمًا مختصًا.";
  } else if (highEE) {
    profile = "نمط الاستنزاف (Overextended)";
    detail =
      "طاقتك العاطفية مستنزفة من العمل بينما علاقتك بزملائك وإحساسك بالإنجاز ما زالا متماسكين. في تصنيف ليتر وماسلاك هذا «الممتد فوق طاقته» — أفضل نافذة للتدخل قبل اكتمال دائرة الاحتراق.";
  } else if (highDP) {
    profile = "نمط التباعد (Disengaged)";
    detail =
      "أبرز إشاراتك ليست التعب بل التباعد: جفاء وتبلّد تجاه زملائك. هذا النمط يسبق غالبًا فقدان المعنى، وعلاجه في جودة العلاقات وحدود العبء لا في الراحة فقط.";
  } else if (lowPA) {
    profile = "نمط تراجع الفعالية (Ineffective)";
    detail =
      "طاقتك وعلاقاتك بخير، لكن إحساسك بالإنجاز والكفاءة في عملك متراجع. هذا النمط يستجيب جيدًا لأهداف أوضح وتغذية راجعة منتظمة تجعل أثرك مرئيًا لك.";
  } else if (eeBand.level === "moderate" || dpBand.level === "moderate" || paBand.level === "moderate") {
    profile = "منطقة رمادية — إجهاد قابل للإدارة";
    detail =
      "لم تتجاوز أي من مؤشرات الاحتراق الثلاثة حدّها الحرج، لكن بعضها في النطاق المتوسط. المراقبة وحماية وقت التعافي الآن أرخص كثيرًا من العلاج لاحقًا.";
  } else {
    profile = "نمط الاندماج (Engaged)";
    detail =
      "المؤشرات الثلاثة للاحتراق — الإنهاك، التبلّد، وتراجع الإنجاز — كلها في النطاق الصحي. هذا هو النمط «المندمج» في تصنيف ماسلاك: طاقة متجددة وإحساس حقيقي بالأثر.";
  }

  // Overall score: mean healthiness of the three sub-scales.
  const eeF = ee.n ? 1 - ee.sum / (ee.n * 6) : 0.5;
  const dpF = dp.n ? 1 - dp.sum / (dp.n * 6) : 0.5;
  const paF = pa.n ? paTrue / (pa.n * 6) : 0.5;
  const score = clamp100(((eeF + dpF + paF) / 3) * 100);

  return {
    id: "burnout-profile",
    label: "خريطة الاحتراق الوظيفي",
    score,
    level: highEE && highDP ? "attention" : scoreMeta(score).level,
    headline: profile,
    detail,
    evidence: [
      { label: "الإنهاك العاطفي (EE)", value: `${nums(ee.sum)} من ${nums(ee.n * 6)} — ${eeBand.label}`, level: eeBand.level },
      { label: "تبلّد المشاعر (DP)", value: `${nums(dp.sum)} من ${nums(dp.n * 6)} — ${dpBand.label}`, level: dpBand.level },
      { label: "الإحساس بالإنجاز (PA)", value: `${nums(paTrue)} من ${nums(pa.n * 6)} — ${paBand.label}`, level: paBand.level },
    ],
    basis: "مقياس ماسلاك للاحتراق الوظيفي (MBI-HSS) بحدوده المنشورة، وتصنيف Leiter & Maslach للأنماط",
    dims: ["professional"],
  };
}

/* ── 2. Weekly activity vs the WHO guideline ───────────────────────────────── */
/*  IPAQ-style arithmetic: days × session-minutes midpoints, vigorous counted
    double (WHO: 75 vigorous ≡ 150 moderate minutes).                           */

const DAY_MID: Record<number, number> = { 1: 0.5, 2: 2.5, 3: 4.5, 4: 6.5 };
const MIN_MID: Record<number, number> = { 1: 20, 2: 45, 3: 75, 4: 100 };
/** Strength answers map 1→0, 2→1.5, 3→3.5, 4→5 days. */
const STRENGTH_DAYS: Record<number, number> = { 1: 0, 2: 1.5, 3: 3.5, 4: 5 };

export function weeklyMinutes(a: Answers, daysSlug: string, minSlug: string): number | null {
  const d = a[daysSlug];
  const m = a[minSlug];
  if (d === undefined || m === undefined) return null;
  return Math.round(DAY_MID[d] * MIN_MID[m]);
}

function activityComposite(a: Answers): CompositeIndex | null {
  const vig = weeklyMinutes(a, "VigorousActivityDays", "VigorousActivityDuration");
  const mod = weeklyMinutes(a, "ModerateActivityDays", "ModerateActivityDuration");
  const walk = weeklyMinutes(a, "WalkingDays", "WalkingDuration");
  if (vig === null && mod === null && walk === null) return null;

  const modEq = (vig ?? 0) * 2 + (mod ?? 0) + (walk ?? 0);
  const pct = Math.round((modEq / 150) * 100);
  const score = clamp100(pct);
  const level = scoreMeta(score).level;

  const strengthDays = a.StrengthTrainingDays !== undefined ? STRENGTH_DAYS[a.StrengthTrainingDays] : null;
  const strengthOk = strengthDays !== null && strengthDays >= 2;

  const evidence: CompositeEvidence[] = [
    { label: "دقائقك الأسبوعية المكافئة", value: `${nums(modEq)} دقيقة`, level },
    { label: "هدف منظمة الصحة العالمية", value: "150 دقيقة معتدلة أسبوعيًا" },
  ];
  if (vig !== null) evidence.push({ label: "نشاط عالي الشدة", value: `≈ ${nums(vig)} دقيقة (تُحتسب مضاعفة)` });
  if (mod !== null) evidence.push({ label: "نشاط متوسط الشدة", value: `≈ ${nums(mod)} دقيقة` });
  if (walk !== null) evidence.push({ label: "مشي متواصل", value: `≈ ${nums(walk)} دقيقة` });
  if (strengthDays !== null)
    evidence.push({
      label: "تمارين المقاومة",
      value: strengthOk ? `≈ ${nums(strengthDays)} أيام — يحقق التوصية` : "أقل من يومين — دون التوصية",
      level: strengthOk ? "good" : "moderate",
    });

  const headline =
    pct >= 100
      ? `تحقق ${nums(Math.min(pct, 300))}% من توصية الحركة العالمية`
      : `تحقق ${nums(pct)}% فقط من توصية الحركة العالمية`;
  const detail =
    pct >= 100
      ? "مجموع حركتك الأسبوعية المقدّر من إجاباتك يتجاوز عتبة الـ150 دقيقة المعتدلة التي تربطها الأدلة بانخفاض ملموس في وفيات القلب والسكري. حافظ على الانتظام — الفائدة تأتي من الاستمرارية لا الشدة."
      : pct >= 50
        ? `أنت في منتصف الطريق: يفصلك نحو ${nums(Math.max(0, 150 - modEq))} دقيقة أسبوعيًا عن العتبة التي يتغيّر عندها منحنى المخاطر القلبية. جلستا مشي سريع إضافيتان تكفيان غالبًا.`
        : "مجموع حركتك الأسبوعية المقدّر أقل بوضوح من عتبة الـ150 دقيقة. الخبر الجيد أن أكبر قفزة صحية موثّقة تحدث عند الانتقال من الخمول إلى أي نشاط منتظم — وليس عند مستويات الرياضيين.";

  return {
    id: "activity-target",
    label: "رصيد الحركة الأسبوعي",
    score,
    level,
    headline,
    detail,
    evidence,
    basis: "توصيات منظمة الصحة العالمية للنشاط البدني 2020 (150–300 دقيقة معتدلة أسبوعيًا) وحساب دقائق بأسلوب استبيان IPAQ",
    dims: ["physical"],
  };
}

/* ── 3. Cardiometabolic risk-factor count ──────────────────────────────────── */

function cardioComposite(a: Answers, pi: PersonalInfoAnswers): CompositeIndex | null {
  const flags: CompositeEvidence[] = [];
  let checked = 0;

  const h = Number(pi.height);
  const w = Number(pi.weight);
  if (h > 80 && h < 260 && w > 25 && w < 400) {
    checked += 1;
    const bmi = w / Math.pow(h / 100, 2);
    if (bmi >= 30)
      flags.push({ label: "السمنة", value: `مؤشر كتلة الجسم ${bmi.toFixed(1)}`, level: "attention" });
    else if (bmi >= 25)
      flags.push({ label: "زيادة الوزن", value: `مؤشر كتلة الجسم ${bmi.toFixed(1)}`, level: "moderate" });
  }

  const waist = Number(pi.waistCircumference);
  if (waist > 40 && waist < 200) {
    checked += 1;
    const cut = pi.gender === "2" ? 88 : 102;
    if (waist >= cut)
      flags.push({ label: "سمنة بطنية", value: `محيط الخصر ${nums(waist)} سم (الحد ${nums(cut)})`, level: "attention" });
  }

  if (a.TobaccoUse !== undefined) {
    checked += 1;
    if (a.TobaccoUse <= 2)
      flags.push({
        label: "التدخين",
        value: a.TobaccoUse === 1 ? "استخدام يومي للتبغ" : "استخدام متقطع للتبغ",
        level: "attention",
      });
  }

  if (a.SittingHours !== undefined) {
    checked += 1;
    if (a.SittingHours <= 2)
      flags.push({
        label: "الجلوس المطوّل",
        value: a.SittingHours === 1 ? "10 ساعات فأكثر يوميًا" : "7–9 ساعات يوميًا",
        level: a.SittingHours === 1 ? "attention" : "moderate",
      });
  }

  const vig = weeklyMinutes(a, "VigorousActivityDays", "VigorousActivityDuration");
  const mod = weeklyMinutes(a, "ModerateActivityDays", "ModerateActivityDuration");
  const walk = weeklyMinutes(a, "WalkingDays", "WalkingDuration");
  if (vig !== null || mod !== null || walk !== null) {
    checked += 1;
    const modEq = (vig ?? 0) * 2 + (mod ?? 0) + (walk ?? 0);
    if (modEq < 150)
      flags.push({ label: "قلة النشاط", value: `≈ ${nums(modEq)} دقيقة أسبوعيًا (الهدف 150)`, level: "moderate" });
  }

  const diet = meanPos(a, ["FruitVegetableIntake", "FastFoodFrequency", "HighFatFoodPreference", "HighSaltFoodPreference"]);
  if (diet) {
    checked += 1;
    if (diet.f < 0.45)
      flags.push({ label: "نمط التغذية", value: "دهون/ملح مرتفعان وخضار قليلة", level: "moderate" });
  }

  if (a.SleepDuration !== undefined) {
    checked += 1;
    if (a.SleepDuration <= 2)
      flags.push({
        label: "قصر النوم",
        value: a.SleepDuration === 1 ? "أقل من 5 ساعات ليلًا" : "5–6 ساعات ليلًا",
        level: "moderate",
      });
  }

  if (a.MedicalConditions !== undefined) {
    checked += 1;
    if (a.MedicalConditions === 2 || a.MedicalConditions === 3 || a.MedicalConditions === 4)
      flags.push({
        label: "حالة مُشخّصة",
        value: a.MedicalConditions === 2 ? "السكري" : a.MedicalConditions === 3 ? "ارتفاع ضغط الدم" : "أمراض القلب",
        level: "attention",
      });
  }

  if (checked < 4) return null;

  // Attention flags weigh 1.5, moderate 1; the denominator is the worst case
  // (every checked factor flagged at attention), so 0 means "all red".
  const weight = flags.reduce((n, f) => n + (f.level === "attention" ? 1.5 : 1), 0);
  const score = clamp100(100 - (weight / (checked * 1.5)) * 100);
  const level = scoreMeta(score).level;
  const headline = flags.length
    ? `${nums(flags.length)} من ${nums(checked)} عوامل خطر قلبية استقلابية حاضرة`
    : `لا عوامل خطر قلبية استقلابية من ${nums(checked)} فُحصت`;

  return {
    id: "cardiometabolic",
    label: "عوامل الخطر القلبية الاستقلابية",
    score,
    level,
    headline,
    detail: flags.length
      ? "هذه العوامل تتضاعف ولا تتجمّع فقط: كل عامل يرفع أثر الذي يليه. الترتيب الأنجع علميًا هو البدء بالتدخين إن وُجد، ثم الحركة، ثم التغذية — لأن كل واحدة تسهّل التي بعدها. هذا فرز مبني على إجاباتك وليس تشخيصًا طبيًا."
      : "إجاباتك وقياساتك لا تُظهر أيًا من عوامل الخطر القابلة للتعديل التي فحصناها — وزن، خصر، تدخين، حركة، تغذية، نوم. هذا أفضل استثمار طويل الأمد تملكه؛ حافظ عليه.",
    evidence: flags.length ? flags : [{ label: "النتيجة", value: "كل العوامل المفحوصة سليمة", level: "good" }],
    basis: "عدّ عوامل الخطر القابلة للتعديل وفق أطر الفحص القلبي الاستقلابي (WHO / AHA) — فرز أولي وليس تشخيصًا",
    dims: ["physical"],
  };
}

/* ── 4. Job demands vs resources — JD-R balance ────────────────────────────── */

function jdrComposite(a: Answers): CompositeIndex | null {
  const eePos = meanPos(a, EE); // higher = more exhaustion (demand proxy)
  const finPos = meanPos(a, FIN_STRAIN); // higher raw = LESS strain (4=none)
  const bullyPos = pos(a, "WorkplaceBullying"); // higher = safer
  const res = meanPos(a, WP_RESOURCES);
  if (!eePos && !res) return null;

  const demandParts: number[] = [];
  if (eePos) demandParts.push(eePos.f);
  if (finPos) demandParts.push(1 - finPos.f);
  if (bullyPos !== null) demandParts.push(1 - bullyPos);
  const demands = demandParts.length
    ? clamp100((demandParts.reduce((s, v) => s + v, 0) / demandParts.length) * 100)
    : null;
  const resources = res ? clamp100(res.f * 100) : null;
  if (demands === null || resources === null) return null;

  const score = clamp100(50 + (resources - demands) / 2);
  const heavyDemand = demands >= 55;
  const richResources = resources >= 65;

  let headline: string;
  let detail: string;
  if (heavyDemand && !richResources) {
    headline = "متطلبات ثقيلة وموارد لا تكفيها";
    detail =
      "الضغوط الواقعة عليك (إنهاك العمل، الضغط المالي، بيئة التعامل) أعلى من الموارد المتاحة لك (دعم المدير، التقدير، النمو، الانتماء). هذا هو التركيب الذي يتنبأ بالاحتراق في نموذج JD-R — والحل المثبت ليس تحمّلًا أكثر، بل رفع الموارد: محادثة صريحة عن العبء، وطلب دعم وتقدير أوضح.";
  } else if (heavyDemand && richResources) {
    headline = "عمل متطلّب لكنه مسنود";
    detail =
      "متطلبات عملك مرتفعة، لكن مواردك — الدعم والتقدير والمعنى — مرتفعة بالمثل. في نموذج JD-R هذا مزيج «التحدي المدعوم»: مرهق أحيانًا لكنه يبني نموًا لا احتراقًا، ما دامت الموارد حاضرة فعلًا وقت الشدة.";
  } else if (!heavyDemand && !richResources) {
    headline = "ضغط منخفض وموارد محدودة";
    detail =
      "لا تقع تحت ضغط شديد حاليًا، لكن رصيدك من الموارد الوظيفية (تقدير، نمو، دعم) محدود أيضًا. هذا وضع هادئ لكنه هش: أي ارتفاع مفاجئ في المتطلبات سيجدك دون شبكة. الوقت مناسب لبناء الموارد قبل الحاجة إليها.";
  } else {
    headline = "توازن صحي: موارد تفيض عن المتطلبات";
    detail =
      "مواردك الوظيفية تتجاوز الضغوط الواقعة عليك — الوضع الذي يتنبأ في نموذج JD-R بالاندماج لا الاحتراق. هذا الفائض هو ما يسمح لك بأخذ تحديات أكبر بأمان.";
  }

  return {
    id: "jdr-balance",
    label: "ميزان الضغوط والموارد",
    score,
    level: scoreMeta(score).level,
    headline,
    detail,
    evidence: [
      { label: "المتطلبات الواقعة عليك", value: `${nums(demands)} من 100`, level: demands >= 65 ? "attention" : demands >= 45 ? "moderate" : "good" },
      { label: "الموارد المتاحة لك", value: `${nums(resources)} من 100`, level: scoreMeta(resources).level },
      { label: "صافي الميزان", value: `${resources - demands >= 0 ? "+" : "−"}${nums(Math.abs(resources - demands))} لصالح ${resources >= demands ? "الموارد" : "المتطلبات"}` },
    ],
    basis: "نموذج متطلبات وموارد العمل JD-R لـ Demerouti & Bakker — أكثر نماذج الاحتراق تحققًا تجريبيًا",
    dims: ["professional", "workplace", "financial"],
  };
}

/* ── 5. Retention outlook — turnover intent + its drivers ──────────────────── */

function retentionComposite(a: Answers): CompositeIndex | null {
  const intent = pos(a, "TurnoverIntention"); // higher = intends to stay
  if (intent === null) return null;
  const vigour = meanPos(a, VIGOUR);
  const recog = meanPos(a, RECOGNITION);
  const growth = meanPos(a, GROWTH);

  // Weighted stay-score: stated intent carries half, the three strongest
  // known antecedents of turnover carry the rest.
  let score = intent * 0.5;
  let weight = 0.5;
  if (vigour) { score += vigour.f * 0.2; weight += 0.2; }
  if (recog) { score += recog.f * 0.15; weight += 0.15; }
  if (growth) { score += growth.f * 0.15; weight += 0.15; }
  const stay = clamp100((score / weight) * 100);

  const drivers: { label: string; f: number }[] = [];
  if (vigour) drivers.push({ label: "الحماس والاندماج", f: vigour.f });
  if (recog) drivers.push({ label: "التقدير ودعم المدير", f: recog.f });
  if (growth) drivers.push({ label: "وضوح النمو والمسار", f: growth.f });
  drivers.sort((x, y) => x.f - y.f);
  const weakest = drivers.filter((d) => d.f < 0.6);

  const headline =
    stay >= 75
      ? "ارتباطك بمنظمتك مستقر"
      : stay >= 55
        ? "ارتباط متذبذب — قابل للكسب أو الخسارة"
        : "مؤشرات مبكرة على نية مغادرة";
  const detail =
    stay >= 75
      ? "نيتك المعلنة للبقاء ومحركاتها الثلاثة الكبرى — الاندماج والتقدير والنمو — كلها في النطاق الصحي. أبحاث الدوران الوظيفي تجد أن هذا التركيب هو الأكثر ثباتًا."
      : weakest.length
        ? `نية البقاء تتأثر قبل أي شيء بثلاثة محركات، وأضعفها لديك حاليًا: ${weakest.map((d) => d.label).join("، و")}. الأثر الأقوى يأتي من معالجة هذه تحديدًا — لا من حوافز عامة.`
        : "نيتك المعلنة متوسطة رغم أن المحركات الأساسية بخير — قد يكون العامل خارج نطاق هذا القياس (عرض خارجي، ظرف شخصي). يستحق حوارًا مفتوحًا.";

  return {
    id: "retention",
    label: "بوصلة الاستقرار الوظيفي",
    score: stay,
    level: scoreMeta(stay).level,
    headline,
    detail,
    evidence: [
      { label: "نية البقاء المعلنة", value: `${nums(Math.round(intent * 100))} من 100`, level: scoreMeta(intent * 100).level },
      ...drivers.map((d) => ({
        label: d.label,
        value: `${nums(Math.round(d.f * 100))} من 100`,
        level: scoreMeta(d.f * 100).level,
      })),
    ],
    basis: "تحليلات Rubenstein وزملائه التلوية لمقدّمات الدوران الوظيفي: النية المعلنة أقوى منبئ، يليها الاندماج والتقدير والنمو",
    dims: ["workplace"],
  };
}

/* ── 6. Resilience reserve — Conservation of Resources ─────────────────────── */

function resilienceComposite(a: Answers): CompositeIndex | null {
  const pillars: { label: string; f: number }[] = [];

  const stability = meanPos(a, hraData.find((d) => d.slug === "psycho")?.questions.map((q) => q.slug) ?? []);
  if (stability) pillars.push({ label: "الاستقرار النفسي", f: 1 - stability.f });

  const social = meanPos(a, hraData.find((d) => d.slug === "social")?.questions.map((q) => q.slug) ?? []);
  if (social) pillars.push({ label: "الطاقة الاجتماعية", f: social.f });

  const community = meanPos(a, hraData.find((d) => d.slug === "community")?.questions.map((q) => q.slug) ?? []);
  if (community) pillars.push({ label: "شبكة الثقة والعلاقات", f: community.f });

  if (a.SleepDuration !== undefined) {
    // 7–8h is the recovery sweet spot; 9+ is fine, short sleep erodes it.
    const f = a.SleepDuration === 3 ? 1 : a.SleepDuration === 4 ? 0.85 : a.SleepDuration === 2 ? 0.45 : 0.15;
    pillars.push({ label: "نوم التعافي", f });
  }

  const vig = weeklyMinutes(a, "VigorousActivityDays", "VigorousActivityDuration");
  const mod = weeklyMinutes(a, "ModerateActivityDays", "ModerateActivityDuration");
  const walk = weeklyMinutes(a, "WalkingDays", "WalkingDuration");
  if (vig !== null || mod !== null || walk !== null) {
    const modEq = (vig ?? 0) * 2 + (mod ?? 0) + (walk ?? 0);
    pillars.push({ label: "اللياقة كمخزون طاقة", f: Math.min(1, modEq / 150) });
  }

  const buffer = meanPos(a, ["EmergencyFund", "EmergencyConfidence"]);
  if (buffer) pillars.push({ label: "الاحتياطي المالي", f: buffer.f });

  const belong = meanPos(a, ["TeamBelonging", "RespectInclusion", "ManagerSupport"]);
  if (belong) pillars.push({ label: "الإسناد في العمل", f: belong.f });

  if (pillars.length < 4) return null;

  const score = clamp100((pillars.reduce((s, p) => s + p.f, 0) / pillars.length) * 100);
  const weakest = [...pillars].sort((x, y) => x.f - y.f)[0];
  const strongest = [...pillars].sort((x, y) => y.f - x.f)[0];

  return {
    id: "resilience",
    label: "مخزون الصمود",
    score,
    level: scoreMeta(score).level,
    headline:
      score >= 75
        ? "احتياطياتك للأزمات ممتلئة"
        : score >= 60
          ? "مخزون كافٍ ليوم عادي — لا لأزمة طويلة"
          : "احتياطياتك للضغط شبه مستنفدة",
    detail: `نظرية «حفظ الموارد» تفسّر الصمود بما تملكه فعلًا من موارد قابلة للسحب وقت الشدة، لا بقوة الإرادة. أمتن أعمدتك الآن ${strongest.label} (${nums(Math.round(strongest.f * 100))})، وأكثرها استنزافًا ${weakest.label} (${nums(Math.round(weakest.f * 100))}) — والاستثمار في العمود الأضعف يرفع المخزون كله لأن الموارد تتكاثر متسلسلة.`,
    evidence: pillars.map((p) => ({
      label: p.label,
      value: `${nums(Math.round(p.f * 100))} من 100`,
      level: scoreMeta(p.f * 100).level,
    })),
    basis: "نظرية حفظ الموارد (Conservation of Resources — Hobfoll): الصمود = رصيد مواردك القابلة للسحب",
    dims: ["psycho", "social", "community", "physical", "financial", "workplace"],
  };
}

/* ── 7. Subjective vitality — energy read across four dimensions ───────────── */
/*  The same "how much fuel do I have" question hides in four scales: work
    vitality (professional), pace (social), fitness self-rating and sleep
    (physical). Reading them together gives one honest energy account.         */

function vitalityComposite(a: Answers): CompositeIndex | null {
  const parts: { label: string; f: number }[] = [];

  const work = meanPos(a, ["VitalityEnergy", "MorningFatigueWorkday"]);
  if (work) parts.push({ label: "طاقتك في العمل", f: 1 - work.f });

  const socialEnergy = meanPos(a, ["EnergeticActive", "VeryActive"]);
  if (socialEnergy) parts.push({ label: "نشاطك اليومي العام", f: socialEnergy.f });

  const fit = pos(a, "FitnessLevel");
  if (fit !== null) parts.push({ label: "لياقتك كما تقيّمها", f: fit });

  if (a.SleepDuration !== undefined) {
    const f = a.SleepDuration === 3 ? 1 : a.SleepDuration === 4 ? 0.85 : a.SleepDuration === 2 ? 0.45 : 0.15;
    parts.push({ label: "وقود النوم", f });
  }

  if (parts.length < 3) return null;
  const score = clamp100((parts.reduce((s, p) => s + p.f, 0) / parts.length) * 100);
  const weakest = [...parts].sort((x, y) => x.f - y.f)[0];

  return {
    id: "vitality",
    label: "مؤشر الطاقة الحيوية",
    score,
    level: scoreMeta(score).level,
    headline:
      score >= 75
        ? "خزان طاقتك ممتلئ ومصادره متعددة"
        : score >= 60
          ? "طاقة كافية ليومك — مع تسريب من مصدر واحد على الأقل"
          : "خزان الطاقة منخفض عبر أكثر من مصدر",
    detail: `سألناك عن طاقتك بأربع طرق مختلفة في أربعة أماكن متباعدة من التقييم — في العمل، في يومك العام، في لياقتك، وفي نومك — وجمعنا الإجابات في حساب واحد. أدنى مصادرك حاليًا «${weakest.label}» (${nums(Math.round(weakest.f * 100))} من 100)، والطاقة تتسرب من أضعف نقطة لا من متوسطها.`,
    evidence: parts.map((p) => ({
      label: p.label,
      value: `${nums(Math.round(p.f * 100))} من 100`,
      level: scoreMeta(p.f * 100).level,
    })),
    basis: "مفهوم الحيوية الذاتية Subjective Vitality (Ryan & Frederick 1997) — منبئ موثق بالصحة والأداء",
    dims: ["professional", "social", "physical"],
  };
}

/* ── 8. Cross-domain self-regulation ───────────────────────────────────────── */
/*  Self-control shows up in four unrelated corners of the questionnaire: how
    you run your tasks, your money, your reactions, and your health habits.
    Scoring them side by side reveals whether discipline is a general asset or
    lives in one domain only — and which domain to copy from.                  */

function selfRegulationComposite(a: Answers): CompositeIndex | null {
  const domains: { label: string; f: number }[] = [];

  const tasks = meanPos(a, ["TimeManagementSkill", "WasteTimeProcrastination", "ProductivePerson", "CommitmentCompletion"]);
  if (tasks) domains.push({ label: "ضبط المهام والوقت", f: tasks.f });

  const money = meanPos(a, ["LongTermGoals", "DailySpendingAwareness", "EmergencyFund"]);
  if (money) domains.push({ label: "ضبط المال", f: money.f });

  const emotions = meanPos(a, ["AngerTreatment", "ShameHiding", "EmotionalCollapse", "FrustrationHelplessness"]);
  if (emotions) domains.push({ label: "ضبط الانفعالات", f: 1 - emotions.f });

  const habits = meanPos(a, ["FastFoodFrequency", "TobaccoUse"]);
  if (habits) domains.push({ label: "ضبط العادات الصحية", f: habits.f });

  if (domains.length < 3) return null;
  const score = clamp100((domains.reduce((s, d) => s + d.f, 0) / domains.length) * 100);
  const sorted = [...domains].sort((x, y) => y.f - x.f);
  const top = sorted[0];
  const low = sorted[sorted.length - 1];
  const gap = Math.round((top.f - low.f) * 100);

  return {
    id: "self-regulation",
    label: "ضبط الذات عبر المجالات",
    score,
    level: scoreMeta(score).level,
    headline:
      gap >= 30
        ? `انضباطك ليس سمة واحدة: قوي في ${top.label.replace("ضبط ", "")} وضعيف في ${low.label.replace("ضبط ", "")}`
        : score >= 75
          ? "انضباط عام متين عبر المجالات الأربعة"
          : score >= 60
            ? "ضبط ذات متوسط ومتقارب عبر المجالات"
            : "ضبط الذات منخفض عبر أكثر من مجال",
    detail:
      gap >= 30
        ? `قسنا انضباطك في أربعة مجالات لا يجمعها سؤال واحد. الفارق بين أقواها (${top.label} — ${nums(Math.round(top.f * 100))}) وأضعفها (${low.label} — ${nums(Math.round(low.f * 100))}) يبلغ ${nums(gap)} نقطة. هذا خبر جيد: المشكلة ليست «إرادة ضعيفة» عامة — أنت تملك آليات ضبط ناجحة فعلًا، لكنها مركّبة في مجال دون آخر. الآليات تُنقل: نفس التكتيك الذي يضبط ${top.label.replace("ضبط ", "")} لديك (مواعيد؟ أتمتة؟ قواعد ثابتة؟) قابل للتركيب على ${low.label.replace("ضبط ", "")}.`
        : `قسنا انضباطك في أربعة مجالات متباعدة — المهام، المال، الانفعالات، والعادات — وجاءت متقاربة حول ${nums(score)} من 100. الاتساق نفسه معلومة: ما تبنيه من عادات في مجال سينسحب على البقية غالبًا.`,
    evidence: domains.map((d) => ({
      label: d.label,
      value: `${nums(Math.round(d.f * 100))} من 100`,
      level: scoreMeta(d.f * 100).level,
    })),
    basis: "دراسة Dunedin الممتدة 32 سنة (Moffitt وآخرون، PNAS 2011): ضبط الذات يتنبأ بالصحة والثروة مستقلًا عن الذكاء والطبقة",
    dims: ["belonging", "financial", "psycho", "physical"],
  };
}

/* ── 9. Daily sedentary load — sitting + commute, vs the activity offset ───── */

const SIT_HOURS: Record<number, number> = { 1: 10.5, 2: 8, 3: 5, 4: 3 };
/** Vehicle answers are ordered best→worst reversed: value 1 = most days / longest. */
const COMMUTE_DAYS: Record<number, number> = { 1: 6.5, 2: 4.5, 3: 2.5, 4: 0.5 };
const COMMUTE_MIN: Record<number, number> = { 1: 75, 2: 45, 3: 22, 4: 10 };

function sedentaryComposite(a: Answers): CompositeIndex | null {
  if (a.SittingHours === undefined) return null;
  const sit = SIT_HOURS[a.SittingHours];

  let commuteWeekly: number | null = null;
  if (a.VehicleUseDays !== undefined && a.VehicleDuration !== undefined) {
    commuteWeekly = Math.round(COMMUTE_DAYS[a.VehicleUseDays] * COMMUTE_MIN[a.VehicleDuration]);
  }
  const commuteDaily = commuteWeekly !== null ? commuteWeekly / 7 / 60 : 0;
  const total = sit + commuteDaily;

  const vig = weeklyMinutes(a, "VigorousActivityDays", "VigorousActivityDuration");
  const mod = weeklyMinutes(a, "ModerateActivityDays", "ModerateActivityDuration");
  const walk = weeklyMinutes(a, "WalkingDays", "WalkingDuration");
  const modEq = vig === null && mod === null && walk === null ? null : (vig ?? 0) * 2 + (mod ?? 0) + (walk ?? 0);
  const dailyMvpa = modEq !== null ? Math.round(modEq / 7) : null;
  const offset = dailyMvpa !== null && dailyMvpa >= 60;

  const base = total <= 5 ? 88 : total <= 7 ? 72 : total <= 9 ? 55 : total <= 11 ? 40 : 28;
  const score = clamp100(base + (offset ? 12 : 0));
  const deskBound = a.SedentaryWork !== undefined && a.SedentaryWork <= 2;

  const evidence: CompositeEvidence[] = [
    { label: "جلوسك اليومي المقدَّر", value: `≈ ${total.toFixed(1)} ساعة`, level: total <= 6 ? "good" : total <= 9 ? "moderate" : "attention" },
  ];
  if (commuteWeekly !== null)
    evidence.push({ label: "منها داخل المركبة", value: `≈ ${nums(Math.round(commuteDaily * 60))} دقيقة/يوم` });
  if (dailyMvpa !== null)
    evidence.push({
      label: "حركتك المعوِّضة",
      value: `≈ ${nums(dailyMvpa)} دقيقة/يوم (عتبة التعويض 60–75)`,
      level: offset ? "good" : "attention",
    });

  return {
    id: "sedentary-load",
    label: "الحمل الجلوسي اليومي",
    score,
    level: scoreMeta(score).level,
    headline: offset
      ? `≈ ${total.toFixed(1)} ساعة جلوس يوميًا — لكن حركتك تعوّض أثرها`
      : `≈ ${total.toFixed(1)} ساعة جلوس يوميًا دون تعويض حركي كافٍ`,
    detail: `جمعنا جلوسك المعلن مع وقت المركبة${deskBound ? " وطبيعة عملك المكتبية" : ""} في رقم واحد: نحو ${total.toFixed(1)} ساعة خمول يوميًا. ${
      offset
        ? "الخبر الجيد أن مستوى حركتك الحالي يقع فوق العتبة التي وجدت الأبحاث أنها تلغي تقريبًا ارتباط الجلوس الطويل بالوفيات — استمرارك عليها هو ما يبقي هذا الرقم آمنًا."
        : "عند هذا المستوى من الجلوس، الأبحاث تجد أن إلغاء أثره يتطلب 60–75 دقيقة حركة معتدلة يوميًا — وأنت دون ذلك حاليًا. الخيار الثاني: خفض الجلوس نفسه بفواصل وقوف قصيرة متكررة."
    }`,
    evidence,
    basis: "تحليل Ekelund التلوي (The Lancet 2016، مليون+ مشارك): 60–75 دقيقة نشاط معتدل يوميًا تلغي ارتباط الجلوس الطويل بالوفيات",
    dims: ["physical"],
  };
}

/* ── Measurement quality — coverage + individual response consistency ──────── */
/*  Groups of near-duplicate items measuring one construct; the spread between
    a person's answers inside each group is an individual-level reliability
    read. Low spread → the profile can be trusted; high spread → flag it.      */

const QUALITY_GROUPS: string[][] = [
  EE,
  ["SadnessDepressionFree", "LonelinessSadnessFree", "WorthlessnessFeelings", "InferiorityFeelings"],
  VIGOUR,
  FIN_STRAIN,
  ["KeepThingsOrganized", "NotOrganized", "NeverOrganized"],
];

function measurementQuality(a: Answers): MeasurementQuality | null {
  const answered = Object.keys(a).filter((s) => QUESTIONS.has(s)).length;
  if (!answered) return null;
  const coverage = clamp100((answered / QUESTIONS.size) * 100);

  const sds: number[] = [];
  for (const group of QUALITY_GROUPS) {
    const ps = group.map((s) => pos(a, s)).filter((p): p is number => p !== null);
    if (ps.length < 2) continue;
    const mean = ps.reduce((s, v) => s + v, 0) / ps.length;
    const sd = Math.sqrt(ps.reduce((s, v) => s + (v - mean) ** 2, 0) / ps.length);
    sds.push(sd);
  }
  if (!sds.length) return null;
  const avgSd = sds.reduce((s, v) => s + v, 0) / sds.length;
  const consistency = clamp100(100 - avgSd * 260);
  const level = scoreMeta(consistency).level;

  return {
    coverage,
    consistency,
    level,
    reading:
      level === "good"
        ? "إجاباتك على الأسئلة التي تقيس الشيء نفسه بصياغات مختلفة جاءت متسقة — قراءاتك أدناه موثوقة."
        : level === "moderate"
          ? "اتساق جيد عمومًا مع تباعد بسيط في بعض الأسئلة المتشابهة — القراءات صالحة مع هامش."
          : "تباعدت إجاباتك على بعض الأسئلة المتشابهة — القراءات تبقى مفيدة، لكن راجع الأبعاد التي لم تكن متأكدًا من إجاباتها.",
  };
}

/* ── 10. Wellness age — the classic HRA headline, with an itemised ledger ──── */
/*  Chronological age adjusted by the person's own modifiable factors, each
    priced in ± years. The ledger IS the product: every habit gets a cost or a
    credit the person can read line by line. Deliberately conservative and
    labelled as awareness arithmetic, not diagnosis.                           */

const PSY_STRESS_SLUGS = ["StressNervousness", "EmotionalCollapse", "AnxietyNotProne", "FearAnxietyFree"];

function wellnessAgeComposite(a: Answers, pi: PersonalInfoAnswers): CompositeIndex | null {
  const age = ageOf(pi);
  if (age === null) return null;

  const ledger: { label: string; years: number }[] = [];
  let checked = 0;

  if (a.TobaccoUse !== undefined) {
    checked += 1;
    if (a.TobaccoUse === 1) ledger.push({ label: "تدخين يومي", years: 4 });
    else if (a.TobaccoUse === 2) ledger.push({ label: "تدخين متقطع", years: 2 });
    else if (a.TobaccoUse === 4) ledger.push({ label: "خلوّك من التبغ", years: -1 });
  }

  const h = Number(pi.height);
  const w = Number(pi.weight);
  if (h > 80 && h < 260 && w > 25 && w < 400) {
    checked += 1;
    const bmi = w / Math.pow(h / 100, 2);
    if (bmi >= 35) ledger.push({ label: "سمنة من الدرجة الثانية+", years: 4 });
    else if (bmi >= 30) ledger.push({ label: "السمنة", years: 3 });
    else if (bmi >= 25) ledger.push({ label: "زيادة الوزن", years: 1.5 });
    else if (bmi >= 18.5) ledger.push({ label: "وزن ضمن النطاق الصحي", years: -1 });
  }

  const waist = Number(pi.waistCircumference);
  if (waist > 40 && waist < 200 && waist >= (pi.gender === "2" ? 88 : 102)) {
    checked += 1;
    ledger.push({ label: "سمنة بطنية", years: 1.5 });
  }

  const vig = weeklyMinutes(a, "VigorousActivityDays", "VigorousActivityDuration");
  const mod = weeklyMinutes(a, "ModerateActivityDays", "ModerateActivityDuration");
  const walk = weeklyMinutes(a, "WalkingDays", "WalkingDuration");
  if (vig !== null || mod !== null || walk !== null) {
    checked += 1;
    const modEq = (vig ?? 0) * 2 + (mod ?? 0) + (walk ?? 0);
    if (modEq >= 300) ledger.push({ label: "نشاط بدني فوق التوصية", years: -2 });
    else if (modEq >= 150) ledger.push({ label: "نشاط بدني يحقق التوصية", years: -1 });
    else if (modEq < 75) ledger.push({ label: "خمول بدني واضح", years: 2 });
    else ledger.push({ label: "نشاط بدني دون التوصية", years: 1 });
  }

  if (a.SleepDuration !== undefined) {
    checked += 1;
    if (a.SleepDuration === 1) ledger.push({ label: "نوم أقل من 5 ساعات", years: 2 });
    else if (a.SleepDuration === 2) ledger.push({ label: "نوم 5–6 ساعات", years: 1 });
    else if (a.SleepDuration === 3) ledger.push({ label: "نوم 7–8 ساعات", years: -0.5 });
  }

  const diet = meanPos(a, ["FruitVegetableIntake", "FastFoodFrequency", "HighFatFoodPreference", "HighSaltFoodPreference"]);
  if (diet) {
    checked += 1;
    if (diet.f >= 0.7) ledger.push({ label: "نمط غذائي جيد", years: -1 });
    else if (diet.f < 0.45) ledger.push({ label: "نمط غذائي مرتفع الدهون/الملح", years: 1.5 });
  }

  if (a.MedicalConditions !== undefined && [2, 3, 4].includes(a.MedicalConditions)) {
    checked += 1;
    const name = a.MedicalConditions === 2 ? "السكري" : a.MedicalConditions === 3 ? "ارتفاع ضغط الدم" : "أمراض القلب";
    ledger.push({ label: `حالة مُشخّصة: ${name}`, years: 3 });
  }

  const ee = meanPos(a, EE);
  const psy = meanPos(a, PSY_STRESS_SLUGS);
  if (ee || psy) {
    checked += 1;
    if ((ee && ee.f >= 0.6) || (psy && psy.f >= 0.65)) ledger.push({ label: "إجهاد/توتر مزمن مرتفع", years: 1 });
  }

  if (a.BloodPressureCheck !== undefined && a.CholesterolCheck !== undefined && a.BloodSugarCheck !== undefined) {
    checked += 1;
    if (a.BloodPressureCheck > 1 && a.CholesterolCheck === 4 && a.BloodSugarCheck === 4)
      ledger.push({ label: "فحوصاتك الوقائية محدّثة", years: -0.5 });
  }

  if (checked < 5) return null;

  const delta = Math.max(-8, Math.min(15, ledger.reduce((s, l) => s + l.years, 0)));
  const wellnessAge = Math.round(age + delta);
  const score = delta <= -3 ? 92 : delta <= 0 ? 80 : delta <= 3 ? 62 : delta <= 6 ? 45 : 28;
  const fmtY = (y: number) =>
    `${y > 0 ? "+" : "−"}${Math.abs(y) % 1 === 0 ? nums(Math.abs(y)) : Math.abs(y).toFixed(1)} سنة`;

  return {
    id: "wellness-age",
    label: "عمرك الصحي التقديري",
    score,
    level: scoreMeta(score).level,
    headline:
      delta <= -1
        ? `عمرك الصحي ≈ ${nums(wellnessAge)} — أصغر من عمرك الزمني بنحو ${nums(Math.round(Math.abs(delta)))} سنوات`
        : delta >= 1
          ? `عمرك الصحي ≈ ${nums(wellnessAge)} — أكبر من عمرك الزمني بنحو ${nums(Math.round(delta))} سنوات`
          : `عمرك الصحي ≈ ${nums(wellnessAge)} — مطابق تقريبًا لعمرك الزمني`,
    detail: `عمرك الزمني ${nums(age)} سنة. سعّرنا كل عادة وعامل خطر في إجاباتك بسنوات — هذه محاسبة توعوية مبسّطة لا تشخيص، لكن اتجاهها مبني على أدلة: كل بند في الكشف أدناه قابل للتعديل${
      delta >= 1 ? "، أي أن هذه السنوات قابلة للاسترداد — والبنود الأثقل أولًا" : " — وهذا الرصيد الإيجابي يستحق الحماية"
    }.`,
    evidence: [
      { label: "عمرك الزمني", value: `${nums(age)} سنة` },
      ...ledger.map((l) => ({
        label: l.label,
        value: fmtY(l.years),
        level: (l.years > 0 ? "attention" : "good") as ScoreLevel,
      })),
      { label: "المحصلة", value: fmtY(delta) },
    ],
    basis: "مفهوم عمر القلب/العمر الصحي (Framingham Heart Age — D'Agostino وآخرون، 2008) بتقدير مبسّط توعوي، لا تشخيصي",
    dims: ["physical", "professional", "psycho"],
  };
}

/* ── 11. Stress-source decomposition — where the pressure actually comes from  */

function stressMapComposite(a: Answers): CompositeIndex | null {
  const sources: { label: string; f: number }[] = [];

  const work = meanPos(a, EE);
  if (work) sources.push({ label: "ضغط العمل والإنهاك", f: work.f });

  const fin = meanPos(a, FIN_STRAIN);
  if (fin) sources.push({ label: "الضغط المالي", f: 1 - fin.f });

  const psy = meanPos(a, PSY_STRESS_SLUGS);
  if (psy) sources.push({ label: "القلق والتوتر العام", f: psy.f });

  const env = meanPos(a, ["WorkplaceBullying", "SpeakUpSafety", "IdeaFearHesitation"]);
  if (env) sources.push({ label: "بيئة العمل وأمانها", f: 1 - env.f });

  if (sources.length < 3) return null;

  const total = sources.reduce((s, x) => s + x.f, 0);
  const meanStrain = total / sources.length;
  const score = clamp100((1 - meanStrain) * 100);
  const ranked = [...sources].sort((x, y) => y.f - x.f);
  const top = ranked[0];
  const calm = meanStrain < 0.35 || top.f < 0.4;
  const share = total > 0 ? Math.round((top.f / total) * 100) : 0;

  return {
    id: "stress-map",
    label: "خريطة مصادر الضغط",
    score,
    level: scoreMeta(score).level,
    headline: calm
      ? "لا يوجد مصدر ضغط بارز في حياتك حاليًا"
      : `أكبر مصدر لضغطك: ${top.label} (≈ ${nums(share)}% من المجموع)`,
    detail: calm
      ? "قسنا الضغط الواقع عليك من أربعة اتجاهات مستقلة — العمل، المال، القلق العام، وبيئة العمل — وجاءت كلها في النطاق المنخفض. هذا نادر نسبيًا ويستحق أن تعرف مصدره لتحافظ عليه."
      : `الضغط ليس كتلة واحدة — قسنا مصادره الأربعة كلًّا على حدة. ${top.label} يتصدر بوضوح، وهذا يغيّر الوصفة: تقنيات الاسترخاء العامة تخفف الأعراض، لكن العلاج الفعلي يكون في مصدر الضغط الأكبر نفسه${
          ranked[1] && ranked[1].f >= 0.5 ? `، مع انتباه للمصدر الثاني (${ranked[1].label})` : ""
        }.`,
    evidence: ranked.map((s) => ({
      label: s.label,
      value: `شدّة ${nums(Math.round(s.f * 100))}/100 · ≈ ${nums(total > 0 ? Math.round((s.f / total) * 100) : 0)}%`,
      level: s.f >= 0.6 ? "attention" : s.f >= 0.4 ? "moderate" : ("good" as ScoreLevel),
    })),
    basis: "تفكيك المتطلبات في نموذج JD-R، ومنهج مسوح APA (Stress in America) في قياس مصادر الضغط منفصلة",
    dims: ["professional", "financial", "psycho", "workplace"],
  };
}

/* ── 12. Big-Five profile + work-style persona ─────────────────────────────── */

export const dimSlugs = (slug: DimensionId): string[] =>
  hraData.find((d) => d.slug === slug)?.questions.map((q) => q.slug) ?? [];

interface TraitDef {
  id: string;
  label: string;
  dim: DimensionId;
  invert: boolean;
  lowPole: string;
  highPole: string;
  high: string;
  mid: string;
  low: string;
}

const TRAITS: TraitDef[] = [
  {
    id: "openness", label: "الانفتاح على الخبرة", dim: "intellectual", invert: false,
    lowPole: "عملي ومجرّب", highPole: "فضولي ومستكشف",
    high: "تنجذب للأفكار والتجارب الجديدة وتضيق بالروتين — أفضل بيئاتك ما تتجدد فيه المشكلات.",
    mid: "توازن بين حب الاستكشاف وقيمة المجرّب — تتبنى الجديد بعد أن يثبت جدواه.",
    low: "تفضّل الطرق المجرّبة والملموسة على التنظير — قوة في التنفيذ والاستقرار.",
  },
  {
    id: "conscientiousness", label: "يقظة الضمير", dim: "belonging", invert: false,
    lowPole: "مرن وتلقائي", highPole: "منظم ومثابر",
    high: "منظم وموثوق وتفي بما تلتزم به — السمة الأقوى ارتباطًا بالأداء المهني في كل التحليلات التلوية.",
    mid: "منظم عند الحاجة دون صرامة — تحتفظ بمرونة تساعد في البيئات المتغيرة.",
    low: "تعمل بتلقائية وتضيق بالجداول الصارمة — تزدهر مع أهداف واضحة وحرية في الطريقة.",
  },
  {
    id: "extraversion", label: "الانبساط", dim: "social", invert: false,
    lowPole: "هادئ ومتأمل", highPole: "اجتماعي وحيوي",
    high: "تستمد طاقتك من الناس والتفاعل — العزلة الطويلة تستنزفك أكثر من العمل نفسه.",
    mid: "منبسط انتقائيًا: اجتماعي حين يلزم، ومحتاج لوقتك الخاص لتستعيد طاقتك.",
    low: "تركيزك العميق يزدهر في الهدوء — الاجتماعات الكثيفة تكلفك طاقة حقيقية.",
  },
  {
    id: "agreeableness", label: "الطيبة والتعاون", dim: "community", invert: false,
    lowPole: "حازم وتنافسي", highPole: "متعاون ومتعاطف",
    high: "تثق وتتعاون وتراعي الآخرين — رصيد علاقات عالٍ، مع تنبّه ألا يتحوّل لطفك إلى عبء عليك.",
    mid: "تجمع بين التعاون والحزم — تساعد دون أن تفرّط في مصلحتك.",
    low: "مباشر وتنافسي وتدافع عن موقفك — قوة في التفاوض تحتاج موازنة في العلاقات القريبة.",
  },
  {
    id: "stability", label: "الاتزان الانفعالي", dim: "psycho", invert: true,
    lowPole: "حسّاس للضغط", highPole: "هادئ تحت الضغط",
    high: "تحتفظ بهدوئك تحت الضغط وتتعافى سريعًا من الانتكاسات — عامل حماية قوي ضد الاحتراق.",
    mid: "متزن غالبًا مع حساسية للضغط الشديد — تحتاج فترات تعافٍ بعد الذروات.",
    low: "تعيش المشاعر بعمق وتتأثر بالضغط سريعًا — وعيك بها هو أول أدوات إدارتها.",
  },
];

function computeTraits(a: Answers): TraitScore[] {
  const out: TraitScore[] = [];
  for (const t of TRAITS) {
    const p = meanPos(a, dimSlugs(t.dim));
    if (!p || p.n < 6) continue;
    const f = t.invert ? 1 - p.f : p.f;
    const score = clamp100(f * 100);
    out.push({
      id: t.id,
      label: t.label,
      score,
      lowPole: t.lowPole,
      highPole: t.highPole,
      reading: score >= 65 ? t.high : score >= 40 ? t.mid : t.low,
    });
  }
  return out;
}

/** A work-style persona from the two most distinctive traits. */
function personaOf(traits: TraitScore[]): Persona | null {
  if (traits.length < 4) return null;
  const byId = Object.fromEntries(traits.map((t) => [t.id, t.score]));
  const parts: string[] = [];

  const c = byId.conscientiousness ?? 50;
  const o = byId.openness ?? 50;
  const e = byId.extraversion ?? 50;
  const ag = byId.agreeableness ?? 50;
  const st = byId.stability ?? 50;

  const name =
    c >= 65 && o >= 65 ? "المهندس المستكشف"
    : c >= 65 && ag >= 65 ? "المنجز المتعاون"
    : c >= 65 && e < 45 ? "الحِرفي العميق"
    : c >= 65 ? "المنجز المنضبط"
    : o >= 65 && e >= 65 ? "المُلهِم الاجتماعي"
    : o >= 65 ? "المفكّر المستقل"
    : e >= 65 && ag >= 65 ? "قلب الفريق"
    : e >= 65 ? "المحرّك النشط"
    : ag >= 65 ? "السند الهادئ"
    : "المتوازن الواقعي";

  if (st >= 65) parts.push("رابط الجأش تحت الضغط");
  else if (st < 40) parts.push("عالي الحساسية للضغط — ميزة إنذار مبكر تحتاج إدارة");

  const top = [...traits].sort((x, y) => Math.abs(y.score - 50) - Math.abs(x.score - 50)).slice(0, 2);
  const blurb = `أوضح ملامح أسلوبك: ${top.map((t) => `${t.label} (${t.score.toLocaleString("en-US")})`).join("، و")}${parts.length ? "، وأنت " + parts.join("، ") : ""}. هذا وصف لأسلوب عملك لا حكم عليه — كل موضع على كل سمة له مواطن قوته.`;
  return { name, blurb };
}

/* ── Metric extremes — the peaks and troughs across every sub-scale metric ── */

function metricExtremes(a: Answers, pi: PersonalInfoAnswers): MetricExtremes | null {
  const all = computeMetrics(a, pi).map((m) => ({
    id: m.id,
    label: m.label,
    score: m.score,
    dimension: m.dimension,
  }));
  if (all.length < 10) return null;
  const sorted = [...all].sort((x, y) => y.score - x.score);
  return { top: sorted.slice(0, 5), bottom: sorted.slice(-5).reverse(), total: all.length };
}

/* ── Public API ────────────────────────────────────────────────────────────── */

export function computeDeepAnalysis(a: Answers, pi: PersonalInfoAnswers = {}): DeepAnalysisResult {
  const composites = [
    wellnessAgeComposite(a, pi),
    burnoutComposite(a),
    stressMapComposite(a),
    jdrComposite(a),
    retentionComposite(a),
    resilienceComposite(a),
    vitalityComposite(a),
    selfRegulationComposite(a),
    activityComposite(a),
    sedentaryComposite(a),
    cardioComposite(a, pi),
  ].filter((c): c is CompositeIndex => c !== null);

  const traits = computeTraits(a);

  return {
    composites,
    traits,
    persona: personaOf(traits),
    quality: measurementQuality(a),
    extremes: metricExtremes(a, pi),
    answeredCount: Object.keys(a).filter((s) => QUESTIONS.has(s)).length,
  };
}
