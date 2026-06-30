import { useMemo } from "react";
import { metricsByDimension, type DimensionMetrics } from "../data/metrics";
import type { PersonalInfoAnswers } from "../data/personalInfo";
import { useAssessment } from "./useAssessment";

/* Reads the same personal-info bucket the onboarding step writes, so the
   metrics engine can compute BMI alongside the HRA answers. */
const PERSONAL_INFO_KEY = "cura-sim-personal-info";

function readPersonalInfo(): PersonalInfoAnswers {
  try {
    const raw = localStorage.getItem(PERSONAL_INFO_KEY);
    return raw ? (JSON.parse(raw) as PersonalInfoAnswers) : {};
  } catch {
    return {};
  }
}

/** The full panel of sub-scale metrics for the current answers, grouped by dimension. */
export function useMetrics(): DimensionMetrics[] {
  const { answers } = useAssessment();
  return useMemo(() => metricsByDimension(answers, readPersonalInfo()), [answers]);
}
