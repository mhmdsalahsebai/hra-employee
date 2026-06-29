/**
 * Wellbeing survey content + per-question accent palette.
 *
 * Mocked data, intentionally short (4 questions) to keep the demo flow tight.
 * Each question carries its own soft accent so the white card subtly shifts
 * mood as the person moves from mental wellbeing → stress → sleep → work-life.
 */

export interface Accent {
  /** Strong colour: the question dot, the selected radio fill, progress line. */
  solid: string;
  /** Soft fill behind a selected option row. */
  soft: string;
  /** Border colour of a selected option row. */
  ring: string;
}

export interface SurveyOptionDef {
  id: string;
  label: string;
}

export interface SurveyQuestion {
  id: string;
  /** Internal topic (not shown as the eyebrow). */
  topic: string;
  question: string;
  options: SurveyOptionDef[];
  accent: Accent;
}

/** Soft, wellbeing-coded accents — never loud, readable on white. */
const lavender: Accent = { solid: "#7c6cf0", soft: "#efeefe", ring: "#cfc8fb" };
const coral: Accent = { solid: "#f4675f", soft: "#ffece9", ring: "#fbc9c4" };
const amber: Accent = { solid: "#e3992f", soft: "#fff3dd", ring: "#f6d699" };
const blue: Accent = { solid: "#3877ff", soft: "#e7eeff", ring: "#bcd1ff" };

/** Constant muted label above every question (per the brief). */
export const SURVEY_EYEBROW = "Wellbeing check";

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "mental",
    topic: "Mental wellbeing",
    question: "Over the past two weeks, how often have you felt calm and emotionally balanced?",
    options: [
      { id: "rarely", label: "Rarely" },
      { id: "sometimes", label: "Sometimes" },
      { id: "often", label: "Often" },
      { id: "almost-always", label: "Almost always" },
    ],
    accent: lavender,
  },
  {
    id: "stress",
    topic: "Stress",
    question: "How would you describe your current stress level?",
    options: [
      { id: "low", label: "Low" },
      { id: "moderate", label: "Moderate" },
      { id: "high", label: "High" },
      { id: "very-high", label: "Very high" },
    ],
    accent: coral,
  },
  {
    id: "sleep",
    topic: "Energy & sleep",
    question: "How refreshed do you usually feel after sleeping?",
    options: [
      { id: "not", label: "Not refreshed" },
      { id: "slightly", label: "Slightly refreshed" },
      { id: "mostly", label: "Mostly refreshed" },
      { id: "very", label: "Very refreshed" },
    ],
    accent: amber,
  },
  {
    id: "work-life",
    topic: "Work & lifestyle",
    question: "How satisfied are you with your current work-life balance?",
    options: [
      { id: "very-unsatisfied", label: "Very unsatisfied" },
      { id: "unsatisfied", label: "Unsatisfied" },
      { id: "neutral", label: "Neutral" },
      { id: "satisfied", label: "Satisfied" },
      { id: "very-satisfied", label: "Very satisfied" },
    ],
    accent: blue,
  },
];

/** Map of questionId → selected optionId. */
export type SurveyAnswers = Record<string, string>;
