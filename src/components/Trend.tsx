import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../lib/cn";

/** A compact "+5 since last time" pill. Green when up, coral when down, muted
 *  when flat. For "up is bad" metrics (e.g. stress) pass `invert`. On the dark
 *  Spotlight, pass `onDark` for a translucent treatment. */
export function DeltaPill({
  diff,
  invert = false,
  onDark = false,
  className,
}: {
  diff: number;
  invert?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  const dir = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  const good = invert ? dir === "down" : dir === "up";
  const Icon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus;
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";

  const tone = onDark
    ? dir === "flat"
      ? "bg-white/10 text-white/70"
      : good
        ? "bg-good/25 text-white"
        : "bg-coral-400/25 text-white"
    : dir === "flat"
      ? "bg-ink-100 text-ink-500"
      : good
        ? "bg-good-soft text-good"
        : "bg-alert-soft text-alert";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-bold",
        tone,
        className,
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2.6} />
      <span className="nums" dir="ltr">
        {sign}
        {Math.abs(diff)}
      </span>
    </span>
  );
}
