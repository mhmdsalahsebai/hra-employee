import { RouteTransition } from "../motion/RouteTransition";

/** Layout for the full-screen flows (onboarding, assessment) — no bottom nav,
 *  but the same native push/pop page transitions as the rest of the app. The
 *  page scrolls on the body, like every other screen. */
export function FlowLayout() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-canvas">
      <RouteTransition />
    </div>
  );
}
