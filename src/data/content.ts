import type { DimensionId } from "./dimensions";

/* Deliverable 4: relevant online content matched to the employee's results. */

export type ContentType = "video" | "audio" | "article";

export interface ContentSource {
  name: string;
  url: string;
  license: string;
  language?: string;
}

export interface ContentMedia {
  url: string;
  mimeType: "video/webm" | "audio/ogg";
  poster?: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  author: string;
  dimension: DimensionId;
  /** "8 د" for minutes, "12 د قراءة" etc. */
  duration: string;
  description: string;
  takeaways: string[];
  media?: ContentMedia;
  source?: ContentSource;
  article?: ArticleSection[];
  featured?: boolean;
}

export const contentTypeLabels: Record<ContentType, string> = {
  video: "فيديو",
  audio: "صوتي",
  article: "مقال",
};

export const content: ContentItem[] = [
  {
    id: "c1",
    type: "video",
    title: "7 علامات للاحتراق قد لا تنتبه لها",
    author: "Psych2Go",
    dimension: "professional",
    duration: "6 د",
    description:
      "فيديو توعوي يساعدك على ملاحظة إشارات الإرهاق العاطفي والجسدي قبل أن تتراكم.",
    takeaways: [
      "فرّق بين الكسل العابر والإنهاك المزمن",
      "راقب الانفصال عن العمل وفقدان الحماس",
      "اطلب دعمًا مهنيًا عندما تؤثر الأعراض في حياتك",
    ],
    media: {
      url: "https://upload.wikimedia.org/wikipedia/commons/5/57/7_Signs_You%27re_Burnt_Out_But_Don%27t_Realize_It.webm",
      mimeType: "video/webm",
      poster:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/7_Signs_You%27re_Burnt_Out_But_Don%27t_Realize_It.webm/960px--7_Signs_You%27re_Burnt_Out_But_Don%27t_Realize_It.webm.jpg",
    },
    source: {
      name: "Psych2Go عبر Wikimedia Commons",
      url: "https://commons.wikimedia.org/wiki/File:7_Signs_You%27re_Burnt_Out_But_Don%27t_Realize_It.webm",
      license: "CC BY 3.0",
      language: "الصوت بالإنجليزية",
    },
    featured: true,
  },
  {
    id: "c2",
    type: "audio",
    title: "تأمل موسيقي لتهدئة العقل",
    author: "ميشا إلمان وجوزيف بونيم",
    dimension: "psycho",
    duration: "4:27 د",
    description:
      "تسجيل موسيقي هادئ لمقطوعة Méditation من أوبرا Thaïs، مناسب لاستراحة قصيرة بين المهام.",
    takeaways: [
      "اجلس في وضع مريح وأبعد المشتتات",
      "دع تنفسك يبطؤ من دون محاولة التحكم فيه",
      "اعد إلى مهمتك بخطوة واحدة واضحة",
    ],
    media: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/07/Elman_74341_NR.ogg",
      mimeType: "audio/ogg",
    },
    source: {
      name: "Internet Archive عبر Wikimedia Commons",
      url: "https://commons.wikimedia.org/wiki/File:Elman_74341_NR.ogg",
      license: "ملكية عامة",
      language: "موسيقى بلا كلمات",
    },
  },
  {
    id: "c3",
    type: "article",
    title: "عادات مالية صغيرة تصنع فرقًا كبيرًا",
    author: "فريق cura",
    dimension: "financial",
    duration: "6 د قراءة",
    description:
      "خطة واضحة لتحويل الوعي المالي إلى عادات يومية خفيفة لا تحتاج إلى ميزانية معقّدة.",
    takeaways: [
      "ابدأ برقم يمكنك الاستمرار عليه",
      "افصل الادخار قبل الإنفاق",
      "راجع مصروفاتك دون لوم",
    ],
    article: [
      {
        heading: "ابدأ بادخار صغير وآلي",
        paragraphs: [
          "اختر نسبة صغيرة من الدخل تشعر أنها مريحة، حتى لو كانت 1٪. المهم أن تتحول إلى تحويل تلقائي يحدث فور وصول الراتب.",
          "عندما تعتاد غياب المبلغ من حسابك اليومي، ارفع النسبة تدريجيًا بدلًا من انتظار الوقت المثالي.",
        ],
      },
      {
        heading: "امنح كل مبلغ وظيفة",
        paragraphs: [
          "قسّم مالك إلى ثلاثة أوعية بسيطة: احتياجات ثابتة، مرونة يومية، ومستقبل. لا يهم أن تكون النسب مثالية؛ الهدف أن تعرف إلى أين يذهب المال.",
        ],
      },
      {
        heading: "مراجعة عشر دقائق أسبوعيًا",
        paragraphs: [
          "حدد موعدًا ثابتًا لمراجعة آخر سبعة أيام. ابحث عن مصروف واحد لم يضف قيمة، وعدّله للأسبوع التالي. المراجعة هنا للتعلّم، لا للمحاكمة.",
        ],
      },
    ],
  },
  {
    id: "c4",
    type: "video",
    title: "تمرين التنفّس العميق للاسترخاء",
    author: "Brain Education TV",
    dimension: "physical",
    duration: "13 د",
    description:
      "تمرين تطبيقي يرشدك إلى تنفّس بطني أعمق، مناسب لاستراحة جسدية بعد فترة طويلة أمام الشاشة.",
    takeaways: [
      "امنح الشهيق مساحة في البطن والجانبين",
      "أطل الزفير بلطف دون دفع",
      "توقف إذا شعرت بدوار أو عدم راحة",
    ],
    media: {
      url: "https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6f/Deep_Belly_Breathing_for_Relaxation_-_10_Minute_Daily_Routines.webm/Deep_Belly_Breathing_for_Relaxation_-_10_Minute_Daily_Routines.webm.360p.vp9.webm",
      mimeType: "video/webm",
      poster:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Deep_Belly_Breathing_for_Relaxation_-_10_Minute_Daily_Routines.webm/960px--Deep_Belly_Breathing_for_Relaxation_-_10_Minute_Daily_Routines.webm.jpg",
    },
    source: {
      name: "Brain Education TV عبر Wikimedia Commons",
      url: "https://commons.wikimedia.org/wiki/File:Deep_Belly_Breathing_for_Relaxation_-_10_Minute_Daily_Routines.webm",
      license: "CC BY 3.0",
      language: "الصوت بالإنجليزية",
    },
  },
  {
    id: "c5",
    type: "audio",
    title: "موسيقى هادئة لاستعادة التركيز",
    author: "Musopen String Quartet",
    dimension: "workplace",
    duration: "6:45 د",
    description:
      "تسجيل لمقطوعة تأملية ليوزف سوك، يمكن استخدامها كفاصل هادئ بين اجتماعين أو مهمتين.",
    takeaways: [
      "أغلق الإشعارات خلال المقطوعة",
      "ارخِ الكتفين والفك كلما لاحظت التوتر",
      "حدد أولويتك التالية قبل العودة",
    ],
    media: {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Josef_Suk_-_Meditation_Op_35a.ogg",
      mimeType: "audio/ogg",
    },
    source: {
      name: "Musopen عبر Wikimedia Commons",
      url: "https://commons.wikimedia.org/wiki/File:Josef_Suk_-_Meditation_Op_35a.ogg",
      license: "ملكية عامة",
      language: "موسيقى بلا كلمات",
    },
  },
  {
    id: "c6",
    type: "article",
    title: "خمس طرق لتغذية فضولك الفكري كل يوم",
    author: "فريق cura",
    dimension: "intellectual",
    duration: "5 د قراءة",
    description:
      "طرق عملية تمنح العقل أسئلة جديدة ومساحة للتعلّم خارج روتين العمل.",
    takeaways: [
      "اكتب سؤالًا واحدًا كل يوم",
      "اقرأ خارج مجالك المعتاد",
      "اشرح ما تعلمته لشخص آخر",
    ],
    article: [
      {
        heading: "اتبع السؤال، لا الموضوع",
        paragraphs: [
          "بدلًا من قول «سأقرأ عن الذكاء الاصطناعي»، ابدأ بسؤال محدد: «كيف يختار النموذج إجابة؟». السؤال يمنحك مسارًا يمكن إكماله في عشر دقائق.",
        ],
      },
      {
        heading: "اختر مصدرًا لا تختاره عادة",
        paragraphs: [
          "مرة كل أسبوع، اقرأ من تخصص بعيد عن عملك. ربط المعلومات البعيدة بخبرتك اليومية هو أحد أفضل تمارين الفضول.",
        ],
      },
      {
        heading: "حوّل التعلّم إلى محادثة",
        paragraphs: [
          "لخّص فكرة جديدة في ثلاث جمل، ثم شاركها مع زميل. ستكتشف فجوات فهمك أثناء الشرح، وستتلقى أسئلة تفتح مسارًا جديدًا.",
        ],
      },
    ],
  },
  {
    id: "c7",
    type: "article",
    title: "كيف تقدّم دعمًا حقيقيًا لزميل يمرّ بيوم صعب",
    author: "فريق cura",
    dimension: "community",
    duration: "7 د قراءة",
    description:
      "دليل إنساني صغير للاستماع بدون اقتحام، وتقديم مساعدة يمكن للشخص الآخر قبولها.",
    takeaways: [
      "ابدأ بملاحظة لطيفة لا بتشخيص",
      "اسأل ما الذي يحتاجه الآخر",
      "احترم الخصوصية وحدود دورك",
    ],
    article: [
      {
        heading: "قل ما لاحظته، لا ما افترضته",
        paragraphs: [
          "يمكنك البدء بعبارة بسيطة: «لاحظت أن يومك كان ثقيلًا، هل ترغب في الحديث؟». هذه ملاحظة تفتح بابًا دون أن تفرض تفسيرًا لما يمر به زميلك.",
        ],
      },
      {
        heading: "اسأل قبل تقديم الحلول",
        paragraphs: [
          "بعض الناس يحتاجون إلى من يسمع، وبعضهم يريد مساعدة عملية. سؤال «هل تريدني أن أسمع أم أن نفكر في خطوة تالية؟» يعيد للشخص الآخر التحكم.",
        ],
      },
      {
        heading: "اعرف متى توسّع دائرة الدعم",
        paragraphs: [
          "إذا كان زميلك في خطر، أو كانت معاناته تعطل حياته، فالدعم الأفضل قد يكون مساعدته على الوصول إلى مختص أو جهة دعم مناسبة.",
        ],
      },
    ],
  },
  {
    id: "c8",
    type: "video",
    title: "لحظة وعي وهدوء قصيرة",
    author: "Madame shE³",
    dimension: "social",
    duration: "1:46 د",
    description:
      "فيديو قصير يلتقط لحظة من السكون والتنفّس، لتمنح نفسك فاصلًا صغيرًا قبل العودة للتواصل مع الآخرين.",
    takeaways: [
      "وجّه انتباهك للشهيق والزفير",
      "لاحظ الأفكار دون الحاجة لمقاومتها",
      "اختر تواصلك التالي بهدوء أكبر",
    ],
    media: {
      url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Meditation_Ritual_AGE.webm",
      mimeType: "video/webm",
      poster:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Meditation_Ritual_AGE.webm/960px--Meditation_Ritual_AGE.webm.jpg",
    },
    source: {
      name: "Madame shE³ عبر Wikimedia Commons",
      url: "https://commons.wikimedia.org/wiki/File:Meditation_Ritual_AGE.webm",
      license: "CC BY-SA 4.0",
      language: "محتوى تأملي",
    },
  },
  {
    id: "c9",
    type: "audio",
    title: "تأمل الشمس: جلسة صوتية هادئة",
    author: "Yogi Nils",
    dimension: "belonging",
    duration: "13 د",
    description:
      "جلسة تأمل صوتية طويلة نسبيًا، مناسبة لبداية اليوم أو للتهدئة بعد يوم عمل مكثف.",
    takeaways: [
      "اختر مكانًا هادئًا للجلسة",
      "استمع دون الانشغال بمهمة أخرى",
      "دوّن كلمة واحدة تصف حالتك بعد الاستماع",
    ],
    media: {
      url: "https://upload.wikimedia.org/wikipedia/commons/1/12/Sun-Meditation.ogg",
      mimeType: "audio/ogg",
    },
    source: {
      name: "Yogi Nils عبر Wikimedia Commons",
      url: "https://commons.wikimedia.org/wiki/File:Sun-Meditation.ogg",
      license: "CC BY-SA 3.0",
      language: "جلسة صوتية",
    },
  },
  {
    id: "c10",
    type: "article",
    title: "دليل عملي لنوم أهدأ بعد يوم عمل طويل",
    author: "فريق cura",
    dimension: "physical",
    duration: "8 د قراءة",
    description:
      "روتين ليلي واقعي يساعد جسمك على الانتقال من ضغط العمل إلى الراحة.",
    takeaways: [
      "ثبّت موعد الاستيقاظ قدر الإمكان",
      "ابعد العمل عن السرير",
      "اصنع إشارات ثابتة لنهاية اليوم",
    ],
    article: [
      {
        heading: "ابدأ من موعد الاستيقاظ",
        paragraphs: [
          "موعد استيقاظ ثابت يساعد ساعتك الحيوية على الانتظام. حاول ألا يختلف الموعد كثيرًا بين أيام العمل والعطلة، ثم اسمح لموعد النوم أن يتحرك تدريجيًا.",
        ],
      },
      {
        heading: "انقل القلق من الرأس إلى الورق",
        paragraphs: [
          "قبل النوم بنصف ساعة، اكتب المهام المعلّقة وأول خطوة لكل منها غدًا. لست مطالبًا بالحل ليلًا؛ أنت فقط تضع نقطة واضحة للعودة.",
        ],
      },
      {
        heading: "اصنع جسرًا صغيرًا للهدوء",
        paragraphs: [
          "خفّض الإضاءة، أبعد الهاتف عن السرير، واختر نشاطًا هادئًا متكررًا مثل القراءة أو التمدد. تكرار الإشارات نفسها يعلّم الجسم أن اليوم انتهى.",
        ],
      },
    ],
  },
  {
    id: "c11",
    type: "audio",
    title: "فاصل موسيقي للهدوء بعد العمل",
    author: "ميشا إلمان وجوزيف بونيم",
    dimension: "professional",
    duration: "4:27 د",
    description:
      "مقطوعة هادئة للانتقال النفسي من إيقاع المهام إلى وقتك الشخصي دون محتوى لفظي.",
    takeaways: [
      "أغلق تطبيقات العمل قبل البدء",
      "استخدم الفاصل كإشارة لنهاية اليوم المهني",
      "وجّه انتباهك لمكانك وجسدك الآن",
    ],
    media: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/07/Elman_74341_NR.ogg",
      mimeType: "audio/ogg",
    },
    source: {
      name: "Internet Archive عبر Wikimedia Commons",
      url: "https://commons.wikimedia.org/wiki/File:Elman_74341_NR.ogg",
      license: "ملكية عامة",
      language: "موسيقى بلا كلمات",
    },
  },
  {
    id: "c12",
    type: "article",
    title: "ثلاث تقنيات قصيرة للعودة إلى الهدوء",
    author: "فريق cura",
    dimension: "psycho",
    duration: "4 د قراءة",
    description:
      "ثلاث أدوات مختصرة لمساعدتك على التوقف، وملاحظة ما يحدث، ثم اختيار خطوتك التالية.",
    takeaways: [
      "استخدم زفيرًا أطول من الشهيق",
      "سمّ خمسة أشياء تراها حولك",
      "حوّل القلق إلى أصغر خطوة ممكنة",
    ],
    article: [
      {
        heading: "التنفس: زفير أطول",
        paragraphs: [
          "خذ شهيقًا هادئًا، ثم اجعل الزفير أطول قليلًا من دون دفع. كرر ذلك أربع مرات. الهدف ليس إلغاء القلق، بل خفض سرعة اللحظة بما يكفي للاختيار.",
        ],
      },
      {
        heading: "الحواس: عد إلى مكانك",
        paragraphs: [
          "سمّ خمسة أشياء تراها، أربعة أشياء تشعر بها، وثلاثة أصوات تسمعها. هذه الملاحظات تعيد الانتباه من التوقعات إلى اللحظة الحالية.",
        ],
      },
      {
        heading: "الفعل: خطوة تستغرق دقيقتين",
        paragraphs: [
          "اسأل نفسك: ما أصغر شيء يمكنني فعله الآن؟ قد يكون كتابة سطر، إرسال سؤال، أو شرب كوب ماء. الخطوة الصغيرة لا تحل كل شيء، لكنها تعيد لك الحركة.",
        ],
      },
    ],
  },
];
