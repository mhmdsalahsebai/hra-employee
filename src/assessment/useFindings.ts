import { useMemo } from "react";
import { computeFindings, type FindingsResult } from "../data/findings";
import type { PersonalInfoAnswers } from "../data/personalInfo";
import { useAssessment } from "./useAssessment";

/* Same personal-info bucket the onboarding step writes, so findings can cross
   BMI / waist / gender with the HRA answers (e.g. the flying-blind detector). */
const PERSONAL_INFO_KEY = "cura-sim-personal-info";

function readPersonalInfo(): PersonalInfoAnswers {
  try {
    const raw = localStorage.getItem(PERSONAL_INFO_KEY);
    return raw ? (JSON.parse(raw) as PersonalInfoAnswers) : {};
  } catch {
    return {};
  }
}

/** Cross-answer findings + the leverage point for the current answers. */
export function useFindings(): FindingsResult {
  const { answers } = useAssessment();
  return useMemo(() => computeFindings(answers, readPersonalInfo()), [answers]);
}
