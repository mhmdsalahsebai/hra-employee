import { useContext } from "react";
import { AssessmentContext, type AssessmentValue } from "./assessmentContextValue";

export type { DimensionResult } from "./assessmentContextValue";

export function useAssessment(): AssessmentValue {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within an AssessmentProvider");
  return ctx;
}
