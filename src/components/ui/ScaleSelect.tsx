import { useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import type { DimensionAccent } from "../../data/dimensions";
import type { HraAnswerOption } from "../../data/hra";

/**
 * The answer picker for an ordered question — rendered as a single horizontal
 * spectrum instead of a stack of near-identical rows.
 *
 * ~Every question in the assessment is an ordinal scale (agreement, frequency,
 * a graded quantity), so a flat card list threw away the one thing that matters:
 * that the options run from one pole to the other. Here each option is a graded
 * dot on a track — the dots grow and take on the dimension accent toward the
 * healthy end, so the shape of the scale is legible at a glance. One tap, no
 * scroll.
 *
 * Grading is oriented by *health*, not by raw value: `positiveHigh` says which
 * end is the good one, so a reverse-scored item (e.g. "I feel exhausted daily")
 * still reads correctly. Hovering (or focusing) a dot reveals that option's
 * title above the track, so you can confirm a choice before/after committing.
 */

/** Muted low-end colour the accent grades up from. */
const NEUTRAL = "#c2c8d2";

/** Parse "#rrggbb" → [r,g,b]. */
function toRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Blend two hex colours by `t` (0 → a, 1 → b). */
function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${c(r1, r2)}, ${c(g1, g2)}, ${c(b1, b2)})`;
}

export function ScaleSelect({
  answers,
  value,
  onSelect,
  accent,
  positiveHigh,
}: {
  answers: HraAnswerOption[];
  value: number | undefined;
  onSelect: (value: number) => void;
  accent: DimensionAccent;
  /** Whether a higher answer value is the healthy/positive pole. */
  positiveHigh: boolean;
}) {
  const n = answers.length;
  const [hovered, setHovered] = useState<number | null>(null);

  // Rank each option along the *health* axis (0 = worst … n-1 = best) from its
  // position among the sorted values, so the grade reads correctly on either
  // scale direction. Values are distinct and monotonic within a question.
  const meta = useMemo(() => {
    const sortedAsc = [...answers.map((a) => a.value)].sort((x, y) => x - y);
    return answers.map((a) => {
      const rankAsc = sortedAsc.indexOf(a.value);
      const rank = positiveHigh ? rankAsc : n - 1 - rankAsc;
      const frac = n > 1 ? rank / (n - 1) : 1;
      return {
        color: mix(NEUTRAL, accent.solid, frac),
        // Dots grow toward the healthy end for a legible gradient of intensity.
        size: (n >= 6 ? 12 : 14) + frac * (n >= 6 ? 10 : 14),
      };
    });
  }, [answers, n, positiveHigh, accent.solid]);

  const selectedIndex = answers.findIndex((a) => a.value === value);
  // What the label above shows: the hovered option (a preview) wins, else the
  // committed choice.
  const activeIndex = hovered ?? (selectedIndex === -1 ? null : selectedIndex);
  const active = activeIndex === null ? undefined : answers[activeIndex];
  const previewing = hovered !== null && hovered !== selectedIndex;

  return (
    <div className="flex flex-col">
      {/* The active option's title, surfaced so the dots don't have to carry the
          meaning. Hovering a dot previews its title here. A steady min-height
          keeps the card from jumping as it changes. */}
      <div className="flex min-h-[2.75rem] items-center justify-center px-2 text-center">
        {active ? (
          <span
            key={active.value}
            className={cn(
              "text-balance text-[1.05rem] font-extrabold leading-snug transition-colors",
              !previewing && "animate-rise",
            )}
            style={{ color: previewing ? "var(--color-ink-500)" : accent.fg }}
          >
            {active.title}
          </span>
        ) : (
          <span className="text-[0.9rem] font-bold text-ink-300">مرّر واختر إجابتك على المقياس</span>
        )}
      </div>

      {/* The spectrum: a static track with a graded dot per option. */}
      <div className="relative mt-3 h-11">
        <div className="pointer-events-none absolute inset-x-3 top-1/2 h-[3px] -translate-y-1/2 rounded-pill bg-ink-100" />
        <div className="relative flex h-full items-center justify-between">
          {answers.map((answer, i) => {
            const { color, size } = meta[i];
            const isOn = i === selectedIndex;
            return (
              <button
                key={answer.value}
                type="button"
                title={answer.title}
                onClick={() => onSelect(answer.value)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered((h) => (h === i ? null : h))}
                aria-pressed={isOn}
                aria-label={answer.title}
                className="group grid h-11 flex-1 place-items-center outline-none"
              >
                {/* The hit area is the whole column; the visible dot sits in it. */}
                <span
                  className={cn(
                    "block rounded-full transition-all duration-200",
                    !isOn &&
                      "group-hover:scale-125 group-focus-visible:scale-125 group-active:scale-95",
                  )}
                  style={
                    isOn
                      ? {
                          width: size + 8,
                          height: size + 8,
                          background: accent.solid,
                          // A soft accent halo (the "selected" ring) plus a lift.
                          boxShadow: `0 0 0 5px ${accent.soft}, 0 6px 16px -6px ${accent.solid}`,
                        }
                      : { width: size, height: size, background: color }
                  }
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Pole labels anchor the ends. In RTL the first option sits on the right,
          so first→right and last→left line up with the dots above. */}
      <div className="mt-2 flex items-start justify-between gap-3 px-1">
        <span className="max-w-[8rem] text-start text-[0.7rem] font-bold leading-tight text-ink-400">
          {answers[0].title}
        </span>
        <span className="max-w-[8rem] text-end text-[0.7rem] font-bold leading-tight text-ink-400">
          {answers[n - 1].title}
        </span>
      </div>
    </div>
  );
}
