import { useId, type CSSProperties, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { clampScore } from "../../lib/score";

/** Linear progress / score bar. Colour the fill via `barClassName` (tokens) or
 *  `barStyle` (dimension accent hex). */
export function ProgressBar({
  value,
  barClassName,
  barStyle,
  trackClassName = "bg-ink-100",
  className,
}: {
  value: number;
  barClassName?: string;
  barStyle?: CSSProperties;
  trackClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-pill", trackClassName, className)}>
      <div
        className={cn("h-full rounded-pill transition-[width] duration-700 ease-out", barClassName)}
        style={{ width: `${clampScore(value)}%`, ...barStyle }}
      />
    </div>
  );
}

/** Circular score ring with a centered slot for the value/label. Pass a two-stop
 *  `gradient` for a richer stroke, or colour via `className` (currentColor). */
export function ScoreRing({
  value,
  size = 132,
  stroke = 11,
  className = "text-brand-500",
  trackClassName = "text-ink-100",
  gradient,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  trackClassName?: string;
  gradient?: [string, string];
  children?: ReactNode;
}) {
  const id = useId().replace(/:/g, "");
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampScore(value) / 100) * circumference;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        {gradient && (
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={gradient[0]} />
              <stop offset="1" stopColor={gradient[1]} />
            </linearGradient>
          </defs>
        )}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke="currentColor"
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke={gradient ? `url(#${id})` : "currentColor"}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset] duration-1000 ease-out", !gradient && className)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
