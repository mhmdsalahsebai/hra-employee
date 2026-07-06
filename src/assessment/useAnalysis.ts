import { useMemo } from "react";
import { computeDeepAnalysis, type DeepAnalysisResult } from "../data/analysis";
import type { PersonalInfoAnswers } from "../data/personalInfo";
import { useAssessment } from "./useAssessment";

/* Same personal-info bucket the onboarding step writes (and useInsights reads),
   so composite indices can use BMI / waist / gender alongside the HRA answers. */
const PERSONAL_INFO_KEY = "cura-sim-personal-info";

function readPersonalInfo(): PersonalInfoAnswers {
  try {
    const raw = localStorage.getItem(PERSONAL_INFO_KEY);
    return raw ? (JSON.parse(raw) as PersonalInfoAnswers) : {};
  } catch {
    return {};
  }
}

/** The cross-dimension composite analysis for the current answers. */
export function useAnalysis(): DeepAnalysisResult {
  const { answers } = useAssessment();
  return useMemo(() => computeDeepAnalysis(answers, readPersonalInfo()), [answers]);
}
