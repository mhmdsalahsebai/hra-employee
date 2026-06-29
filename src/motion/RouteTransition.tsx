import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useNavDirection } from "./useNavDirection";
import { restoreScroll, saveScroll } from "./scrollStore";
import {
  pageVariants,
  reducedVariants,
  slideTransition,
  tabTransition,
} from "./transitions";

/**
 * Animates the routed `<Outlet>` so navigating between screens feels like a
 * native app: deeper screens push in, the back button pops them out, and tab
 * switches cross-dissolve. The exiting screen is taken out of flow
 * (`mode="popLayout"`) so it can overlap the entering one during the slide.
 *
 * The page scrolls naturally on the body. We just remember how far each screen
 * was scrolled and put the user back there on return — the top for a fresh
 * push, the remembered spot for a pop or a tab revisit — the way a native stack
 * keeps every screen's position. That restore happens before paint, so there's
 * never a flash of the wrong offset.
 *
 * `useOutlet()` (rather than `<Outlet/>`) hands us the *current* matched route
 * as an element; AnimatePresence keeps the previously-rendered one mounted —
 * frozen on its last content — until its exit finishes.
 */
export function RouteTransition({ className }: { className?: string }) {
  const location = useLocation();
  const outlet = useOutlet();
  const dir = useNavDirection();
  const reduce = useReducedMotion();

  // The active screen's identity, kept fresh for the scroll listener below.
  const here = useRef({ key: location.key, path: location.pathname });
  here.current = { key: location.key, path: location.pathname };

  // Continuously record the active screen's scroll offset so we can restore it.
  useEffect(() => {
    const onScroll = () =>
      saveScroll(here.current.key, here.current.path, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On each navigation, land at the right offset before the browser paints.
  useLayoutEffect(() => {
    window.scrollTo(0, restoreScroll(location.key, location.pathname, dir));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return (
    <AnimatePresence mode="popLayout" custom={dir} initial={false}>
      <motion.div
        key={location.pathname}
        custom={dir}
        variants={reduce ? reducedVariants : pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={dir === "tab" || reduce ? tabTransition : slideTransition}
        className={className}
        style={{ transformOrigin: "center top" }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
