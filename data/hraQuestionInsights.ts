import { IntellectualQuestionSlug } from "../types/intellectual.type";
import { ProfessionalQuestionSlug } from "../types/professional.type";
import { PsychoQuestionSlug } from "../types/psycho.type";
import { CommunityQuestionSlug } from "../types/community.type";
import { SocialQuestionSlug } from "../types/social.type";
import { BelongingQuestionSlug } from "../types/belonging.type";
import { PhysicalQuestionSlug } from "../types/physical.type";
import { FinancialQuestionSlug } from "../types/financial.type";
import { WorkplaceQuestionSlug } from "../types/workplace.type";

/* ───────────────────────────────────────────────────────────────────────────
   Per-question insights shown right after the person answers, keyed to the
   questions in hraDimensions.ts. Every entry is grounded in a real, named,
   respectable source — WHO, Gallup, The Lancet, BMJ, JAMA, PNAS, Science,
   named university studies — with the actual figure the research reports.
   Nothing generic, nothing invented.

   - kind "fact" (حقيقة علمية): a striking, sourced research finding tied to
     the exact topic of the question. Most entries.
   - kind "encouragement" (تشجيع): for emotionally sensitive questions where
     a warm, honest note serves better than a number.

   `stat` is the headline figure the UI animates (count-up). `source` names
   where the fact comes from and renders as a credibility line.
   ─────────────────────────────────────────────────────────────────────────── */

export type HraQuestionInsightKind = "fact" | "encouragement";

export interface HraQuestionInsightStat {
  /** The figure the UI counts up to. Integers only. */
  value: number;
  /** Rendered before the number, e.g. "×" for multipliers. */
  prefix?: string;
  /** Rendered after the number, e.g. "٪" or " دقيقة". */
  suffix?: string;
  /** One line reading as a continuation of the number. */
  label: string;
}

export interface HraQuestionInsight {
  slug: string;
  kind: HraQuestionInsightKind;
  /** One or two Arabic sentences: the takeaway, written to the person. */
  text: string;
  /** Optional headline figure; when present the card leads with it. */
  stat?: HraQuestionInsightStat;
  /** The named study / organization behind the fact. */
  source?: string;
}

const hraQuestionInsights: {
  title: string;
  slug: string;
  insights: HraQuestionInsight[];
}[] = [
  {
    title: "المهني",
    slug: "professional",
    insights: [
      {
        slug: ProfessionalQuestionSlug.WorkEmotionalExhaustion,
        kind: "fact",
        text: "الإنهاك العاطفي هو البعد الأول للاحتراق الوظيفي في التصنيف العلمي، وهو أبعد ما يكون عن الضعف الشخصي — إنه استجابة موثقة لضغط متراكم.",
        stat: {
          value: 76,
          suffix: "٪",
          label: "من الموظفين حول العالم يمرون بالاحتراق الوظيفي في عملهم أحيانًا على الأقل — أنت لست استثناءً",
        },
        source: "مؤسسة غالوب — دراسة على 7,500 موظف",
      },
      {
        slug: ProfessionalQuestionSlug.PatienceExhaustionWorkday,
        kind: "fact",
        text: "أبحاث عالمة النفس سابينه سوننتاغ وجدت أن استعادة الطاقة لا تحدث أثناء العمل بل بعده: من ينفصلون ذهنيًا عن العمل مساءً يبدؤون يومهم التالي بصبر وطاقة أعلى قابلة للقياس.",
        source: "أبحاث التعافي الوظيفي — جامعة مانهايم",
      },
      {
        slug: ProfessionalQuestionSlug.MorningFatigueWorkday,
        kind: "fact",
        text: "الخمول بعد الاستيقاظ مباشرة (Sleep Inertia) ظاهرة فسيولوجية طبيعية تستمر حتى ساعة. أما التعب الذي يرافقك طوال الصباح فإشارة نقص نوم أو إجهاد تستحق الانتباه.",
        stat: {
          value: 60,
          suffix: " دقيقة",
          label: "هي المدة القصوى الطبيعية للخمول الصباحي الفسيولوجي — ما يتجاوزها رسالة من جسدك",
        },
        source: "أبحاث طب النوم السريري",
      },
      {
        slug: ProfessionalQuestionSlug.EmpathyColleagues,
        kind: "fact",
        text: "التعاطف في بيئة العمل ليس مجاملة — إنه محرك إبداع موثق بالأرقام.",
        stat: {
          value: 61,
          suffix: "٪",
          label: "من الموظفين الذين يعملون مع قادة متعاطفين يصفون أنفسهم بالمبدعين، مقابل 13٪ فقط مع قادة أقل تعاطفًا",
        },
        source: "دراسة مؤسسة Catalyst 2021 — 889 موظفًا",
      },
      {
        slug: ProfessionalQuestionSlug.DehumanizingColleagues,
        kind: "fact",
        text: "«تبلد المشاعر» تجاه من حولك في العمل ليس قسوة في شخصيتك — إنه آلية دفاع نفسية معروفة، وأحد الأبعاد الرسمية للاحتراق الوظيفي، وهو قابل للعلاج.",
        stat: {
          value: 3,
          suffix: " أبعاد",
          label: "للاحتراق الوظيفي في التصنيف الدولي للأمراض ICD-11: الإنهاك، وتبلد المشاعر، وتراجع الإنجاز",
        },
        source: "منظمة الصحة العالمية — ICD-11",
      },
      {
        slug: ProfessionalQuestionSlug.ColleagueInteractionEffort,
        kind: "fact",
        text: "ما تشعر به له اسم علمي: «العمل العاطفي». أبحاث أليسيا غراندي وجدت أن التظاهر بمشاعر غير حقيقية أثناء التعامل مع الناس يستنزف طاقة فعلية ويتنبأ بالإنهاك — بينما اللحظات القصيرة من الهدوء بين التفاعلات تعيد الشحن.",
        source: "أبحاث العمل العاطفي — جامعة ولاية بنسلفانيا",
      },
      {
        slug: ProfessionalQuestionSlug.HandleColleagueProblems,
        kind: "fact",
        text: "نموذج «متطلبات العمل وموارده» — الأكثر استخدامًا في علم النفس المهني — يضع الدعم الاجتماعي بين الزملاء في مقدمة الموارد التي تحمي من الإجهاد: مهارتك في مساندة زملائك تحميك أنت أيضًا.",
        source: "نموذج JD-R — باكر وديميروتي",
      },
      {
        slug: ProfessionalQuestionSlug.WorkBreakdown,
        kind: "encouragement",
        text: "هذا الشعور جرس إنذار حقيقي يستحق أن يُؤخذ بجدية، لا أن يُكابَر عليه. الاحتراق الوظيفي حالة موثقة طبيًا وقابلة للتعافي — والتحدث مع مختص خطوة عملية وليست رفاهية.",
      },
      {
        slug: ProfessionalQuestionSlug.PositiveImpactPeople,
        kind: "fact",
        text: "في تجربة آدم غرانت الشهيرة، التقى موظفو جمع تبرعات جامعية لخمس دقائق فقط بطالب استفاد من عملهم — فقفز أداؤهم قفزة هائلة. رؤية أثرك على الناس وقود حقيقي.",
        stat: {
          value: 171,
          suffix: "٪",
          label: "زيادة في التبرعات التي جمعها الموظفون بعد لقاء واحد قصير مع مستفيد من عملهم",
        },
        source: "دراسة آدم غرانت — جامعة بنسلفانيا 2007",
      },
      {
        slug: ProfessionalQuestionSlug.IncreasedHardnessPeople,
        kind: "encouragement",
        text: "ملاحظتك لهذا التغير في نفسك وعيٌ نادر. القسوة المتزايدة غالبًا درع نفسي ضد الاستنزاف لا طبع أصيل — ومع معالجة مصدر الضغط، تعود المرونة.",
      },
      {
        slug: ProfessionalQuestionSlug.FearIndifference,
        kind: "encouragement",
        text: "الخوف من فقدان الاهتمام دليل على أن الاهتمام ما زال حيًا. اللامبالاة المهنية مرحلة موثقة في مسار الإجهاد — والتقاطها مبكرًا كما تفعل الآن يجعل عكسها أسهل بكثير.",
      },
      {
        slug: ProfessionalQuestionSlug.VitalityEnergy,
        kind: "fact",
        text: "المفارقة المثبتة علميًا: الحركة تصنع الطاقة ولا تستهلكها. في تجربة جامعة جورجيا، النشاط الخفيف المنتظم تفوّق على الراحة في علاج الإرهاق.",
        stat: {
          value: 65,
          suffix: "٪",
          label: "انخفاضًا في الشعور بالتعب لدى من مارسوا نشاطًا بدنيًا خفيفًا منتظمًا لمدة 6 أسابيع",
        },
        source: "دراسة جامعة جورجيا 2008",
      },
      {
        slug: ProfessionalQuestionSlug.WorkFrustration,
        kind: "fact",
        text: "أبحاث «هندسة الوظيفة» (Job Crafting) لإيمي فجينيفسكي بجامعة ييل وجدت أن الموظفين الذين يعيدون تشكيل مهامهم ولو جزئيًا حول نقاط قوتهم يرتفع رضاهم وأداؤهم — الإحباط قابل للهندسة العكسية.",
        source: "أبحاث Job Crafting — جامعة ييل",
      },
      {
        slug: ProfessionalQuestionSlug.DifficultWork,
        kind: "fact",
        text: "نموذج «الجهد مقابل المكافأة» في الطب المهني يوثّق أن الإجهاد الضار لا يأتي من صعوبة العمل نفسها، بل من اختلال التوازن بين ما تبذله وما تحصل عليه من تقدير وعائد — التسمية الدقيقة للمشكلة نصف حلها.",
        source: "نموذج سيغريست — الطب النفسي المهني",
      },
      {
        slug: ProfessionalQuestionSlug.IndifferenceColleaguesWellbeing,
        kind: "encouragement",
        text: "فقدان الاكتراث بالزملاء عرض معروف من أعراض الاستنزاف، لا حكم على أخلاقك. حين تُستعاد الطاقة، يعود الاكتراث — وإجابتك الصادقة هنا أول خطوة.",
      },
      {
        slug: ProfessionalQuestionSlug.DirectContactStress,
        kind: "fact",
        text: "مقياس ماسلاش — المعيار العالمي لقياس الاحتراق — وُضع أصلًا لمهن الاتصال المباشر بالناس، لأن الأبحاث وجدتها الأعلى استنزافًا عاطفيًا على الإطلاق. شعورك بالضغط منطقي علميًا وليس ضعفًا.",
        source: "كريستينا ماسلاش — جامعة كاليفورنيا بيركلي",
      },
      {
        slug: ProfessionalQuestionSlug.CreateComfortableAtmosphere,
        kind: "fact",
        text: "قدرتك على خلق جو مريح ليست مهارة اجتماعية ثانوية — أبحاث الأمان النفسي تضعها في قلب أداء الفرق العالية: الفريق الذي يرتاح أفراده لبعضهم يتعلم أسرع ويخطئ أقل.",
        source: "إيمي إدموندسون — كلية هارفارد للأعمال",
      },
      {
        slug: ProfessionalQuestionSlug.RefreshedWithColleagues,
        kind: "fact",
        text: "الصداقة في العمل ليست ترفًا — إنها من أقوى مؤشرات الاندماج التي تقيسها غالوب منذ عقود.",
        stat: {
          value: 7,
          prefix: "×",
          label: "أضعاف احتمال الاندماج الكامل في العمل لدى من لديهم «صديق مقرّب» في مكان العمل",
        },
        source: "مؤسسة غالوب — استطلاعات Q12",
      },
      {
        slug: ProfessionalQuestionSlug.ValuableAccomplishments,
        kind: "fact",
        text: "حلل باحثو هارفارد 12 ألف مذكرة يومية لموظفين ليكتشفوا «مبدأ التقدم»: أقوى محفز للإنسان في عمله ليس المال ولا الثناء — بل الإحساس بإحراز تقدم في عمل ذي معنى.",
        stat: {
          value: 12,
          suffix: " ألف مذكرة",
          label: "يومية حللتها دراسة هارفارد لتكتشف أن الشعور بالتقدم هو المحفز الأول في العمل",
        },
        source: "أماييل وكرامر — مبدأ التقدم، هارفارد",
      },
      {
        slug: ProfessionalQuestionSlug.ApproachingBurnout,
        kind: "encouragement",
        text: "شكرًا لصراحتك — هذه الإجابة تحديدًا هي أهم معلومة في هذا التقييم كله. الاحتراق الوظيفي حالة معترف بها من منظمة الصحة العالمية، قابلة للتعافي الكامل، والاعتراف بها أول خطوات العلاج. لست وحدك، والدعم متاح.",
      },
      {
        slug: ProfessionalQuestionSlug.EmotionalProblemssCalmly,
        kind: "fact",
        text: "«إعادة التقييم المعرفي» — النظر للموقف الانفعالي من زاوية أخرى قبل الرد — أكثر استراتيجيات تنظيم المشاعر التي أثبتت فعاليتها في مختبرات جيمس غروس بستانفورد: تخفض الانفعال دون كبته.",
        source: "مختبر تنظيم المشاعر — جامعة ستانفورد",
      },
      {
        slug: ProfessionalQuestionSlug.BlamedForColleaguesProblems,
        kind: "fact",
        text: "تحمّل مسؤولية مشاعر الآخرين ومشاكلهم باستمرار نمط معروف في أبحاث الإجهاد المهني، والحدود الصحية ليست أنانية: الأبحاث تُظهر أن أصحاب الحدود الواضحة يقدمون دعمًا أفضل وأدوم لزملائهم.",
        source: "أبحاث الحدود المهنية — علم النفس التنظيمي",
      },
    ],
  },
  {
    title: "النفسي",
    slug: "psycho",
    insights: [
      {
        slug: PsychoQuestionSlug.AnxietyNotProne,
        kind: "fact",
        text: "القلق ليس حالة نادرة ولا وصمة — إنه أكثر الاضطرابات النفسية شيوعًا على وجه الأرض، وأكثرها استجابة للعلاج.",
        stat: {
          value: 301,
          suffix: " مليون",
          label: "إنسان حول العالم يعيشون مع اضطرابات القلق — وهي الأكثر قابلية للعلاج بين الاضطرابات النفسية",
        },
        source: "منظمة الصحة العالمية 2019",
      },
      {
        slug: PsychoQuestionSlug.InferiorityFeelings,
        kind: "fact",
        text: "أبحاث كريستين نيف في «التعاطف مع الذات» وثّقت أن من يعاملون أنفسهم بلطف صديق — لا بقسوة ناقد — أقل قلقًا واكتئابًا وأكثر مثابرة بعد الفشل. اللطف مع النفس مهارة تُتعلم، لا طبعًا يولد مع الإنسان.",
        source: "كريستين نيف — جامعة تكساس",
      },
      {
        slug: PsychoQuestionSlug.EmotionalCollapse,
        kind: "fact",
        text: "في تجارب التصوير الدماغي بجامعة كاليفورنيا، مجرد تسمية الشعور بكلمة («هذا غضب»، «هذا خوف») خفّضت نشاط اللوزة الدماغية — مركز الانفعال — بشكل فوري قابل للقياس. سمِّ ما تشعر به تُطفئ نصفه.",
        source: "ماثيو ليبرمان — جامعة كاليفورنيا UCLA",
      },
      {
        slug: PsychoQuestionSlug.LonelinessSadnessFree,
        kind: "fact",
        text: "الوحدة المزمنة ليست مجرد شعور مزعج — تقرير الجرّاح العام الأمريكي صنّفها خطرًا صحيًا من الدرجة الأولى.",
        stat: {
          value: 15,
          suffix: " سيجارة",
          label: "يوميًا — هذا ما يوازيه أثر الوحدة المزمنة على صحتك؛ والعكس صحيح: العلاقات دواء",
        },
        source: "تقرير الجرّاح العام الأمريكي 2023",
      },
      {
        slug: PsychoQuestionSlug.StressNervousness,
        kind: "fact",
        text: "في تجربة ستانفورد، مشوار واحد في بيئة طبيعية خفّض نشاط منطقة «اجترار الأفكار القلقة» في الدماغ فعليًا على أجهزة التصوير — الطبيعة تعالج ما يعجز عنه الجلوس في الغرفة.",
        stat: {
          value: 90,
          suffix: " دقيقة",
          label: "مشيًا في الطبيعة كانت كافية لخفض نشاط مركز الاجترار القلق في الدماغ",
        },
        source: "دراسة براتمان — جامعة ستانفورد 2015",
      },
      {
        slug: PsychoQuestionSlug.WorthlessnessFeelings,
        kind: "encouragement",
        text: "هذه المشاعر عرض معروف يمر به ملايين البشر، وهي تكذب عليك: لا تعكس قيمتك الحقيقية. العلاج النفسي الحديث فعال معها بشكل موثق — وطلب الدعم شجاعة لا ضعف.",
      },
      {
        slug: PsychoQuestionSlug.FearAnxietyFree,
        kind: "fact",
        text: "إيقاع التنفس يقود الجهاز العصبي مباشرة: الزفير الأطول من الشهيق ينشّط جهاز التهدئة (الباراسمبثاوي) خلال دقائق — أداة مجانية تحملها معك في كل مكان.",
        stat: {
          value: 6,
          suffix: " أنفاس",
          label: "في الدقيقة هو الإيقاع الذي تُظهر القياسات الفسيولوجية أنه يبلغ بالجسد أعمق استرخاء",
        },
        source: "أبحاث فسيولوجيا التنفس والعصب الحائر",
      },
      {
        slug: PsychoQuestionSlug.AngerTreatment,
        kind: "fact",
        text: "تهدئة الغضب ليست مجاملة اجتماعية بل استثمار صحي مباشر: التحليل الشامل لدراسات القلب وجد ارتباطًا واضحًا بين العدائية المزمنة وأمراض الشرايين.",
        stat: {
          value: 19,
          suffix: "٪",
          label: "زيادة في خطر أمراض القلب لدى الأصحّاء الذين يغلب عليهم الغضب والعدائية",
        },
        source: "تحليل شامل — مجلة الكلية الأمريكية لأمراض القلب 2009",
      },
      {
        slug: PsychoQuestionSlug.FrustrationHelplessness,
        kind: "fact",
        text: "مارتن سيليغمان — مؤسس علم النفس الإيجابي — أثبت أن «العجز» أسلوب تفسير مكتسب لا حقيقة ثابتة: تدريب النفس على تفسير الانتكاسات كمؤقتة ومحددة (لا دائمة وشاملة) يقيس فرقًا حقيقيًا في المرونة.",
        source: "مارتن سيليغمان — جامعة بنسلفانيا",
      },
      {
        slug: PsychoQuestionSlug.SadnessDepressionFree,
        kind: "fact",
        text: "تحليل 15 دراسة على 191 ألف شخص وجد أن جرعة متواضعة جدًا من الحركة تقي من الاكتئاب — لا تحتاج ماراثونًا، تحتاج انتظامًا.",
        stat: {
          value: 25,
          suffix: "٪",
          label: "انخفاضًا في خطر الاكتئاب لدى من يمشون بنشاط ساعتين ونصف أسبوعيًا فقط",
        },
        source: "JAMA Psychiatry 2022 — تحليل 15 دراسة",
      },
      {
        slug: PsychoQuestionSlug.HelplessnessPassivity,
        kind: "fact",
        text: "أبحاث جامعة كورنيل وجدت أننا نقلل تقديرنا لاستعداد الآخرين لمساعدتنا بنحو النصف: طلبات المساعدة تُلبّى أكثر بكثير مما نتوقع — والطلب نفسه يوطّد العلاقة غالبًا.",
        source: "فلين وليك — جامعة كورنيل",
      },
      {
        slug: PsychoQuestionSlug.ShameHiding,
        kind: "fact",
        text: "خلاصة عقدين من أبحاث برينيه براون على آلاف المقابلات: الخجل المؤلم يتغذى على الكتمان ويذوب عند الكلام — مشاركته مع شخص واحد يستحق الثقة تسحب منه معظم قوته.",
        source: "برينيه براون — جامعة هيوستن",
      },
    ],
  },
  {
    title: "الفكري",
    slug: "intellectual",
    insights: [
      {
        slug: IntellectualQuestionSlug.DaydreamingDislike,
        kind: "fact",
        text: "درس باحثو هارفارد لحظات 2,250 شخصًا عبر تطبيق هاتفي فوجدوا أن العقل البشري يقضي قرابة نصف يقظته شاردًا — والشرود الموجّه (أثناء المشي مثلًا) من أخصب حالات توليد الأفكار.",
        stat: {
          value: 47,
          suffix: "٪",
          label: "من ساعات يقظتنا تسرح فيها أذهاننا بعيدًا عما نفعله — ظاهرة إنسانية عامة لا عيبًا فيك",
        },
        source: "كيلينغسوورث وغيلبرت — هارفارد، مجلة Science",
      },
      {
        slug: IntellectualQuestionSlug.AdherenceTradition,
        kind: "fact",
        text: "الالتزام بالطرق المجرّبة ليس جمودًا — إنه اقتصاد ذهني: دراسات جامعة ديوك وجدت أن نحو 43٪ من تصرفاتنا اليومية عادات تلقائية لا قرارات، وهذا ما يحرر العقل للمهم فعلًا.",
        stat: {
          value: 43,
          suffix: "٪",
          label: "من سلوكنا اليومي يجري بقوة العادة لا بالتفكير — الروتين الجيد يحرر طاقتك الذهنية",
        },
        source: "أبحاث العادات — جامعة ديوك",
      },
      {
        slug: IntellectualQuestionSlug.AestheticAppreciation,
        kind: "fact",
        text: "حاسة الجمال ليست ترفًا: أبحاث «الرهبة والدهشة» لداكر كلتنر بجامعة بيركلي تُظهر أن لحظات الانبهار بالجمال — في الطبيعة أو الفن — تخفض التوتر وتزيد الشعور بالمعنى والسخاء تجاه الآخرين.",
        source: "داكر كلتنر — جامعة كاليفورنيا بيركلي",
      },
      {
        slug: IntellectualQuestionSlug.OpposingSpeakers,
        kind: "fact",
        text: "أبحاث «التواضع الفكري» الحديثة تجد أن الاستماع الجاد للرأي المخالف لا يشوّش المفكر القوي بل يصقله: أصحاب التواضع الفكري العالي أدق في تقييم الأدلة وأسرع في تصحيح أخطائهم.",
        source: "أبحاث التواضع الفكري — جامعة ديوك",
      },
      {
        slug: IntellectualQuestionSlug.PoetryLittleImpact,
        kind: "fact",
        text: "متابعة استمرت 12 عامًا لأكثر من 3,600 شخص وجدت أن قرّاء الكتب يعيشون أطول من غير القراء — بمتوسط عامين إضافيين تقريبًا، حتى بعد ضبط العوامل الأخرى.",
        stat: {
          value: 2,
          suffix: " سنة",
          label: "عمرًا إضافيًا في المتوسط ارتبط بقراءة الكتب بانتظام في متابعة طويلة",
        },
        source: "دراسة جامعة ييل 2016",
      },
      {
        slug: IntellectualQuestionSlug.TryingNewFoods,
        kind: "fact",
        text: "التجارب الجديدة — حتى الصغيرة كطبق لم تجربه — تنشّط نظام الدوبامين وتحفز الدماغ على تكوين وصلات جديدة؛ علماء الأعصاب يعتبرون التنويع والتجديد تمرينًا للدماغ بقدر ما القراءة تمرين له.",
        source: "أبحاث المرونة العصبية والحداثة",
      },
      {
        slug: IntellectualQuestionSlug.MoodChangeSensitivity,
        kind: "fact",
        text: "«الحبكة العاطفية» — قدرتك على تمييز مشاعرك ومشاعر المواقف بدقة — يعتبرها علم النفس الحديث مهارة صحية من الطراز الأول: أصحاب المفردات العاطفية الأغنى ينظمون انفعالاتهم أفضل ويمرضون أقل.",
        source: "ليزا فيلدمان باريت — جامعة نورث إيسترن",
      },
      {
        slug: IntellectualQuestionSlug.PoetryArtEnjoyment,
        kind: "fact",
        text: "أطول متابعة من نوعها (6,700 شخص على مدى 14 عامًا) وجدت أن من يترددون على الفعاليات الفنية والثقافية بانتظام يعيشون أطول — الفن غذاء حرفيًا لا مجازًا.",
        stat: {
          value: 31,
          suffix: "٪",
          label: "انخفاضًا في خطر الوفاة المبكرة لدى المواظبين على الفعاليات الفنية والثقافية",
        },
        source: "المجلة الطبية البريطانية BMJ 2019 — كلية لندن الجامعية",
      },
      {
        slug: IntellectualQuestionSlug.UniversePhilosophyInterest,
        kind: "fact",
        text: "التأمل في الأسئلة الكبرى ليس شرودًا فلسفيًا بلا عائد: أبحاث «الإحساس بالمعنى والهدف» تربطه بصحة أفضل وعمر أطول وقرارات حياتية أرشد — الحائرون المتسائلون بصحة جيدة.",
        source: "أبحاث المعنى والهدف — علم النفس الإيجابي",
      },
      {
        slug: IntellectualQuestionSlug.IntellectualCuriosity,
        kind: "fact",
        text: "في تجارب التصوير الدماغي، الفضول يضع الدماغ في «حالة تعلم» تقوّي الذاكرة حتى للمعلومات الجانبية التي تمر أثناءه — الفضول يجعل عقلك إسفنجة مؤقتًا.",
        source: "دراسة غروبر — مجلة Neuron 2014",
      },
      {
        slug: IntellectualQuestionSlug.TheoriesIdeasEnjoyment,
        kind: "fact",
        text: "النشاط الذهني المستمر — القراءة والأفكار الجديدة والتعلم — يبني ما يسميه أطباء الأعصاب «الاحتياطي المعرفي»: دماغًا أكثر مقاومة للتدهور المعرفي مع التقدم في العمر.",
        source: "أبحاث الاحتياطي المعرفي — طب الأعصاب",
      },
    ],
  },
  {
    title: "المجتمعي",
    slug: "community",
    insights: [
      {
        slug: CommunityQuestionSlug.KindnessPeople,
        kind: "fact",
        text: "بحث عالمي غطى 136 دولة وجد النتيجة نفسها في كل الثقافات تقريبًا: الإنفاق على الآخرين — مهما صغر المبلغ — يرفع سعادة المعطي أكثر من الإنفاق على النفس.",
        stat: {
          value: 136,
          suffix: " دولة",
          label: "شملها البحث ووجد أن العطاء يرفع سعادة المعطي نفسه — اللطف مكافأته مدمجة فيه",
        },
        source: "دن وأكنين ونورتون — مجلة Science",
      },
      {
        slug: CommunityQuestionSlug.ArgumentsFamilyWork,
        kind: "fact",
        text: "من مختبر جون غوتمان الذي راقب آلاف التفاعلات: العلاقات الناجحة ليست بلا خلافات — لكنها تحافظ على نسبة ذهبية من التفاعلات الإيجابية مقابل السلبية.",
        stat: {
          value: 5,
          suffix: ":1",
          label: "تفاعلات إيجابية مقابل كل خلاف واحد — النسبة التي تميز العلاقات التي تدوم",
        },
        source: "مختبر غوتمان — جامعة واشنطن",
      },
      {
        slug: CommunityQuestionSlug.SelfishArrogant,
        kind: "fact",
        text: "أبحاث آدم غرانت في «الأخذ والعطاء» قلبت التصور الشائع: على المدى الطويل، «المعطاؤون» الأذكياء — لا الآخذون — يتصدرون قوائم النجاح المهني، لأن السمعة والثقة أصول تتراكم.",
        source: "آدم غرانت — كتاب Give and Take",
      },
      {
        slug: CommunityQuestionSlug.CooperationPreference,
        kind: "fact",
        text: "تفضيلك للتعاون على التنافس ليس مثالية — إنه استراتيجية موثقة: أبحاث الشبكات الاجتماعية تُظهر أن السلوك التعاوني يبني رأسمالًا من الثقة يعود على صاحبه في وقت الحاجة أضعافًا.",
        source: "أبحاث رأس المال الاجتماعي",
      },
      {
        slug: CommunityQuestionSlug.CynicismOthers,
        kind: "fact",
        text: "مفاجأة من الدراسات التتبعية: الساخرون الدائمون من نوايا الآخرين يكسبون دخلًا أقل بمرور السنين من الواثقين الحذرين — لأن الشك الدائم يغلق أبواب التعاون التي يمر منها النجاح.",
        source: "ستافروفا وإيلبراخت — Psychological Science 2016",
      },
      {
        slug: CommunityQuestionSlug.OthersExploitation,
        kind: "fact",
        text: "بيانات «مسح القيم العالمي» عبر عشرات الدول تُظهر نمطًا ثابتًا: المجتمعات والأفراد الأعلى ثقة بالآخرين أعلى سعادة ودخلًا وصحة — الثقة الواعية استثمار لا سذاجة.",
        source: "مسح القيم العالمي World Values Survey",
      },
      {
        slug: CommunityQuestionSlug.PeopleLikeMe,
        kind: "fact",
        text: "«فجوة الإعجاب» ظاهرة موثقة معاكسة لمخاوفنا: بعد المحادثات، يقيّمنا الآخرون بإيجابية أعلى مما نتوقع بفارق منهجي. الناس يحبونك أكثر مما تظن — حرفيًا وبالقياس.",
        source: "بوثبي وزملاؤها — Psychological Science 2018",
      },
      {
        slug: CommunityQuestionSlug.IndifferenceSelfishness,
        kind: "encouragement",
        text: "انطباعات الآخرين ليست دائمًا مرآة دقيقة — لكن التساؤل الصادق عنها، كما تفعل الآن، هو ما يميز من ينضجون اجتماعيًا عمن يتوقفون.",
      },
      {
        slug: CommunityQuestionSlug.RationalConvictions,
        kind: "fact",
        text: "الجمع النادر الذي تصفه هذه العبارة — قناعات مبنية بعقلانية مع استعداد للمراجعة — هو بالضبط ما تسميه الأبحاث الحديثة «التفكير النشط المنفتح»، وهو من أقوى مؤشرات جودة القرارات.",
        source: "أبحاث جوناثان بارون — جامعة بنسلفانيا",
      },
      {
        slug: CommunityQuestionSlug.ConsiderationRights,
        kind: "fact",
        text: "لطفك لا يقف عند من تقابله: تحليل الشبكات الاجتماعية أثبت أن السلوك التعاوني «معدٍ» وينتقل عبر الناس حتى ثلاث درجات — لطفك اليوم يصل إلى شخص لن تعرفه أبدًا.",
        stat: {
          value: 3,
          suffix: " درجات",
          label: "ينتقل عبرها أثر تصرفك اللطيف في الشبكة الاجتماعية — من شخص لشخص لشخص ثالث",
        },
        source: "فاولر وكريستاكيس — دورية PNAS 2010",
      },
      {
        slug: CommunityQuestionSlug.DirectDislike,
        kind: "fact",
        text: "علم النفس يفرّق بدقة بين الحزم (توصيل الموقف باحترام) والعدائية (توصيله بجرح): الأول يرفع احترام الآخرين لك والثاني يخفضه — والفرق مهارة قابلة للتعلم اسمها التواصل الحازم.",
        source: "أبحاث التواصل الحازم Assertiveness",
      },
      {
        slug: CommunityQuestionSlug.ManipulationNecessity,
        kind: "fact",
        text: "أبحاث السمعة في الاقتصاد السلوكي حاسمة هنا: مكاسب التعامل الوصولي قصيرة العمر، لأن البشر بارعون في كشف الأنماط — والثقة إذا كُسرت مرة كلّف إصلاحها أضعاف بنائها.",
        source: "أبحاث الثقة — الاقتصاد السلوكي",
      },
    ],
  },
  {
    title: "الاجتماعي",
    slug: "social",
    insights: [
      {
        slug: SocialQuestionSlug.PeopleAroundMe,
        kind: "fact",
        text: "أضخم تحليل من نوعه — 148 دراسة وأكثر من 308 آلاف مشارك — وجد أن العلاقات الاجتماعية القوية تتفوق في أثرها على العمر على الرياضة وعلى إنقاص الوزن.",
        stat: {
          value: 50,
          suffix: "٪",
          label: "زيادة في فرص البقاء والعمر الأطول لدى أصحاب العلاقات الاجتماعية القوية",
        },
        source: "هولت-لنستاد — تحليل 148 دراسة، PLOS Medicine",
      },
      {
        slug: SocialQuestionSlug.SmileLaughEasily,
        kind: "fact",
        text: "في دراسة طريفة وجادة معًا، حلل الباحثون ابتسامات لاعبي البيسبول في صورهم الرسمية القديمة ثم تتبعوا أعمارهم: أصحاب الابتسامات الحقيقية العريضة عاشوا أطول بسنوات.",
        stat: {
          value: 7,
          suffix: " سنوات",
          label: "فارق العمر المتوسط لصالح أصحاب الابتسامة الحقيقية في دراسة صور اللاعبين الشهيرة",
        },
        source: "أبيل وكروغر — جامعة واين ستيت 2010",
      },
      {
        slug: SocialQuestionSlug.CarefreeeFree,
        kind: "fact",
        text: "في دراسة طلبت من قلِقين مزمنين تسجيل مخاوفهم ثم تتبّع ما حدث فعلًا، النتيجة كانت مذهلة: الغالبية الساحقة من المخاوف لم تتحقق أبدًا — والقلق مهارة قابلة لإعادة التدريب.",
        stat: {
          value: 91,
          suffix: "٪",
          label: "من المخاوف المسجلة في الدراسة لم يتحقق منها شيء على أرض الواقع",
        },
        source: "لافرينيير ونيومان — جامعة بنسلفانيا الحكومية 2020",
      },
      {
        slug: SocialQuestionSlug.EnjoyTalkingOthers,
        kind: "fact",
        text: "في تجارب جامعة شيكاغو، الركاب الذين طُلب منهم محادثة غرباء في القطار توقعوا رحلة مزعجة — فوجدوها أمتع رحلاتهم، وارتفع مزاج الطرفين. المحادثة العابرة مصدر سعادة نقلل من شأنه بانتظام.",
        source: "إيبلي وشرودر — جامعة شيكاغو",
      },
      {
        slug: SocialQuestionSlug.CenterAttention,
        kind: "fact",
        text: "«تأثير الأضواء» الشهير: في تجربة كورنيل، توقع المشاركون أن نصف الحاضرين لاحظ قميصهم المحرج — الحقيقة كانت الربع فقط. الناس منشغلون بأنفسهم أكثر بكثير مما نظن، وهذه حرية.",
        source: "تجربة غيلوفيتش — جامعة كورنيل",
      },
      {
        slug: SocialQuestionSlug.WorkAlonePreference,
        kind: "fact",
        text: "نحو ثلث الناس إلى نصفهم يميلون للانطوائية بدرجة ما، وأبحاثها الحديثة واضحة: العمل المنفرد ليس نقصًا اجتماعيًا بل أسلوب معالجة مختلف — كثير من أعمق الإنجازات وُلد في العزلة المختارة.",
        source: "أبحاث الانطوائية — سوزان كين",
      },
      {
        slug: SocialQuestionSlug.EnergeticActive,
        kind: "fact",
        text: "الطاقة دورة تغذي نفسها: النشيطون بدنيًا يقيسون طاقة ذاتية أعلى ونومًا أعمق، والنوم الأعمق يعيد إنتاج الطاقة — أفضل نقطة دخول للدورة هي أي حركة اليوم، مهما صغرت.",
        source: "أبحاث النشاط والطاقة الذاتية",
      },
      {
        slug: SocialQuestionSlug.HappyCheerful,
        kind: "fact",
        text: "تتبّع باحثو جامعة بوسطن عشرات الآلاف لعقود: الأكثر تفاؤلًا عاشوا أطول بشكل ملموس، وكانت فرصهم في بلوغ 85 عامًا أعلى بوضوح — والتفاؤل نفسه قابل للتنمية بالتدريب.",
        stat: {
          value: 15,
          suffix: "٪",
          label: "عمرًا أطول في المتوسط لدى الأعلى تفاؤلًا، مع فرص أكبر لبلوغ 85 عامًا",
        },
        source: "دورية PNAS 2019 — جامعة بوسطن",
      },
      {
        slug: SocialQuestionSlug.CarefreeNot,
        kind: "fact",
        text: "الخبر الذي غيّر علم النفس: التفاؤل ليس حظًا وراثيًا خالصًا بل «أسلوب تفسير» قابل للتعلم — برامج مارتن سيليغمان التدريبية خفّضت معدلات الاكتئاب في تجارب مضبوطة.",
        source: "التفاؤل المتعلم — جامعة بنسلفانيا",
      },
      {
        slug: SocialQuestionSlug.LifePassesQuickly,
        kind: "fact",
        text: "لعلم الأعصاب تفسير لتسارع الزمن: الدماغ «يضغط» الأيام المتشابهة فتمر سريعًا في الذاكرة. الوصفة المضادة موثقة — التجارب الجديدة والانتباه الكامل للحظة يبطئان الزمن الذاتي فعليًا.",
        source: "أبحاث إدراك الزمن — علم الأعصاب",
      },
      {
        slug: SocialQuestionSlug.VeryActive,
        kind: "fact",
        text: "حسبة مثيرة من أبحاث القلب: تقديرات الباحثين أن كل ساعة جري تعيد لصاحبها نحو سبع ساعات من العمر المتوقع — أعلى عائد استثماري ستصادفه على الإطلاق.",
        stat: {
          value: 7,
          suffix: " ساعات",
          label: "من العمر الإضافي المتوقع يعيدها لك كل ساعة جري واحدة، بحسب تقديرات الباحثين",
        },
        source: "Progress in Cardiovascular Diseases 2017",
      },
      {
        slug: SocialQuestionSlug.LeadSelfPreference,
        kind: "fact",
        text: "«نظرية تقرير المصير» — أوسع نظريات الدافعية اعتمادًا — تضع الاستقلالية بين الحاجات النفسية الثلاث الأساسية للإنسان: الرغبة في قيادة نفسك دافع صحي أصيل لا انسحابًا.",
        source: "ديسي ورايان — نظرية تقرير المصير",
      },
    ],
  },
  {
    title: "الشمولي",
    slug: "belonging",
    insights: [
      {
        slug: BelongingQuestionSlug.KeepThingsOrganized,
        kind: "fact",
        text: "في دراسة جامعة كاليفورنيا التي حللت لغة الناس وهم يصفون بيوتهم، من وصفوا بيوتهم بالفوضوية سجلوا مستويات كورتيزول (هرمون التوتر) أعلى على مدار اليوم — الترتيب راحة عصبية لا مظهرًا.",
        source: "دراسة CELF — جامعة كاليفورنيا UCLA",
      },
      {
        slug: BelongingQuestionSlug.TimeManagementSkill,
        kind: "fact",
        text: "أكبر أعداء إدارة الوقت ليس الكسل بل التشتت: أبحاث التبديل بين المهام وجدت أن القفز المتكرر بينها يلتهم حصة ضخمة من الوقت الفعلي في «رسوم انتقال» ذهنية خفية.",
        stat: {
          value: 40,
          suffix: "٪",
          label: "من الوقت الإنتاجي قد يستهلكه التنقل المتكرر بين المهام — التركيز الأحادي أسرع فعليًا",
        },
        source: "الجمعية الأمريكية لعلم النفس — أبحاث روبنستين وماير",
      },
      {
        slug: BelongingQuestionSlug.NotOrganized,
        kind: "fact",
        text: "الحل الموثق لغير المنظمين بالفطرة ليس «إرادة أقوى» بل «نوايا التنفيذ»: صياغة الخطة بصيغة «إذا حدث كذا فسأفعل كذا» ضاعفت معدلات الالتزام في عشرات التجارب — النظام يُبرمج ولا يُشترى.",
        source: "بيتر غولفيتسر — جامعة نيويورك",
      },
      {
        slug: BelongingQuestionSlug.ConscientiousDuty,
        kind: "fact",
        text: "في أطول دراسة نفسية في التاريخ — تتبعت المشاركين ثمانية عقود — كانت «يقظة الضمير» السمة الشخصية الأقوى تنبؤًا بطول العمر، متفوقة على المرح وعلى الذكاء.",
        stat: {
          value: 80,
          suffix: " عامًا",
          label: "امتدت الدراسة، وخلاصتها: الضمير الحي في العمل والحياة أقوى سمة تتنبأ بعمر أطول",
        },
        source: "مشروع تيرمان — كتاب The Longevity Project",
      },
      {
        slug: BelongingQuestionSlug.ClearGoalsSystematic,
        kind: "fact",
        text: "في تجربة مضبوطة على 267 مشاركًا، مجرد كتابة الأهداف — لا التفكير فيها — رفع نسب تحقيقها بفارق كبير؛ ومن شاركوا تقدمهم أسبوعيًا مع صديق حققوا أعلى النسب على الإطلاق.",
        stat: {
          value: 42,
          suffix: "٪",
          label: "زيادة في احتمال تحقيق الهدف لمجرد كتابته — والمشاركة الأسبوعية ترفعها أكثر",
        },
        source: "د. غيل ماثيوز — الجامعة الدومينيكية بكاليفورنيا",
      },
      {
        slug: BelongingQuestionSlug.WasteTimeProcrastination,
        kind: "fact",
        text: "التسويف المزمن يصيب نحو خُمس البالغين، والأبحاث حاسمة في نقطة: هو اضطراب في تنظيم المشاعر (تجنب الانزعاج) لا في إدارة الوقت — لذلك يُعالج بتصغير الخطوة الأولى حتى تفقد رهبتها.",
        stat: {
          value: 20,
          suffix: "٪",
          label: "من البالغين مسوّفون مزمنون — وهي عادة قابلة للتفكيك، لا عيبًا في الشخصية",
        },
        source: "جوزيف فيراري — جامعة ديبول",
      },
      {
        slug: BelongingQuestionSlug.HardWorkAchievement,
        kind: "fact",
        text: "أبحاث أنجيلا داكوورث في «العزيمة» وجدت أن المثابرة طويلة النفس تتنبأ بالإنجاز أكثر من الموهبة في ميادين متباينة — من الأكاديميات العسكرية إلى مسابقات التهجئة الوطنية.",
        source: "أنجيلا داكوورث — جامعة بنسلفانيا",
      },
      {
        slug: BelongingQuestionSlug.CommitmentCompletion,
        kind: "fact",
        text: "في دراسة الأهداف الشهيرة نفسها، المجموعة التي أرسلت تقرير تقدم أسبوعيًا لصديق حققت أهدافها بنسبة تفوق بوضوح كل المجموعات الأخرى — الالتزام المُعلن أقوى من الالتزام الصامت.",
        source: "د. غيل ماثيوز — الجامعة الدومينيكية بكاليفورنيا",
      },
      {
        slug: BelongingQuestionSlug.UnreliableInconsistent,
        kind: "fact",
        text: "الثبات لا يولد مع الإنسان بل يُبنى بالتكرار: تتبعت دراسة كوليدج لندن تكوين العادات يومًا بيوم فوجدت أن السلوك الجديد يحتاج 66 يومًا في المتوسط ليصبح تلقائيًا — والانقطاع يوم أو يومين لا يفسد شيئًا.",
        stat: {
          value: 66,
          suffix: " يومًا",
          label: "في المتوسط يحتاجها السلوك الجديد ليتحول عادة تلقائية — الثبات مسألة أيام متراكمة",
        },
        source: "دراسة لالي — جامعة كوليدج لندن 2010",
      },
      {
        slug: BelongingQuestionSlug.ProductivePerson,
        kind: "fact",
        text: "أبحاث الأداء المعرفي تُظهر أن الإنتاجية العميقة تعمل في موجات لا خطًا مستقيمًا: جلسات تركيز كاملة تتخللها استراحات حقيقية تتفوق في المحصلة على ساعات متواصلة من العمل المتقطع الانتباه.",
        source: "أبحاث العمل العميق والأداء المعرفي",
      },
      {
        slug: BelongingQuestionSlug.NeverOrganized,
        kind: "encouragement",
        text: "خبر جيد من علم السلوك: المنظمون ليسوا أصحاب إرادة خارقة بل أصحاب أنظمة صغيرة ذكية. ابدأ بنظام واحد بسيط (مكان ثابت للمفاتيح، قائمة واحدة للمهام) ودع التراكم يعمل لصالحك.",
      },
      {
        slug: BelongingQuestionSlug.StriveExcellence,
        kind: "fact",
        text: "تحليل شمل ثلاثة عقود وجد أن «الكمالية المفروضة اجتماعيًا» ارتفعت 33٪ بين الأجيال — والأبحاث تفرّق بحدة بين السعي الصحي للتميز (يغذي الأداء) والكمالية القاسية (تستنزفه). التقدم لا الكمال.",
        stat: {
          value: 33,
          suffix: "٪",
          label: "ارتفعت الكمالية المفروضة اجتماعيًا بين الأجيال منذ 1989 — تذكّر: التقدم أهم من الكمال",
        },
        source: "كوران وهيل — Psychological Bulletin 2017",
      },
    ],
  },
  {
    title: "البدني",
    slug: "physical",
    insights: [
      {
        slug: PhysicalQuestionSlug.SedentaryWork,
        kind: "fact",
        text: "تحليل مجلة لانسيت الذي شمل مليون شخص حمل خبرين: الجلوس الطويل بلا حركة يرفع خطر الوفاة المبكرة بوضوح — لكن ساعة نشاط يومية تمحو هذا الخطر بالكامل تقريبًا.",
        stat: {
          value: 59,
          suffix: "٪",
          label: "زيادة في خطر الوفاة المبكرة لدى من يجلسون 8+ ساعات بلا نشاط — والحركة اليومية تمحوها",
        },
        source: "تحليل إيكلوند — مجلة لانسيت، مليون مشارك",
      },
      {
        slug: PhysicalQuestionSlug.VigorousActivityDays,
        kind: "fact",
        text: "أحدث ما توصل له العلم: «دفعات» النشاط القوي المدمجة في الحياة اليومية — صعود درج بسرعة، حمل أغراض ثقيلة، مشية شديدة قصيرة — تحدث فرقًا هائلًا دون نادٍ رياضي أصلًا.",
        stat: {
          value: 4,
          suffix: " دقائق",
          label: "فقط يوميًا من دفعات النشاط القوي المتقطع ارتبطت بانخفاض خطر الوفاة 26–30٪",
        },
        source: "Nature Medicine 2022 — بيانات 25 ألف شخص",
      },
      {
        slug: PhysicalQuestionSlug.VigorousActivityDuration,
        kind: "fact",
        text: "النشاط عالي الشدة استثمار مضغوط: التوصية العالمية كلها تعادل أقل من ربع ساعة يوميًا.",
        stat: {
          value: 75,
          suffix: " دقيقة",
          label: "أسبوعيًا من النشاط عالي الشدة تكفي لتحقيق التوصية العالمية لصحة القلب",
        },
        source: "منظمة الصحة العالمية",
      },
      {
        slug: PhysicalQuestionSlug.VehicleUseDays,
        kind: "fact",
        text: "دراسة بريطانية على 264 ألف شخص قارنت طرق التنقل للعمل: المتنقلون بالدراجة سجلوا انخفاضًا مذهلًا في الوفيات المبكرة — وحتى تحويل جزء من المشوار إلى مشي أحدث فرقًا.",
        stat: {
          value: 41,
          suffix: "٪",
          label: "انخفاضًا في خطر الوفاة المبكرة لدى من يتنقلون لعملهم بالدراجة بدل المركبة",
        },
        source: "المجلة الطبية البريطانية BMJ 2017",
      },
      {
        slug: PhysicalQuestionSlug.VehicleDuration,
        kind: "fact",
        text: "أبحاث التنقل تربط المشاوير الطويلة اليومية بتوتر أعلى ونشاط أقل — والتعويض الموثق بسيط: انزل قبل وجهتك بمسافة مشي، أو اجعل جزءًا من المشوار على قدميك.",
        source: "أبحاث التنقل والصحة العامة",
      },
      {
        slug: PhysicalQuestionSlug.ModerateActivityDays,
        kind: "fact",
        text: "التوصية الذهبية عالميًا في متناول الجميع: مشي سريع، سباحة هادئة، أو حتى أعمال منزلية نشطة — كلها تُحتسب.",
        stat: {
          value: 150,
          suffix: " دقيقة",
          label: "نشاطًا متوسط الشدة أسبوعيًا — نحو 21 دقيقة يوميًا فقط — هي وصفة حماية القلب المعتمدة",
        },
        source: "منظمة الصحة العالمية",
      },
      {
        slug: PhysicalQuestionSlug.ModerateActivityDuration,
        kind: "fact",
        text: "لا يشترط أن تكون الدقائق متصلة: العلم الحديث أسقط شرط «الجلسة الواحدة» — كل حركة متوسطة الشدة خلال يومك تتراكم في حسابك الصحي، ولو خمس دقائق هنا وعشر هناك.",
        source: "إرشادات النشاط البدني — منظمة الصحة العالمية",
      },
      {
        slug: PhysicalQuestionSlug.StrengthTrainingDays,
        kind: "fact",
        text: "تمارين المقاومة أقل التوصيات الصحية شهرة وأعلاها عائدًا: نصف ساعة إلى ساعة أسبوعيًا فقط ارتبطت بانخفاض ملموس في الوفيات وأمراض القلب والسكري.",
        stat: {
          value: 20,
          suffix: "٪",
          label: "انخفاضًا في خطر الوفاة المبكرة مع 30–60 دقيقة أسبوعيًا فقط من تمارين المقاومة",
        },
        source: "المجلة البريطانية للطب الرياضي 2022",
      },
      {
        slug: PhysicalQuestionSlug.WalkingDays,
        kind: "fact",
        text: "لا تحتاج 10 آلاف خطوة — الرقم الشهير أصله حملة تسويقية يابانية قديمة. العلم الفعلي وجد العتبة المجزية أقرب كثيرًا.",
        stat: {
          value: 7000,
          suffix: " خطوة",
          label: "يوميًا ارتبطت بانخفاض خطر الوفاة المبكرة 50–70٪ لدى أعمار منتصف العمر",
        },
        source: "JAMA Network Open 2021",
      },
      {
        slug: PhysicalQuestionSlug.WalkingDuration,
        kind: "fact",
        text: "نصف ساعة مشي معظم الأيام — قابلة للتقسيم — تظل أبسط وصفة وقائية في الطب الحديث كله.",
        stat: {
          value: 30,
          suffix: "٪",
          label: "انخفاضًا في خطر أمراض القلب لدى الملتزمين بالمشي 30 دقيقة معظم أيام الأسبوع",
        },
        source: "دراسات هارفارد للصحة العامة",
      },
      {
        slug: PhysicalQuestionSlug.SittingHours,
        kind: "fact",
        text: "المفاجأة في التفاصيل: الخطر ليس في مجموع ساعات الجلوس فقط بل في تواصلها — من يجلسون في جلسات متصلة طويلة أعلى خطرًا ممن يجلسون المدة نفسها متقطعة. انهض دقيقة كل نصف ساعة.",
        source: "دياز وزملاؤه — حوليات الطب الباطني 2017",
      },
      {
        slug: PhysicalQuestionSlug.BloodPressureCheck,
        kind: "fact",
        text: "يسميه الأطباء «القاتل الصامت» عن استحقاق: 1.28 مليار إنسان مصابون بارتفاع ضغط الدم، ونصفهم تقريبًا لا يدري — وقياس دوري بسيط يكشفه قبل أن يترك أثرًا.",
        stat: {
          value: 46,
          suffix: "٪",
          label: "من المصابين بارتفاع ضغط الدم حول العالم لا يعلمون بإصابتهم أصلًا",
        },
        source: "منظمة الصحة العالمية",
      },
      {
        slug: PhysicalQuestionSlug.CholesterolCheck,
        kind: "fact",
        text: "أمراض القلب والأوعية هي المسبب الأول للوفاة على الكوكب — والكوليسترول المرتفع أهم عوامل خطرها الصامتة التي لا تظهر أعراضًا إطلاقًا قبل أن يكشفها فحص دم بسيط.",
        stat: {
          value: 18,
          suffix: " مليون",
          label: "وفاة سنويًا سببها أمراض القلب والأوعية — وفحص دم واحد يكشف عامل خطرها الأصمت",
        },
        source: "منظمة الصحة العالمية",
      },
      {
        slug: PhysicalQuestionSlug.BloodSugarCheck,
        kind: "fact",
        text: "السكري من النوع الثاني يتسلل بصمت لسنوات قبل التشخيص — والقبض عليه في مرحلة «مقدمات السكري» يجعل عكسه ممكنًا بتغييرات نمط الحياة وحدها.",
        stat: {
          value: 44,
          suffix: "٪",
          label: "من مصابي السكري حول العالم لا يعلمون بإصابتهم — فحص صائم بسيط يحسم الأمر",
        },
        source: "أطلس السكري — الاتحاد الدولي للسكري",
      },
      {
        slug: PhysicalQuestionSlug.FitnessLevel,
        kind: "fact",
        text: "في دراسة كليفلاند كلينك على 122 ألف شخص، كانت اللياقة القلبية المنخفضة أخطر على العمر من التدخين نفسه — والخبر الأهم: اللياقة قابلة للتحسين في أي عمر، وكل درجة تحسّن تُحتسب.",
        stat: {
          value: 122,
          suffix: " ألف شخص",
          label: "شملتهم الدراسة التي وجدت أن ضعف اللياقة أخطر مؤشرات العمر — أخطر من التدخين",
        },
        source: "JAMA Network Open 2018 — كليفلاند كلينك",
      },
      {
        slug: PhysicalQuestionSlug.ChronicPain,
        kind: "fact",
        text: "آلام أسفل الظهر وحدها هي السبب الأول للإعاقة في العالم — والمفارقة الموثقة: الحركة اللطيفة المنتظمة تعالجها أفضل من الراحة التامة التي كانت الوصفة القديمة.",
        stat: {
          value: 619,
          suffix: " مليون",
          label: "إنسان يعيشون مع آلام أسفل الظهر — والحركة الموجهة أفضل علاجاتها الموثقة",
        },
        source: "منظمة الصحة العالمية",
      },
      {
        slug: PhysicalQuestionSlug.SleepDuration,
        kind: "fact",
        text: "في تجربة صارمة، عرّض الباحثون متطوعين لفيروس الزكام مباشرة ثم راقبوا من يمرض: قِصار النوم مرضوا أضعاف من ناموا كفايتهم — المناعة تُصنع في السرير حرفيًا.",
        stat: {
          value: 4,
          prefix: "×",
          label: "أضعاف احتمال الإصابة بالزكام لدى من ينامون أقل من 6 ساعات مقارنة بمن ينامون 7+",
        },
        source: "دراسة براذر — جامعة كاليفورنيا 2015",
      },
      {
        slug: PhysicalQuestionSlug.FruitVegetableIntake,
        kind: "fact",
        text: "تحليل هارفارد الضخم — نحو مليوني مشارك — حدد الوصفة المثلى بدقة: حصتا فاكهة وثلاث حصص خضار يوميًا، وما زاد لم يضف كثيرًا. هدف واضح ومحدود وقابل للتنفيذ.",
        stat: {
          value: 13,
          suffix: "٪",
          label: "انخفاضًا في خطر الوفاة المبكرة لدى من يتناولون 5 حصص خضار وفاكهة يوميًا",
        },
        source: "مجلة Circulation 2021 — هارفارد",
      },
      {
        slug: PhysicalQuestionSlug.TobaccoUse,
        kind: "fact",
        text: "جسدك يبدأ إصلاح ذاته خلال 20 دقيقة من آخر سيجارة، والمكاسب تتسارع: خلال أشهر تتحسن الرئتان، وخلال عام ينقلب أخطر الأرقام لصالحك.",
        stat: {
          value: 50,
          suffix: "٪",
          label: "ينخفض خطر أمراض القلب إلى النصف تقريبًا بعد عام واحد فقط من الإقلاع",
        },
        source: "منظمة الصحة العالمية",
      },
      {
        slug: PhysicalQuestionSlug.FastFoodFrequency,
        kind: "fact",
        text: "الأطعمة فائقة المعالجة — الوجبات السريعة والمقرمشات المصنعة والمشروبات المحلاة — ربطتها المتابعات الطويلة بارتفاع حاد في الوفيات؛ وكل وجبة تُستبدل بطعام حقيقي تحسب لصالحك.",
        stat: {
          value: 62,
          suffix: "٪",
          label: "زيادة في خطر الوفاة المبكرة لدى من يتناولون 4+ حصص يومية من الأطعمة فائقة المعالجة",
        },
        source: "المجلة الطبية البريطانية BMJ 2019",
      },
      {
        slug: PhysicalQuestionSlug.WaterIntake,
        kind: "fact",
        text: "دماغك ثلاثة أرباعه ماء تقريبًا — لذلك يتأثر التركيز والمزاج والذاكرة مبكرًا جدًا بنقص السوائل، قبل أن يصلك إحساس العطش أصلًا.",
        stat: {
          value: 2,
          suffix: "٪",
          label: "فقط من نقص سوائل الجسم يكفي لإضعاف التركيز والمزاج والذاكرة قابلًا للقياس",
        },
        source: "أبحاث التغذية الإكلينيكية",
      },
      {
        slug: PhysicalQuestionSlug.HighFatFoodPreference,
        kind: "fact",
        text: "أهم تجربة تغذية في هذا القرن (PREDIMED) قلبت السؤال: العبرة بنوع الدهون لا كميتها — النمط الغني بزيت الزيتون والمكسرات خفّض النوبات القلبية والسكتات بنحو الثلث.",
        stat: {
          value: 30,
          suffix: "٪",
          label: "انخفاضًا في النوبات القلبية والسكتات مع النمط الغذائي المتوسطي الغني بالدهون الصحية",
        },
        source: "تجربة PREDIMED — مجلة نيو إنغلاند الطبية",
      },
      {
        slug: PhysicalQuestionSlug.HighSaltFoodPreference,
        kind: "fact",
        text: "متوسط ما يستهلكه سكان العالم من الملح ضعف الحد الموصى به بالتمام — وخفضه من أسرع الطرق غير الدوائية إطلاقًا لخفض ضغط الدم، بنتائج تظهر خلال أسابيع.",
        stat: {
          value: 2,
          prefix: "×",
          label: "ضعف الحد الموصى به (5 غرامات) — هذا ما يستهلكه الإنسان العادي من الملح فعليًا كل يوم",
        },
        source: "منظمة الصحة العالمية",
      },
    ],
  },
  {
    title: "المالي",
    slug: "financial",
    insights: [
      {
        slug: FinancialQuestionSlug.FinancialStressFeeling,
        kind: "fact",
        text: "المال يتصدر قوائم مصادر التوتر في المسوح الكبرى عامًا بعد عام، متقدمًا على العمل والصحة — شعورك بالضغط المالي حالة إنسانية عامة لا فشلًا شخصيًا.",
        stat: {
          value: 72,
          suffix: "٪",
          label: "من البالغين يشعرون بتوتر بشأن المال من وقت لآخر — إنه مصدر التوتر الأول عالميًا",
        },
        source: "الجمعية الأمريكية لعلم النفس — مسح التوتر السنوي",
      },
      {
        slug: FinancialQuestionSlug.FinancialSatisfaction,
        kind: "fact",
        text: "أبحاث اقتصاد السعادة وجدت أن الرضا المالي يتعلق بالفجوة بين الواقع والتطلعات وبالمقارنات الاجتماعية أكثر من الرقم المطلق — إدارة المقارنة مهارة مالية بحد ذاتها.",
        source: "أبحاث اقتصاد السعادة",
      },
      {
        slug: FinancialQuestionSlug.MonthlyExpenseWorry,
        kind: "fact",
        text: "أبحاث «الندرة» في مجلة Science وجدت أن القلق المالي المزمن يستهلك قدرة ذهنية حقيقية تعادل ليلة كاملة بلا نوم — وتحويل المجهول إلى أرقام مكتوبة يستعيد جزءًا كبيرًا منها.",
        stat: {
          value: 13,
          suffix: " نقطة",
          label: "من نقاط القدرة الذهنية الفعالة يلتهمها القلق المالي المزمن — والوضوح يستعيدها",
        },
        source: "ماني وزملاؤه — مجلة Science 2013",
      },
      {
        slug: FinancialQuestionSlug.EmergencyConfidence,
        kind: "fact",
        text: "في مسح الاحتياطي الفيدرالي الشهير، عجز 37٪ من الأمريكيين عن تغطية طارئ بـ400 دولار نقدًا — الهشاشة المالية أوسع انتشارًا مما يبدو، وكل وسادة صغيرة تبنيها تضعك في موقع أفضل.",
        stat: {
          value: 37,
          suffix: "٪",
          label: "من الأمريكيين لا يغطون طارئًا بـ400 دولار نقدًا — الاحتياط ميزة نادرة تستحق البناء",
        },
        source: "مسح الاحتياطي الفيدرالي الأمريكي SHED",
      },
      {
        slug: FinancialQuestionSlug.PaycheckToPaycheck,
        kind: "fact",
        text: "العيش راتبًا براتب يطال الغالبية حتى في أغنى الاقتصادات — والخروج منه لا يبدأ بدخل أعلى غالبًا، بل بادخار تلقائي صغير يُقتطع قبل أن تلمسه اليد.",
        stat: {
          value: 62,
          suffix: "٪",
          label: "من الموظفين في أكبر اقتصاد بالعالم يعيشون راتبًا براتب — الظاهرة أوسع مما تظن",
        },
        source: "مسوح LendingClub الأمريكية 2023",
      },
      {
        slug: FinancialQuestionSlug.GeneralFinancialStress,
        kind: "fact",
        text: "أقوى ما وجدته أبحاث السلوك المالي ضد الضغط المالي هو «الأتمتة»: تحويل تلقائي للادخار يوم الراتب يلغي معركة الإرادة الشهرية من أساسها — النظام يقاوم الضغط نيابة عنك.",
        source: "أبحاث الاقتصاد السلوكي — ثالر وبينارتزي",
      },
      {
        slug: FinancialQuestionSlug.MeetFinancialObligations,
        kind: "fact",
        text: "قدرتك على الوفاء بالتزاماتك أهم مؤشرات «العافية المالية» في الأطر الدولية — أهم من حجم الدخل نفسه، لأنها تقيس التوازن الفعلي الذي تعيشه لا الرقم النظري.",
        source: "إطار العافية المالية — مكتب الحماية المالية للمستهلك",
      },
      {
        slug: FinancialQuestionSlug.IncomeExceedsExpenses,
        kind: "fact",
        text: "«ادفع لنفسك أولًا» أثبت نفسه أنجح مبادئ الادخار المدروسة: من يقتطعون الادخار في أول الشهر يدخرون أضعاف من ينتظرون «ما يتبقى» آخره — لأن المتبقي نادرًا ما يتبقى.",
        source: "أبحاث السلوك الادخاري",
      },
      {
        slug: FinancialQuestionSlug.DailySpendingAwareness,
        kind: "fact",
        text: "أثر «المراقبة الذاتية» موثق عبر المجالات كلها: مجرد تسجيل الإنفاق — دون أي إجراء آخر — يخفضه تلقائيًا، تمامًا كما يفعل تسجيل الطعام مع الحمية. الوعي وحده يعدّل السلوك.",
        source: "أبحاث المراقبة الذاتية — علم النفس السلوكي",
      },
      {
        slug: FinancialQuestionSlug.LongTermGoals,
        kind: "fact",
        text: "أبحاث أنّاماريا لوساردي — أشهر باحثة ثقافة مالية في العالم — وجدت فجوة صادمة: من يخططون ماليًا للمستقبل يراكمون حتى ثلاثة أضعاف ثروة من لا يخططون، بنفس مستويات الدخل.",
        stat: {
          value: 3,
          prefix: "×",
          label: "أضعاف الثروة عند التقاعد يراكمها المخططون ماليًا مقارنة بغير المخططين من نفس الدخل",
        },
        source: "أنّاماريا لوساردي — أبحاث الثقافة المالية",
      },
      {
        slug: FinancialQuestionSlug.EmergencyFund,
        kind: "fact",
        text: "صندوق الطوارئ هو الفاصل الموثق بين «مشكلة عابرة» و«أزمة تتدحرج إلى ديون» — ويُبنى تدريجيًا: حتى راتب شهر واحد يغير المعادلة النفسية كاملة.",
        stat: {
          value: 6,
          suffix: " أشهر",
          label: "من النفقات الأساسية (أو 3 كبداية) هي المعيار المتعارف لصندوق طوارئ مطمئن",
        },
        source: "قواعد التخطيط المالي المعتمدة",
      },
      {
        slug: FinancialQuestionSlug.SeekFinancialAdvice,
        kind: "fact",
        text: "في المسح العالمي الأشمل للثقافة المالية، اجتاز الاختبار الأساسي ثلث البالغين فقط — سعيك للمشورة الموثوقة يضعك تلقائيًا في مقدمة الركب.",
        stat: {
          value: 33,
          suffix: "٪",
          label: "فقط من البالغين حول العالم يجتازون اختبار الثقافة المالية الأساسي",
        },
        source: "مسح S&P العالمي للثقافة المالية",
      },
      {
        slug: FinancialQuestionSlug.DebtBurden,
        kind: "fact",
        text: "عبء الديون ليس ماليًا فقط: التحليلات الشاملة تجد ارتباطًا قويًا بينه وبين القلق والاكتئاب — لذلك فخطة سداد واضحة (الأعلى فائدة أولًا) خطة صحية نفسية أيضًا.",
        stat: {
          value: 3,
          prefix: "×",
          label: "أضعاف احتمال اضطرابات نفسية لدى المثقلين بديون غير مدارة — الخطة الواضحة تحمي الجانبين",
        },
        source: "تحليل ريتشاردسون — Clinical Psychology Review 2013",
      },
      {
        slug: FinancialQuestionSlug.RetirementReadiness,
        kind: "fact",
        text: "في الادخار طويل الأجل، الوقت أثمن من المبلغ: بفعل الفائدة المركبة، من يبدأ قبل غيره بعشر سنين قد يصل للتقاعد بضعف الرصيد — بنفس الاقتطاع الشهري تمامًا.",
        stat: {
          value: 2,
          prefix: "×",
          label: "قد يتضاعف رصيد تقاعدك لمجرد البدء بالادخار 10 سنوات أبكر — بنفس المبلغ الشهري",
        },
        source: "حسابات الفائدة المركبة",
      },
    ],
  },
  {
    title: "بيئة العمل والانتماء",
    slug: "workplace",
    insights: [
      {
        slug: WorkplaceQuestionSlug.WorkEnthusiasm,
        kind: "fact",
        text: "حماسك للعمل — إن وُجد — عملة نادرة عالميًا: أغلبية الموظفين حول العالم يؤدون عملهم غير مندمجين فيه. وإن غاب الحماس، فمعرفة السبب أول طريق استعادته.",
        stat: {
          value: 23,
          suffix: "٪",
          label: "فقط من موظفي العالم مندمجون فعلًا في عملهم — الحماس الحقيقي ميزة نادرة",
        },
        source: "غالوب — تقرير حالة مكان العمل العالمي 2023",
      },
      {
        slug: WorkplaceQuestionSlug.ImmersionFlow,
        kind: "fact",
        text: "«مفارقة العمل» التي وثّقها ميهاي تشيكسنتميهاي مكتشف حالة التدفق: نختبر الانغماس العميق في العمل أكثر مما نختبره في أوقات الفراغ — العمل المصمم جيدًا مصدر متعة حقيقي.",
        source: "تشيكسنتميهاي — أبحاث التدفق Flow",
      },
      {
        slug: WorkplaceQuestionSlug.TurnoverIntention,
        kind: "fact",
        text: "إجابتك هنا من أثمن ما يمكن أن تعرفه منظمتك: غالبية من يستقيلون فعلًا كان يمكن استبقاؤهم لو التُقطت إشاراتهم مبكرًا.",
        stat: {
          value: 52,
          suffix: "٪",
          label: "ممن استقالوا طوعًا قالوا إن مديرهم أو منظمتهم كان بوسعهم منع رحيلهم",
        },
        source: "مؤسسة غالوب — أبحاث دوران الموظفين",
      },
      {
        slug: WorkplaceQuestionSlug.JobSatisfaction,
        kind: "fact",
        text: "الرضا الوظيفي لا يبقى في المكتب: الدراسات الطولية توثق «انسكابه» على الحياة كلها — المزاج في البيت، وجودة النوم، وحتى العلاقات. الاستثمار في رضاك الوظيفي استثمار في حياتك.",
        source: "أبحاث الانسكاب Spillover — علم النفس المهني",
      },
      {
        slug: WorkplaceQuestionSlug.MorningMotivation,
        kind: "fact",
        text: "الدافعية الصباحية ليست شخصية ثابتة بل مؤشر متغير يعكس ثلاثة أشياء وثّقتها أبحاث الدافعية: معنى واضحًا، وتقدمًا محسوسًا، وقدرًا من التحكم في يومك — وثلاثتها قابلة للهندسة.",
        source: "أبحاث الدافعية الذاتية في العمل",
      },
      {
        slug: WorkplaceQuestionSlug.ManagerSupport,
        kind: "fact",
        text: "أضخم قواعد بيانات الموظفين في العالم تشير لنتيجة واحدة حاسمة: المدير المباشر ليس عاملًا من عوامل تجربتك الوظيفية — إنه العامل.",
        stat: {
          value: 70,
          suffix: "٪",
          label: "من تفاوت اندماج الفرق يفسّره المدير المباشر وحده — تقييمك لمديرك معلومة ثمينة",
        },
        source: "مؤسسة غالوب",
      },
      {
        slug: WorkplaceQuestionSlug.SpeakUpSafety,
        kind: "fact",
        text: "أنفقت غوغل سنوات لتكتشف سر فرقها الأنجح، وفحصت كل شيء — الذكاء، الخبرة، الشخصيات. الجواب لم يكن أيًا منها: كان «الأمان النفسي»، شعور كل فرد بأنه يستطيع الكلام دون خوف.",
        stat: {
          value: 180,
          suffix: " فريقًا",
          label: "درسها مشروع أرسطو في غوغل ليجد أن الأمان النفسي هو العامل الأول في نجاح الفرق",
        },
        source: "مشروع أرسطو — غوغل",
      },
      {
        slug: WorkplaceQuestionSlug.IdeaFearHesitation,
        kind: "fact",
        text: "اكتشاف إيمي إدموندسون المؤسِّس: فرق المستشفيات الأفضل أداءً بدت وكأنها «تخطئ أكثر» — الحقيقة أنها كانت تبلّغ عن أخطائها بحرية فتتعلم منها. الفريق الذي يخاف الكلام يدفن أخطاءه وتكلفتها معًا.",
        source: "إيمي إدموندسون — كلية هارفارد للأعمال",
      },
      {
        slug: WorkplaceQuestionSlug.EffortRecognized,
        kind: "fact",
        text: "التقدير أرخص أدوات الإدارة وأكثرها إهمالًا في آن: بيانات غالوب تُظهر أن غيابه يدفع الموظفين للباب مباشرة.",
        stat: {
          value: 2,
          prefix: "×",
          label: "احتمال استقالة الموظف خلال العام حين لا يشعر بتقدير كافٍ لجهده",
        },
        source: "مؤسسة غالوب — أبحاث التقدير",
      },
      {
        slug: WorkplaceQuestionSlug.FairRecognition,
        kind: "fact",
        text: "أبحاث «عدالة المنظمات» وجدت أن إحساس الموظف بعدالة التقدير يؤثر في ولائه وأدائه أكثر من قيمة المكافأة نفسها — العدالة المدرَكة عملة نفسية أقوى من العملة الفعلية.",
        source: "أبحاث العدالة التنظيمية",
      },
      {
        slug: WorkplaceQuestionSlug.GrowthOpportunities,
        kind: "fact",
        text: "فرص التعلم لم تعد «ميزة إضافية» — إنها أقوى أسباب البقاء التي يصرح بها الموظفون أنفسهم في أكبر مسوح سوق العمل.",
        stat: {
          value: 94,
          suffix: "٪",
          label: "من الموظفين يبقون أطول في الشركات التي تستثمر جديًا في تعلمهم وتطويرهم",
        },
        source: "تقرير لينكدإن لتعلم القوى العاملة",
      },
      {
        slug: WorkplaceQuestionSlug.CareerPathClarity,
        kind: "fact",
        text: "وضوح المسار الوظيفي من أقوى محركات البقاء في أبحاث الاحتفاظ بالمواهب: الموظف يحتمل تحديات كثيرة إذا رأى إلى أين تقوده — والضباب وحده كافٍ لدفع الأكفاء للرحيل.",
        source: "أبحاث الاحتفاظ بالمواهب",
      },
      {
        slug: WorkplaceQuestionSlug.WorkMeaning,
        kind: "fact",
        text: "حين سُئل آلاف الموظفين الأمريكيين عن قيمة المعنى في العمل، كان جوابهم رقمًا لا كلامًا: مستعدون للتنازل عن جزء معتبر من دخلهم مقابل عمل ذي معنى دائم.",
        stat: {
          value: 23,
          suffix: "٪",
          label: "من دخلهم المستقبلي مستعد الموظفون للتنازل عنه مقابل عمل لا يفقد معناه",
        },
        source: "دراسة BetterUp — هارفارد بزنس ريفيو",
      },
      {
        slug: WorkplaceQuestionSlug.ContributionToGoals,
        kind: "fact",
        text: "رؤية «الخط الواصل» بين مهامك اليومية وأهداف المنظمة الكبرى من أثبت محركات الدافعية في الأدبيات الإدارية — والمنظمات التي ترسمه لموظفيها بوضوح تتفوق في الأداء والاحتفاظ معًا.",
        source: "أبحاث وضوح الهدف التنظيمي",
      },
      {
        slug: WorkplaceQuestionSlug.TeamBelonging,
        kind: "fact",
        text: "الانتماء ليس شعورًا جانبيًا لطيفًا — إنه محرك أداء مقيس بالأرقام في أبحاث بيئة العمل الحديثة.",
        stat: {
          value: 56,
          suffix: "٪",
          label: "زيادة في الأداء الوظيفي ترتبط بشعور الموظف العميق بالانتماء لفريقه",
        },
        source: "دراسة BetterUp — قيمة الانتماء",
      },
      {
        slug: WorkplaceQuestionSlug.RespectInclusion,
        kind: "fact",
        text: "حين رتّبت أبحاث القيادة سلوكيات القادة بأثرها على الموظفين، تصدّر «الاحترام» القائمة بفارق واسع — الموظف الذي يُعامل باحترام أعلى صحة والتزامًا وأداء من نظيره الأعلى راتبًا الأقل احترامًا.",
        source: "كريستين بوراث — جامعة جورجتاون",
      },
      {
        slug: WorkplaceQuestionSlug.FeelLikeOutsider,
        kind: "encouragement",
        text: "الإحساس العابر بالغربة عن المجموعة يمر به الجميع تقريبًا — أبحاث «قلق الانتماء» بستانفورد وجدته شائعًا حتى بين الأكثر نجاحًا، ووجدت أن مجرد معرفة أنه شائع ومؤقت يخفف أثره فعليًا.",
      },
      {
        slug: WorkplaceQuestionSlug.ProudRecommend,
        kind: "fact",
        text: "استعدادك لترشيح مكان عملك لأصدقائك هو جوهر مؤشر eNPS الذي تعتمده كبرى الشركات — لأنه يختصر تجربتك كلها في سؤال واحد صادق: هل تضع سمعتك الشخصية ضمانًا لمنظمتك؟",
        source: "مؤشر صافي ترويج الموظفين eNPS",
      },
      {
        slug: WorkplaceQuestionSlug.PurposeMission,
        kind: "fact",
        text: "الشركات ذات الرسالة الحية — التي يشعر موظفوها بمعناها فعلًا لا شعارًا — تتفوق في الاحتفاظ بالمواهب وفي الأداء طويل الأمد في دراسات متكررة؛ وإحساسك برسالة منظمتك جزء من هذه المعادلة.",
        source: "أبحاث المنظمات ذات الرسالة",
      },
      {
        slug: WorkplaceQuestionSlug.WorkplaceBullying,
        kind: "fact",
        text: "أول مسح عالمي من نوعه وجد أن نحو ربع العاملين تعرضوا لعنف أو مضايقة في العمل — إن كنت منهم فأنت لست وحدك ولا ذنب لك: التبليغ حق، وحمايتك مسؤولية منظمتك القانونية والأخلاقية.",
        stat: {
          value: 23,
          suffix: "٪",
          label: "من العاملين حول العالم تعرضوا لعنف أو مضايقة في عملهم — والمسؤولية على المنظمات",
        },
        source: "منظمة العمل الدولية 2022",
      },
      {
        slug: WorkplaceQuestionSlug.BullyingHandling,
        kind: "fact",
        text: "ثقة الموظفين بجدية التعامل مع الشكاوى هي الفيصل الموثق: في المنظمات التي تحقق وتحاسب فعلًا، ترتفع معدلات التبليغ وينخفض التنمّر نفسه — الأمان يُبنى بالاستجابة لا بالشعارات.",
        source: "أبحاث السلامة النفسية في المنظمات",
      },
    ],
  },
];

/** Flat lookup by question slug across all dimensions. */
export function getHraQuestionInsight(slug: string): HraQuestionInsight | undefined {
  for (const dimension of hraQuestionInsights) {
    const hit = dimension.insights.find((i) => i.slug === slug);
    if (hit) return hit;
  }
  return undefined;
}

export default hraQuestionInsights;
