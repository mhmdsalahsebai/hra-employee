import { createContext } from "react";

export type OnboardingStep = "welcome" | "login" | "invitation" | "personal_info" | "complete";

export interface OnboardingValue {
  step: OnboardingStep;
  setStep: (step: OnboardingStep) => void;
  complete: () => void;
  reset: () => void;
  isComplete: boolean;
}

export const OnboardingContext = createContext<OnboardingValue | null>(null);
