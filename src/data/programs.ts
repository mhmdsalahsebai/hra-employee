import {
  Activity,
  Brain,
  Cigarette,
  CloudRain,
  HeartPulse,
  Moon,
  Salad,
  Sparkles,
  Wallet,
  Weight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DimensionId } from "./dimensions";
import {
  type Insight,
  type InsightSeverity,
} from "./insights";

/* ───────────────────────────────────────────────────────────────────────────
   Guided programs. Where the plan engine turns each report finding into a single
   self-driven step, a program is the deeper intervention: a named issue
   (obesity, anxiety, depression, burnout …), a dedicated health expert, and a
   structured course of five sessions that walks the employee from assessment to
   lasting change.

   Each program declares the insight ids it treats (`treats`). After the
   assessment, recommendProgrames() matches the employee's actual findings to
   these programs and ranks them by urgency — so the plan surfaces the right
   expert-led course for the issues the report uncovered.
   ─────────────────────────────────────────────────────────────────────────── */

export interface ProgramExpert {
  /** Display name (Avatar derives initials from this). */
  name: string;
  /** Professional title shown under the name. */
  title: string;
  /** Years of experience, for credibility. */
  years: number;
}

export interface ProgramSession {
  order: number;
  title: string;
  /** What this session covers and what the employee walks away with. */
  focus: string;
  durationMin: number;
}

export interface Program {
  id: string;
  /** Short label, e.g. "السمنة". Used as the issue chip in the plan. */
  tag: string;
  title: string;
  /** One-line promise of the program. */
  tagline: string;
  /** Two–three sentences: who it's for and how it helps. */
  description: string;
  /** The wellbeing dimension this program lives under — drives icon & accent. */
  dimension: DimensionId;
  icon: LucideIcon;
  expert: ProgramExpert;
  /** Exactly five sessions, in order. */
  sessions: ProgramSession[];
  /** The tangible gains the employee walks away with — the "why join" value,
   *  shown as a benefit list on the recommendation card. Keep to 2–3, concrete. */
  outcomes: string[];
  /** Insight ids (from insights.ts) this program is designed to address. */
  treats: string[];
}

export const programs: Program[] = [
  {
    id: "weight",
    tag: "السمنة",
    title: "إدارة الوزن والسمنة",
    tagline: "خطة آمنة ومتدرّجة للوصول إلى وزن صحي والحفاظ عليه",
    description:
      "برنامج عملي لمن يعانون من زيادة الوزن أو السمنة. تضع معك أخصائية التغذية خطة واقعية تجمع بين تعديل الغذاء والحركة وتغيير العادات، بأهداف صغيرة قابلة للقياس بعيدًا عن الحميات القاسية.",
    dimension: "physical",
    icon: Weight,
    expert: { name: "د. نورة الزهراني", title: "استشارية تغذية علاجية", years: 12 },
    sessions: [
      { order: 1, title: "تقييم الوضع ووضع الهدف", focus: "قراءة مؤشر كتلة الجسم ومحيط الخصر، وتحديد هدف واقعي لخسارة 5٪ خلال 3 أشهر.", durationMin: 45 },
      { order: 2, title: "هندسة الطبق والسعرات", focus: "بناء وجبات متوازنة وضبط الحصص دون حرمان، وقراءة الملصقات الغذائية.", durationMin: 40 },
      { order: 3, title: "الحركة التي تناسب جسمك", focus: "خطة نشاط تبدأ بالمشي وتتدرّج، مدمجة في يومك دون الحاجة لنادٍ.", durationMin: 40 },
      { order: 4, title: "محفّزات الأكل العاطفي", focus: "التعرّف على الجوع العاطفي وكسر دورة الأكل تحت الضغط أو الملل.", durationMin: 45 },
      { order: 5, title: "تثبيت العادة ومنع الانتكاس", focus: "خطة المحافظة على الوزن، والتعامل مع المناسبات والهفوات دون استسلام.", durationMin: 40 },
    ],
    outcomes: [
      "خسارة تدريجية وآمنة للوزن دون حرمان",
      "طاقة أعلى ومؤشرات ضغط وسكر أفضل",
      "عادات أكل تدوم معك بعد البرنامج",
    ],
    treats: ["bmi", "waist"],
  },
  {
    id: "healthy-lifestyle",
    tag: "نمط الحياة والوقاية",
    title: "نمط حياة صحي ووقاية",
    tagline: "تغذية متوازنة وفحوصات وقائية تحمي قلبك واستقلابك",
    description:
      "برنامج وقائي يجمع بين تحسين العادات الغذائية، الالتزام بالفحوصات الدورية، وإدارة الحالات المزمنة مبكرًا. مناسب لمن تظهر لديه مؤشرات غذائية أو حالات مزمنة أو فحوصات ناقصة.",
    dimension: "physical",
    icon: Salad,
    expert: { name: "د. خالد الدوسري", title: "استشاري طب أسرة ووقاية", years: 15 },
    sessions: [
      { order: 1, title: "خريطة المخاطر الصحية", focus: "مراجعة الفحوصات الناقصة (الضغط، السكر، الكوليسترول) وجدولة ما يلزم.", durationMin: 40 },
      { order: 2, title: "أساسيات الصحن الصحي", focus: "زيادة الخضار والفواكه، وتقليل الملح والدهون والوجبات السريعة عمليًا.", durationMin: 40 },
      { order: 3, title: "إدارة الحالة المزمنة", focus: "الالتزام بالعلاج والقياسات المنزلية وعلامات الإنذار التي تستدعي الطبيب.", durationMin: 45 },
      { order: 4, title: "الترطيب والحركة اليومية", focus: "بناء عادة شرب الماء وكسر الجلوس المطوّل خلال يوم العمل.", durationMin: 35 },
      { order: 5, title: "خطة المتابعة السنوية", focus: "تقويم فحوصات شخصي وعادات وقائية مستدامة تحافظ على مكاسبك.", durationMin: 35 },
    ],
    outcomes: [
      "فحوصاتك الوقائية مكتملة ومجدولة",
      "خطر أمراض القلب والسكري أقل",
      "روتين غذائي وحركي يحمي استقلابك",
    ],
    treats: ["nutrition", "chronic-condition", "chronic-pain", "screening-gap", "screening-single", "bp-never"],
  },
  {
    id: "anxiety",
    tag: "القلق",
    title: "التحرّر من القلق",
    tagline: "أدوات معرفية وسلوكية لتهدئة القلق واستعادة التركيز",
    description:
      "برنامج قائم على العلاج المعرفي السلوكي لمن يعانون من القلق المتكرر والتوتر والتوجّس. تتعلّم كيف تهدّئ جهازك العصبي، وتتعامل مع الأفكار القلِقة، وتستعيد نومك وتركيزك.",
    dimension: "psycho",
    icon: Brain,
    expert: { name: "أ. ريم الشهري", title: "أخصائية نفسية – اضطرابات القلق", years: 9 },
    sessions: [
      { order: 1, title: "فهم القلق وكيف يعمل", focus: "التمييز بين القلق الصحي والمفرط، ورسم خريطة لمحفّزاتك الشخصية.", durationMin: 45 },
      { order: 2, title: "تهدئة الجسم", focus: "تمارين التنفّس والتأريض والاسترخاء العضلي لخفض حالة التأهب.", durationMin: 40 },
      { order: 3, title: "إعادة صياغة الأفكار القلِقة", focus: "ضبط التفكير الكارثي وتحدّي الأفكار التلقائية بأدلة الواقع.", durationMin: 45 },
      { order: 4, title: "مواجهة المخاوف تدريجيًا", focus: "التعرّض المتدرّج للمواقف المتجنَّبة لكسر دائرة القلق.", durationMin: 45 },
      { order: 5, title: "خطة الوقاية من الانتكاس", focus: "عُدّة أدوات يومية وعلامات إنذار مبكر للحفاظ على الهدوء.", durationMin: 40 },
    ],
    outcomes: [
      "نوبات قلق أقل تكرارًا وأخفّ حدّة",
      "أدوات فورية تهدّئ توترك وقت الحاجة",
      "نوم وتركيز يعودان إلى طبيعتهما",
    ],
    treats: ["anxiety", "stress"],
  },
  {
    id: "depression",
    tag: "الاكتئاب",
    title: "تجاوز الاكتئاب وتحسين المزاج",
    tagline: "خطوات مدروسة لاستعادة الطاقة والدافع ومعنى يومك",
    description:
      "برنامج داعم لمن تظهر لديهم مؤشرات مزاج منخفض أو اكتئاب: حزن متكرر، قلة دافع، أو شعور بقلة القيمة. يعمل معك المختص على إعادة تنشيط حياتك تدريجيًا وتغيير أنماط التفكير السلبية.",
    dimension: "psycho",
    icon: CloudRain,
    expert: { name: "د. سلطان الحربي", title: "استشاري الطب النفسي", years: 14 },
    sessions: [
      { order: 1, title: "أين أنت الآن؟", focus: "فهم أعراض المزاج المنخفض وكسر لوم الذات حولها.", durationMin: 45 },
      { order: 2, title: "التنشيط السلوكي", focus: "إعادة أنشطة تمنح المتعة والإنجاز ولو بخطوات صغيرة.", durationMin: 40 },
      { order: 3, title: "تفكيك الأفكار السلبية", focus: "التعرّف على نمط التفكير المكتئب واستبداله بنظرة أكثر توازنًا.", durationMin: 45 },
      { order: 4, title: "الروتين والنوم والدعم", focus: "بناء روتين يومي مستقر وشبكة دعم تسندك.", durationMin: 40 },
      { order: 5, title: "الحفاظ على التقدّم", focus: "رصد علامات الانتكاس مبكرًا وخطة لمواصلة التعافي.", durationMin: 40 },
    ],
    outcomes: [
      "طاقة ودافع يعودان خطوة بخطوة",
      "نظرة أكثر توازنًا نحو نفسك ويومك",
      "روتين وشبكة دعم تسندك",
    ],
    treats: ["depression", "emotional-regulation"],
  },
  {
    id: "burnout",
    tag: "الاحتراق الوظيفي",
    title: "التعافي من الاحتراق الوظيفي",
    tagline: "استعد طاقتك وحدودك وعلاقتك بعملك",
    description:
      "برنامج لمن يعانون من الإنهاك العاطفي وتبلّد المشاعر وتراجع الإحساس بالإنجاز بسبب العمل. يساعدك المدرّب على فهم مصادر الاستنزاف، ووضع حدود صحية، وإعادة بناء طاقتك.",
    dimension: "professional",
    icon: Sparkles,
    expert: { name: "أ. فهد العتيبي", title: "مدرب رفاهية وظيفية معتمد", years: 10 },
    sessions: [
      { order: 1, title: "تشخيص الاحتراق", focus: "قياس أبعاد الاحتراق الثلاثة وتحديد أكبر مصادر الاستنزاف لديك.", durationMin: 45 },
      { order: 2, title: "حدود العبء والطاقة", focus: "إعادة التفاوض على العبء، وحماية وقت التعافي بين العمل وما بعده.", durationMin: 40 },
      { order: 3, title: "استعادة المعنى", focus: "إعادة ربط مهامك بقيمها وأثرها لتجديد الدافع.", durationMin: 40 },
      { order: 4, title: "إدارة الطاقة لا الوقت", focus: "فواصل التعافي القصيرة وطقوس بداية ونهاية اليوم.", durationMin: 40 },
      { order: 5, title: "خطة الاستدامة", focus: "نظام إنذار مبكر يمنع عودة الاحتراق ومحادثة واضحة مع مديرك.", durationMin: 40 },
    ],
    outcomes: [
      "طاقتك واتزانك يعودان تدريجيًا",
      "حدود صحية بين العمل وبقية حياتك",
      "علاقة أهدأ وأصحّ مع عملك",
    ],
    treats: ["burnout", "burnout-ee", "burnout-mild"],
  },
  {
    id: "sleep",
    tag: "النوم",
    title: "النوم الصحي العميق",
    tagline: "استعد ساعات نومك وجودته لطاقة ومزاج أفضل",
    description:
      "برنامج قائم على العلاج السلوكي للأرق لمن ينامون أقل من الموصى به أو يعانون من نوم متقطّع. تبني عادات نوم صحية تخفّض التوتر وتحسّن التركيز والمناعة.",
    dimension: "physical",
    icon: Moon,
    expert: { name: "د. هند المطيري", title: "أخصائية طب النوم", years: 8 },
    sessions: [
      { order: 1, title: "تقييم نومك", focus: "تحليل أنماط نومك ويقظتك وتحديد ما يعطّل راحتك.", durationMin: 40 },
      { order: 2, title: "نظافة النوم", focus: "ضبط مواعيد النوم، والبيئة، والشاشات، والكافيين قبل النوم.", durationMin: 35 },
      { order: 3, title: "تهدئة العقل ليلًا", focus: "تقنيات استرخاء وتفريغ ذهني توقف اجترار الأفكار.", durationMin: 40 },
      { order: 4, title: "ضبط الساعة البيولوجية", focus: "تثبيت وقت الاستيقاظ والتعرّض للضوء لإعادة ضبط إيقاعك.", durationMin: 35 },
      { order: 5, title: "نوم مستدام", focus: "خطة للتعامل مع الليالي الصعبة دون العودة للأرق.", durationMin: 35 },
    ],
    outcomes: [
      "نوم أعمق وأقلّ تقطّعًا",
      "استيقاظ بنشاط وتركيز أوضح",
      "توتر أقل يرافقك خلال يومك",
    ],
    treats: ["sleep"],
  },
  {
    id: "smoking",
    tag: "التدخين",
    title: "الإقلاع عن التدخين",
    tagline: "خطة مدعومة تضاعف فرص إقلاعك بدل الاعتماد على الإرادة وحدها",
    description:
      "برنامج متدرّج لمن يستخدمون التبغ يوميًا أو متقطّعًا. يساعدك المختص على تحديد يوم الإقلاع، وإدارة الاشتياق والانسحاب، وتفادي الانتكاس بدعم مستمر.",
    dimension: "physical",
    icon: Cigarette,
    expert: { name: "أ. ماجد القرني", title: "أخصائي الإقلاع عن التدخين", years: 11 },
    sessions: [
      { order: 1, title: "دوافعك ويوم الإقلاع", focus: "توضيح أسبابك، وقياس درجة الاعتماد، وتحديد يوم الإقلاع.", durationMin: 40 },
      { order: 2, title: "إدارة الاشتياق", focus: "استراتيجيات فورية للتعامل مع نوبات الرغبة والمحفّزات.", durationMin: 35 },
      { order: 3, title: "أعراض الانسحاب والبدائل", focus: "خيارات الدعم الدوائي والسلوكي لتخفيف الانسحاب.", durationMin: 40 },
      { order: 4, title: "كسر الارتباطات", focus: "تغيير الروتين المرتبط بالتدخين وبناء بدائل صحية.", durationMin: 35 },
      { order: 5, title: "البقاء غير مدخّن", focus: "خطة منع الانتكاس والتعامل مع الهفوة إن حدثت.", durationMin: 35 },
    ],
    outcomes: [
      "فرص إقلاعك تتضاعف بدعم مختص",
      "تحكّم في الاشتياق وأعراض الانسحاب",
      "نفَس وقلب ومال في حال أفضل",
    ],
    treats: ["smoking"],
  },
  {
    id: "fitness",
    tag: "الخمول البدني",
    title: "الحركة واللياقة",
    tagline: "من الخمول إلى 150 دقيقة نشاط أسبوعيًا بخطوات صغيرة",
    description:
      "برنامج لمن يعانون من قلة النشاط البدني أو الجلوس المطوّل أو ضعف اللياقة. يبني معك الأخصائي خطة حركة تدريجية تناسب جسمك ووقتك وتحسّن طاقتك ومزاجك.",
    dimension: "physical",
    icon: Activity,
    expert: { name: "أ. عبدالله الغامدي", title: "أخصائي علاج طبيعي ولياقة", years: 9 },
    sessions: [
      { order: 1, title: "نقطة الانطلاق", focus: "تقييم مستوى اللياقة وأي قيود، ووضع هدف نشاط أسبوعي واقعي.", durationMin: 40 },
      { order: 2, title: "كسر الجلوس المطوّل", focus: "إدخال الحركة الخفيفة المتكررة في يوم العمل المكتبي.", durationMin: 35 },
      { order: 3, title: "بناء التحمّل", focus: "خطة مشي/كارديو متدرّجة نحو 150 دقيقة أسبوعيًا.", durationMin: 40 },
      { order: 4, title: "تمارين المقاومة الآمنة", focus: "تمارين قوة منزلية بسيطة لحماية العضلات والمفاصل.", durationMin: 40 },
      { order: 5, title: "اجعلها عادة", focus: "جدولة النشاط ومتابعته بما يضمن الاستمرارية.", durationMin: 35 },
    ],
    outcomes: [
      "لياقة وطاقة ترتفع أسبوعًا بعد أسبوع",
      "خطة حركة تناسب وقتك دون نادٍ",
      "مزاج أفضل وجلوس مطوّل أقل",
    ],
    treats: ["inactivity", "sitting"],
  },
  {
    id: "financial",
    tag: "الضغط المالي",
    title: "الصحة المالية والاستقرار",
    tagline: "من الضغط المالي إلى ميزانية واضحة وصندوق طوارئ متنامٍ",
    description:
      "برنامج لمن يعانون من ضغط مالي، صعوبة في تغطية النفقات، غياب الادخار، أو ضعف الاستعداد للتقاعد. تضع معك المستشارة المالية خطة عملية لإعادة التوازن وبناء الأمان المالي.",
    dimension: "financial",
    icon: Wallet,
    expert: { name: "أ. سارة العنزي", title: "مستشارة مالية معتمدة", years: 10 },
    sessions: [
      { order: 1, title: "صورة وضعك المالي", focus: "حصر الدخل والنفقات والديون، وتحديد أكبر مصادر الضغط.", durationMin: 45 },
      { order: 2, title: "بناء الميزانية", focus: "توزيع الدخل بقاعدة بسيطة وخفض بند إنفاق واحد فورًا.", durationMin: 40 },
      { order: 3, title: "صندوق الطوارئ", focus: "بناء وسادة مالية تلقائية تغطي نفقات 3 أشهر تدريجيًا.", durationMin: 40 },
      { order: 4, title: "معالجة الديون", focus: "ترتيب سداد الديون وتخفيف عبئها على الميزانية الشهرية.", durationMin: 40 },
      { order: 5, title: "التخطيط للمستقبل", focus: "أهداف طويلة الأجل وبداية ادخار التقاعد ولو 5٪ شهريًا.", durationMin: 40 },
    ],
    outcomes: [
      "ميزانية واضحة تحت سيطرتك",
      "صندوق طوارئ ينمو تلقائيًا",
      "ضغط مالي أقل وشعور أكبر بالأمان",
    ],
    treats: ["financial-stress", "financial-cushion", "financial-obligations", "retirement", "financial-planning"],
  },
  {
    id: "engagement",
    tag: "الانتماء الوظيفي",
    title: "الاندماج والانتماء الوظيفي",
    tagline: "استعد شغفك بعملك وشعورك بالتقدير والانتماء لفريقك",
    description:
      "برنامج لمن يشعرون بفتور الاندماج، ضعف المعنى، غياب مسار النمو، أو ضعف الانتماء للفريق أو التفكير في المغادرة. يساعدك المدرّب على استعادة العلاقة الإيجابية مع عملك ومنظمتك.",
    dimension: "workplace",
    icon: HeartPulse,
    expert: { name: "د. ليان القحطاني", title: "مدربة تطوير مهني", years: 11 },
    sessions: [
      { order: 1, title: "ما الذي استنزف شغفك؟", focus: "تشخيص أسباب الفتور: المهام، التقدير، العبء، أو غياب المعنى.", durationMin: 45 },
      { order: 2, title: "إعادة اكتشاف المعنى", focus: "ربط دورك بأثره الأكبر وقيمك الشخصية.", durationMin: 40 },
      { order: 3, title: "مسار النمو", focus: "خطة تطوّر فردية وخطوة مهنية تالية واضحة.", durationMin: 40 },
      { order: 4, title: "الانتماء والأمان النفسي", focus: "بناء روابط صادقة في الفريق والتعبير عن الرأي بأمان.", durationMin: 40 },
      { order: 5, title: "قرار واعٍ", focus: "تقييم السبب الجذري قبل أي قرار بالبقاء أو المغادرة، ومحادثة مع مديرك.", durationMin: 45 },
    ],
    outcomes: [
      "شغف ومعنى يعودان إلى عملك",
      "مسار نمو وخطوة مهنية تالية واضحة",
      "انتماء وأمان نفسي أكبر في فريقك",
    ],
    treats: ["engagement-low", "engagement-meaning", "engagement-growth", "engagement-belonging", "turnover", "recognition", "psych-safety"],
  },
];

export const programsById: Record<string, Program> = programs.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<string, Program>,
);

/* ── Recommendation engine ─────────────────────────────────────────────────── */

const SEVERITY_RANK: Record<InsightSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
  positive: 3,
};

export interface RecommendedProgram {
  program: Program;
  /** The employee's own findings this program addresses. */
  matches: Insight[];
  /** Most urgent severity among the matches — drives ordering & emphasis. */
  topSeverity: InsightSeverity;
}

/**
 * Match the employee's report findings to the guided programs. A program is
 * recommended when any of its `treats` ids appears among the flagged insights.
 * Results are ranked by the most urgent finding they address, then by how many
 * of the employee's findings the program covers.
 */
export function recommendPrograms(insights: Insight[]): RecommendedProgram[] {
  const flagged = insights.filter((i) => i.severity !== "positive");
  const byId = new Map<string, Insight>();
  for (const i of flagged) if (!byId.has(i.id)) byId.set(i.id, i);

  const recommended: RecommendedProgram[] = [];
  for (const program of programs) {
    const matches = program.treats
      .map((id) => byId.get(id))
      .filter((i): i is Insight => i !== undefined);
    if (!matches.length) continue;
    const topSeverity = matches.reduce<InsightSeverity>(
      (best, i) => (SEVERITY_RANK[i.severity] < SEVERITY_RANK[best] ? i.severity : best),
      "info",
    );
    recommended.push({ program, matches, topSeverity });
  }

  return recommended.sort((a, b) => {
    const sev = SEVERITY_RANK[a.topSeverity] - SEVERITY_RANK[b.topSeverity];
    return sev !== 0 ? sev : b.matches.length - a.matches.length;
  });
}
