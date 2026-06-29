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
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-canvas">
      <main className="relative flex-1 overflow-x-clip pb-28">
        <RouteTransition />
      </main>
      <BottomNav />
    </div>
  );
}
