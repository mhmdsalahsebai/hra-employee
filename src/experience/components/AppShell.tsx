import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { DarkDecoratedBackground } from "./DarkDecoratedBackground";

/**
 * Full-screen container for the wellbeing experience. Owns the `.exp-root`
 * Arabic/RTL scope, paints
 * the decorated dark stage, and centres a phone-width column for the screens.
 */
export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="exp-root relative min-h-dvh w-full overflow-hidden">
      <DarkDecoratedBackground />
      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-dvh w-full max-w-[460px] flex-col",
          "px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
