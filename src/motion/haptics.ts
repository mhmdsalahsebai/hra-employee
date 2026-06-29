/**
 * A whisper of haptic feedback on key taps. On devices that support the
 * Vibration API (most Android phones) this lands the same micro-confirmation a
 * native tab bar or back button gives you; everywhere else it's a silent no-op,
 * so it only ever adds to the illusion, never detracts.
 *
 * Durations are deliberately tiny — a "tick", not a buzz.
 */
type Haptic = "tap" | "select";

const PATTERNS: Record<Haptic, number> = {
  tap: 6, // a light press — back buttons, list rows
  select: 10, // a slightly firmer confirm — switching tabs
};

export function haptic(kind: Haptic = "tap") {
  if (typeof navigator === "undefined") return;
  // Some browsers expose `vibrate` but throw/return false when disallowed.
  navigator.vibrate?.(PATTERNS[kind]);
}
