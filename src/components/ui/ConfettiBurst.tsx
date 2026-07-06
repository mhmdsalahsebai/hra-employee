import { motion, useReducedMotion } from "motion/react";

/**
 * A one-shot scatter of confetti bursting outward from the centre of its
 * (relatively positioned) parent — the shared "achievement" flourish behind
 * milestone art. Mirrors the AchievementModal burst so every celebration in
 * the app moves the same way. Renders nothing under reduced motion.
 */
const PIECES = [
  { x: -74, y: -22, c: "#e23e6b", d: 0 },
  { x: 70, y: -32, c: "#7c6ee6", d: 0.05 },
  { x: -52, y: 42, c: "#1c9bb4", d: 0.1 },
  { x: 58, y: 46, c: "#d08a1f", d: 0.15 },
  { x: 0, y: -64, c: "#13a394", d: 0.08 },
  { x: -92, y: 14, c: "#df7446", d: 0.12 },
  { x: 90, y: 8, c: "#16855f", d: 0.18 },
  { x: -34, y: -54, c: "#d08a1f", d: 0.2 },
  { x: 38, y: 58, c: "#e23e6b", d: 0.14 },
];

export function ConfettiBurst({ accent }: { accent?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {PIECES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-[2px]"
          style={{ background: accent && i % 3 === 0 ? accent : p.c }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{ x: p.x, y: p.y, scale: 1, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, delay: 0.15 + p.d, ease: "easeOut" }}
        />
      ))}
    </span>
  );
}
