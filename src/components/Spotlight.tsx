import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/** Deep brand spotlight, reserved for primary moments in the light UI. */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-brand-900 shadow-card">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 86% -12%, rgba(131,187,238,0.34), transparent 56%), radial-gradient(80% 80% at 0% 100%, rgba(124,110,230,0.22), transparent 58%)",
        }}
      />
      {/* className styles the content area so callers can lay out children directly */}
      <div className={cn("relative", className)}>{children}</div>
    </div>
  );
}
