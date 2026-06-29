import type { CSSProperties } from "react";

/**
 * The dark premium stage shared by every experience screen: a deep night
 * gradient washed with a few large soft colour orbs, plus small slowly drifting
 * "wellness signal" dots. Calm, never confetti. Purely decorative.
 */

interface Orb {
  /** CSS inset values (top/right/bottom/left). */
  pos: CSSProperties;
  size: number;
  color: string;
}

interface Dot {
  top: string;
  left: string;
  size: number;
  color: string;
  opacity: number;
  dur: string;
  delay: string;
  /** A soft expanding halo, used on a few dots only. */
  pulse?: boolean;
}

/* Large ambient colour washes — soft blue, lavender, mint, coral. */
const ORBS: Orb[] = [
  { pos: { top: "-12%", left: "-18%" }, size: 320, color: "#3a5cff" },
  { pos: { top: "2%", right: "-22%" }, size: 300, color: "#7c6cf0" },
  { pos: { bottom: "-8%", left: "-14%" }, size: 300, color: "#22c19a" },
  { pos: { bottom: "10%", right: "-20%" }, size: 260, color: "#f4675f" },
];

/* Small crisp signals scattered across the field. */
const DOTS: Dot[] = [
  { top: "14%", left: "16%", size: 6, color: "#8aa0ff", opacity: 0.7, dur: "9s", delay: "0s", pulse: true },
  { top: "22%", left: "78%", size: 5, color: "#7ef0d0", opacity: 0.7, dur: "11s", delay: "1.2s" },
  { top: "30%", left: "40%", size: 4, color: "#ffd27a", opacity: 0.6, dur: "8s", delay: "0.6s" },
  { top: "44%", left: "86%", size: 5, color: "#9d8cff", opacity: 0.6, dur: "12s", delay: "2s", pulse: true },
  { top: "52%", left: "10%", size: 4, color: "#f48fa0", opacity: 0.6, dur: "10s", delay: "0.3s" },
  { top: "64%", left: "70%", size: 6, color: "#7ef0d0", opacity: 0.55, dur: "13s", delay: "1.6s" },
  { top: "72%", left: "30%", size: 4, color: "#8aa0ff", opacity: 0.6, dur: "9.5s", delay: "0.9s" },
  { top: "12%", left: "54%", size: 3, color: "#ffd27a", opacity: 0.55, dur: "10.5s", delay: "2.4s" },
  { top: "82%", left: "84%", size: 4, color: "#9d8cff", opacity: 0.5, dur: "11.5s", delay: "0.2s" },
];

export function DarkDecoratedBackground() {
  return (
    <div className="exp-night pointer-events-none absolute inset-0 overflow-hidden">
      {/* large soft colour washes */}
      {ORBS.map((orb, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full blur-[72px]"
          style={{
            ...orb.pos,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            opacity: 0.22,
          }}
        />
      ))}

      {/* drifting wellness signals */}
      {DOTS.map((dot, i) => (
        <span
          key={`dot-${i}`}
          className="exp-drift absolute block rounded-full"
          style={
            {
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              background: dot.color,
              boxShadow: `0 0 12px ${dot.color}`,
              "--exp-dot-opacity": dot.opacity,
              "--exp-dot-dur": dot.dur,
              "--exp-dot-delay": dot.delay,
            } as CSSProperties
          }
        >
          {dot.pulse && (
            <span
              className="exp-pulse absolute inset-0 rounded-full"
              style={{ background: dot.color }}
            />
          )}
        </span>
      ))}

      {/* a faint vignette to seat the cards */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(0,0,0,0.45),transparent_60%)]" />
    </div>
  );
}
