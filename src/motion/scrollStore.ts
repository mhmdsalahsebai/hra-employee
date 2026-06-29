import type { NavDir } from "./transitions";

/**
 * Per-screen scroll memory — the thing that makes navigation feel native.
 *
 * On a real phone every screen keeps its own scroll position: pop back to a
 * list and it's exactly where you left it; switch tabs and each tab remembers
 * where you were. The web default (one shared body scroll that resets to the
 * top on every route change) is the loudest tell that something is "just a
 * website", so we record each screen's offset and restore it on return.
 *
 *   • by history key  — the precise entry, so a *back* lands pixel-perfect.
 *   • by pathname      — so re-entering a tab restores its last position even
 *                        though it's a brand-new history entry.
 */
const byKey = new Map<string, number>();
const byPath = new Map<string, number>();

export function saveScroll(key: string, path: string, top: number) {
  byKey.set(key, top);
  byPath.set(path, top);
}

/** The scroll offset a freshly-entering screen should start at. */
export function restoreScroll(key: string, path: string, dir: NavDir): number {
  // A pushed screen always opens at the top, the way a new native screen does.
  if (dir === "forward") return 0;
  // A pop returns to the exact entry; tab swaps return to that tab's last spot.
  if (dir === "back") return byKey.get(key) ?? byPath.get(path) ?? 0;
  return byPath.get(path) ?? 0;
}
