import { useCallback, useState, type ReactNode } from "react";
import {
  OnboardingContext,
  type OnboardingStep,
  type OnboardingValue,
} from "./onboardingContextValue";

/* Real onboarding progress (welcome → login → invitation → personal info →
   complete), persisted to localStorage. A fresh visitor starts at "welcome". */

const KEY = "cura-onboarding-step";
const STEPS: OnboardingStep[] = ["welcome", "login", "invitation", "personal_info", "complete"];

function read(): OnboardingStep {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && STEPS.includes(saved as OnboardingStep)) return saved as OnboardingStep;
  } catch {
    /* ignore unavailable storage */
  }
  return "welcome";
}

function persist(step: OnboardingStep) {
  try {
    localStorage.setItem(KEY, step);
  } catch {
    /* ignore unavailable storage */
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStepState] = useState<OnboardingStep>(read);

  const setStep = useCallback((next: OnboardingStep) => {
    setStepState(next);
    persist(next);
  }, []);

  const value: OnboardingValue = {
    step,
    setStep,
    complete: useCallback(() => setStep("complete"), [setStep]),
    reset: useCallback(() => setStep("welcome"), [setStep]),
    isComplete: step === "complete",
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
