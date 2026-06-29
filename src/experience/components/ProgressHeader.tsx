/**
 * Survey top bar on the dark stage: a thin animated progress line, the centred
 * "X of N" step text, and a quiet "Skip" text button on the right.
 */
export function ProgressHeader({
  current,
  total,
  accent,
  onSkip,
}: {
  /** 1-based index of the current question. */
  current: number;
  total: number;
  /** Solid accent colour for the filled portion of the line. */
  accent: string;
  /** When omitted, the Skip button is hidden (e.g. for required surveys). */
  onSkip?: () => void;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="pt-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/12">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ width: `${pct}%`, background: accent, boxShadow: `0 0 14px ${accent}` }}
        />
      </div>
      <div className="relative mt-3 flex h-7 items-center justify-center">
        <span className="text-[13px] font-semibold tracking-wide text-white/65">
          {current} من {total}
        </span>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="absolute end-0 top-1/2 -translate-y-1/2 px-1 py-1 text-[13px] font-semibold text-white/50 transition hover:text-white/85"
          >
            تخطي
          </button>
        )}
      </div>
    </div>
  );
}
