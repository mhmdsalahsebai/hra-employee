/* ───────────────────────────────────────────────────────────────────────────
   Per-question micro-insights shown *during* the assessment, right after the
   person answers. Where data/insights.ts reads the finished profile to build
   the report, this layer is about the moment of answering: a small, warm note
   that either encourages ("تشجيع") or teaches a genuinely useful, evidence-based
   fact ("معلومة مفيدة") tied to the topic of that specific question.

   It keeps a long, honest questionnaire from feeling like a cold form: every
   few taps the person gets a little reassurance or a takeaway they can act on.

   Keyed by the question `slug` (the enum-member name used across hra.generated).
   Not every question has one — insights are curated to the questions where a
   note actually adds value, so they stay meaningful rather than constant noise.
   ─────────────────────────────────────────────────────────────────────────── */

export type QuestionInsightKind = "encouragement" | "tip";

export interface QuestionInsight {
  kind: QuestionInsightKind;
  /** One or two warm Arabic sentences. Kept short — it's a glance, not a read. */
  text: string;
}

/** Human label + tone for each kind, used by the UI chip. */
export const INSIGHT_KIND_LABEL: Record<QuestionInsightKind, string> = {
  encouragement: "تشجيع",
  tip: "معلومة مفيدة",
};

const questionInsights: Record<string, QuestionInsight> = {
  /* ── المهني · الاحتراق الوظيفي ─────────────────────────────────────────── */
  WorkEmotionalExhaustion: {
    kind: "encouragement",
    text: "الإرهاق النفسي إشارة تستحق الإنصات لها، لا علامة ضعف. فترات راحة قصيرة ومنتظمة خلال اليوم تعيد شحن طاقتك.",
  },
  MorningFatigueWorkday: {
    kind: "tip",
    text: "روتين صباحي هادئ ولو لخمس دقائق قبل بدء العمل يخفّف ثقل مواجهة اليوم ويحسّن مزاجك.",
  },
  ColleagueInteractionEffort: {
    kind: "tip",
    text: "التعب من كثرة التفاعل شائع جدًا؛ خصّص لحظات هدوء قصيرة بين المهام لتستعيد تركيزك.",
  },
  VitalityEnergy: {
    kind: "encouragement",
    text: "الحيوية تُبنى بالتدريج؛ نوم كافٍ وحركة بسيطة يوميًا يرفعان طاقتك أكثر مما تتوقّع.",
  },
  WorkFrustration: {
    kind: "encouragement",
    text: "الإحباط شعور مؤقت ومفهوم. مشاركة ما يزعجك مع شخص تثق به يخفّف حِمله كثيرًا.",
  },
  ApproachingBurnout: {
    kind: "encouragement",
    text: "شكرًا لصراحتك. الاعتراف بالإرهاق أول خطوة نحو التعافي، وأنت لست وحدك في هذا.",
  },

  /* ── النفسي · الصحة النفسية ────────────────────────────────────────────── */
  AnxietyNotProne: {
    kind: "tip",
    text: "دقيقتان من التنفّس العميق البطيء تهدّئان الجهاز العصبي وتخفّضان التوتر بشكل فوري.",
  },
  InferiorityFeelings: {
    kind: "encouragement",
    text: "قيمتك لا تُقاس بلحظات الشك. عامل نفسك بنفس اللطف الذي تمنحه لصديق عزيز.",
  },
  EmotionalCollapse: {
    kind: "tip",
    text: "عند اشتداد الضغط، توقّف لحظة وسمِّ ما تشعر به بكلمة واحدة؛ تسمية المشاعر وحدها تخفّف حدّتها.",
  },
  StressNervousness: {
    kind: "tip",
    text: "الحركة الخفيفة — كمشي عشر دقائق — من أسرع الطرق لتفريغ التوتر المتراكم في الجسد.",
  },
  WorthlessnessFeelings: {
    kind: "encouragement",
    text: "هذه المشاعر ثقيلة لكنها لا تعكس حقيقتك. طلب الدعم عند الحاجة شجاعة لا ضعف.",
  },
  SadnessDepressionFree: {
    kind: "tip",
    text: "التواصل مع شخص تثق به يخفّف المشاعر الصعبة؛ العزلة تكبّرها، والحديث يصغّرها.",
  },
  FrustrationHelplessness: {
    kind: "encouragement",
    text: "لا بأس ألا تسير الأمور كما تريد دائمًا. التركيز على خطوة واحدة ممكنة يعيد لك الإحساس بالتحكّم.",
  },

  /* ── الفكري · الانفتاح والفضول ─────────────────────────────────────────── */
  IntellectualCuriosity: {
    kind: "encouragement",
    text: "الفضول الفكري يبقي عقلك نشِطًا ويغذّي إبداعك؛ استمرّ في طرح الأسئلة.",
  },
  TryingNewFoods: {
    kind: "encouragement",
    text: "تجربة الجديد — ولو في الطعام — تكسر الروتين وتنشّط الدماغ وتضيف بهجة صغيرة ليومك.",
  },
  PoetryArtEnjoyment: {
    kind: "tip",
    text: "التعرّض للفنون والشعر يقلّل هرمونات التوتر ويحسّن المزاج؛ لحظة جمال قصيرة تكفي.",
  },
  TheoriesIdeasEnjoyment: {
    kind: "encouragement",
    text: "شغفك بالأفكار الجديدة ثروة؛ تعلّم شيء واحد بسيط كل أسبوع يراكم فرقًا كبيرًا.",
  },

  /* ── المجتمعي · اللطف والتعاون ─────────────────────────────────────────── */
  KindnessPeople: {
    kind: "encouragement",
    text: "اللطف اليومي يعزّز سعادتك أنت قبل غيرك؛ حتى ابتسامة صغيرة لها أثر.",
  },
  CooperationPreference: {
    kind: "encouragement",
    text: "تفضيلك للتعاون قوة اجتماعية حقيقية تبني ثقة وعلاقات تدوم.",
  },
  ConsiderationRights: {
    kind: "encouragement",
    text: "مراعاتك لمشاعر الآخرين وحقوقهم علامة نضج تجعلك محلّ ثقة من حولك.",
  },

  /* ── الاجتماعي · العلاقات والطاقة ──────────────────────────────────────── */
  PeopleAroundMe: {
    kind: "tip",
    text: "العلاقات الاجتماعية القوية من أقوى عوامل طول العمر والسعادة، وتُضاهي أثر الرياضة على صحتك.",
  },
  SmileLaughEasily: {
    kind: "tip",
    text: "الضحك يخفض هرمونات التوتر ويقوّي المناعة؛ لحظة مرح حقيقية دواء مجاني.",
  },
  EnjoyTalkingOthers: {
    kind: "encouragement",
    text: "استمتاعك بالحديث مع الناس نعمة؛ محادثة صادقة واحدة قد تضيء يومك ويوم غيرك.",
  },
  HappyCheerful: {
    kind: "encouragement",
    text: "مزاجك المتفائل يعدي من حولك بالإيجابية؛ احرص على ما يغذّيه.",
  },

  /* ── الشمولي · التنظيم والإنتاجية ──────────────────────────────────────── */
  KeepThingsOrganized: {
    kind: "tip",
    text: "بيئة مرتّبة تقلّل التشتّت الذهني؛ خمس دقائق ترتيب يومية توفّر عليك وقتًا وطاقة.",
  },
  TimeManagementSkill: {
    kind: "tip",
    text: "تقسيم المهمة الكبيرة إلى خطوات صغيرة واضحة يقلّل التسويف ويجعل البدء أسهل بكثير.",
  },
  WasteTimeProcrastination: {
    kind: "tip",
    text: "قاعدة الدقيقتين: إن كانت المهمة تستغرق أقل من دقيقتين، أنجزها الآن بدل تأجيلها.",
  },
  ClearGoalsSystematic: {
    kind: "encouragement",
    text: "وضوح أهدافك نصف الطريق إليها؛ كتابتها ومراجعتها بانتظام يضاعف فرص تحقيقها.",
  },
  StriveExcellence: {
    kind: "encouragement",
    text: "سعيك للتميّز محرّك قوي؛ فقط تذكّر أن التقدّم أهم من الكمال.",
  },

  /* ── البدني · النشاط والوقاية ونمط الحياة ──────────────────────────────── */
  SedentaryWork: {
    kind: "tip",
    text: "الجلوس الطويل عامل خطر مستقل حتى لو كنت تتمرّن؛ قِف وتحرّك ٣–٥ دقائق كل ساعة.",
  },
  VigorousActivityDays: {
    kind: "tip",
    text: "توصي منظمة الصحة العالمية بـ ٧٥ دقيقة على الأقل من النشاط العالي الشدة أسبوعيًا لصحة القلب.",
  },
  ModerateActivityDays: {
    kind: "tip",
    text: "١٥٠ دقيقة نشاط متوسط أسبوعيًا (نحو ٢١ دقيقة يوميًا) هدف واقعي يحمي قلبك ووزنك.",
  },
  StrengthTrainingDays: {
    kind: "tip",
    text: "تمارين المقاومة مرتين أسبوعيًا تحافظ على كتلتك العضلية وقوّة عظامك مع تقدّم العمر.",
  },
  WalkingDays: {
    kind: "encouragement",
    text: "المشي ٣٠ دقيقة معظم أيام الأسبوع يقلّل خطر أمراض القلب بشكل ملموس؛ كل خطوة تُحتسب.",
  },
  SittingHours: {
    kind: "tip",
    text: "تقليل ساعات الجلوس المتصل يحسّن سكر الدم والدورة الدموية؛ قاطِع جلوسك بوقفات قصيرة.",
  },
  BloodPressureCheck: {
    kind: "tip",
    text: "ارتفاع ضغط الدم غالبًا بلا أعراض؛ قياسه بانتظام أبسط وسيلة لاكتشافه مبكرًا.",
  },
  CholesterolCheck: {
    kind: "tip",
    text: "فحص الكوليسترول دوريًا يساعد على الوقاية من أمراض القلب قبل ظهور أي أعراض.",
  },
  BloodSugarCheck: {
    kind: "tip",
    text: "فحص سكر الدم يكشف مقدّمات السكري مبكرًا، حين يكون تغيير المسار أسهل بكثير.",
  },
  ChronicPain: {
    kind: "tip",
    text: "الألم المزمن قابل للإدارة؛ الحركة اللطيفة المنتظمة غالبًا تخفّفه أكثر من الراحة التامة.",
  },
  SleepDuration: {
    kind: "tip",
    text: "يحتاج البالغ ٧–٩ ساعات نوم؛ النوم الكافي يقوّي المناعة والمزاج والتركيز والذاكرة.",
  },
  FruitVegetableIntake: {
    kind: "tip",
    text: "٥ حصص من الخضار والفاكهة يوميًا هدف بسيط يصنع فرقًا كبيرًا في طاقتك ووقايتك.",
  },
  TobaccoUse: {
    kind: "tip",
    text: "تبدأ فائدة الإقلاع عن التبغ خلال ٢٠ دقيقة، وخلال عام ينخفض خطر أمراض القلب إلى النصف تقريبًا.",
  },
  FastFoodFrequency: {
    kind: "tip",
    text: "خفض الوجبات السريعة إلى مرة أسبوعيًا خطوة واقعية تحسّن وزنك وطاقتك تدريجيًا.",
  },
  WaterIntake: {
    kind: "tip",
    text: "شرب ٦–٨ أكواب ماء يوميًا يدعم التركيز والطاقة وصحة الكلى؛ ابدأ يومك بكوب.",
  },
  HighSaltFoodPreference: {
    kind: "tip",
    text: "تقليل الملح إلى أقل من ٥ غرام يوميًا (نحو ملعقة صغيرة) يخفض ضغط الدم ويحمي قلبك.",
  },
  FitnessLevel: {
    kind: "encouragement",
    text: "لياقتك تتحسّن بالتدرّج لا بالقفزات؛ ثابر على القليل المنتظم وستفاجئك النتيجة.",
  },

  /* ── المالي · الاستقرار والعادات ───────────────────────────────────────── */
  FinancialStressFeeling: {
    kind: "encouragement",
    text: "الضغط المالي شائع جدًا ولا يعرّف قيمتك؛ خطوة صغيرة منظّمة تعيد لك الإحساس بالسيطرة.",
  },
  MonthlyExpenseWorry: {
    kind: "tip",
    text: "كتابة نفقاتك الشهرية تخفّف القلق لأنها تحوّل المجهول المقلق إلى أرقام واضحة يمكن التعامل معها.",
  },
  EmergencyFund: {
    kind: "tip",
    text: "صندوق طوارئ يغطّي ٣–٦ أشهر من نفقاتك هو أقوى درع مالي ضد مفاجآت الحياة.",
  },
  DailySpendingAwareness: {
    kind: "tip",
    text: "تتبّع إنفاقك اليومي لأسبوع واحد فقط يكشف تسرّبات صغيرة تتراكم إلى مبالغ مؤثّرة.",
  },
  LongTermGoals: {
    kind: "tip",
    text: "تحديد هدف مالي واضح ومكتوب يضاعف احتمال تحقيقه مقارنة بالنيّة وحدها.",
  },
  SeekFinancialAdvice: {
    kind: "encouragement",
    text: "طلب المشورة المالية من مصدر موثوق علامة وعي ونضج، لا ضعف.",
  },
  DebtBurden: {
    kind: "tip",
    text: "سداد الديون ذات الفائدة الأعلى أولًا يوفّر عليك أكثر على المدى البعيد.",
  },
  RetirementReadiness: {
    kind: "tip",
    text: "الادّخار المبكر ولو بمبلغ بسيط يكبر مع الوقت بفضل الفائدة المركّبة؛ الوقت أثمن من المبلغ.",
  },

  /* ── بيئة العمل والانتماء ──────────────────────────────────────────────── */
  WorkEnthusiasm: {
    kind: "encouragement",
    text: "الحماس للعمل نعمة تُغذّى؛ لاحظ ما يشعلها لديك واحرص على المزيد منه.",
  },
  TurnoverIntention: {
    kind: "encouragement",
    text: "مشاعرك تجاه عملك مهمة وصادقة؛ التعبير عنها هنا يساعد على تحسين بيئتك.",
  },
  SpeakUpSafety: {
    kind: "tip",
    text: "بيئة العمل الآمنة نفسيًا — حيث يُقال الرأي بلا خوف — ترفع الإبداع والأداء للفريق كلّه.",
  },
  GrowthOpportunities: {
    kind: "encouragement",
    text: "التعلّم المستمر من أهم ما يبقيك متحمّسًا؛ اقتنص أي فرصة للتطوّر ولو كانت صغيرة.",
  },
  WorkMeaning: {
    kind: "encouragement",
    text: "إيجاد معنى في عملك من أقوى الدروع ضد الاحتراق الوظيفي؛ اربط مهامك بأثرها الأكبر.",
  },
  TeamBelonging: {
    kind: "encouragement",
    text: "الشعور بالانتماء يرفع رضاك وأداءك؛ علاقة داعمة واحدة في العمل تصنع فرقًا كبيرًا.",
  },
  WorkplaceBullying: {
    kind: "tip",
    text: "التنمّر في العمل ليس شيئًا تتحمّله وحدك؛ التبليغ حقّك، وحماية بيئتك مسؤولية منظمتك.",
  },
  ProudRecommend: {
    kind: "encouragement",
    text: "فخرك بمكان عملك مؤشّر صحي جميل؛ إنه ثمرة انسجام بين قيمك وما تقدّمه كل يوم.",
  },
};

/** The insight for a question, or `undefined` if it doesn't carry one. */
export function getQuestionInsight(slug: string): QuestionInsight | undefined {
  return questionInsights[slug];
}

export default questionInsights;
