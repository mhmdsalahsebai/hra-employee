import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../onboarding/useOnboarding";
import { AppShell } from "./components/AppShell";
import { LoginScreen } from "./screens/LoginScreen";
import { PersonalInfoSurveyScreen } from "./screens/PersonalInfoSurveyScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import "./experience.css";

type Phase = "welcome" | "login" | "survey";

/**
 * The premium wellbeing experience: a single-page state machine that flows
 * login → personal-info survey with calm transitions. The dark stage
 * (`AppShell`) persists across phases; only the foreground screen swaps and
 * replays its entrance, which keeps the motion continuous like the reference.
 *
 * A short button "loading" beat precedes each phase change so the press feels
 * deliberate, then the next screen animates in. On finishing the survey we mark
 * onboarding complete and hand straight off to the home dashboard.
 */
export function ExperienceFlow() {
  const navigate = useNavigate();
  const onboarding = useOnboarding();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  /** Show a brief press/loading beat, then move to the next phase. */
  const transitionTo = useCallback((next: Phase, delay: number) => {
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      setPhase(next);
    }, delay);
  }, []);

  // Answers are persisted by the survey; mark onboarding done and go straight
  // to the home dashboard (no interstitial completion screen).
  const finishSurvey = useCallback(() => {
    setLoading(true);
    timer.current = setTimeout(() => {
      onboarding.complete();
      navigate("/");
    }, 560);
  }, [navigate, onboarding]);

  return (
    <AppShell>
      {phase === "welcome" && (
        <WelcomeScreen onStart={() => transitionTo("login", 420)} loading={loading} />
      )}

      {phase === "login" && (
        <LoginScreen
          onBack={() => setPhase("welcome")}
          onLogin={() => transitionTo("survey", 520)}
          loading={loading}
        />
      )}

      {phase === "survey" && (
        <PersonalInfoSurveyScreen
          onFinish={finishSurvey}
          onExit={() => setPhase("login")}
          finishing={loading}
        />
      )}
    </AppShell>
  );
}
