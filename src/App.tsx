import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { FlowLayout } from "./components/FlowLayout";
import { Onboarding } from "./screens/Onboarding";
import { Login } from "./screens/Login";
import { Invitation } from "./screens/Invitation";
import { PersonalInfo } from "./screens/PersonalInfo";
import { Home } from "./screens/Home";
import { Journey } from "./screens/Journey";
import { Assessment } from "./screens/Assessment";
import { Report } from "./screens/Report";
import { Dimension } from "./screens/Dimension";
import { Focus } from "./screens/Focus";
import { Plan } from "./screens/Plan";
import { Program } from "./screens/Program";
import { Content } from "./screens/Content";
import { Consultation } from "./screens/Consultation";
import { Profile } from "./screens/Profile";
import { ExperienceFlow } from "./experience/ExperienceFlow";
import { type OnboardingStep, useOnboarding } from "./onboarding/useOnboarding";
import { DevAssessmentToolbar } from "./components/DevAssessmentToolbar";

const onboardingPaths: Record<Exclude<OnboardingStep, "complete">, string> = {
  welcome: "/welcome",
  login: "/login",
  invitation: "/invitation",
  personal_info: "/personal-info",
};

function pathForStep(step: OnboardingStep) {
  return step === "complete" ? "/" : onboardingPaths[step];
}

function RequireOnboarding({ children }: { children: ReactNode }) {
  const { isComplete, step } = useOnboarding();
  if (!isComplete) {
    // New visitors start on the onboarding feature tour, then continue through
    // whichever step they last reached.
    return <Navigate to={pathForStep(step)} replace />;
  }
  return children;
}

function OnboardingStepRoute({
  step,
  children,
}: {
  step: Exclude<OnboardingStep, "complete">;
  children: ReactNode;
}) {
  const onboarding = useOnboarding();
  if (onboarding.isComplete) return <Navigate to="/" replace />;
  if (onboarding.step !== step) return <Navigate to={pathForStep(onboarding.step)} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <DevAssessmentToolbar />
      <Routes>
        {/* Premium wellbeing experience — welcome → login → survey → completion.
            The default entry for new visitors; hands off to the dashboard. */}
        <Route path="/experience" element={<ExperienceFlow />} />

        {/* Full-screen flows without the bottom navigation — wrapped in a
            transition layout so they push/pop like native screens too. */}
        <Route element={<FlowLayout />}>
          <Route
            path="/welcome"
            element={
              <OnboardingStepRoute step="welcome">
                <Onboarding />
              </OnboardingStepRoute>
            }
          />
          <Route
            path="/login"
            element={
              <OnboardingStepRoute step="login">
                <Login />
              </OnboardingStepRoute>
            }
          />
          <Route
            path="/invitation"
            element={
              <OnboardingStepRoute step="invitation">
                <Invitation />
              </OnboardingStepRoute>
            }
          />
          <Route
            path="/personal-info"
            element={
              <OnboardingStepRoute step="personal_info">
                <PersonalInfo />
              </OnboardingStepRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <RequireOnboarding>
                <Assessment />
              </RequireOnboarding>
            }
          />
        </Route>

        {/* Main app inside the phone frame + bottom nav */}
        <Route
          element={
            <RequireOnboarding>
              <AppLayout />
            </RequireOnboarding>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/report" element={<Report />} />
          <Route path="/dimension/:slug" element={<Dimension />} />
          <Route path="/focus/:slug" element={<Focus />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/program/:id" element={<Program />} />
          <Route path="/content" element={<Content />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
