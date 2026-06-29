// AUTO-GENERATED from data/hraDimensions.ts + data/hraResults.ts. Do not edit by hand.
// 9 wellbeing dimensions with their real HRA questions, score-band insights, and advices.

export interface HraAnswerOption {
  value: number;
  title: string;
}

export interface HraQuestion {
  slug: string;
  order: number;
  title: string;
  /** When true, higher agreement maps to a lower (better) value — already baked into answer values. */
  reversed: boolean;
  answers: HraAnswerOption[];
}

/** A score band: raw-score range → verdict, alert, description, and concrete advices. */
export interface HraInsightBand {
  minScore: number;
  maxScore: number;
  title: string;
  alert: string;
  description: string;
  advices: string[];
}

export interface HraDimensionData {
  slug: string;
  title: string;
  description: string;
  questions: HraQuestion[];
  insights: HraInsightBand[];
}

export const hraData: HraDimensionData[] = [
  {
    "slug": "professional",
    "title": "المهني",
    "description": "يهتم هذا البعد بتقييم الجانب المهني لديك حيث يهدف إلى قياس مستوى الإجهاد النفسي والعاطفي الذي قد تواجهه في بيئة عملك، حيث يقيم جوانب مثل الإجهاد العاطفي الذي يشير إلى مدى التعب النفسي والعاطفي، وتدهور الأداء الوظيفي الذي يعكس تأثير الإجهاد على كفاءة العمل والإنتاجية، واللامبالاة المهنية التي تعبر عن فقدان الاهتمام والحماس للعمل، والإجهاد الجسدي الذي يبرز الآثار الجسدية الناتجة عن الإجهاد المهني الطويل. ويساعد هذا الاختبار ايضا في التعرف على تأثير العمل على الصحة النفسية والجسدية للفرد ويسهم في وضع استراتيجيات لتحسين الرفاهية المهنية.",
    "questions": [
      {
        "slug": "WorkEmotionalExhaustion",
        "order": 1,
        "title": "أشعر بأن عملي انهكني نفسياً",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "PatienceExhaustionWorkday",
        "order": 2,
        "title": "ينفذ صبري بنهاية يوم العمل",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "MorningFatigueWorkday",
        "order": 3,
        "title": "أشعر بالتعب عندما استيقظ في الصباح وعلى مواجهة يوم آخر في العمل",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "EmpathyColleagues",
        "order": 4,
        "title": "أستطيع بسهولة أن أفهم مايشعر به زملائي",
        "reversed": true,
        "answers": [
          {
            "value": 6,
            "title": "ابدا"
          },
          {
            "value": 5,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 4,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 2,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 1,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 0,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "DehumanizingColleagues",
        "order": 5,
        "title": "أشعر أني أعامل بعض زملائي بغير إنسانية كما لو كانوا أشياء",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "ColleagueInteractionEffort",
        "order": 6,
        "title": "العمل مع الزملاء طوال اليوم يتطلب قدر كبير من الجهد",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "HandleColleagueProblems",
        "order": 7,
        "title": "أتعامل مع مشاكل زملائي بفعالية",
        "reversed": true,
        "answers": [
          {
            "value": 6,
            "title": "ابدا"
          },
          {
            "value": 5,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 4,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 2,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 1,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 0,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "WorkBreakdown",
        "order": 8,
        "title": "أشعرأن عملي هو من يحطمني",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "PositiveImpactPeople",
        "order": 9,
        "title": "من خلال عملي أشعر بأن لدي تأثير إيجابي على الناس",
        "reversed": true,
        "answers": [
          {
            "value": 6,
            "title": "ابدا"
          },
          {
            "value": 5,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 4,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 2,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 1,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 0,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "IncreasedHardnessPeople",
        "order": 10,
        "title": "أصبحت أكثر قسوة على الناس منذ أن بدأت هذا العمل",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "FearIndifference",
        "order": 11,
        "title": "أخشى أن العمل يجعلني شخصا غير مهتم",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "VitalityEnergy",
        "order": 12,
        "title": "أشعر بأني مفعم بالحيوية",
        "reversed": true,
        "answers": [
          {
            "value": 6,
            "title": "ابدا"
          },
          {
            "value": 5,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 4,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 2,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 1,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 0,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "WorkFrustration",
        "order": 13,
        "title": "أشعر أني محبط بسبب عملي",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "DifficultWork",
        "order": 14,
        "title": "أشعر أني أعمل بصعوبة جداً في وظيفتي",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "IndifferenceColleaguesWellbeing",
        "order": 15,
        "title": "حقيقة لايهمني مايحدث للبعض من زملائي",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "DirectContactStress",
        "order": 16,
        "title": "العمل في اتصال مباشر مع الاخرين يسبب لي ضغطاً كبيراً",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "CreateComfortableAtmosphere",
        "order": 17,
        "title": "أنا قادر بسهولة أن أخلق جو مريح مع زملائي",
        "reversed": true,
        "answers": [
          {
            "value": 6,
            "title": "ابدا"
          },
          {
            "value": 5,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 4,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 2,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 1,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 0,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "RefreshedWithColleagues",
        "order": 18,
        "title": "أشعر بالانتعاش عندما أكون قريبا من زملائي في العمل",
        "reversed": true,
        "answers": [
          {
            "value": 6,
            "title": "ابدا"
          },
          {
            "value": 5,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 4,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 2,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 1,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 0,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "ValuableAccomplishments",
        "order": 19,
        "title": "أنجز الكثير من الأشياء ذات القيمة في العمل",
        "reversed": true,
        "answers": [
          {
            "value": 6,
            "title": "ابدا"
          },
          {
            "value": 5,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 4,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 2,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 1,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 0,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "ApproachingBurnout",
        "order": 20,
        "title": "أشعر وكأنني أقترب من نهايتي",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "EmotionalProblemssCalmly",
        "order": 21,
        "title": "في عملي أتعامل مع المشاكل الانفعالية بكل هدوء",
        "reversed": true,
        "answers": [
          {
            "value": 6,
            "title": "ابدا"
          },
          {
            "value": 5,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 4,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 2,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 1,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 0,
            "title": "يوميا"
          }
        ]
      },
      {
        "slug": "BlamedForColleaguesProblems",
        "order": 22,
        "title": "لدى انطباع بأن بعض زملائي يحملونني مسؤولية البعض من مشاكلهم",
        "reversed": false,
        "answers": [
          {
            "value": 0,
            "title": "ابدا"
          },
          {
            "value": 1,
            "title": "عدة مرات في السنة"
          },
          {
            "value": 2,
            "title": "مرة في الشهر"
          },
          {
            "value": 3,
            "title": "عدة مرات قي الشهر"
          },
          {
            "value": 4,
            "title": "مرة في الاسبوع"
          },
          {
            "value": 5,
            "title": "عدة مرات في الاسبوع"
          },
          {
            "value": 6,
            "title": "يوميا"
          }
        ]
      }
    ],
    "insights": [
      {
        "minScore": 0,
        "maxScore": 44,
        "title": "مرن / مرن وظيفيا / متوازن",
        "alert": "قد تقلل من أهمية العناية بنفسك واسترخائك بشكل كافٍ.",
        "description": "درجتك منخفضة، فإنك تشعر بقدر قليل من الإجهاد وتتمتع بمستوى عالٍ من الطاقة والحماس لعملك.",
        "advices": [
          "استمر في المحافظة على التوازن بين العمل والحياة الشخصية",
          "احرص على تخصيص وقت للأنشطة التي تستمتع بها والتي تساعدك على الاسترخاء",
          "كن وعيًا لمؤشرات الإجهاد واعتنِ بنفسك عند الحاجة",
          "شارك نجاحاتك وتجاربك الإيجابية مع زملائك لتعزيز معنويات الجميع"
        ]
      },
      {
        "minScore": 44,
        "maxScore": 88,
        "title": "معرض للاحتراق الوظيفي",
        "alert": "قد تواجه صعوبة في الحفاظ على الدافعية والتحفيز في بعض الأحيان.",
        "description": "درجتك متوسطة، مايعني أنك تشعر ببعض الإجهاد والتعب، لكنك لا تزال قادرًا على إدارة مهامك بشكل معقول.",
        "advices": [
          "حافظ على نمط حياة صحي من خلال ممارسة الرياضة بانتظام وتناول غذاء متوازن",
          "احرص على أخذ فترات راحة قصيرة خلال العمل لتجديد طاقتك",
          "قم بإدارة وقتك بشكل فعال وحدد أولوياتك لتجنب الإرهاق",
          "احرص على تطوير مهاراتك من خلال التدريب والتعلم المستمر"
        ]
      },
      {
        "minScore": 89,
        "maxScore": 200,
        "title": "مجهد / مجهد وظيفيا / محترق وظيفيا",
        "alert": "قد تكون عرضة للإرهاق المزمن، والاكتئاب، وتأثيرات سلبية على صحتك الجسدية والنفسية.",
        "description": "درجتك مرتفعة، أنت تعاني من مستويات عالية من الإجهاد العاطفي والجسدي، وتشعر بالتعب الدائم وفقدان الحماس لعملك.",
        "advices": [
          "حاول تحقيق التوازن بين العمل والحياة الشخصية من خلال تخصيص وقت للراحة والترفيه",
          "مارس تقنيات الاسترخاء مثل التأمل والتنفس العميق للتخفيف من الإجهاد",
          "احرص على التواصل مع الأشخاص المقربين للحصول على الدعم النفسي",
          "قم بإعادة تقييم أولوياتك وتعلم كيفية قول 'لا' للمهام الزائدة عن قدرتك",
          "اطلب استشارة من متخصص نفسي"
        ]
      }
    ]
  },
  {
    "slug": "psycho",
    "title": "النفسي",
    "description": "البعد النفسي يهتم بتقيم مدى استقرارك النفسي وكيفية تعاملك مع المشاعر السلبية مثل القلق، الغضب، الاكتئاب، والتوتر. فهو يساعد في تحديد مدى تعرضك للقلق والتوتر في المواقف الضاغطة، وكيفية إظهار ردود الفعل العاطفية على التحديات والأزمات، وتجربة تقلبات المزاج والشعور بالاكتئاب، ومدى القلق حول حالتك الصحية وسلامتك الشخصية. يعتبر هذا الاختبار أداة مهمة لفهم كيفية تأثير العامل النفسي على حياتك اليومية وعلاقاتك الشخصية والمهنية، ويساهم في تطوير استراتيجيات لتحسين صحتك النفسية ورفاهيتك العامة.",
    "questions": [
      {
        "slug": "AnxietyNotProne",
        "order": 1,
        "title": "أنا لست شخصا قلقا",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "InferiorityFeelings",
        "order": 2,
        "title": "غالبا ما أشعر بأنني أقل شأنا من الآخرين",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "EmotionalCollapse",
        "order": 3,
        "title": "عندما أكون تحت ضغط هائل أشعر أحيانا بأن أعصابي قد انهارت",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "LonelinessSadnessFree",
        "order": 4,
        "title": "نادرا ما أشعر بالوحدة والكآبة",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "StressNervousness",
        "order": 5,
        "title": "أشعر غالبا بالتوتر والعصبية",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "WorthlessnessFeelings",
        "order": 6,
        "title": "أشعر أحيانا بأنني عديم القيمة",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "FearAnxietyFree",
        "order": 7,
        "title": "نادرا ما أشعر بالخوف والقلق",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "AngerTreatment",
        "order": 8,
        "title": "غالبا ما أغضب من الطريقة التي يعاملني بها الآخرون",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "FrustrationHelplessness",
        "order": 9,
        "title": "عندما لا تسير الأمور بالشكل الصحيح ، أشعر بالإحباط أو الاستسلام",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "SadnessDepressionFree",
        "order": 10,
        "title": "نادرا ما أكون حزينا ومكتئبا",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "HelplessnessPassivity",
        "order": 11,
        "title": "غالبا ما أشعر بعدم قدرتي على مساعدة الآخرين و أريد من شخص آخر أن يحل مشكلاتي",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ShameHiding",
        "order": 12,
        "title": "عندما أشعر بالخجل أود لو اختبئ كي لا يراني أحد",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      }
    ],
    "insights": [
      {
        "minScore": 0,
        "maxScore": 29,
        "title": "مستقر عاطفيا",
        "alert": "قد تواجه صعوبة في التعاطف مع الآخرين الذين يعانون من التوتر والقلق.",
        "description": "درجتك منخفضة، أنت تميل إلى أن تكون أكثر استقراراً نفسياً وأقل عرضة للقلق والتوتر. تتعامل بهدوء مع الضغوط والمشاكل.",
        "advices": [
          "استخدم استقرارك النفسي لدعم الآخرين ومساعدتهم في التغلب على الضغوط",
          "اعمل على تطوير مهارات الاستماع الفعال لتعزيز علاقاتك مع الآخرين",
          "حافظ على نمط حياة صحي ومتوازن للحفاظ على استقرارك النفسي",
          "تذكر أهمية التعاطف مع مشاعر الآخرين وتقديم الدعم عند الحاجة"
        ]
      },
      {
        "minScore": 30,
        "maxScore": 45,
        "title": "متوازن عاطفيا",
        "alert": "قد تكون غير متأكد في بعض الأحيان من كيفية التعامل مع الضغوط الكبيرة.",
        "description": "درجتك متوسطة، أنت تظهر توازناً بين الاستقرار العاطفي والتفاعل مع الضغوط. تتعامل بشكل جيد مع المواقف اليومية، ولكن قد تشعر بالقلق أحياناً.",
        "advices": [
          "استمر في ممارسة تقنيات الاسترخاء للتخفيف من الضغوط",
          "اعمل على تحسين مهارات إدارة الوقت لتجنب الإجهاد",
          "حافظ على توازن بين العمل والحياة الشخصية",
          "كن مرناً في تعاملك مع التحديات وتقبل التغيير"
        ]
      },
      {
        "minScore": 46,
        "maxScore": 200,
        "title": "حساس عاطفيا",
        "alert": "قد تكون عرضة للإجهاد العاطفي، والتقلبات المزاجية، وصعوبة في الاستقرار النفسي.",
        "description": "درجتك مرتفعة، وهذا يعني إنك قد تعاني من القلق،وتقلب المزاج والتوتر بشكل متكرر. تكون ردود أفعالك العاطفية قوية وقد تواجه صعوبة في التعامل مع الضغوط.",
        "advices": [
          "مارس تقنيات الاسترخاء مثل التأمل والتنفس العميق لتخفيف التوتر",
          "حافظ على نمط حياة صحي من خلال ممارسة الرياضة بانتظام وتناول غذاء متوازن",
          "احرص على الحصول على دعم اجتماعي من الأصدقاء والعائلة",
          "اعمل على تطوير استراتيجيات للتكيف مع الضغوط وتجنب المواقف المثيرة للقلق"
        ]
      }
    ]
  },
  {
    "slug": "intellectual",
    "title": "الفكري",
    "description": "البعد الفكري يقيس عدة جوانب مهمة تتعلق بكيفية استجابتك للتجارب والأفكار الجديدة. حيث يتناول هذا الاختبار مدى فضولك الفكري واهتمامك بالاستكشاف وفهم الأمور بعمق، بالإضافة إلى قدرتك على الإبداع والتفكير بطرق غير تقليدية. كما يقيم مدى تقديرك للفنون والجمال وقدرتك على الاستمتاع بالتجارب الجمالية، وأيضاً مدى تقبلك لمجموعة واسعة من المشاعر وتجارب الحياة المختلفة. بالإضافة إلى ذلك، يقيس الاختبار مدى ميلك لاستخدام الخيال والابتكار في التفكير والاستقلالية الفكرية التي تعتمد على حكمك الشخصي. يُعتبر هذا الاختبار أداة مهمة لفهم تأثير انفتاحيتك على حياتك اليومية وعلاقاتك الشخصية والمهنية، ويساهم في تطوير استراتيجيات لتعزيز هذه الجوانب لتحقيق رفاهيتك العامة.",
    "questions": [
      {
        "slug": "DaydreamingDislike",
        "order": 1,
        "title": "لا أحب أضيع وقتي في أحلام اليقظة",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "AdherenceTradition",
        "order": 2,
        "title": "عندما أعرف الطريقة الصحيحة للقيام بشئ ما فإنني التزم بها",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "AestheticAppreciation",
        "order": 3,
        "title": "التزم بالنماذج التي أجدها في الفن والطبيعة",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "OpposingSpeakers",
        "order": 4,
        "title": "اعتقد بأن السماح للطلاب بالاستماع إلى متحدثين متناقضين لا يعمل أكثر من مجرد تشويشهم وتضليلهم",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "PoetryLittleImpact",
        "order": 5,
        "title": "للشعر تأثير قليل على أو ليس له تأثير",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "TryingNewFoods",
        "order": 6,
        "title": "غالبا ما أحاول أن أجرب الأطعمة الجديدة والغربية",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "MoodChangeSensitivity",
        "order": 7,
        "title": "نادرا ما ألاحظ تغير المزاج مع تغير المواقف والبيئات المختلفة",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ReligiousAuthorityEthics",
        "order": 8,
        "title": "اعتقد أن علينا الرجوع إلى السلطات الدينية فيما يتعلق بالأمور الأخلاقيه",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "PoetryArtEnjoyment",
        "order": 9,
        "title": "عندما أقرأ قصيدة من الشعر أو أنظر في عمل فني فإنني أشعر أحيانا بالاستمتاع",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "UniversePhilosophyInterest",
        "order": 10,
        "title": "لدي اهتمام قليل بالتفكير في طبيعة الكون والظروف البشرية",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "IntellectualCuriosity",
        "order": 11,
        "title": "لدي الكثير من الفضول الفكري",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "TheoriesIdeasEnjoyment",
        "order": 12,
        "title": "غالبا ما استمتع بالتعامل مع النظريات والأفكار الجديدة",
        "reversed": true,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      }
    ],
    "insights": [
      {
        "minScore": 0,
        "maxScore": 29,
        "title": "محافظ",
        "alert": "قد تواجه صعوبة في التكيف مع التغييرات أو في تبني الأفكار الجديدة.",
        "description": "درجتك منخفضة، أنت تميل إلى أن تكون تقليدياً ومحباً للاستقرار. تفضل الروتين والأنشطة المألوفة وتشعر بالراحة أكثر في البيئات المألوفة.",
        "advices": [
          "استخدم استقرارك لتعزيز إنتاجيتك وتحقيق أهدافك",
          "حاول تجربة أنشطة جديدة بشكل تدريجي لزيادة انفتاحيتك",
          "لا تخف من التغيير؛ انظر إليه كفرصة للتعلم والنمو",
          "قم ببناء شبكة دعم اجتماعي من الأشخاص الذين يمكنهم تقديم نصائح جديدة وأفكار ملهمة"
        ]
      },
      {
        "minScore": 30,
        "maxScore": 45,
        "title": "واقعي",
        "alert": "قد تواجه صعوبة في الابتكار بشكل كبير أو في التكيف مع التغييرات المفاجئة.",
        "description": "درجتك متوسطة، مايعني إنك تظهر توازناً بين الاهتمام بالتجارب الجديدة والاستمتاع بالروتين. تتقبل بعض الأفكار والمشاعر الجديدة، ولكنك تفضل أيضاً الاستقرار",
        "advices": [
          "حافظ على هذا التوازن بين الابتكار والاستقرار",
          "انخرط في أنشطة جديدة لتطوير مهاراتك وزيادة معرفتك",
          "استمتع بروتينك اليومي ولكن ابحث عن طرق لتحسينه بشكل دوري",
          "كن منفتحاً على الأفكار الجديدة والتغييرات الصغيرة في حياتك"
        ]
      },
      {
        "minScore": 46,
        "maxScore": 200,
        "title": "منفتح",
        "alert": "قد تميل إلى التشتت بسهولة بسبب تنوع اهتماماتك، وقد تواجه صعوبة في التكيف مع الروتين أو التعليمات التقليدية.",
        "description": "كانت درجتك مرتفعة على البُعد الفكري، مايعني إنك تميل إلى أن تكون مبتكراً وفضولياً، وتمتلك اهتماماً قوياً بالتجارب الجديدة والأفكار غير التقليدية. تتفاعل بشكل إيجابي مع الفنون والجمال والمشاعر المختلفة.",
        "advices": [
          "استغل فضولك الفكري في استكشاف مجالات جديدة ومعرفة أوسع",
          "قم بتنظيم وقتك ومهامك لتجنب التشتت وتشتت الجهود",
          "استمتع بالتجارب الفنية والثقافية لتعزيز إبداعك",
          "تعلم مهارات جديدة لتوسيع آفاقك الشخصية والمهنية"
        ]
      }
    ]
  },
  {
    "slug": "community",
    "title": "المجتمعي",
    "description": "البُعد المجتمعي يقيس مدى لطفك وتعاونك مع الآخرين. يتناول هذا الاختبار عدة جوانب، منها: الثقة التي تشير إلى مدى ميلك للثقة بالآخرين والاعتقاد في حسن نيتهم، الاستقامة التي تظهر مدى تمسكك بالأخلاقيات والاستقامة في التعامل، الإيثار وهو ميلك لمساعدة الآخرين وتقديم الدعم لهم، المحبة التي تعكس مدى عاطفتك وحساسيتك تجاه مشاعر الآخرين، التوافق الذي يقيم مدى تعاونك وتفهمك للآراء المختلفة، وأخيراً التواضع الذي يظهر مدى بساطتك وتجنبك للغرور. يعتبر هذا الاختبار أداة مهمة لفهم كيفية تأثير انسجامك مع الآخرين على حياتك اليومية وعلاقاتك الشخصية والمهنية.",
    "questions": [
      {
        "slug": "KindnessPeople",
        "order": 1,
        "title": "أحاول أن أكون لطيفا مع جميع من أقابلهم",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ArgumentsFamilyWork",
        "order": 2,
        "title": "غالبا ما أدخل في مجادلات مع عائلتي ومع زملائي في العمل",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "SelfishArrogant",
        "order": 3,
        "title": "يعتقد بعض الناس أنني أناني ومغرور",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "CooperationPreference",
        "order": 4,
        "title": "أفضل أن أتعاون مع الاخرين على التنافس معهم",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "CynicismOthers",
        "order": 5,
        "title": "أميل إلى السخرية والشك في نوايا الاخرين",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "OthersExploitation",
        "order": 6,
        "title": "أعتقد بأن أغلب الناس سوف يستغلوني إذا سمحت لهم بذلك",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "PeopleLikeMe",
        "order": 7,
        "title": "يحبني معظم الناس الذين أعرفهم",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "IndifferenceSelfishness",
        "order": 8,
        "title": "يعتقد بعض الناس بأنني غير مبال وأناني",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "RationalConvictions",
        "order": 9,
        "title": "أكوٌن اتجاهاتي بعقلانية وأتمسك بها",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ConsiderationRights",
        "order": 10,
        "title": "أحاول بشكل عام أن أكون مراعيا لحقوق الاخرين ومشاعرهم",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "DirectDislike",
        "order": 11,
        "title": "عندما لا أحب أحدا فإنني أحب أن أشعره بذلك",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ManipulationNecessity",
        "order": 12,
        "title": "عند الضرورة لدي الاستعداد لأن أتعامل مع الأخرين بالطريقة التي تحقق لي الحصول على ما أريد",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      }
    ],
    "insights": [
      {
        "minScore": 0,
        "maxScore": 29,
        "title": "حذر",
        "alert": "قد تجد صعوبة في بناء علاقات تعاون وثقة مع الآخرين.",
        "description": "درجتك منخفضة، أنت تميل إلى أن تكون أكثر استقلالية وحذرًا في تعاملاتك مع الآخرين. قد تفضل العمل بمفردك وتجنب الاعتماد على الآخرين.",
        "advices": [
          "حاول الانخراط في أنشطة جماعية لتعزيز تعاونك مع الآخرين",
          "اعمل على تطوير مهاراتك الاجتماعية والتواصلية",
          "تذكر أهمية بناء علاقات متبادلة تقوم على الثقة والاحترام",
          "اعمل على تعزيز الثقة في الآخرين تدريجيًا"
        ]
      },
      {
        "minScore": 30,
        "maxScore": 45,
        "title": "متعاون",
        "alert": "قد تكون غير متأكد في بعض الأحيان من كيفية التوازن بين التعاون والحذر.",
        "description": "درجتك متوسطة، أنت تظهر توازنًا بين التعاون والاستقلالية. تتعاون مع الآخرين عند الحاجة، ولكنك أيضًا تستطيع حماية مصالحك الشخصية.",
        "advices": [
          "اعمل على تحديد أولوياتك ومعرفة متى تحتاج إلى التعاون ومتى تحتاج إلى الاستقلالية",
          "حافظ على تواصلك المفتوح والصريح مع الآخرين",
          "تعلم فن الاستماع الفعال لتعزيز علاقاتك",
          "كن حذرًا في تقديم الدعم دون أن تهمل احتياجاتك الشخصية"
        ]
      },
      {
        "minScore": 46,
        "maxScore": 200,
        "title": "متعاطف",
        "alert": "قد تكون عرضة للاستغلال من قبل الآخرين بسبب لطفك الزائد.",
        "description": "درجتك مرتفعة، هذا مؤشر الى أنك تميل إلى أن تكون لطيفًا، متعاونًا، وتقدر علاقاتك مع الآخرين بشكل كبير.",
        "advices": [
          "حافظ على حدودك الشخصية وتعلم قول 'لا' عندما يكون ذلك ضروريًا",
          "اعمل على تعزيز ثقتك بنفسك لتجنب الاستغلال",
          "حاول ممارسة التفكر في التوازن بين احتياجاتك واحتياجات الآخرين",
          "حافظ على علاقات صحية ومتبادلة تقوم على الاحترام المتبادل"
        ]
      }
    ]
  },
  {
    "slug": "social",
    "title": "الاجتماعي",
    "description": "البعد الاجتماعي يقيس عدة جوانب مهمة تتعلق بكيفية تفاعلك مع الآخرين واستجابتك للمواقف الاجتماعية. يتناول هذا الاختبار مدى حبك للتفاعل الاجتماعي وكونك شخصاً اجتماعياً، ويقيم مدى نشاطك وطاقتك في المواقف الاجتماعية. كما يقيم مدى ميلك للبحث عن التحفيز من خلال النشاطات الخارجية، ومدى تعبيرك عن مشاعر البهجة والإيجابية. بالإضافة إلى ذلك، يقيس الاختبار مدى ثقتك بنفسك وراحتك في المواقف الاجتماعية، ومدى استعدادك لتحمل المخاطر والانخراط في مغامرات جديدة. أيضاً يشمل تقييم حاجتك للشعور بالدعم الاجتماعي ووجود شبكة اجتماعية قوية.يعتبر هذا الاختبار أداة مهمة لفهم تأثير انبساطيتك على حياتك اليومية وعلاقاتك الشخصية والمهنية، ويساهم في تطوير استراتيجيات لتعزيز هذه الجوانب لتحقيق رفاهيتك العامة.",
    "questions": [
      {
        "slug": "PeopleAroundMe",
        "order": 1,
        "title": "احب أن يكون حولي الكثير من الناس",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "SmileLaughEasily",
        "order": 2,
        "title": "أٌسر و أضحك بسهولة",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "CarefreeeFree",
        "order": 3,
        "title": "لا أعتبر نفسي خاليا من الهموم",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "EnjoyTalkingOthers",
        "order": 4,
        "title": "أستمتع حقا بالحديث مع الآخرين",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "CenterAttention",
        "order": 5,
        "title": "أحب أن أكون في بؤرة الحدث",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "WorkAlonePreference",
        "order": 6,
        "title": "أفضل عادة القيام بأعمالي وحدي",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "EnergeticActive",
        "order": 7,
        "title": "غالبا ما أشعر بأنني مفعم بالنشاط",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "HappyCheerful",
        "order": 8,
        "title": "أنا شخص سعيد ومبتهج",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "CarefreeNot",
        "order": 9,
        "title": "أنا لست بالمتفائل المبتهج",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "LifePassesQuickly",
        "order": 10,
        "title": "حياتي تمر سريعا",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "VeryActive",
        "order": 11,
        "title": "أنا شخص نشيط جدا",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "LeadSelfPreference",
        "order": 12,
        "title": "افضل أن أقود نفسي على أن أقود الآخرين",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      }
    ],
    "insights": [
      {
        "minScore": 0,
        "maxScore": 29,
        "title": "منطوي / انطوائي",
        "alert": "قد تواجه صعوبة في بناء شبكات اجتماعية قوية، وقد تشعر بالعزلة في بعض الأحيان.",
        "description": "درجتك منخفضة في هذا البعد، هذا يعني إنك تميل إلى أن تكون أكثر انعزالاً واستقلالية، تفضل النشاطات الفردية والهادئة على التجمعات الكبيرة. تشعر بالراحة أكثر في البيئات الهادئة.",
        "advices": [
          "استخدم وقتك الهادئ لتطوير مهاراتك الشخصية والإبداعية",
          "حاول الانخراط في نشاطات اجتماعية صغيرة أو مقابلات فردية لزيادة تفاعلك الاجتماعي بشكل مريح",
          "لا تتردد في طلب الدعم الاجتماعي عند الحاجة",
          "احرص على بناء شبكة دعم اجتماعي من خلال الانضمام إلى نوادي أو مجموعات صغيرة"
        ]
      },
      {
        "minScore": 30,
        "maxScore": 45,
        "title": "متفاعل",
        "alert": "قد تواجه صعوبة في اتخاذ قرار حول الوقت الذي يجب أن تقضيه بمفردك أو في النشاطات الاجتماعية",
        "description": "درجتك متوسطة، هذا يعني إنك تظهر توازناً بين الاستمتاع بالنشاطات الاجتماعية والحاجة إلى الوقت الهادئ. تتفاعل بشكل جيد مع الآخرين، ولكنك أيضًا تستطيع الاستمتاع بأوقاتك الخاصة.",
        "advices": [
          "حافظ على هذا التوازن بين النشاطات الاجتماعية والوقت الهادئ",
          "اعرف متى تحتاج إلى الاسترخاء ومتى يمكنك الانخراط في الأنشطة الاجتماعية",
          "حافظ على علاقاتك الاجتماعية القوية، ولا تنسى تخصيص وقت لنفسك",
          "استمع إلى احتياجاتك العاطفية وكن مرنًا في جدولك"
        ]
      },
      {
        "minScore": 46,
        "maxScore": 200,
        "title": "منبسط / انبساطي",
        "alert": "قد تلاحظ أنك تميل إلى التشتت بسهولة، وتواجه صعوبة في البقاء بمفردك وقد تتعرض للإرهاق الاجتماعي.",
        "description": "درجتك مرتفعة على البُعد الاجتماعي، هذا يعني أنك تميل إلى أن تكون اجتماعيًا للغاية، ممتلئًا بالطاقة، وتبحث عن التحفيز من خلال النشاطات الخارجية. تعبر عن مشاعرك بسهولة وتشعر بالسعادة والبهجة في التجمعات.",
        "advices": [
          "استفد من طاقتك الاجتماعية في بناء علاقات قوية مع الآخرين",
          "حاول تنويع نشاطاتك الاجتماعية لتجنب الشعور بالملل",
          "احتفظ بوقت هادئ لتجديد طاقتك",
          "تعلم كيفية الاسترخاء وقضاء الوقت بمفردك"
        ]
      }
    ]
  },
  {
    "slug": "belonging",
    "title": "الشمولي",
    "description": "هذا البُعد يعتبر من أهم الابعاد في تقييم شخصيتك حيث يقيس مدى تنظيمك، تحملك للمسؤولية، والتزامك بالمواعيد والواجبات. يتضمن هذا البُعد الانضباط الذاتي الذي يعكس قدرتك على تنظيم وقتك وإدارة مهامك بشكل فعال، والاجتهاد الذي يشير إلى التزامك بإنجاز المهام بدقة وفعالية. كما يتناول المسؤولية التي تعبر عن مدى تحملك للمسؤولية والاعتماد عليك في أداء الواجبات، والتفاني الذي يعكس جديتك وتفانيك في العمل والدراسة، وأخيراً التنظيم الذي يظهر قدرتك على الحفاظ على الترتيب والنظام في حياتك. كما أن أهمية قياس البعد الشمولي يكمن في ارتباطه الوثيق بالأداء المهني.",
    "questions": [
      {
        "slug": "KeepThingsOrganized",
        "order": 1,
        "title": "أسعي إلى المحافظة على أن تكون أشيائي مرتبة ونظيفة",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "TimeManagementSkill",
        "order": 2,
        "title": "أنا بارع في إدارة الوقت بحيث يتم إنجاز الأشياء في أوقاتها المحددة",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "NotOrganized",
        "order": 3,
        "title": "أنا لست شخصا منظما بشكل كبير",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ConscientiousDuty",
        "order": 4,
        "title": "أحاول القيام بجميع الأعمال الموكلة إلى بضمير حي",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ClearGoalsSystematic",
        "order": 5,
        "title": "لدي مجموعة واضحة من الأهداف و أعمل على تحقيقها بأسلوب منتظم",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "WasteTimeProcrastination",
        "order": 6,
        "title": "أهدر الكثير من الوقت قبل البدء بتنفيذ العمل",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "HardWorkAchievement",
        "order": 7,
        "title": "أعمل بجد واجتهاد لتحقيق أهدافي",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "CommitmentCompletion",
        "order": 8,
        "title": "عندما ألتزم القيام بعمل ما فإنني أحرص على إنجازه",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "UnreliableInconsistent",
        "order": 9,
        "title": "أظـهر احيانا بأنه لا يعتمد على ولست ثابتا كما يجب أن أكون",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ProductivePerson",
        "order": 10,
        "title": "أنا شخص منتج أحب دائما إنجاز الأعمال",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "NeverOrganized",
        "order": 11,
        "title": "يبدو أنني لا أستطيع أبدا أن أكون منظما",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "StriveExcellence",
        "order": 12,
        "title": "أكافح من أجل أن أكون متميزا في أي عمل",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      }
    ],
    "insights": [
      {
        "minScore": 0,
        "maxScore": 29,
        "title": "متهاون",
        "alert": "قد تواجه صعوبة في الالتزام بالمواعيد والواجبات، وقد يكون لديك فوضى في إدارة المهام.",
        "description": "درجتك منخفضة، هذا يعني انك تميل إلى أن تكون أكثر تلقائية وغير ملتزم بالروتين. تفضل العمل بحرية وتجنب الالتزام بالخطط الصارمة.",
        "advices": [
          "اعمل على تنظيم جدولك اليومي وتحديد مهام محددة لإنجازها",
          "حاول تطوير عادات تنظيمية تساعدك في التزامك بالمسؤوليات",
          "اعتمد على أدوات تنظيمية مثل الجداول الزمنية والقوائم لتحسين إدارة وقتك",
          "احرص على تحديد أهداف قصيرة الأجل لتحقيق تقدم ملموس ومستمر"
        ]
      },
      {
        "minScore": 30,
        "maxScore": 45,
        "title": "مجتهد / مثابر",
        "alert": "قد تواجه صعوبة في تحديد أولويات المهام أو الالتزام الكامل بالواجبات في بعض الأحيان.",
        "description": "درجتك متوسطة، أنت تظهر توازنًا بين التنظيم والمرونة. تتعامل مع المسؤوليات بشكل جيد ولكنك تستطيع التكيف مع التغييرات.",
        "advices": [
          "اعمل على تطوير مهارات تحديد الأولويات لديك",
          "استمر في ممارسة التنظيم لإبقاء أمورك تحت السيطرة",
          "كن مرنًا وتقبل التغييرات والتحديات الجديدة",
          "استمر في تحسين قدرتك على إدارة الوقت لتحقيق أهدافك بشكل أفضل"
        ]
      },
      {
        "minScore": 46,
        "maxScore": 200,
        "title": "متفاني / منضبط / انضباطي",
        "alert": "درجتك مرتفعة، أنت تميل إلى أن تكون منظمًا للغاية، مسؤولًا، وتلتزم بالمواعيد والواجبات. تهتم بإنجاز المهام بدقة وفعالية.",
        "description": "درجتك مرتفعة، أنت تميل إلى أن تكون منظمًا للغاية، مسؤولًا، وتلتزم بالمواعيد والواجبات. تهتم بإنجاز المهام بدقة وفعالية.",
        "advices": [
          "حاول تقسيم مهامك الكبيرة إلى مهام صغيرة يمكن إنجازها بسهولة",
          "احرص على تحديد أوقات للاسترخاء والراحة لتجنب الإرهاق",
          "تعلم كيفية التفويض والتعاون مع الآخرين لتخفيف الأعباء",
          "حافظ على توازن بين العمل والحياة الشخصية لضمان رفاهيتك"
        ]
      }
    ]
  },
  {
    "slug": "physical",
    "title": "البدني",
    "description": "يركز هذا البعد على تقييم النشاط البدني، المؤشرات الوقائية، الحالة الصحية الذاتية، ونمط الحياة الغذائي لتحديد مستوى اللياقة والصحة العامة.",
    "questions": [
      {
        "slug": "SedentaryWork",
        "order": 1,
        "title": "هل يتضمن عملك في الغالب الجلوس أو الوقوف مع مشي لا يتجاوز ساعتين يوميًا؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "دائمًا"
          },
          {
            "value": 2,
            "title": "غالبًا"
          },
          {
            "value": 3,
            "title": "أحيانًا"
          },
          {
            "value": 4,
            "title": "نادرًا"
          }
        ]
      },
      {
        "slug": "VigorousActivityDays",
        "order": 2,
        "title": "كم عدد الأيام التي تمارس فيها أنشطة بدنية عالية الشدة ضمن عملك؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "0-1 يوم"
          },
          {
            "value": 2,
            "title": "2-3 أيام"
          },
          {
            "value": 3,
            "title": "4-5 أيام"
          },
          {
            "value": 4,
            "title": "6-7 أيام"
          }
        ]
      },
      {
        "slug": "VigorousActivityDuration",
        "order": 3,
        "title": "في تلك الأيام، ما متوسط المدة اليومية؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "أقل من 30 دقيقة"
          },
          {
            "value": 2,
            "title": "30-60 دقيقة"
          },
          {
            "value": 3,
            "title": "أكثر من 60 دقيقة"
          },
          {
            "value": 4,
            "title": "أكثر من 90 دقيقة"
          }
        ]
      },
      {
        "slug": "VehicleUseDays",
        "order": 4,
        "title": "كم عدد الأيام التي تستخدم فيها مركبة آلية للتنقل؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "6-7 أيام"
          },
          {
            "value": 2,
            "title": "4-5 أيام"
          },
          {
            "value": 3,
            "title": "2-3 أيام"
          },
          {
            "value": 4,
            "title": "0-1 يوم"
          }
        ]
      },
      {
        "slug": "VehicleDuration",
        "order": 5,
        "title": "في أيام التنقل، ما متوسط الوقت اليومي داخل المركبة؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "أكثر من 60 دقيقة"
          },
          {
            "value": 2,
            "title": "30-60 دقيقة"
          },
          {
            "value": 3,
            "title": "أقل من 30 دقيقة"
          },
          {
            "value": 4,
            "title": "أقل من 15 دقيقة"
          }
        ]
      },
      {
        "slug": "ModerateActivityDays",
        "order": 6,
        "title": "كم عدد الأيام التي تمارس فيها نشاطًا متوسط الشدة؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "0-1 يوم"
          },
          {
            "value": 2,
            "title": "2-3 أيام"
          },
          {
            "value": 3,
            "title": "4-5 أيام"
          },
          {
            "value": 4,
            "title": "6-7 أيام"
          }
        ]
      },
      {
        "slug": "ModerateActivityDuration",
        "order": 7,
        "title": "في تلك الأيام، ما متوسط المدة اليومية؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "أقل من 30 دقيقة"
          },
          {
            "value": 2,
            "title": "30-60 دقيقة"
          },
          {
            "value": 3,
            "title": "أكثر من 60 دقيقة"
          },
          {
            "value": 4,
            "title": "أكثر من 90 دقيقة"
          }
        ]
      },
      {
        "slug": "StrengthTrainingDays",
        "order": 8,
        "title": "كم عدد الأيام أسبوعيًا التي تمارس فيها تمارين مقاومة؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "0 يوم"
          },
          {
            "value": 2,
            "title": "1-2 أيام"
          },
          {
            "value": 3,
            "title": "3-4 أيام"
          },
          {
            "value": 4,
            "title": "5 أيام أو أكثر"
          }
        ]
      },
      {
        "slug": "WalkingDays",
        "order": 9,
        "title": "كم عدد الأيام التي تمشي فيها 10 دقائق متواصلة؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "0-1 يوم"
          },
          {
            "value": 2,
            "title": "2-3 أيام"
          },
          {
            "value": 3,
            "title": "4-5 أيام"
          },
          {
            "value": 4,
            "title": "6-7 أيام"
          }
        ]
      },
      {
        "slug": "WalkingDuration",
        "order": 10,
        "title": "في أيام المشي، ما متوسط الوقت اليومي؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "أقل من 30 دقيقة"
          },
          {
            "value": 2,
            "title": "30-60 دقيقة"
          },
          {
            "value": 3,
            "title": "أكثر من 60 دقيقة"
          },
          {
            "value": 4,
            "title": "أكثر من 90 دقيقة"
          }
        ]
      },
      {
        "slug": "SittingHours",
        "order": 11,
        "title": "كم عدد الساعات التي تقضيها جالسًا يوميًا؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "10 ساعات أو أكثر"
          },
          {
            "value": 2,
            "title": "7-9 ساعات"
          },
          {
            "value": 3,
            "title": "4-6 ساعات"
          },
          {
            "value": 4,
            "title": "أقل من 4 ساعات"
          }
        ]
      },
      {
        "slug": "BloodPressureCheck",
        "order": 12,
        "title": "كم مرة تقيس ضغط دمك؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "أبدًا"
          },
          {
            "value": 2,
            "title": "سنويًا"
          },
          {
            "value": 3,
            "title": "ربع سنويًا"
          },
          {
            "value": 4,
            "title": "شهريًا"
          }
        ]
      },
      {
        "slug": "CholesterolCheck",
        "order": 13,
        "title": "هل تم فحص مستويات الكوليسترول لديك؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "لا"
          },
          {
            "value": 4,
            "title": "نعم"
          }
        ]
      },
      {
        "slug": "BloodSugarCheck",
        "order": 14,
        "title": "هل تم فحص سكر الدم لديك؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "لا"
          },
          {
            "value": 4,
            "title": "نعم"
          }
        ]
      },
      {
        "slug": "FitnessLevel",
        "order": 15,
        "title": "كيف تقيم مستوى لياقتك البدنية؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "ضعيف جدًا"
          },
          {
            "value": 2,
            "title": "ضعيف"
          },
          {
            "value": 3,
            "title": "جيد"
          },
          {
            "value": 4,
            "title": "ممتاز"
          }
        ]
      },
      {
        "slug": "ChronicPain",
        "order": 16,
        "title": "هل تعاني من ألم مزمن يحد من أنشطتك؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "دائمًا"
          },
          {
            "value": 2,
            "title": "أحيانًا"
          },
          {
            "value": 3,
            "title": "نادرًا"
          },
          {
            "value": 4,
            "title": "أبدًا"
          }
        ]
      },
      {
        "slug": "SleepDuration",
        "order": 18,
        "title": "ما متوسط مدة نومك الليلي؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "أقل من 5 ساعات"
          },
          {
            "value": 2,
            "title": "5-6 ساعات"
          },
          {
            "value": 3,
            "title": "7-8 ساعات"
          },
          {
            "value": 4,
            "title": "9 ساعات أو أكثر"
          }
        ]
      },
      {
        "slug": "FruitVegetableIntake",
        "order": 19,
        "title": "كم عدد حصص الفواكه والخضروات يوميًا؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "0"
          },
          {
            "value": 2,
            "title": "1-2"
          },
          {
            "value": 3,
            "title": "3-4"
          },
          {
            "value": 4,
            "title": "5 أو أكثر"
          }
        ]
      },
      {
        "slug": "TobaccoUse",
        "order": 20,
        "title": "هل تستخدم منتجات تبغ؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "نعم يوميًا"
          },
          {
            "value": 2,
            "title": "نعم أحيانًا"
          },
          {
            "value": 3,
            "title": "نادرًا"
          },
          {
            "value": 4,
            "title": "لا"
          }
        ]
      },
      {
        "slug": "FastFoodFrequency",
        "order": 21,
        "title": "كم مرة تتناول الوجبات السريعة؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "يوميًا"
          },
          {
            "value": 2,
            "title": "أسبوعيًا"
          },
          {
            "value": 3,
            "title": "نادرًا"
          },
          {
            "value": 4,
            "title": "أبدًا"
          }
        ]
      },
      {
        "slug": "WaterIntake",
        "order": 22,
        "title": "كم عدد أكواب الماء يوميًا؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "أقل من 4"
          },
          {
            "value": 2,
            "title": "4-6"
          },
          {
            "value": 3,
            "title": "7-8"
          },
          {
            "value": 4,
            "title": "أكثر من 8"
          }
        ]
      },
      {
        "slug": "HighFatFoodPreference",
        "order": 23,
        "title": "هل تميل إلى الأطعمة عالية الدهون؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "عالية دائمًا"
          },
          {
            "value": 2,
            "title": "غالبًا عالية"
          },
          {
            "value": 3,
            "title": "غالبًا منخفضة"
          },
          {
            "value": 4,
            "title": "منخفضة دائمًا"
          }
        ]
      },
      {
        "slug": "HighSaltFoodPreference",
        "order": 24,
        "title": "هل تميل إلى الأطعمة عالية الملح؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "عالية دائمًا"
          },
          {
            "value": 2,
            "title": "غالبًا عالية"
          },
          {
            "value": 3,
            "title": "غالبًا منخفضة"
          },
          {
            "value": 4,
            "title": "منخفضة دائمًا"
          }
        ]
      }
    ],
    "insights": [
      {
        "minScore": 0,
        "maxScore": 48,
        "title": "صحة بدنية ضعيفة",
        "alert": "قد تكون عرضة لمخاطر صحية مزمنة مثل أمراض القلب والسكري وارتفاع ضغط الدم بسبب قلة النشاط البدني وعادات التغذية غير الصحية.",
        "description": "درجتك منخفضة، مما يشير إلى نمط حياة خامل مع نشاط بدني محدود وعادات تغذية تحتاج إلى تحسين. قد تقضي ساعات طويلة جالسًا دون حركة كافية، وقد يكون نظامك الغذائي يفتقر إلى العناصر الأساسية.",
        "advices": [
          "ابدأ بممارسة المشي لمدة 15-30 دقيقة يوميًا وزد المدة تدريجيًا",
          "أضف الفواكه والخضروات إلى وجباتك اليومية وقلل من الأطعمة المصنعة والوجبات السريعة",
          "احرص على الفحوصات الطبية الدورية لمراقبة ضغط الدم والسكر والكوليسترول",
          "خصص أوقاتًا للنهوض والتحرك كل ساعة إذا كان عملك يتطلب الجلوس لفترات طويلة",
          "احرص على شرب كميات كافية من الماء (8 أكواب على الأقل يوميًا) وتحسين جودة نومك"
        ]
      },
      {
        "minScore": 49,
        "maxScore": 72,
        "title": "صحة بدنية متوسطة",
        "alert": "قد تحتاج إلى تحسين بعض عاداتك الصحية لتجنب التراجع التدريجي في لياقتك البدنية وصحتك العامة.",
        "description": "درجتك متوسطة، مما يعني أنك تمارس بعض العادات الصحية الجيدة ولكن هناك مجال واضح للتحسين. قد تمارس النشاط البدني بشكل غير منتظم أو تتبع نظامًا غذائيًا متوسط الجودة.",
        "advices": [
          "حافظ على ممارسة النشاط البدني المعتدل 150 دقيقة أسبوعيًا على الأقل مع إضافة تمارين تقوية العضلات",
          "حسّن نظامك الغذائي بزيادة تنوع الخضروات والفواكه وتقليل الأملاح والدهون المشبعة",
          "التزم بجدول نوم منتظم واحصل على 7-8 ساعات نوم يوميًا",
          "قلل من وقت الجلوس واستخدم التنقل النشط مثل المشي أو ركوب الدراجة كلما أمكن"
        ]
      },
      {
        "minScore": 73,
        "maxScore": 200,
        "title": "صحة بدنية جيدة",
        "alert": "قد تُبالغ أحيانًا في النشاط البدني دون راحة كافية، احرص على التعافي المناسب بين التمارين المكثفة.",
        "description": "درجتك مرتفعة، مما يشير إلى أنك تتبع نمط حياة نشط وصحي. تمارس الرياضة بانتظام، وتهتم بتغذيتك، وتحرص على الفحوصات الطبية الدورية.",
        "advices": [
          "استمر في المحافظة على عاداتك الصحية الممتازة وتنويع أنشطتك البدنية",
          "شارك تجربتك الصحية مع المحيطين بك لتحفيزهم على تبني نمط حياة أكثر صحة",
          "احرص على التعافي الكافي والراحة بين التمارين لتجنب الإصابات",
          "تابع فحوصاتك الطبية الدورية للحفاظ على مستوى صحتك المتميز"
        ]
      }
    ]
  },
  {
    "slug": "financial",
    "title": "المالي",
    "description": "يركز هذا البعد على تقييم مستوى الضغط المالي، الرضا عن الوضع المالي، القدرة على تغطية النفقات، الاستعداد للطوارئ، وعبء القروض والديون، والاستعداد المالي للتقاعد، والعادات المالية مثل التخطيط والوعي بالمصاريف. يساعد هذا التقييم في فهم مدى الاستقرار المالي الحالي وتحديد نقاط القوة والضعف في إدارة الموارد المالية.",
    "questions": [
      {
        "slug": "FinancialStressFeeling",
        "order": 1,
        "title": "ما هو شعورك تجاه الضغط المالي الحالي لديك؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "ضغط هائل"
          },
          {
            "value": 2,
            "title": "ضغط متوسط"
          },
          {
            "value": 3,
            "title": "ضغط خفيف"
          },
          {
            "value": 4,
            "title": "لا يوجد ضغط"
          }
        ]
      },
      {
        "slug": "FinancialSatisfaction",
        "order": 2,
        "title": "ما هو مستوى رضاك عن وضعك المالي الحالي؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "غير راضٍ تمامًا"
          },
          {
            "value": 2,
            "title": "غير راضٍ"
          },
          {
            "value": 3,
            "title": "راضٍ"
          },
          {
            "value": 4,
            "title": "راضٍ تمامًا"
          }
        ]
      },
      {
        "slug": "MonthlyExpenseWorry",
        "order": 3,
        "title": "كم مرة تقلق بشأن تغطية النفقات الشهرية؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "دائمًا"
          },
          {
            "value": 2,
            "title": "أحيانًا"
          },
          {
            "value": 3,
            "title": "نادرًا"
          },
          {
            "value": 4,
            "title": "أبدًا"
          }
        ]
      },
      {
        "slug": "EmergencyConfidence",
        "order": 4,
        "title": "كم ثقتك في التعامل مع طوارئ مالية بقيمة 5,000 ريال؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "غير واثق"
          },
          {
            "value": 2,
            "title": "ثقة قليلة"
          },
          {
            "value": 3,
            "title": "واثق"
          },
          {
            "value": 4,
            "title": "واثق جدًا"
          }
        ]
      },
      {
        "slug": "PaycheckToPaycheck",
        "order": 5,
        "title": "إلى أي مدى تعيش في ضيق مالي وصعوبة في تغطية نفقاتك حتى الراتب التالي؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "دائمًا"
          },
          {
            "value": 2,
            "title": "أحيانًا"
          },
          {
            "value": 3,
            "title": "نادرًا"
          },
          {
            "value": 4,
            "title": "أبدًا"
          }
        ]
      },
      {
        "slug": "GeneralFinancialStress",
        "order": 6,
        "title": "كم الضغط المالي العام لديك؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "ضغط هائل"
          },
          {
            "value": 2,
            "title": "ضغط متوسط"
          },
          {
            "value": 3,
            "title": "ضغط خفيف"
          },
          {
            "value": 4,
            "title": "لا يوجد ضغط"
          }
        ]
      },
      {
        "slug": "MeetFinancialObligations",
        "order": 7,
        "title": "أستطيع الوفاء بجميع التزاماتي المالية مثل الفواتير",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "غير صحيح على الإطلاق"
          },
          {
            "value": 2,
            "title": "غير صحيح"
          },
          {
            "value": 3,
            "title": "صحيح"
          },
          {
            "value": 4,
            "title": "صحيح تمامًا"
          }
        ]
      },
      {
        "slug": "IncomeExceedsExpenses",
        "order": 8,
        "title": "دخلي يتجاوز نفقاتي",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "غير صحيح على الإطلاق"
          },
          {
            "value": 2,
            "title": "غير صحيح"
          },
          {
            "value": 3,
            "title": "صحيح"
          },
          {
            "value": 4,
            "title": "صحيح تمامًا"
          }
        ]
      },
      {
        "slug": "DailySpendingAwareness",
        "order": 9,
        "title": "أعرف بدقة كم أنفق يوميًا",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "غير صحيح على الإطلاق"
          },
          {
            "value": 2,
            "title": "غير صحيح"
          },
          {
            "value": 3,
            "title": "صحيح"
          },
          {
            "value": 4,
            "title": "صحيح تمامًا"
          }
        ]
      },
      {
        "slug": "LongTermGoals",
        "order": 10,
        "title": "أضع أهدافًا مالية طويلة الأجل",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "غير صحيح على الإطلاق"
          },
          {
            "value": 2,
            "title": "غير صحيح"
          },
          {
            "value": 3,
            "title": "صحيح"
          },
          {
            "value": 4,
            "title": "صحيح تمامًا"
          }
        ]
      },
      {
        "slug": "EmergencyFund",
        "order": 11,
        "title": "لدي صندوق طوارئ",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "غير صحيح على الإطلاق"
          },
          {
            "value": 2,
            "title": "غير صحيح"
          },
          {
            "value": 3,
            "title": "صحيح"
          },
          {
            "value": 4,
            "title": "صحيح تمامًا"
          }
        ]
      },
      {
        "slug": "SeekFinancialAdvice",
        "order": 12,
        "title": "أطلب نصيحة مالية من مصادر موثوقة",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "أبدًا"
          },
          {
            "value": 2,
            "title": "أحيانًا"
          },
          {
            "value": 3,
            "title": "غالبًا"
          },
          {
            "value": 4,
            "title": "دائمًا"
          }
        ]
      },
      {
        "slug": "DebtBurden",
        "order": 13,
        "title": "ما مدى الضغط الذي تسببه أقساط القروض والديون على ميزانيتك الشهرية؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "ضغط هائل"
          },
          {
            "value": 2,
            "title": "ضغط متوسط"
          },
          {
            "value": 3,
            "title": "ضغط خفيف"
          },
          {
            "value": 4,
            "title": "لا يوجد ضغط / لا توجد ديون"
          }
        ]
      },
      {
        "slug": "RetirementReadiness",
        "order": 14,
        "title": "إلى أي مدى تشعر بالاطمئنان تجاه استعدادك المالي للتقاعد ومستقبلك على المدى البعيد؟",
        "reversed": false,
        "answers": [
          {
            "value": 1,
            "title": "غير مستعد إطلاقًا"
          },
          {
            "value": 2,
            "title": "استعداد ضعيف"
          },
          {
            "value": 3,
            "title": "مستعد إلى حد جيد"
          },
          {
            "value": 4,
            "title": "مستعد تمامًا"
          }
        ]
      }
    ],
    "insights": [
      {
        "minScore": 0,
        "maxScore": 28,
        "title": "صحة مالية ضعيفة",
        "alert": "قد تكون عرضة لضغط مالي مزمن يؤثر سلبًا على صحتك النفسية وجودة حياتك بشكل عام، خصوصًا مع عبء القروض وضعف الاستعداد للتقاعد.",
        "description": "درجتك منخفضة، مما يشير إلى وجود ضغوط مالية كبيرة مع صعوبة في تغطية النفقات الشهرية وغياب التخطيط المالي طويل الأجل. قد تعيش من راتب إلى راتب وتفتقر إلى صندوق طوارئ، وقد تثقلك أقساط القروض دون خطة واضحة للتقاعد.",
        "advices": [
          "ابدأ بتتبع مصروفاتك اليومية لمعرفة أين تذهب أموالك وتحديد النفقات غير الضرورية",
          "ضع ميزانية شهرية بسيطة والتزم بها مع تخصيص ولو مبلغ صغير للادخار",
          "اسعَ لبناء صندوق طوارئ يغطي مصاريف 3-6 أشهر بشكل تدريجي",
          "استشر مختصًا ماليًا أو استفد من الدورات المجانية في التخطيط المالي لتحسين وعيك المالي",
          "راجع ديونك والتزاماتك المالية وابدأ بسداد الأعلى فائدة أولًا",
          "ابدأ ولو بمبلغ بسيط في الادخار أو الاستثمار للتقاعد مبكرًا، فالوقت أهم عامل في بناء مدخرات المستقبل"
        ]
      },
      {
        "minScore": 29,
        "maxScore": 42,
        "title": "صحة مالية متوسطة",
        "alert": "قد تكون قادرًا على تغطية نفقاتك الحالية لكنك تفتقر إلى خطة مالية متينة لمواجهة الطوارئ أو سداد القروض أو تحقيق أهداف التقاعد.",
        "description": "درجتك متوسطة، مما يعني أنك تتعامل مع شؤونك المالية بشكل مقبول ولكن هناك مجال للتحسين. قد تشعر ببعض القلق المالي أحيانًا وتحتاج إلى تعزيز عادات الادخار والتخطيط، وإلى رؤية أوضح لإدارة القروض والاستعداد للتقاعد.",
        "advices": [
          "طوّر خطة مالية واضحة تتضمن أهدافًا قصيرة ومتوسطة وطويلة الأجل",
          "زد نسبة ادخارك تدريجيًا لتصل إلى 20% من دخلك الشهري",
          "تعلّم أساسيات الاستثمار لتنمية مدخراتك بدلاً من إبقائها في حساب جاري",
          "راجع اشتراكاتك والتزاماتك الشهرية بانتظام وألغِ ما لا تحتاجه",
          "ضع خطة منظمة لسداد القروض، وخصّص نسبة ثابتة من دخلك لحساب أو وعاء ادخاري خاص بالتقاعد"
        ]
      },
      {
        "minScore": 43,
        "maxScore": 200,
        "title": "صحة مالية جيدة",
        "alert": "قد تميل أحيانًا إلى الإفراط في الحرص المالي على حساب الاستمتاع بالحاضر. حافظ على التوازن بين الادخار والإنفاق على ما يُسعدك.",
        "description": "درجتك مرتفعة، مما يشير إلى وضع مالي مستقر مع مستوى منخفض من الضغط المالي. تتمتع بقدرة جيدة على إدارة أموالك والتخطيط للمستقبل والتعامل مع الطوارئ المالية.",
        "advices": [
          "استمر في عاداتك المالية الصحية وشارك خبراتك مع أفراد عائلتك",
          "نوّع استثماراتك لحماية ثروتك من المخاطر وتحقيق نمو مستدام",
          "خصص جزءًا من مواردك للتبرع والمسؤولية الاجتماعية لتعزيز الرضا الشخصي",
          "راجع خطتك المالية دوريًا وعدّلها بما يتوافق مع تغيرات حياتك وأهدافك"
        ]
      }
    ]
  },
  {
    "slug": "workplace",
    "title": "بيئة العمل والانتماء",
    "description": "يقيس هذا البعد علاقة الموظف بمنظمته وتجربته الوظيفية: مدى حماسه وانخراطه في عمله، ورضاه الوظيفي، وعلاقته بمديره وشعوره بالأمان في التعبير عن رأيه، ومدى التقدير الذي يلمسه، ووضوح فرص نموه، والمعنى والرسالة التي يجدها في عمله وإحساسه بأن لعمله هدفًا أكبر، وقوة انتمائه وشعوره بالشمول والإنصاف، وخلوّ بيئته من التنمّر والمضايقة. وهو الجانب الذي تستطيع المنظمة التأثير فيه مباشرة، ويرتبط بقوة بالاستبقاء والإنتاجية والولاء.",
    "questions": [
      {
        "slug": "WorkEnthusiasm",
        "order": 1,
        "title": "أشعر بالحماس تجاه العمل الذي أقوم به",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ImmersionFlow",
        "order": 2,
        "title": "أنغمس في مهامي حتى يمرّ وقت العمل بسرعة",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "TurnoverIntention",
        "order": 3,
        "title": "كثيرًا ما أفكّر في ترك هذه المنظمة",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "JobSatisfaction",
        "order": 4,
        "title": "أنا راضٍ عن عملي بشكل عام",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "MorningMotivation",
        "order": 5,
        "title": "أبدأ معظم أيام العمل وأنا متحفّز ومتطلّع لها",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ManagerSupport",
        "order": 6,
        "title": "يدعمني مديري المباشر ويهتم بتطوّري",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "SpeakUpSafety",
        "order": 7,
        "title": "أستطيع التعبير عن رأيي بصراحة دون خوف من عواقب سلبية",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "IdeaFearHesitation",
        "order": 8,
        "title": "أتردّد في طرح أفكاري الجديدة خوفًا من الانتقاد",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "EffortRecognized",
        "order": 9,
        "title": "أشعر بأن جهدي يُلاحَظ ويُقدَّر في العمل",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "FairRecognition",
        "order": 10,
        "title": "أحصل على تقدير عادل مقابل ما أقدّمه",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "GrowthOpportunities",
        "order": 11,
        "title": "تتاح لي فرص حقيقية للتعلّم والتطوّر المهني",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "CareerPathClarity",
        "order": 12,
        "title": "أرى مسارًا واضحًا لتقدّمي الوظيفي في هذه المنظمة",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "WorkMeaning",
        "order": 13,
        "title": "أجد معنى وقيمة في العمل الذي أؤديه",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ContributionToGoals",
        "order": 14,
        "title": "أفهم كيف يسهم عملي في تحقيق أهداف المنظمة الأكبر",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "TeamBelonging",
        "order": 15,
        "title": "أشعر بأنني جزء أصيل من فريقي ومنظمتي",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "RespectInclusion",
        "order": 16,
        "title": "أُعامَل باحترام وإنصاف بغضّ النظر عن خلفيتي",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "FeelLikeOutsider",
        "order": 17,
        "title": "أشعر أحيانًا بأنني غريب عن فريقي",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "ProudRecommend",
        "order": 18,
        "title": "أفتخر بعملي في هذه المنظمة وأوصي بها أصدقائي",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "PurposeMission",
        "order": 19,
        "title": "تجعلني رسالة المنظمة وأهدافها أشعر بأن عملي مهم وذو قيمة",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "WorkplaceBullying",
        "order": 20,
        "title": "أتعرّض للتنمّر أو المضايقة أو المعاملة المهينة في عملي",
        "reversed": true,
        "answers": [
          {
            "value": 1,
            "title": "موافق بشدة"
          },
          {
            "value": 2,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 4,
            "title": "غير موافق"
          },
          {
            "value": 5,
            "title": "غير موافق بشدة"
          }
        ]
      },
      {
        "slug": "BullyingHandling",
        "order": 21,
        "title": "أثق بأن منظمتي تتعامل بجدية وإنصاف مع أي حالة تنمّر أو مضايقة",
        "reversed": false,
        "answers": [
          {
            "value": 5,
            "title": "موافق بشدة"
          },
          {
            "value": 4,
            "title": "موافق"
          },
          {
            "value": 3,
            "title": "محايد"
          },
          {
            "value": 2,
            "title": "غير موافق"
          },
          {
            "value": 1,
            "title": "غير موافق بشدة"
          }
        ]
      }
    ],
    "insights": [
      {
        "minScore": 0,
        "maxScore": 61,
        "title": "ضعيف الارتباط",
        "alert": "قد يكون الموظف منسحبًا أو معرّضًا لخطر ترك العمل، مع ضعف في الشعور بالتقدير والانتماء والأمان في التعبير عن الرأي، وقد يكون عرضة للتنمّر أو غياب الإحساس بهدف أكبر لعمله.",
        "description": "درجتك منخفضة؛ قد لا تشعر بارتباط قوي بعملك أو منظمتك حاليًا، وربما تفتقد التقدير أو وضوح مسار النمو أو الأمان في إبداء رأيك أو الإحساس بأن لعملك رسالة وهدفًا أكبر. وقد تكون قد تعرّضت لمضايقة أو تنمّر يضعف ارتباطك. غالبًا ما يكون هذا انعكاسًا لبيئة العمل أكثر منه أمرًا شخصيًا فيك.",
        "advices": [
          "تحدّث بصراحة مع مديرك حول ما يساعدك على الشعور بمزيد من التقدير والدعم",
          "حدّد جانبًا واحدًا من عملك يمنحك معنى أو حماسًا وابنِ عليه تدريجيًا",
          "اطلب أهدافًا واضحة وتغذية راجعة دورية لتتمكن من تلمّس تقدّمك",
          "استكشف فرص التعلّم المتاحة وشارك اهتمامك بالتطوّر مع إدارتك",
          "إذا تعرّضت لأي تنمّر أو مضايقة، فوثّق ما يحدث ولا تتردّد في اللجوء إلى الموارد البشرية أو قناة موثوقة داخل المنظمة"
        ]
      },
      {
        "minScore": 62,
        "maxScore": 82,
        "title": "ارتباط متوسط",
        "alert": "ارتباط مقبول لكنه هشّ؛ قد يتذبذب مع ضغوط العمل أو غياب التقدير ووضوح النمو.",
        "description": "درجتك متوسطة؛ لديك ارتباط جيد بعملك في عدة جوانب، مع فرص واضحة لتعميق شعورك بالتقدير أو النمو أو الانتماء حتى يصبح ارتباطك أكثر رسوخًا.",
        "advices": [
          "حافظ على ما يمنحك حماسًا، وحدّد ما ينقصه ليصبح أقوى",
          "اطلب مهامًا تتيح لك التعلّم وتوسيع أثرك في العمل",
          "عزّز علاقاتك داخل الفريق من خلال المشاركة والمبادرة",
          "شارك أفكارك بثقة؛ فرأيك يصنع فرقًا في بيئة عملك"
        ]
      },
      {
        "minScore": 83,
        "maxScore": 200,
        "title": "مرتبط ومنتمٍ",
        "alert": "موظف مرتبط ومنتمٍ؛ أصل ثمين وسفير محتمل للمنظمة — يستحق الحفاظ على ارتباطه وتغذيته.",
        "description": "درجتك مرتفعة؛ تشعر بحماس وانتماء وتقدير، ولديك وضوح في مسارك ومعنى في عملك. هذه حالة رائعة تستحق الحفاظ عليها وتنميتها.",
        "advices": [
          "كن سفيرًا لثقافة فريقك وادعم زملاءك الجدد في الاندماج",
          "شارك ما يحفّزك مع إدارتك ليُعمَّم على بقية الفريق",
          "استثمر طاقتك في مشاريع ذات أثر ومعنى أكبر",
          "حافظ على توازنك بين العمل والحياة حتى يدوم حماسك على المدى الطويل"
        ]
      }
    ]
  }
];
