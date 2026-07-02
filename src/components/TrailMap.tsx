import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";
import { LEVEL_HEX } from "../lib/score";
import type { DimensionResult } from "../assessment/useAssessment";
import type { Dimension } from "../data/dimensions";

/** Soft pastel fill from a solid accent — the modern colour-blocked card look. */
export const pastel = (hex: string, pct = 12) => `color-mix(in srgb, ${hex} ${pct}%, white)`;

/* ── The winding journey trail — stations on a dotted path that fills in with
   each station's own accent as it's walked. Shared between the Home preview
   and the dedicated journey page so the road reads the same everywhere. ────── */

/** Horizontal station positions (% of trail width), cycling right → centre →
 *  left → centre so the path winds like a map rather than stacking in a line. */
const TRAIL_X = [76, 47, 20, 47];

export interface TrailStation {
  key: string;
  /** Content of the circular node — usually an icon. */
  icon: ReactNode;
  /** Extra classes on the circle (shadow, text colour, border…). */
  circleClassName?: string;
  circleStyle?: CSSProperties;
  /** Circle diameter in px. */
  size?: number;
  /** Slow ping behind the circle — marks "you are here". */
  pulseColor?: string;
  /** Corner badge (step number / check) — positioned absolutely by the caller. */
  badge?: ReactNode;
  title: ReactNode;
  /** Title colour/emphasis override (defaults to ink-900). */
  titleClassName?: string;
  /** Caption node(s) under the title — callers style their own spans. */
  caption?: ReactNode;
  /** Label column width class (default w-28). */
  labelWidth?: string;
  /** Whether the path segment *leaving* this station has been walked. */
  walked?: boolean;
  /** Stroke colour of that walked segment. */
  pathColor?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function TrailMap({
  stations,
  stepY = 96,
  topY = 44,
  bottomPad = 92,
  className,
}: {
  stations: TrailStation[];
  /** Vertical pitch between stations, px. */
  stepY?: number;
  /** First station's centre y, px. */
  topY?: number;
  /** Space under the last station for its label, px. */
  bottomPad?: number;
  className?: string;
}) {
  // The curved path needs real pixel coordinates, so measure the container.
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setWidth(el.clientWidth));
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const pointOf = (order: number) => ({
    x: (TRAIL_X[order % TRAIL_X.length] / 100) * width,
    y: topY + order * stepY,
  });
  const height = topY + (stations.length - 1) * stepY + bottomPad;

  return (
    <div ref={ref} className={cn("relative", className)} style={{ height }}>
      {width > 0 && (
        <svg className="absolute inset-0" width={width} height={height} aria-hidden>
          {stations.slice(0, -1).map((station, i) => {
            const from = pointOf(i);
            const to = pointOf(i + 1);
            const walked = station.walked ?? false;
            return (
              <path
                key={station.key}
                d={`M ${from.x} ${from.y} C ${from.x} ${from.y + stepY / 2}, ${to.x} ${to.y - stepY / 2}, ${to.x} ${to.y}`}
                fill="none"
                stroke={walked ? (station.pathColor ?? "var(--color-ink-200)") : "var(--color-ink-200)"}
                strokeWidth={walked ? 3.5 : 3}
                strokeLinecap="round"
                strokeDasharray={walked ? undefined : "0.5 9"}
                opacity={walked ? 0.8 : 1}
              />
            );
          })}
        </svg>
      )}

      {stations.map((station, i) => {
        const size = station.size ?? 54;
        const { x, y } = pointOf(i);
        return (
          <button
            key={station.key}
            onClick={station.onClick}
            disabled={station.disabled}
            className={cn(
              "absolute z-10 flex -translate-x-1/2 flex-col items-center",
              station.labelWidth ?? "w-28",
              station.disabled && "cursor-not-allowed",
            )}
            style={{ left: x, top: y - size / 2 }}
          >
            <span
              className={cn(
                "relative grid place-items-center rounded-full transition duration-200",
                !station.disabled && "hover:-translate-y-0.5",
                station.circleClassName,
              )}
              style={{ height: size, width: size, ...station.circleStyle }}
            >
              {station.pulseColor && (
                <span
                  className="absolute inset-0 animate-ping rounded-full [animation-duration:2.4s]"
                  style={{ background: station.pulseColor, opacity: 0.2 }}
                />
              )}
              {station.icon}
              {station.badge}
            </span>
            <span
              className={cn(
                "mt-1.5 text-[11.5px] font-extrabold leading-tight",
                station.titleClassName ?? "text-ink-900",
              )}
            >
              {station.title}
            </span>
            {station.caption}
          </button>
        );
      })}
    </div>
  );
}

/** One wellbeing dimension as a trail station — completed stations fill with
 *  their accent, the next one pulses, and every station stays tappable
 *  (dimensions are never locked). */
export function dimensionStation({
  dimension,
  result,
  isNext,
  step,
  onClick,
}: {
  dimension: Dimension;
  result: DimensionResult;
  isNext: boolean;
  /** 1-based station number shown on the badge while incomplete. */
  step: number;
  onClick: () => void;
}): TrailStation {
  const accent = dimension.accent;
  const done = result.complete;
  return {
    key: dimension.id,
    icon: <dimension.icon className="relative h-6 w-6" strokeWidth={2} />,
    circleClassName: cn("shadow-soft", isNext && "bg-white", done && "text-white"),
    circleStyle: done
      ? { background: accent.solid }
      : isNext
        ? { color: accent.fg, boxShadow: `0 0 0 3px ${accent.solid}` }
        : { background: pastel(accent.solid, 16), color: accent.fg },
    pulseColor: isNext ? accent.solid : undefined,
    badge: done ? (
      <span className="absolute -bottom-0.5 -left-0.5 grid h-5 w-5 place-items-center rounded-full bg-good text-white shadow-soft ring-2 ring-white">
        <Check className="h-3 w-3" strokeWidth={3.5} />
      </span>
    ) : (
      <span
        className="nums absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-extrabold shadow-soft"
        style={{ color: accent.fg }}
      >
        {step}
      </span>
    ),
    title: dimension.title,
    caption: done ? (
      <span
        className="nums text-[11px] font-extrabold leading-tight"
        style={{ color: LEVEL_HEX[result.level] }}
      >
        {result.score}
      </span>
    ) : isNext ? (
      <span className="text-[10px] font-extrabold leading-tight" style={{ color: accent.fg }}>
        {result.answered > 0 ? "أكمل الآن" : "ابدأ الآن"}
      </span>
    ) : (
      <span className="line-clamp-1 w-full text-center text-[10px] font-semibold leading-tight text-ink-400">
        {dimension.tagline}
      </span>
    ),
    walked: done,
    pathColor: accent.solid,
    onClick,
  };
}
