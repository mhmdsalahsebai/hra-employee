import type { DimensionId } from "./dimensions";

/* Deliverable 4: relevant online content matched to the employee's results. */

export type ContentType = "video" | "audio" | "article";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  author: string;
  dimension: DimensionId;
  /** "8 د" for minutes, "12 د قراءة" etc. */
  duration: string;
  featured?: boolean;
}

export const contentTypeLabels: Record<ContentType, string> = {
  video: "فيديو",
  audio: "بودكاست",
  article: "مقال",
};

export const content: ContentItem[] = [
  {
    id: "c1",
    type: "video",
    title: "كيف توقف دوّامة الاحتراق الوظيفي قبل أن تبدأ",
    author: "د. ليان القحطاني",
    dimension: "professional",
    duration: "9 د",
    featured: true,
  },
  {
    id: "c2",
    type: "audio",
    title: "تأمل موجّه: عشر دقائق لتهدئة العقل",
    author: "مساحة هدوء",
    dimension: "psycho",
    duration: "10 د",
  },
  {
    id: "c3",
    type: "article",
    title: "عادات مالية صغيرة تصنع فرقًا كبيرًا",
    author: "فريق cura",
    dimension: "financial",
    duration: "6 د قراءة",
  },
  {
    id: "c4",
    type: "video",
    title: "حركات بسيطة لمكتبك تنشّط جسمك في دقائق",
    author: "أ. سارة الحربي",
    dimension: "physical",
    duration: "7 د",
  },
  {
    id: "c5",
    type: "audio",
    title: "كيف تبني علاقات أعمق في فريق العمل",
    author: "بودكاست الانتماء",
    dimension: "workplace",
    duration: "18 د",
  },
  {
    id: "c6",
    type: "article",
    title: "خمس طرق لتغذية فضولك الفكري كل يوم",
    author: "فريق cura",
    dimension: "intellectual",
    duration: "5 د قراءة",
  },
  {
    id: "c7",
    type: "article",
    title: "كيف تقدّم دعمًا حقيقيًا لزميل يمرّ بيوم صعب",
    author: "فريق cura",
    dimension: "community",
    duration: "7 د قراءة",
  },
  {
    id: "c8",
    type: "video",
    title: "خطوات بسيطة لاستعادة طاقتك الاجتماعية بهدوء",
    author: "أ. نورة السالم",
    dimension: "social",
    duration: "8 د",
  },
  {
    id: "c9",
    type: "audio",
    title: "روتين أسبوعي يساعدك على التنظيم من دون ضغط",
    author: "بودكاست خطوة",
    dimension: "belonging",
    duration: "14 د",
  },
  {
    id: "c10",
    type: "article",
    title: "دليل عملي لنوم أهدأ بعد يوم عمل طويل",
    author: "د. ريم العتيبي",
    dimension: "physical",
    duration: "8 د قراءة",
  },
  {
    id: "c11",
    type: "audio",
    title: "حدود صحية تحمي طاقتك في العمل",
    author: "بودكاست توازن",
    dimension: "professional",
    duration: "16 د",
  },
  {
    id: "c12",
    type: "article",
    title: "ثلاث تقنيات قصيرة للعودة إلى الهدوء",
    author: "فريق cura",
    dimension: "psycho",
    duration: "4 د قراءة",
  },
];
