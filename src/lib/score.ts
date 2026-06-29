/** Shared logic for turning a 0–100 wellbeing score into a label + colour.
 *  Three calm, muted levels — never neon. Score colour carries *meaning*
 *  (how you're doing); dimension accents carry identity (which area). */

export type ScoreLevel = "good" | "moderate" | "attention";

export interface ScoreMeta {
  level: ScoreLevel;
  /** Arabic status label shown next to scores. */
  label: string;
  /** Tailwind text colour for the number / ring. */
  text: string;
  /** Soft status pill (tinted bg + text). */
  soft: string;
  /** Solid background for a progress-bar fill. */
  bar: string;
  /** Raw hex (strong) — for SVG ring strokes & gradients. */
  hex: string;
  /** Raw hex (soft tint). */
  hexSoft: string;
}

export function scoreMeta(score: number): ScoreMeta {
  if (score >= 75) {
    return {
      level: "good",
      label: "جيدة",
      text: "text-good",
      soft: "bg-good-soft text-good",
      bar: "bg-good",
      hex: "#16855f",
      hexSoft: "rgba(22,133,95,0.12)",
    };
  }
  if (score >= 60) {
    return {
      level: "moderate",
      label: "متوسطة",
      text: "text-warn",
      soft: "bg-warn-soft text-warn",
      bar: "bg-warn",
      hex: "#b77118",
      hexSoft: "rgba(183,113,24,0.13)",
    };
  }
  return {
    level: "attention",
    label: "تحتاج عناية",
    text: "text-alert",
    soft: "bg-alert-soft text-alert",
    bar: "bg-alert",
    hex: "#cc4d3f",
    hexSoft: "rgba(204,77,63,0.12)",
  };
}

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Strong hex per status level — for SVG strokes, dots and inline accents when
 *  the level comes from a score band rather than a raw threshold. */
export const LEVEL_HEX: Record<ScoreLevel, string> = {
  good: "#16855f",
  moderate: "#b77118",
  attention: "#cc4d3f",
};

/** Tailwind text + soft-pill classes per level. */
export const LEVEL_CLASS: Record<ScoreLevel, { text: string; soft: string; bar: string; label: string }> = {
  good: { text: "text-good", soft: "bg-good-soft text-good", bar: "bg-good", label: "جيدة" },
  moderate: { text: "text-warn", soft: "bg-warn-soft text-warn", bar: "bg-warn", label: "متوسطة" },
  attention: { text: "text-alert", soft: "bg-alert-soft text-alert", bar: "bg-alert", label: "تحتاج عناية" },
};
