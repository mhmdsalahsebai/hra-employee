import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

/** Small status label, e.g. a score level or category. Caller supplies colour. */
export function Badge({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-bold",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

/** Selectable filter pill used in content filters & answer scales. */
export function Chip({ active, className, children, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "rounded-pill px-4 py-2 text-sm font-bold whitespace-nowrap transition duration-200 active:scale-[0.97]",
        active
          ? "bg-ink-900 text-canvas"
          : "border border-ink-200 bg-surface text-ink-500 hover:border-ink-300 hover:text-ink-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
