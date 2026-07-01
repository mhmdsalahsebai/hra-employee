import {
  Activity,
  Brain,
  Briefcase,
  Building2,
  HeartHandshake,
  Lightbulb,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ───────────────────────────────────────────────────────────────────────────
   The nine wellbeing dimensions of the cura HRA, mirrored from
   data/hraDimensions.ts (the backend source of truth). Each carries its own
   accent so the same dimension reads consistently everywhere it appears.

   The accent is a functional data palette. Each dimension owns one readable hue
   and a quiet tint, applied via inline styles so identity stays consistent.
   Score colour (good / moderate / attention) carries the meaning.
   ─────────────────────────────────────────────────────────────────────────── */

export type DimensionId =
  | "professional"
  | "psycho"
  | "intellectual"
  | "community"
  | "social"
  | "belonging"
  | "physical"
  | "financial"
  | "workplace";

export interface DimensionAccent {
  /** Text / icon colour. */
  fg: string;
  /** Quiet tint for icon tiles and pills. */
  soft: string;
  /** Solid fill for bars & dots. */
  solid: string;
}

/** Inline-style helpers so a dimension renders consistently anywhere. */
export const tileStyle = (a: DimensionAccent) => ({ color: a.fg, background: a.soft });
export const softStyle = (a: DimensionAccent) => ({ color: a.fg, background: a.soft });

export interface Dimension {
  id: DimensionId;
  /** Short Arabic label used in chips & lists. */
  title: string;
  /** One-line plain-language summary. */
  tagline: string;
  /** Full description (from the assessment). */
  description: string;
  icon: LucideIcon;
  accent: DimensionAccent;
  /** Anonymous peer average on the 0–100 display scale, for benchmarking. */
  benchmark: number;
  /** Change since the previous assessment, for the trend delta. */
  trend: number;
}

/* Order matters: this array drives the answering order in the assessment, the
   Home journey path, the radar and the metrics list. It's deliberately arranged
   so the employee starts with dimensions about *themselves* (health, mind,
   money) and the company-related dimensions (المهني / بيئة العمل) come last. */
export const dimensions: Dimension[] = [
  {
    id: "physical",
    title: "البدني",
    tagline: "النشاط واللياقة",
    description:
      "يقيس مستوى نشاطك البدني والمؤشرات الوقائية وحالتك الصحية ونمط حياتك الغذائي.",
    icon: Activity,
    accent: { fg: "#5c861d", soft: "rgba(92,134,29,0.12)", solid: "#7cad2e" },
    benchmark: 50,
    trend: -3,
  },
  {
    id: "psycho",
    title: "النفسي",
    tagline: "الاستقرار العاطفي",
    description:
      "يقيس مدى استقرارك النفسي وكيفية تعاملك مع القلق والتوتر والمشاعر السلبية في المواقف الضاغطة.",
    icon: Brain,
    accent: { fg: "#b24572", soft: "rgba(178,69,114,0.1)", solid: "#d25d8c" },
    benchmark: 58,
    trend: 4,
  },
  {
    id: "financial",
    title: "المالي",
    tagline: "الاستقرار المالي",
    description:
      "يقيس مستوى الضغط المالي ورضاك عن وضعك المالي واستعدادك للطوارئ وعاداتك في التخطيط والادخار.",
    icon: Wallet,
    accent: { fg: "#177e93", soft: "rgba(23,126,147,0.1)", solid: "#1c9bb4" },
    benchmark: 56,
    trend: 4,
  },
  {
    id: "intellectual",
    title: "الفكري",
    tagline: "الفضول والانفتاح",
    description:
      "يقيس فضولك الفكري وإبداعك وتقديرك للأفكار والتجارب الجديدة واستقلاليتك في التفكير.",
    icon: Lightbulb,
    accent: { fg: "#a86512", soft: "rgba(168,101,18,0.12)", solid: "#d08a1f" },
    benchmark: 66,
    trend: 3,
  },
  {
    id: "community",
    title: "المجتمعي",
    tagline: "التعاون والتعاطف",
    description:
      "يقيس مدى لطفك وتعاونك وثقتك بالآخرين، وتقديرك لمشاعرهم وتواضعك في التعامل معهم.",
    icon: HeartHandshake,
    accent: { fg: "#087f74", soft: "rgba(8,127,116,0.1)", solid: "#13a394" },
    benchmark: 70,
    trend: 2,
  },
  {
    id: "social",
    title: "الاجتماعي",
    tagline: "الطاقة والانبساط",
    description:
      "يقيس حبك للتفاعل الاجتماعي وطاقتك وثقتك بنفسك في المواقف الاجتماعية وحاجتك للدعم.",
    icon: Users,
    accent: { fg: "#b85e34", soft: "rgba(184,94,52,0.11)", solid: "#df7446" },
    benchmark: 64,
    trend: -2,
  },
  {
    id: "belonging",
    title: "الشمولي",
    tagline: "التنظيم والمسؤولية",
    description:
      "يقيس انضباطك الذاتي وتنظيمك والتزامك بالمواعيد والواجبات، وهو الأوثق ارتباطًا بالأداء المهني.",
    icon: Target,
    accent: { fg: "#6757b8", soft: "rgba(103,87,184,0.11)", solid: "#7f6ee6" },
    benchmark: 67,
    trend: 3,
  },
  /* ── Company-related dimensions come last ──────────────────────────────── */
  {
    id: "professional",
    title: "المهني",
    tagline: "الإجهاد والاحتراق الوظيفي",
    description:
      "يقيس مستوى الإجهاد النفسي والعاطفي في بيئة عملك، وتأثيره على أدائك وطاقتك وعلاقتك بزملائك.",
    icon: Briefcase,
    accent: { fg: "#2563a8", soft: "rgba(37,99,168,0.1)", solid: "#2f7dcc" },
    benchmark: 55,
    trend: 6,
  },
  {
    id: "workplace",
    title: "بيئة العمل",
    tagline: "الانتماء والانخراط",
    description:
      "يقيس علاقتك بمنظمتك ورضاك الوظيفي وشعورك بالتقدير والأمان والمعنى وقوة انتمائك لفريقك.",
    icon: Building2,
    accent: { fg: "#a3509f", soft: "rgba(163,80,159,0.11)", solid: "#c565bf" },
    benchmark: 72,
    trend: 2,
  },
];

export const dimensionsById: Record<DimensionId, Dimension> = dimensions.reduce(
  (acc, d) => {
    acc[d.id] = d;
    return acc;
  },
  {} as Record<DimensionId, Dimension>,
);

/* ── A representative slice of real questions for the assessment demo. ──────── */

export interface AssessmentAnswer {
  value: number;
  title: string;
}

export interface AssessmentQuestion {
  id: string;
  dimension: DimensionId;
  title: string;
  answers: AssessmentAnswer[];
}

const frequency: AssessmentAnswer[] = [
  { value: 0, title: "أبدًا" },
  { value: 1, title: "عدة مرات في السنة" },
  { value: 2, title: "مرة في الشهر" },
  { value: 3, title: "عدة مرات في الشهر" },
  { value: 4, title: "مرة في الأسبوع" },
  { value: 5, title: "عدة مرات في الأسبوع" },
  { value: 6, title: "يوميًا" },
];

const agreement: AssessmentAnswer[] = [
  { value: 5, title: "موافق بشدة" },
  { value: 4, title: "موافق" },
  { value: 3, title: "محايد" },
  { value: 2, title: "غير موافق" },
  { value: 1, title: "غير موافق بشدة" },
];

export const assessmentQuestions: AssessmentQuestion[] = [
  { id: "p1", dimension: "professional", title: "أشعر بأن عملي أنهكني نفسيًا", answers: frequency },
  { id: "p2", dimension: "professional", title: "ينفد صبري بنهاية يوم العمل", answers: frequency },
  {
    id: "p3",
    dimension: "professional",
    title: "أشعر بالتعب عندما أستيقظ في الصباح لمواجهة يوم آخر في العمل",
    answers: frequency,
  },
  { id: "ps1", dimension: "psycho", title: "أشعر غالبًا بالتوتر والعصبية", answers: agreement },
  {
    id: "ps2",
    dimension: "psycho",
    title: "عندما لا تسير الأمور بالشكل الصحيح، أشعر بالإحباط أو الاستسلام",
    answers: agreement,
  },
  {
    id: "w1",
    dimension: "workplace",
    title: "أشعر بأن لعملي معنى وهدفًا أكبر يستحق جهدي",
    answers: agreement,
  },
];
