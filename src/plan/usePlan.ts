import { useContext } from "react";
import { PlanContext, type PlanValue } from "./planContextValue";

export function usePlan(): PlanValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within a PlanProvider");
  return ctx;
}
