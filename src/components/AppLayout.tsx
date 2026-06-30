import { BottomNav } from "./BottomNav";
import { RouteTransition } from "../motion/RouteTransition";

/** The mobile "phone frame": a centered max-width column the whole app lives
 *  inside, framed with a hairline edge so it reads as a held object on desktop.
 *
 *  The page scrolls naturally on the body — `main` is just the positioning +
 *  horizontal-clip context for the transition: while a screen slides in, the
 *  outgoing one is taken out of flow and its off-screen travel is clipped here
 *  (without turning `main` into a vertical scroll container). */
export function AppLayout() {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">
      {/* Soft decorative colour wash behind everything — gentle rose/violet/peach
          orbs that give the shell depth and warmth (see `app-aurora`). */}
      <div className="app-aurora pointer-events-none fixed inset-0 -z-10" aria-hidden />
      <main className="relative flex-1 overflow-x-clip pb-28">
        <RouteTransition />
      </main>
      <BottomNav />
    </div>
  );
}
