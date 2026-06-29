import { useRef } from "react";
import { useLocation } from "react-router-dom";
import type { NavDir } from "./transitions";

/** The bottom-nav destinations — moving between any two of these is a "tab" swap. */
const TAB_ROUTES = new Set(["/", "/report", "/plan", "/content", "/profile"]);
const isTab = (path: string) => TAB_ROUTES.has(path);

/** React Router stores a monotonically increasing index in history state; a
 *  lower index than before means the user went *back* (pop), higher means push. */
function historyIndex(): number {
  return (window.history.state?.idx as number | undefined) ?? 0;
}

/**
 * Resolves the direction of the latest navigation so page transitions can play
 * the right way round. Must be used from a component that stays mounted across
 * route changes (e.g. a layout), so its refs survive between navigations.
 */
export function useNavDirection(): NavDir {
  const location = useLocation();
  const dir = useRef<NavDir>("tab");
  const prev = useRef({ idx: historyIndex(), pathname: location.pathname });

  if (prev.current.pathname !== location.pathname) {
    const idx = historyIndex();
    if (isTab(location.pathname) && isTab(prev.current.pathname)) {
      dir.current = "tab";
    } else if (idx < prev.current.idx) {
      dir.current = "back";
    } else {
      dir.current = "forward";
    }
    prev.current = { idx, pathname: location.pathname };
  }

  return dir.current;
}
