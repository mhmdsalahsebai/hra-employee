import type { CSSProperties } from "react";
import { cn } from "../lib/cn";

// Vendored unDraw illustrations (MIT). Every file recolors its single accent
// through the CSS variable `--primary-svg-color`, so the whole set reads as one
// calm family — we just feed it a tone from the cura palette per surface.
import mindfulness from "./assets/mindfulness.svg?raw";
import meditation from "./assets/meditation.svg?raw";
import aMomentToRelax from "./assets/a-moment-to-relax.svg?raw";
import medicalCare from "./assets/medical-care.svg?raw";
import instantSupport from "./assets/instant-support.svg?raw";
import bookLover from "./assets/book-lover.svg?raw";
import wellDone from "./assets/well-done.svg?raw";
import personalGoals from "./assets/personal-goals.svg?raw";
import journey from "./assets/journey.svg?raw";
import healthyHabit from "./assets/healthy-habit.svg?raw";

const REGISTRY = {
  mindfulness,
  meditation,
  "a-moment-to-relax": aMomentToRelax,
  "medical-care": medicalCare,
  "instant-support": instantSupport,
  "book-lover": bookLover,
  "well-done": wellDone,
  "personal-goals": personalGoals,
  journey,
  "healthy-habit": healthyHabit,
} as const;

export type IllustrationName = keyof typeof REGISTRY;

/**
 * A calm, palette-themed decorative illustration. Purely presentational —
 * always `aria-hidden`, since the surrounding copy carries the meaning.
 *
 * `tone` sets the illustration's single accent colour; pass any palette token
 * (e.g. `var(--color-coral-400)`) or a dimension accent hex. Defaults to a
 * soft brand teal so unthemed usages stay quiet.
 */
export function Illustration({
  name,
  tone = "var(--color-brand-400)",
  className,
  style,
}: {
  name: IllustrationName;
  tone?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={cn("cura-illustration", className)}
      style={{ ["--primary-svg-color" as string]: tone, ...style }}
      dangerouslySetInnerHTML={{ __html: REGISTRY[name] }}
    />
  );
}
