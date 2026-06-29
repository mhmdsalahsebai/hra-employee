import type { Transition, Variants } from "motion/react";

/**
 * Native-app page transitions.
 *
 * The app is RTL, so the physical slide directions are mirrored from iOS LTR:
 *   • forward (push)  — the new screen slides fully in from the LEFT while the
 *     old one parallaxes a third of the way RIGHT and recedes under a shade,
 *     so it reads as sliding *underneath* — not fading out.
 *   • back (pop)      — the mirror: the previous screen rises back from beneath
 *     on the RIGHT as the current one slides off to the LEFT.
 *   • tab             — switching between bottom-nav tabs cross-dissolves with a
 *     hair of scale, the way native tab bars swap content (no horizontal travel).
 *
 * The depth cue is opacity-preserving on purpose: real iOS keeps the lower
 * screen fully opaque and simply darkens it (`brightness`), where translucency
 * would betray the stack as flat web layers.
 *
 * `custom` carries the navigation direction into the variants so the same
 * element can describe both the entering and the exiting screen of a transition.
 */
export type NavDir = "forward" | "back" | "tab";

/** iOS-like deceleration curve for the full-screen push/pop. */
const SLIDE_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
/** Quick, soft curve for the tab cross-dissolve. */
const FADE_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** How far the underlying screen parallaxes — UIKit uses ~30% of the travel. */
const PARALLAX = "30%";
/** The shade the receding screen sits under while it's "behind". */
const SHADE = "brightness(0.82)";
const LIT = "brightness(1)";

export const slideTransition: Transition = { duration: 0.44, ease: SLIDE_EASE };
export const tabTransition: Transition = { duration: 0.26, ease: FADE_EASE };

export const pageVariants: Variants = {
  initial: (dir: NavDir) =>
    dir === "tab"
      ? { opacity: 0, scale: 0.985, filter: LIT }
      : dir === "back"
        ? { x: PARALLAX, filter: SHADE }
        : { x: "-100%", filter: LIT },
  animate: { x: "0%", opacity: 1, scale: 1, filter: LIT },
  exit: (dir: NavDir) =>
    dir === "tab"
      ? { opacity: 0, scale: 0.985, filter: LIT }
      : dir === "back"
        ? { x: "-100%", filter: LIT }
        : { x: PARALLAX, filter: SHADE },
};

/** When the user prefers reduced motion, collapse every transition to a fade. */
export const reducedVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
