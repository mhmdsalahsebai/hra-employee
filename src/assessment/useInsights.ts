import { useMemo } from "react";
import { summarizeInsights, type InsightSummary } from "../data/insights";
import type { PersonalInfoAnswers } from "../data/personalInfo";
import { useAssessment } from "./useAssessment";

/* Reads the same personal-info bucket the onboarding step writes, so the
   insight engine can compute BMI / waist risk alongside the HRA answers. */
const PERSONAL_INFO_KEY = "cura-sim-personal-info";

function readPersonalInfo(): PersonalInfoAnswers {
  try {
    const raw = localStorage.getItem(PERSONAL_INFO_KEY);
    return raw ? (JSON.parse(raw) as PersonalInfoAnswers) : {};
  } catch {
    return {};
  }
}

/** The detailed, derived health insights for the current answers. */
export function useInsights(): InsightSummary {
  const { answers } = useAssessment();
  return useMemo(() => summarizeInsights(answers, readPersonalInfo()), [answers]);
}
