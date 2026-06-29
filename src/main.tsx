import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { OnboardingProvider } from "./onboarding/OnboardingProvider";
import { AssessmentProvider } from "./assessment/AssessmentProvider";
import { PlanProvider } from "./plan/PlanProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OnboardingProvider>
      <AssessmentProvider>
        <PlanProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PlanProvider>
      </AssessmentProvider>
    </OnboardingProvider>
  </StrictMode>,
);
