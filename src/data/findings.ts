import type { DimensionId } from "./dimensions";
import { computeMetrics, METRIC_SLUGS } from "./metrics";
import type { PersonalInfoAnswers } from "./personalInfo";
import {
  DISTRESS_DIMS,
  EE,
  FIN_STRAIN,
  QUESTIONS,
  VIGOUR,
  ageOf,
  computeDeepAnalysis,
  dimSlugs,
  meanPos,
  pos,
  weeklyMinutes,
} from "./analysis";

/* ───────────────────────────────────────────────────────────────────────────
   The findings engine — the "so what" layer.

   Every other layer scores answers *separately*. A finding only exists when
   answers from two or more different scales, crossed together, reveal
   something the person never stated directly:

   · they said "exhausted daily" AND "recognition is unfair" — but the ratio
     between the two is Siegrist's effort–reward imbalance, which carries a
     measured depression risk;
   · they rated their fitness "ممتاز" AND their reported activity computes to
     40 min/week — the gap between self-image and behaviour is the finding;
   · stress markers are high AND both recovery channels (sleep, movement) are
     closed — the *combination* is what predicts trouble, not either alone.

   Hard rule for every detector: if the person could have written the sentence
   themselves right after answering, it is not a finding — delete it. Each
   finding carries the reasoning receipts (their numbers), the mechanism, one
   named research figure, and exactly one concrete move.

   The leverage ranking at the top answers the only question that matters at
   the end of a 150-question assessment: "if I change one thing, which one?" —
   computed from a dependency graph over the person's own weak metrics.
   ─────────────────────────────────────────────────────────────────────────── */

type Answers = Record<string, number>;

export type FindingTone = "risk" | "watch" | "strength";

export interface FindingReceipt {
  label: string;
  value: string;
}

export interface Finding {
  id: string;
  tone: FindingTone;
  /** The discovery — a sentence the person could NOT have written themselves. */
  title: string;
  /** The reasoning: which of their answers were crossed, with their numbers. */
  story: string;
  /** Mechanism + one named research figure. */
  why: string;
  /** Exactly one concrete move. */
  move: string;
  receipts: FindingReceipt[];
  dims: DimensionId[];
}

export interface LeverageStep {
  id: string;
  label: string;
  score: number;
}

/** One number that would move if the leverage answers improved a single step. */
export interface ProjectionDelta {
  label: string;
  from: number;
  to: number;
}

export interface Leverage {
  source: LeverageStep;
  downstream: LeverageStep[];
  story: string;
  move: string;
  /** What-if simulation: the same engines re-run with the improved answers. */
  projection: ProjectionDelta[];
}

export interface FindingsResult {
  leverage: Leverage | null;
  findings: Finding[];
}

/* ── Shared sub-scale groups ───────────────────────────────────────────────── */

const REWARD = ["EffortRecognized", "FairRecognition", "ManagerSupport", "GrowthOpportunities", "CareerPathClarity"];
const MEANING = ["WorkMeaning", "PurposeMission", "ContributionToGoals"];
const SAFETY = ["SpeakUpSafety", "IdeaFearHesitation"];
const PSY_STRESS = ["StressNervousness", "EmotionalCollapse", "AnxietyNotProne", "FearAnxietyFree"];

const n100 = (f: number) => Math.round(f * 100).toLocaleString("en-US");
const nums = (n: number) => n.toLocaleString("en-US");

/** Weekly moderate-equivalent minutes (same arithmetic as analysis.ts). */
function modEqMinutes(a: Answers): number | null {
  const vig = weeklyMinutes(a, "VigorousActivityDays", "VigorousActivityDuration");
  const mod = weeklyMinutes(a, "ModerateActivityDays", "ModerateActivityDuration");
  const walk = weeklyMinutes(a, "WalkingDays", "WalkingDuration");
  if (vig === null && mod === null && walk === null) return null;
  return (vig ?? 0) * 2 + (mod ?? 0) + (walk ?? 0);
}

/* ── Detectors ─────────────────────────────────────────────────────────────── */
/*  Each returns null unless its cross-scale pattern is actually present.      */

/** 1 · Siegrist effort–reward imbalance: heavy drain, thin perceived return. */
function detectERI(a: Answers): Finding | null {
  const effort = meanPos(a, EE);
  const reward = meanPos(a, REWARD);
  if (!effort || !reward || effort.n < 5 || reward.n < 3) return null;
  if (effort.f < 0.5 || reward.f > 0.5) return null;
  const ratio = effort.f / Math.max(reward.f, 0.05);
  if (ratio < 1.4) return null;
  return {
    id: "eri",
    tone: "risk",
    title: "أنت تدفع أكثر مما تسترد — بفارق مقيس",
    story: `وضعنا استنزافك في العمل (${n100(effort.f)} من 100) مقابل العائد الذي تلمسه من تقدير ودعم وفرص نمو (${n100(reward.f)} من 100). النسبة بينهما ${ratio.toFixed(1)}×، وهذا ليس «تعبًا عاديًا» — إنه اختلال بين الجهد والمقابل، وهو حالة لها اسم وقياس في أبحاث الصحة المهنية.`,
    why: `نموذج Siegrist للاختلال بين الجهد والمكافأة: التحليل التلوي (Rugulies وآخرون، 2017) وجد أن من يعملون تحت هذا الاختلال يرتفع لديهم خطر الاكتئاب بنحو 1.5 ضعف — الجهد المرتفع وحده لا يفعل ذلك؛ الجهدُ غير المكافأ هو الذي يفعل.`,
    move: "قبل طلب أي تخفيف للعبء، اطلب تسعيرًا أوضح لجهدك: اجتماع محدد مع مديرك عنوانه «ما الذي يجب أن أحققه ليُترجم جهدي إلى تقدير ومسار؟» — الاختلال يُعالَج من طرف المكافأة غالبًا.",
    receipts: [
      { label: "الجهد المستنزَف", value: `${n100(effort.f)}/100` },
      { label: "العائد المُدرَك", value: `${n100(reward.f)}/100` },
      { label: "نسبة الاختلال", value: `${ratio.toFixed(1)}×` },
    ],
    dims: ["professional", "workplace"],
  };
}

/** 2 · Engaged–exhausted: burning out on work they actually love. */
function detectEngagedExhausted(a: Answers): Finding | null {
  const ee = meanPos(a, EE);
  const vigour = meanPos(a, VIGOUR);
  if (!ee || !vigour || ee.n < 5 || vigour.n < 3) return null;
  if (ee.f < 0.48 || vigour.f < 0.62) return null;
  return {
    id: "engaged-exhausted",
    tone: "watch",
    title: "أخطر مزيج في بياناتك: حماس مرتفع فوق إنهاك متصاعد",
    story: `اندماجك وحماسك في العمل (${n100(vigour.f)} من 100) في القمة، وإنهاكك (${n100(ee.f)} من 100) ${ee.f >= 0.6 ? "مرتفع" : "يتقدم نحو المنطقة الحرجة"} في الوقت نفسه. هذان لا يجتمعان عادة — ومن يجمعهما لا يشعر بالخطر لأن الحماس يخدّر إشارات الاستنزاف. أنت لا تحترق لأنك تكره عملك؛ أنت تحترق لأنك تحبه.`,
    why: `دراسة جامعة Yale على 1,085 موظفًا (Moeller وآخرون، 2018) وجدت أن نحو واحد من كل خمسة موظفين «مندمج-مستنزَف» في آن — وكانت هذه الفئة تحديدًا الأعلى في نية ترك العمل، أعلى حتى من غير المندمجين.`,
    move: "لا تعتمد على إحساسك — هو مضلَّل هنا. ضع حدًا خارجيًا واحدًا غير قابل للتفاوض (ساعة إغلاق ثابتة أو يوم بلا اجتماعات) واجعله قاعدة لا قرارًا يوميًا.",
    receipts: [
      { label: "الحماس والاندماج", value: `${n100(vigour.f)}/100` },
      { label: "الإنهاك العاطفي", value: `${n100(ee.f)}/100` },
    ],
    dims: ["professional", "workplace"],
  };
}

/** 3 · Detached drain: exhaustion with the meaning channel also closed. */
function detectDetachedDrain(a: Answers): Finding | null {
  const ee = meanPos(a, EE);
  const vigour = meanPos(a, VIGOUR);
  const meaning = meanPos(a, MEANING);
  if (!ee || !vigour || !meaning) return null;
  if (ee.f < 0.5 || vigour.f > 0.4 || meaning.f > 0.45) return null;
  return {
    id: "detached-drain",
    tone: "risk",
    title: "إنهاكك ليس مشكلة طاقة — إنه مشكلة معنى",
    story: `إنهاكك مرتفع (${n100(ee.f)} من 100)، لكن ما يميّز حالتك أن الحماس (${n100(vigour.f)}) والمعنى الذي تجده في عملك (${n100(meaning.f)}) منخفضان معه. حين تجتمع الثلاثة، الراحة وحدها لا تصلح شيئًا — تعود من الإجازة إلى الفراغ نفسه.`,
    why: "في أبحاث الاحتراق، الانفصال عن المعنى يتنبأ بالتدهور أكثر من ساعات العمل نفسها؛ ماسلاك وليتر يصنفان «فجوة القيم» ضمن أقوى ستة أسباب منظّمية للاحتراق — وهي لا تُعالج بإدارة الوقت.",
    move: "قبل أي خطة راحة، أجرِ جرد معنى: أسبوع واحد سجّل فيه المهام التي شعرت أنها تستحق وقتك. إن كانت القائمة شبه فارغة، فالنقاش الصحيح مع مديرك هو عن محتوى دورك، لا عن عبئه.",
    receipts: [
      { label: "الإنهاك", value: `${n100(ee.f)}/100` },
      { label: "الحماس", value: `${n100(vigour.f)}/100` },
      { label: "المعنى", value: `${n100(meaning.f)}/100` },
    ],
    dims: ["professional", "workplace"],
  };
}

/** 4 · Recovery shutdown: high strain with both recovery channels closed. */
function detectRecoveryShutdown(a: Answers): Finding | null {
  const ee = meanPos(a, EE);
  const psy = meanPos(a, PSY_STRESS);
  const strained = (ee && ee.f >= 0.45) || (psy && psy.f >= 0.55);
  if (!strained) return null;
  const sleepShort = a.SleepDuration !== undefined && a.SleepDuration <= 2;
  const modEq = modEqMinutes(a);
  if (!sleepShort || modEq === null || modEq >= 120) return null;
  const strain = Math.max(ee?.f ?? 0, psy?.f ?? 0);
  return {
    id: "recovery-shutdown",
    tone: "risk",
    title: "ضغطك مرتفع وقناتا التعافي الوحيدتان مغلقتان",
    story: `الجسم يصرّف الضغط عبر قناتين فقط: النوم والحركة. مستوى الضغط لديك ${n100(strain)} من 100، بينما نومك ${a.SleepDuration === 1 ? "أقل من 5 ساعات" : "5–6 ساعات"} وحركتك الأسبوعية تُقدَّر بـ${nums(modEq)} دقيقة فقط. أنت تسحب من رصيد لا يُعاد تعبئته — وهذا نمط تراكمي، لا حالة يوم سيئ.`,
    why: "ليلة نوم منقوصة ترفع تفاعل اللوزة الدماغية مع الضغوط بنسبة تقارب 60% (Yoo وآخرون، 2007)، ومن ينامون أقل من 6 ساعات أُصيبوا بالعدوى عند التعرض للفيروس بمعدل 4 أضعاف من ينامون 7+ (Prather، 2015) — الضغط مع انغلاق التعافي يتحول من شعور إلى فسيولوجيا.",
    move: "افتح قناة واحدة فقط وابدأ بالنوم لأنه يجرّ الأخرى: موعد نوم ثابت يضمن 7 ساعات لمدة 14 ليلة. لا تضف أي هدف آخر قبل ذلك.",
    receipts: [
      { label: "الضغط", value: `${n100(strain)}/100` },
      { label: "النوم", value: a.SleepDuration === 1 ? "أقل من 5 س" : "5–6 س" },
      { label: "الحركة الأسبوعية", value: `≈ ${nums(modEq)} د` },
    ],
    dims: ["professional", "psycho", "physical"],
  };
}

/** 5 · Self-image vs measured behaviour — in either direction. */
function detectFitnessGap(a: Answers): Finding | null {
  const self = a.FitnessLevel;
  const modEq = modEqMinutes(a);
  if (self === undefined || modEq === null) return null;

  if (self >= 3 && modEq < 100) {
    return {
      id: "fitness-gap",
      tone: "watch",
      title: "صورتك عن لياقتك تسبق سلوكك المقاس",
      story: `قيّمت لياقتك بـ«${self === 4 ? "ممتاز" : "جيد"}»، لكن حين حسبنا حركتك الفعلية من إجاباتك — الأيام × المدة لكل نوع نشاط — كان الناتج نحو ${nums(modEq)} دقيقة أسبوعيًا، أي ${nums(Math.round((modEq / 150) * 100))}% من الحد الموصى به. الفجوة بين التقييمين هي المعلومة: إحساسك بحالتك أفضل من مدخلاتها.`,
      why: "مراجعة منهجية لـ148 دراسة (Prince وآخرون، 2008) وجدت أن الناس يقدّرون نشاطهم الذاتي أعلى من قياس أجهزة التتبع بنسب تصل إلى 40–50% — الانطباع يتشكل من أفضل أسبوع، والجسم يحاسب على المتوسط.",
      move: "لا تغيّر تقييمك — غيّر القياس: أسبوع واحد مع عدّاد خطوات (هاتفك يكفي) ليصبح رقمك الحقيقي هو المرجع بدل الانطباع.",
      receipts: [
        { label: "تقييمك الذاتي", value: self === 4 ? "ممتاز" : "جيد" },
        { label: "المحسوب من إجاباتك", value: `≈ ${nums(modEq)} د/أسبوع` },
        { label: "من التوصية", value: `${nums(Math.round((modEq / 150) * 100))}%` },
      ],
      dims: ["physical"],
    };
  }

  if (self <= 2 && modEq >= 150) {
    return {
      id: "fitness-gap",
      tone: "strength",
      title: "أنت أقسى على نفسك من أرقامك",
      story: `قيّمت لياقتك بـ«${self === 1 ? "ضعيف جدًا" : "ضعيف"}»، لكن حركتك المحسوبة من إجاباتك تبلغ نحو ${nums(modEq)} دقيقة أسبوعيًا — فوق عتبة الـ150 دقيقة الموصى بها. سلوكك يحقق الهدف؛ صورتك الذاتية هي المتأخرة، وهذه الفجوة العكسية تُضعف الاستمرارية لأنها تسرق شعور الإنجاز.`,
      why: "في أبحاث تغيير السلوك الصحي، إدراك الكفاءة الذاتية (Bandura) من أقوى منبئات الاستمرار في النشاط — من لا يرى تقدمه يتوقف أكثر ممن لا يتقدم.",
      move: "ثبّت الحقيقة بالأرقام: سجل أسبوعًا واحدًا من نشاطك الفعلي وراجعه — استحقاق النتيجة جزء من الحفاظ عليها.",
      receipts: [
        { label: "تقييمك الذاتي", value: self === 1 ? "ضعيف جدًا" : "ضعيف" },
        { label: "المحسوب من إجاباتك", value: `≈ ${nums(modEq)} د/أسبوع` },
      ],
      dims: ["physical"],
    };
  }
  return null;
}

/** 6 · Money as the upstream stressor feeding psych/sleep symptoms. */
function detectMoneyUpstream(a: Answers): Finding | null {
  const strainPos = meanPos(a, FIN_STRAIN);
  if (!strainPos) return null;
  const strain = 1 - strainPos.f;
  if (strain < 0.55) return null;
  const psy = meanPos(a, PSY_STRESS);
  const sleepShort = a.SleepDuration !== undefined && a.SleepDuration <= 2;
  if (!(psy && psy.f >= 0.5) && !sleepShort) return null;

  const fund = pos(a, "EmergencyFund");
  const symptoms = [
    psy && psy.f >= 0.5 ? `توترك النفسي (${n100(psy.f)} من 100)` : null,
    sleepShort ? "قِصر نومك" : null,
  ].filter(Boolean);
  return {
    id: "money-upstream",
    tone: "risk",
    title: "جزء من توترك ليس نفسيًا — إنه مالي يرتدي قناعًا",
    story: `ضغطك المالي (${n100(strain)} من 100) يظهر في بُعد آخر تمامًا من إجاباتك: ${symptoms.join(" و")}. حين يتزامن الاثنان بهذا الشكل، معالجة الأعراض النفسية وحدها تشبه تجفيف أرضية والصنبور مفتوح${fund !== null && fund <= 0.34 ? " — خصوصًا أنك أشرت إلى غياب صندوق طوارئ، وهو تحديدًا ما يحوّل أي مفاجأة إلى أزمة" : ""}.`,
    why: "المال يتصدر مصادر الضغط في مسوح APA السنوية (Stress in America) منذ أكثر من عقد، والأمان المالي المُدرَك — وجود احتياطي — يخفض الضغط المبلَّغ أكثر من مستوى الدخل نفسه في دراسات الرفاه المالي (CFPB).",
    move: "خطوة واحدة تعالج المنبع: تحويل تلقائي صغير (حتى 5% من الراتب) إلى حساب منفصل يوم نزول الراتب — أثره على النوم والتوتر يبدأ من الشهر الأول لأنه يغيّر «إحساس» الأمان لا الأرقام فقط.",
    receipts: [
      { label: "الضغط المالي", value: `${n100(strain)}/100` },
      ...(psy && psy.f >= 0.5 ? [{ label: "التوتر النفسي", value: `${n100(psy.f)}/100` }] : []),
      ...(sleepShort ? [{ label: "النوم", value: "أقل من 7 س" }] : []),
    ],
    dims: ["financial", "psycho"],
  };
}

/** 7 · The social shield is up and working — name it so they use it. */
function detectSocialShield(a: Answers): Finding | null {
  const ee = meanPos(a, EE);
  const psy = meanPos(a, PSY_STRESS);
  const strained = (ee && ee.f >= 0.45) || (psy && psy.f >= 0.55);
  if (!strained) return null;
  const community = meanPos(a, dimSlugs("community"));
  const belong = pos(a, "TeamBelonging");
  if (!community || community.f < 0.65 || belong === null || belong < 0.6) return null;
  const strain = Math.max(ee?.f ?? 0, psy?.f ?? 0);
  return {
    id: "social-shield",
    tone: "strength",
    title: "لديك أصل مضاد للضغط لا تستخدمه بكامل طاقته",
    story: `ضغطك الحالي (${n100(strain)} من 100) يقابله في بياناتك رصيد نادر: شبكة ثقة وتعاون (${n100(community.f)} من 100) وانتماء حقيقي لفريقك (${n100(belong)} من 100). الأشخاص في وضعك الضاغط نفسه بلا هذه الشبكة يتأثرون بدرجة أعمق بكثير — أنت تحمل درعًا ربما لا تعرف أنك ترتديه.`,
    why: "التحليل التلوي الشهير لـHolt-Lunstad (2010، على 308 آلاف شخص) وجد أن العلاقات القوية ترفع احتمالات البقاء على قيد الحياة بنسبة 50%، وأبحاث الدعم الاجتماعي تُظهر أنه يخفف الأثر الفسيولوجي للضغوط (نموذج التخفيف — Cohen & Wills).",
    move: "حوّل الدرع من سلبي إلى نشط: حين يرتفع ضغطك، اجعل التواصل خطوتك الأولى لا الأخيرة — محادثة واحدة مقصودة مع شخص تثق به وقت الذروة تعادل أثر عدة أيام هدوء.",
    receipts: [
      { label: "الضغط", value: `${n100(strain)}/100` },
      { label: "شبكة الثقة", value: `${n100(community.f)}/100` },
      { label: "الانتماء للفريق", value: `${n100(belong)}/100` },
    ],
    dims: ["community", "workplace", "professional"],
  };
}

/** 8 · Unbuffered stress: high strain with the social channel also thin. */
function detectUnbufferedStress(a: Answers): Finding | null {
  const ee = meanPos(a, EE);
  const psy = meanPos(a, PSY_STRESS);
  const strained = (ee && ee.f >= 0.5) || (psy && psy.f >= 0.55);
  if (!strained) return null;
  const community = meanPos(a, dimSlugs("community"));
  const social = meanPos(a, dimSlugs("social"));
  if (!community || !social || community.f > 0.45 || social.f > 0.42) return null;
  const strain = Math.max(ee?.f ?? 0, psy?.f ?? 0);
  return {
    id: "unbuffered-stress",
    tone: "risk",
    title: "ضغط مرتفع بلا عازل اجتماعي — المضاعف الصامت",
    story: `المقلق في بياناتك ليس الضغط (${n100(strain)} من 100) وحده، بل أنه يقع على شخص شبكته الاجتماعية الحالية رقيقة (الثقة والتعاون ${n100(community.f)}، والطاقة الاجتماعية ${n100(social.f)}). الضغط نفسه بوجود عازل اجتماعي شيء، وبغيابه شيء آخر تمامًا — أنت في الحالة الثانية.`,
    why: "Holt-Lunstad (2010): ضعف الروابط الاجتماعية عامل خطر على البقاء يعادل تدخين 15 سيجارة يوميًا ويفوق أثر السمنة — وهو المضاعِف الأقل انتباهًا في الصحة المهنية.",
    move: "لا تستهدف «تحسين حياتك الاجتماعية» — هدف غائم يفشل. أنشئ مرساة واحدة متكررة: موعد أسبوعي ثابت مع شخص واحد (قهوة، مشي، مكالمة). التكرار يبني العازل، لا عدد المعارف.",
    receipts: [
      { label: "الضغط", value: `${n100(strain)}/100` },
      { label: "شبكة الثقة", value: `${n100(community.f)}/100` },
      { label: "الطاقة الاجتماعية", value: `${n100(social.f)}/100` },
    ],
    dims: ["psycho", "community", "social"],
  };
}

/** 9 · High conscientiousness absorbing overload silently. */
function detectConscientiousOverload(a: Answers): Finding | null {
  const consc = meanPos(a, dimSlugs("belonging"));
  const ee = meanPos(a, EE);
  if (!consc || !ee || consc.f < 0.65 || ee.f < 0.5) return null;
  return {
    id: "conscientious-overload",
    tone: "watch",
    title: "انضباطك العالي يعمل ضدك الآن",
    story: `انضباطك والتزامك من أعلى ما قسنا (${n100(consc.f)} من 100) — وهو عادة أفضل منبئ للأداء. لكنه يجتمع مع إنهاك ${ee.f >= 0.6 ? "مرتفع" : "متصاعد"} (${n100(ee.f)} من 100)، وهذا المزيج له سلوك معروف: أصحاب الانضباط العالي لا يرفضون، لا يشتكون، ويمتصون العبء الزائد بصمت حتى نقطة الكسر — فينهارون «فجأة» في نظر من حولهم فقط.`,
    why: "أبحاث الشخصية والاحتراق تجد أن يقظة الضمير المرتفعة تحمي الأداء لكنها ترفع الالتزام المفرط (overcommitment) — وهو المكوّن الذي يضاعف أثر ضغط العمل في نموذج Siegrist نفسه.",
    move: "استخدم قوتك في الاتجاه المعاكس: أنت تنفّذ ما يُجدول، فجدوِل التعافي كمهمة لها موعد وحالة إنجاز — «راحة إن بقي وقت» لن تحدث أبدًا في نظام شخص مثلك.",
    receipts: [
      { label: "الانضباط", value: `${n100(consc.f)}/100` },
      { label: "الإنهاك", value: `${n100(ee.f)}/100` },
    ],
    dims: ["belonging", "professional"],
  };
}

/** 10 · The silence tax: engaged but not safe to speak. */
function detectSilenceTax(a: Answers): Finding | null {
  const safety = meanPos(a, SAFETY);
  const vigour = meanPos(a, VIGOUR);
  if (!safety || !vigour || safety.f > 0.42 || vigour.f < 0.55) return null;
  return {
    id: "silence-tax",
    tone: "watch",
    title: "منظمتك تدفع ضريبة صمتك — وأنت تدفع فائدتها",
    story: `أنت متحمس لعملك (${n100(vigour.f)} من 100) لكن أمانك في التعبير عن رأيك منخفض (${n100(safety.f)} من 100). هذا يعني وجود أفكار وملاحظات حقيقية لديك لا تصل لأحد — والموظف المتحمس الصامت يتحول مع الوقت إلى متحمس أقل، لأن الأفكار غير المقولة تتراكم كإحباط.`,
    why: "مشروع أرسطو في Google (تحليل 180+ فريقًا) وجد أن الأمان النفسي — بمفهوم Edmondson — هو المنبئ الأول بفعالية الفريق، قبل الكفاءات الفردية ومزيج الشخصيات.",
    move: "اختبر الأمان بحمولة صغيرة: اطرح في الاجتماع القادم ملاحظة واحدة منخفضة المخاطر كنت ستكتمها. النتيجة ستخبرك إن كانت المشكلة في البيئة فعلًا أم في تقديرك لها — وكلاهما معلومة تحتاجها.",
    receipts: [
      { label: "حماسك", value: `${n100(vigour.f)}/100` },
      { label: "أمان التعبير", value: `${n100(safety.f)}/100` },
    ],
    dims: ["workplace"],
  };
}

/** 11 · Thinking of leaving while loving the work: push, not pull. */
function detectPushNotPull(a: Answers): Finding | null {
  const stay = pos(a, "TurnoverIntention");
  const vigour = meanPos(a, VIGOUR);
  if (stay === null || !vigour || stay > 0.45 || vigour.f < 0.6) return null;

  const drivers: { label: string; f: number }[] = [];
  const recog = meanPos(a, ["EffortRecognized", "FairRecognition", "ManagerSupport"]);
  const growth = meanPos(a, ["GrowthOpportunities", "CareerPathClarity"]);
  const fair = pos(a, "RespectInclusion");
  if (recog) drivers.push({ label: "التقدير ودعم المدير", f: recog.f });
  if (growth) drivers.push({ label: "وضوح النمو والمسار", f: growth.f });
  if (fair !== null) drivers.push({ label: "الإنصاف والاحترام", f: fair });
  drivers.sort((x, y) => x.f - y.f);
  const push = drivers[0];

  return {
    id: "push-not-pull",
    tone: "watch",
    title: "تفكيرك في المغادرة دفعٌ من الداخل، لا جذبٌ من الخارج",
    story: `تفكر في ترك منظمتك (نية البقاء ${n100(stay)} من 100) مع أنك تحب العمل نفسه (${n100(vigour.f)} من 100) — وهذا التناقض هو المعلومة. من يحب عمله لا يغادر بحثًا عن عمل أفضل؛ يغادر هربًا من شيء محدد.${push ? ` أضعف محرك في بياناتك يشير إلى المشتبه به: ${push.label} (${n100(push.f)} من 100).` : ""}`,
    why: "مسوح Gallup لمن غادروا فعلًا: 52% قالوا إن مديرهم أو منظمتهم كان بوسعهم فعل شيء يُبقيهم — أي أن أغلب المغادرة دفعٌ قابل للإصلاح، لا جذبٌ حتمي.",
    move: push
      ? `قبل تحديث سيرتك الذاتية، جرّب إصلاح المصدر: محادثة واحدة صريحة عن «${push.label}» — إن تحرّك شيء خلال شهرين فقد ربحت وظيفة تحبها، وإن لم يتحرك فقد ربحت وضوح القرار.`
      : "حدد الشيء الواحد الذي لو تغيّر لبقيت — وضعه على الطاولة صراحة قبل اتخاذ أي قرار.",
    receipts: [
      { label: "نية البقاء", value: `${n100(stay)}/100` },
      { label: "حبك للعمل نفسه", value: `${n100(vigour.f)}/100` },
      ...(push ? [{ label: push.label, value: `${n100(push.f)}/100` }] : []),
    ],
    dims: ["workplace"],
  };
}

/** 12 · Flying blind: real risk factors + the exact screenings that catch them, skipped. */
function detectFlyingBlind(a: Answers, pi: PersonalInfoAnswers): Finding | null {
  const missing: string[] = [];
  if (a.BloodPressureCheck !== undefined && a.BloodPressureCheck <= 1) missing.push("ضغط الدم");
  if (a.CholesterolCheck !== undefined && a.CholesterolCheck <= 1) missing.push("الكوليسترول");
  if (a.BloodSugarCheck !== undefined && a.BloodSugarCheck <= 1) missing.push("سكر الدم");
  if (missing.length < 2) return null;

  const factors: string[] = [];
  const h = Number(pi.height);
  const w = Number(pi.weight);
  if (h > 80 && h < 260 && w > 25 && w < 400 && w / Math.pow(h / 100, 2) >= 25) factors.push("الوزن");
  const waist = Number(pi.waistCircumference);
  if (waist > 40 && waist < 200 && waist >= (pi.gender === "2" ? 88 : 102)) factors.push("محيط الخصر");
  if (a.TobaccoUse !== undefined && a.TobaccoUse <= 2) factors.push("التدخين");
  if (a.SittingHours !== undefined && a.SittingHours <= 2) factors.push("الجلوس المطوّل");
  const modEq = modEqMinutes(a);
  if (modEq !== null && modEq < 150) factors.push("قلة الحركة");
  if (a.SleepDuration !== undefined && a.SleepDuration <= 2) factors.push("قصر النوم");
  if (factors.length < 2) return null;

  return {
    id: "flying-blind",
    tone: "risk",
    title: "تجمع عوامل الخطر وتتخطى تحديدًا الفحوصات التي تكشف أثرها",
    story: `في إجاباتك ${nums(factors.length)} عوامل خطر حاضرة (${factors.join("، ")})، وفي الوقت نفسه لم تُجرِ فحص ${missing.join(" ولا ")}. هذه ليست مصادفتين منفصلتين — إنها المعادلة الأسوأ: العوامل التي لديك ترفع تحديدًا الأشياء التي لا تقيسها. أنت تقود بسرعة وعداداتك مطفأة.`,
    why: "منظمة الصحة العالمية تقدّر أن نحو 46% من المصابين بارتفاع ضغط الدم حول العالم لا يعلمون بإصابتهم — لأن العوامل التي لديك تُنتج أمراضًا «صامتة» لا أعراض مبكرة لها؛ الفحص هو الأعراض المبكرة.",
    move: `زيارة واحدة تصفّر العدادات: فحص شامل (ضغط + سكر + دهون) يستغرق أقل من ساعة. بملفك الحالي هذا أعلى عائد صحي ممكن لساعة واحدة من وقتك.`,
    receipts: [
      { label: "عوامل خطر حاضرة", value: nums(factors.length) },
      { label: "فحوصات لم تُجرَ", value: missing.join(" · ") },
    ],
    dims: ["physical"],
  };
}

/** 13 · Diagnosed condition × the exact behaviour that feeds it. */
const CONDITION_CLASHES: {
  condition: number;
  name: string;
  test: (a: Answers) => { behaviour: string; value: string } | null;
  mechanism: string;
  move: string;
}[] = [
  {
    condition: 3,
    name: "ارتفاع ضغط الدم",
    test: (a) =>
      a.HighSaltFoodPreference !== undefined && a.HighSaltFoodPreference <= 2
        ? { behaviour: "تفضيل الأطعمة عالية الملح", value: a.HighSaltFoodPreference === 1 ? "عالية دائمًا" : "غالبًا عالية" }
        : null,
    mechanism: "الملح هو الرافعة الغذائية الأولى لضغط الدم تحديدًا: منظمة الصحة العالمية تقدّر أن خفض الملح إلى أقل من 5 غرامات يوميًا يخفض الضغط الانقباضي بما يعادل أثر بعض الأدوية لدى كثيرين.",
    move: "هدف واحد هذا الشهر: أبعد المملحة عن الطاولة وقلّل الأطعمة المصنّعة — نحو 70% من الملح يأتي منها لا من يدك.",
  },
  {
    condition: 2,
    name: "السكري",
    test: (a) =>
      a.FastFoodFrequency !== undefined && a.FastFoodFrequency <= 2
        ? { behaviour: "الوجبات السريعة", value: a.FastFoodFrequency === 1 ? "يوميًا" : "أسبوعيًا" }
        : a.FruitVegetableIntake !== undefined && a.FruitVegetableIntake <= 2
          ? { behaviour: "حصص الخضار والفواكه", value: a.FruitVegetableIntake === 1 ? "صفر يوميًا" : "1–2 يوميًا" }
          : null,
    mechanism: "لدى المشخّصين بالسكري، جودة النمط الغذائي ليست وقاية بل جزء من العلاج: برنامج الوقاية من السكري (DPP) أظهر أن تعديل نمط الحياة يتفوق على الدواء في ضبط سكر الدم لدى كثير من الحالات.",
    move: "لا تبدأ بحمية كاملة — ابدأ بقاعدة الاستبدال: كل وجبة سريعة تُستبدل بوجبة منزلية تُحتسب مكسبًا مباشرًا في قراءة سكرك التراكمي.",
  },
  {
    condition: 4,
    name: "أمراض القلب",
    test: (a) =>
      a.TobaccoUse !== undefined && a.TobaccoUse <= 2
        ? { behaviour: "التدخين", value: a.TobaccoUse === 1 ? "يوميًا" : "أحيانًا" }
        : null,
    mechanism: "التدخين مع تشخيص قلبي قائم هو أخطر تركيبة قابلة للتعديل في الطب الوقائي: الإقلاع بعد التشخيص يخفض خطر الوفاة القلبية بنسبة تقارب 36% (تحليل Critchley & Capewell التلوي) — أثر يفوق معظم الأدوية.",
    move: "هذه الحالة تستحق دعمًا لا إرادة فقط: برنامج إقلاع منظّم مع بدائل النيكوتين يضاعف فرص النجاح ثلاث مرات مقارنة بالمحاولة الذاتية.",
  },
  {
    condition: 6,
    name: "الربو",
    test: (a) =>
      a.TobaccoUse !== undefined && a.TobaccoUse <= 2
        ? { behaviour: "التدخين", value: a.TobaccoUse === 1 ? "يوميًا" : "أحيانًا" }
        : null,
    mechanism: "التدخين مع الربو يجعل الشعب الهوائية الملتهبة أصلًا أقل استجابة لأدوية التحكم نفسها (الكورتيزون الاستنشاقي) — أي أنك تُضعف علاجك وأنت تأخذه.",
    move: "أخبر طبيبك الصادق عن التدخين إن لم تفعل — خطة الربو تختلف كليًا للمدخن، وبرنامج الإقلاع هنا علاج تنفسي لا رفاهية.",
  },
  {
    condition: 9,
    name: "هشاشة العظام",
    test: (a) =>
      a.StrengthTrainingDays !== undefined && a.StrengthTrainingDays === 1
        ? { behaviour: "تمارين المقاومة", value: "صفر أيام أسبوعيًا" }
        : null,
    mechanism: "لدى هشاشة العظام، تمارين المقاومة ليست نشاطًا اختياريًا — إنها العلاج الأول غير الدوائي: العظم يبني كثافته استجابةً للحِمل الميكانيكي تحديدًا (قانون Wolff)، والمشي وحده لا يكفي.",
    move: "جلستا مقاومة أسبوعيًا بإشراف مختص (يحدد الأحمال الآمنة لحالتك) — اطلبها من طبيبك كوصفة علاجية لا كنصيحة عامة.",
  },
  {
    condition: 5,
    name: "التهاب المفاصل",
    test: (a) => {
      const modEq = modEqMinutes(a);
      return modEq !== null && modEq < 100
        ? { behaviour: "الحركة الأسبوعية", value: `≈ ${nums(modEq)} دقيقة فقط` }
        : null;
    },
    mechanism: "أكثر خطأ شائع مع التهاب المفاصل هو حمايتها بالسكون: الإرشادات السريرية (ACR) تضع التمارين في المرتبة الأولى للعلاج غير الدوائي — الغضروف يتغذى بالحركة، والعضلات القوية تُنزل الحمل عن المفصل.",
    move: "ابدأ بما لا يؤلم: السباحة أو الدراجة الثابتة أو المشي على مسطح — 3 جلسات لطيفة أسبوعيًا تخفف الألم أكثر مما يخففه تجنّب الحركة.",
  },
];

function detectConditionClash(a: Answers): Finding | null {
  const cond = a.MedicalConditions;
  if (cond === undefined || cond <= 1) return null;
  const def = CONDITION_CLASHES.find((c) => c.condition === cond);
  if (!def) return null;
  const hit = def.test(a);
  if (!hit) return null;
  return {
    id: "condition-clash",
    tone: "risk",
    title: `تشخيصك بـ${def.name} وسلوك في إجاباتك يغذّيه مباشرة`,
    story: `أشرت إلى تشخيصك بـ${def.name} في موضع من التقييم، وفي موضع آخر بعيد عنه أجبت أن ${hit.behaviour}: «${hit.value}». منفصلتين، كل إجابة عادية؛ معًا، هما أعلى تعارض في ملفك — لأن هذا السلوك تحديدًا هو الأشد أثرًا على هذه الحالة تحديدًا.`,
    why: def.mechanism,
    move: def.move,
    receipts: [
      { label: "التشخيص", value: def.name },
      { label: hit.behaviour, value: hit.value },
    ],
    dims: ["physical"],
  };
}

/** 14 · Retirement runway: age (from birth date) × low readiness. */
function detectRetirementRunway(a: Answers, pi: PersonalInfoAnswers): Finding | null {
  if (a.RetirementReadiness === undefined || a.RetirementReadiness > 2) return null;
  const age = ageOf(pi);
  const goals = pos(a, "LongTermGoals");
  const runway = age !== null ? Math.max(0, 60 - age) : null;

  return {
    id: "retirement-runway",
    tone: age !== null && age >= 45 ? "risk" : "watch",
    title:
      runway !== null
        ? `أمامك ≈ ${nums(runway)} سنة عمل — وعدّاد التقاعد عندك شبه متوقف`
        : "استعدادك للتقاعد منخفض — والوقت هو رأس المال الوحيد الذي لا يُعوَّض",
    story: `${
      age !== null
        ? `من تاريخ ميلادك، عمرك ≈ ${nums(age)} سنة، أي نحو ${nums(runway!)} سنة متبقية من العمل.`
        : "لم نتمكن من حساب عمرك،"
    } وأجبت أن استعدادك المالي للتقاعد «${a.RetirementReadiness === 1 ? "غير مستعد إطلاقًا" : "استعداد ضعيف"}»${
      goals !== null && goals <= 0.34 ? "، مع غياب أهداف مالية طويلة الأجل في إجابة أخرى" : ""
    }. المسألة هنا حسابية لا تحفيزية: في الادخار المركّب، متى بدأت أهم بكثير من كم تدّخر.`,
    why: "بعائد سنوي متوسط ~8% يتضاعف المال كل 9 سنوات تقريبًا (قاعدة الـ72). عمليًا: من يبدأ في الثلاثين يصل لنفس مبلغ التقاعد بنحو نصف الاشتراك الشهري لمن يبدأ في الأربعين — كل عقد تأخير يضاعف ثمن اللحاق.",
    move: "لا تنتظر «مبلغًا يستحق»: افتح وعاء ادخار طويل الأجل هذا الشهر بأي نسبة ثابتة من الراتب — تعديل النسبة لاحقًا سهل؛ تعويض السنوات مستحيل.",
    receipts: [
      ...(age !== null ? [{ label: "سنوات العمل المتبقية", value: `≈ ${nums(runway!)}` }] : []),
      { label: "استعدادك المعلن", value: a.RetirementReadiness === 1 ? "غير مستعد إطلاقًا" : "ضعيف" },
      ...(goals !== null && goals <= 0.34 ? [{ label: "أهداف طويلة الأجل", value: "غائبة" }] : []),
    ],
    dims: ["financial"],
  };
}

/** 15 · Commute drain: heavy weekly vehicle time compounding strain/sitting. */
function detectCommuteDrain(a: Answers): Finding | null {
  if (a.VehicleUseDays === undefined || a.VehicleDuration === undefined) return null;
  const DAYS: Record<number, number> = { 1: 6.5, 2: 4.5, 3: 2.5, 4: 0.5 };
  const MINS: Record<number, number> = { 1: 75, 2: 45, 3: 22, 4: 10 };
  const weekly = Math.round(DAYS[a.VehicleUseDays] * MINS[a.VehicleDuration]);
  if (weekly < 270) return null;
  const ee = meanPos(a, EE);
  const sitLong = a.SittingHours !== undefined && a.SittingHours <= 2;
  if (!(ee && ee.f >= 0.45) && !sitLong) return null;

  const hours = (weekly / 60).toFixed(1);
  return {
    id: "commute-drain",
    tone: "watch",
    title: `≈ ${hours} ساعة أسبوعيًا داخل مركبة — ضريبة صامتة تدفعها من موضعين`,
    story: `من إجاباتك عن التنقل، تقضي نحو ${nums(weekly)} دقيقة أسبوعيًا داخل مركبة (≈ ${hours} ساعة). هذا الوقت يظهر أثره في موضعين آخرين من ملفك: ${
      ee && ee.f >= 0.45 ? `إنهاكك المرتفع (${n100(ee.f)} من 100)` : ""
    }${ee && ee.f >= 0.45 && sitLong ? " و" : ""}${sitLong ? "جلوسك اليومي الطويل أصلًا" : ""} — التنقل الطويل جلوس إضافي وضغط إضافي لا يُحتسبان عادة في أي منهما.`,
    why: "«مفارقة التنقل» (Stutzer & Frey): الناس لا يعوَّضون نفسيًا عن وقت التنقل الطويل — ساعة تنقل إضافية يوميًا تخفض الرضا عن الحياة بقدر يحتاج زيادة دخل كبيرة لمعادلته، لأنها تقتطع من النوم والعلاقات والحركة تحديدًا.",
    move: "الوقت الذي لا تستطيع تقصيره أعد توظيفه: حوّل التنقل إلى حصة تعلّم/بودكاست (يقلب الخسارة نموًا)، أو اركن أبعد وامشِ الجزء الأخير (يقلبها حركة) — التحويل أسهل من الاختصار.",
    receipts: [
      { label: "وقت المركبة أسبوعيًا", value: `≈ ${nums(weekly)} د` },
      ...(ee && ee.f >= 0.45 ? [{ label: "الإنهاك", value: `${n100(ee.f)}/100` }] : []),
      ...(sitLong ? [{ label: "الجلوس اليومي", value: a.SittingHours === 1 ? "10+ س" : "7–9 س" }] : []),
    ],
    dims: ["physical", "professional"],
  };
}

/** 16 · The unprotected giver: high agreeableness in a low-fairness environment. */
function detectUnprotectedGiver(a: Answers): Finding | null {
  const community = meanPos(a, dimSlugs("community"));
  if (!community || community.f < 0.68) return null;
  const fair = meanPos(a, ["FairRecognition", "RespectInclusion"]);
  if (!fair || fair.f > 0.42) return null;
  return {
    id: "unprotected-giver",
    tone: "watch",
    title: "أنت معطاء في بيئة لا تبادلك بالمثل — أخطر وضعية للمعطائين",
    story: `تعاونك ولطفك مع الآخرين من أعلى ما قسنا (${n100(community.f)} من 100)، بينما إحساسك بالإنصاف والتقدير في عملك من أدناه (${n100(fair.f)} من 100). المعطاء في بيئة عادلة يزدهر؛ المعطاء في بيئة لا تردّ الجميل يُستنزف بصمت — لأن عطاءه يستمر بحكم شخصيته حتى بعد توقف المقابل.`,
    why: "أبحاث Adam Grant (منظومة «العطاء والأخذ»): المعطاؤون يتوزعون على طرفي منحنى النجاح — أعلاه وأدناه؛ والفارق الحاسم بين الفريقين هو حدود العطاء، لا كمّيته.",
    move: "لا تقلّص لطفك — قنّنه: اجعل مساعداتك مجدولة ومرئية (وقت محدد أسبوعيًا للمساعدة) بدل أن تكون متاحًا دائمًا وبلا سجل. المعطاء المحمي يعطي أكثر على المدى الطويل.",
    receipts: [
      { label: "تعاونك ولطفك", value: `${n100(community.f)}/100` },
      { label: "الإنصاف الذي تلمسه", value: `${n100(fair.f)}/100` },
    ],
    dims: ["community", "workplace"],
  };
}

/** 17 · The blocked extravert: high social energy, cut off inside work. */
function detectBlockedExtravert(a: Answers): Finding | null {
  const social = meanPos(a, dimSlugs("social"));
  if (!social || social.f < 0.65) return null;
  const belong = meanPos(a, ["TeamBelonging", "FeelLikeOutsider"]);
  if (!belong || belong.f > 0.45) return null;
  return {
    id: "blocked-extravert",
    tone: "watch",
    title: "مصدر طاقتك الأساسي مقطوع في المكان الذي تقضي فيه معظم يومك",
    story: `طاقتك الاجتماعية عالية (${n100(social.f)} من 100) — أنت ممن يشحنهم التفاعل مع الناس. لكن انتماءك لفريقك في العمل تحديدًا منخفض (${n100(belong.f)} من 100). لغيرك قد تكون الغربة عن الفريق إزعاجًا؛ لك أنت هي انقطاع عن مصدر الوقود نفسه — ثماني ساعات يوميًا في المكان الوحيد الذي لا يشحنك.`,
    why: "أبحاث الملاءمة بين الشخص والبيئة (Person–Environment Fit): الأثر النفسي لعدم الملاءمة يفوق أثر خصائص البيئة نفسها — البيئة نفسها التي يحتملها الانطوائي بسهولة تستنزف المنبسط المعزول.",
    move: "ابنِ قناة اجتماعية واحدة داخل العمل لا خارجه: غداء أسبوعي ثابت مع زميل أو زميلين — علاقة عمل واحدة حقيقية تغيّر تجربة المكان كله للمنبسطين.",
    receipts: [
      { label: "طاقتك الاجتماعية", value: `${n100(social.f)}/100` },
      { label: "انتماؤك لفريقك", value: `${n100(belong.f)}/100` },
    ],
    dims: ["social", "workplace"],
  };
}

/* ── The leverage point: "if you change one thing, change this" ────────────── */
/*  A dependency graph over the sub-scale metrics: an edge A → B means research
    consistently shows improving A drags B with it. The leverage point is the
    person's weak metric with the most weak downstream metrics — their highest
    return-on-effort, computed from their own numbers.                          */

const EDGES: Record<string, string[]> = {
  sleep: ["stress", "anxiety", "ee", "activity", "depression"],
  activity: ["sleep", "stress", "depression", "bmi", "fitness"],
  "fin-stress": ["stress", "anxiety", "sleep"],
  "fin-emergency": ["fin-stress", "stress"],
  "wp-recognition": ["wp-vigour", "wp-retention", "ee"],
  "wp-growth": ["wp-retention", "wp-vigour"],
  "wp-safety": ["wp-vigour", "wp-belonging"],
  ee: ["dp", "pa", "depression", "wp-vigour"],
  sitting: ["activity", "bmi"],
  commute: ["sitting", "activity"],
  nutrition: ["bmi", "fitness"],
};

/** The concrete first move per leverage source. */
const LEVER_MOVES: Record<string, string> = {
  sleep: "موعد نوم ثابت يضمن 7 ساعات، لمدة 14 ليلة متتالية — قبل أي هدف آخر.",
  activity: "ثلاث جلسات مشي سريع 30 دقيقة أسبوعيًا، بمواعيد محجوزة في تقويمك لا «عند الفراغ».",
  "fin-stress": "ميزانية شهرية مكتوبة تتتبع فيها أين يذهب راتبك فعلًا — الوضوح وحده يخفض القلق المالي.",
  "fin-emergency": "تحويل تلقائي صغير إلى حساب منفصل يوم نزول الراتب — يبني الأمان الذي يهدّئ البقية.",
  "wp-recognition": "لقاء شهري ثابت مع مديرك تعرض فيه ما أنجزت وما تحتاجه — التقدير يبدأ من الرؤية.",
  "wp-growth": "خطة تطور مكتوبة بهدفين ومهارة واحدة، تتفق عليها مع مديرك خلال أسبوعين.",
  "wp-safety": "ابدأ بملاحظات صغيرة منخفضة المخاطر في الاجتماعات لتختبر المساحة وتوسّعها تدريجيًا.",
  ee: "تفاوض على حدود العبء: ما الذي يُرفع عنك أو يُؤجل؟ الإنهاك يُدار من المنبع لا بالمسكّنات.",
  sitting: "منبّه كل 50 دقيقة للوقوف دقيقتين — يكسر الأثر الاستقلابي للجلوس حتى بلا رياضة.",
  commute: "أعد توظيف وقت المركبة الذي لا تستطيع تقصيره: بودكاست يقلبه تعلمًا، أو ركن أبعد يقلب جزءه مشيًا.",
  nutrition: "قاعدة واحدة فقط أول شهر: خضار أو فاكهة في كل وجبة — قاعدة تصنع أثرًا أكثر من حمية كاملة.",
};

/** The answer one scale-step healthier than the current one, or null. */
function stepToward(slug: string, v: number): number | null {
  const q = QUESTIONS.get(slug);
  if (!q) return null;
  const values = [...q.labelOf.keys()].sort((x, y) => x - y);
  const i = values.indexOf(v);
  if (i < 0) return null;
  const j = DISTRESS_DIMS.has(q.dim) ? Math.max(0, i - 1) : Math.min(values.length - 1, i + 1);
  return values[j];
}

/** Re-run the real engines with the leverage answers improved one step and
 *  report which displayed numbers actually move — an honest what-if, not a
 *  promise: only formulas that share those answers change. */
function projectImprovement(a: Answers, pi: PersonalInfoAnswers, sourceId: string): ProjectionDelta[] {
  const slugs = METRIC_SLUGS[sourceId];
  if (!slugs) return [];
  const improved: Answers = { ...a };
  let changed = false;
  for (const s of slugs) {
    if (improved[s] === undefined) continue;
    const next = stepToward(s, improved[s]);
    if (next !== null && next !== improved[s]) {
      improved[s] = next;
      changed = true;
    }
  }
  if (!changed) return [];

  const out: ProjectionDelta[] = [];
  const before = new Map(computeMetrics(a, pi).map((m) => [m.id, m]));
  const after = new Map(computeMetrics(improved, pi).map((m) => [m.id, m]));
  const src = before.get(sourceId);
  const srcAfter = after.get(sourceId);
  if (src && srcAfter && srcAfter.score !== src.score)
    out.push({ label: src.label, from: src.score, to: srcAfter.score });

  const compBefore = new Map(computeDeepAnalysis(a, pi).composites.map((c) => [c.id, c]));
  for (const c of computeDeepAnalysis(improved, pi).composites) {
    const b = compBefore.get(c.id);
    if (b && Math.abs(c.score - b.score) >= 2)
      out.push({ label: c.label, from: b.score, to: c.score });
  }
  return out.slice(0, 5);
}

function computeLeverage(a: Answers, pi: PersonalInfoAnswers): Leverage | null {
  const metrics = computeMetrics(a, pi);
  const byId = new Map(metrics.map((m) => [m.id, m]));

  let best: { id: string; downstream: string[] } | null = null;
  for (const [src, targets] of Object.entries(EDGES)) {
    const s = byId.get(src);
    if (!s || s.score >= 60) continue;
    const weak = targets.filter((t) => {
      const m = byId.get(t);
      return m !== undefined && m.score < 65;
    });
    if (weak.length < 2) continue;
    if (
      !best ||
      weak.length > best.downstream.length ||
      (weak.length === best.downstream.length && s.score < byId.get(best.id)!.score)
    ) {
      best = { id: src, downstream: weak };
    }
  }
  if (!best) return null;

  const src = byId.get(best.id)!;
  const downstream = best.downstream.map((t) => {
    const m = byId.get(t)!;
    return { id: m.id, label: m.label, score: m.score };
  });

  return {
    source: { id: src.id, label: src.label, score: src.score },
    downstream,
    story: `من بين كل ما قسناه، «${src.label}» (${nums(src.score)} من 100) هو المؤشر الضعيف الذي يجرّ خلفه أكبر عدد من مؤشراتك الضعيفة الأخرى — ${downstream.map((d) => `${d.label} (${nums(d.score)})`).join("، ")}. التحسينات الموزعة على عشر جبهات تفشل؛ المسار الأعلى عائدًا في بياناتك يبدأ من هذه النقطة تحديدًا لأن أثرها يتسلسل.`,
    move: LEVER_MOVES[src.id] ?? "ابدأ بخطوة واحدة صغيرة ثابتة في هذا المؤشر قبل أي شيء آخر.",
    projection: projectImprovement(a, pi, src.id),
  };
}

/* ── Public API ────────────────────────────────────────────────────────────── */

const DETECTORS: ((a: Answers, pi: PersonalInfoAnswers) => Finding | null)[] = [
  detectERI,
  detectEngagedExhausted,
  detectDetachedDrain,
  detectRecoveryShutdown,
  (a) => detectFitnessGap(a),
  detectMoneyUpstream,
  detectSocialShield,
  detectUnbufferedStress,
  detectConscientiousOverload,
  detectSilenceTax,
  detectPushNotPull,
  detectFlyingBlind,
  (a) => detectConditionClash(a),
  detectRetirementRunway,
  (a) => detectCommuteDrain(a),
  (a) => detectUnprotectedGiver(a),
  (a) => detectBlockedExtravert(a),
];

const TONE_RANK: Record<FindingTone, number> = { risk: 0, watch: 1, strength: 2 };

export function computeFindings(a: Answers, pi: PersonalInfoAnswers = {}): FindingsResult {
  const findings = DETECTORS.map((d) => d(a, pi))
    .filter((f): f is Finding => f !== null)
    .sort((x, y) => TONE_RANK[x.tone] - TONE_RANK[y.tone]);
  return { leverage: computeLeverage(a, pi), findings };
}
