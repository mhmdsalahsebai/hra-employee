import { useContext } from "react";
import { OnboardingContext, type OnboardingValue } from "./onboardingContextValue";

export type { OnboardingStep } from "./onboardingContextValue";

export function useOnboarding(): OnboardingValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within an OnboardingProvider");
  return ctx;
}
