import { Check, ChevronLeft, Lock } from "lucide-react";
import { type Dimension, tileStyle } from "../../data/dimensions";
import { ProgressBar } from "../ui";
import { IconTile } from "../ui/Card";
import { DeltaPill } from "../Trend";
import { cn } from "../../lib/cn";
import { LEVEL_CLASS, LEVEL_HEX } from "../../lib/score";
import { useAssessment } from "../../assessment/useAssessment";

/** Small dimension tile for the home "your dimensions" shelf.
 *  When `locked`, it previews the dimension without a score (pre-assessment). */
export function DimensionTile({
  dimension,
  locked,
  onClick,
}: {
  dimension: Dimension;
  locked?: boolean;
  onClick?: () => void;
}) {
  const { resultBySlug } = useAssessment();
  const r = resultBySlug[dimension.id];

  if (locked) {
    return (
      <div className="flex w-[8.5rem] shrink-0 flex-col gap-3 rounded-card border border-ink-100 bg-surface p-4 text-right shadow-soft">
        <div className="flex items-center justify-between">
          <IconTile icon={dimension.icon} className="bg-ink-50 text-ink-300" />
          <Lock className="h-4 w-4 text-ink-300" strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-ink-900">{dimension.title}</h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-ink-400">
            {dimension.tagline}
          </p>
        </div>
        <ProgressBar value={8} barClassName="bg-ink-200" />
      </div>
    );
  }

  const meta = LEVEL_CLASS[r.level];
  return (
    <button
      onClick={onClick}
      className="flex w-[8.5rem] shrink-0 flex-col gap-3 rounded-card border border-ink-100 bg-surface p-4 text-right shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:translate-y-0"
    >
      <div className="flex items-start justify-between">
        <IconTile icon={dimension.icon} style={tileStyle(dimension.accent)} />
        <span className="nums text-[1.75rem] font-extrabold leading-none text-ink-900">
          {r.score}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-ink-900">{dimension.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-ink-400">
          {dimension.tagline}
        </p>
      </div>
      <ProgressBar value={r.score} barClassName={meta.bar} />
    </button>
  );
}

/** Wide dimension row with score + bar for the full report list — taps through
 *  to the dimension's own page. */
export function DimensionRow({
  dimension,
  onClick,
}: {
  dimension: Dimension;
  onClick?: () => void;
}) {
  const { resultBySlug } = useAssessment();
  const r = resultBySlug[dimension.id];
  const meta = LEVEL_CLASS[r.level];
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-card border border-ink-100 bg-surface p-3.5 text-right shadow-soft transition duration-200 hover:border-ink-300 active:scale-[0.99]"
    >
      <IconTile icon={dimension.icon} size="lg" style={tileStyle(dimension.accent)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-[15px] font-bold text-ink-900">{dimension.title}</h3>
          <span className="nums text-lg font-extrabold text-ink-900">{r.score}</span>
        </div>
        <p className="mb-2.5 line-clamp-1 text-xs font-semibold text-ink-400">{r.band.title}</p>
        <ProgressBar value={r.score} barClassName={meta.bar} />
      </div>
      <ChevronLeft className="h-4 w-4 shrink-0 text-ink-300" strokeWidth={2.4} />
    </button>
  );
}

/** Full, self-contained dimension card for the report breakdown: score + peer
 *  benchmark on the bar, the trend, the real verdict, and the top recommendations
 *  — so the whole reading is on the report itself, not one tap away. */
export function DimensionDeepCard({
  dimension,
  onClick,
}: {
  dimension: Dimension;
  onClick?: () => void;
}) {
  const { resultBySlug } = useAssessment();
  const r = resultBySlug[dimension.id];
  const meta = LEVEL_CLASS[r.level];
  const hex = LEVEL_HEX[r.level];
  const advices = r.band.advices.slice(0, 3);
  const vsPeers = r.score - dimension.benchmark;

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-surface shadow-card">
      {/* Header — identity, verdict pill, score */}
      <div className="flex items-start gap-3.5 p-4 pb-3">
        <IconTile icon={dimension.icon} size="lg" style={tileStyle(dimension.accent)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-bold text-ink-900">{dimension.title}</h3>
            <span className="nums text-2xl font-extrabold leading-none" style={{ color: hex }}>
              {r.score}
            </span>
          </div>
          <span className={cn("mt-1.5 inline-block rounded-pill px-2 py-0.5 text-[11px] font-bold", meta.soft)}>
            {r.band.title}
          </span>
        </div>
      </div>

      {/* Score bar with a peer-average marker */}
      <div className="px-4">
        <div className="relative h-2 w-full rounded-pill bg-ink-100">
          <div className="h-full rounded-pill" style={{ width: `${r.score}%`, background: hex }} />
          <span
            className="absolute top-1/2 h-3.5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-400 ring-2 ring-surface"
            style={{ left: `${dimension.benchmark}%` }}
            title="متوسط الزملاء"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold">
          <DeltaPill diff={dimension.trend} />
          <span className="text-ink-400">
            {vsPeers === 0 ? (
              <>بمستوى متوسط الزملاء</>
            ) : (
              <>
                <span dir="ltr" className={cn("nums font-bold", vsPeers > 0 ? "text-good" : "text-alert")}>
                  {vsPeers > 0 ? "+" : "−"}
                  {Math.abs(vsPeers)}
                </span>{" "}
                مقابل متوسط الزملاء (<span dir="ltr" className="nums">{dimension.benchmark}</span>)
              </>
            )}
          </span>
        </div>
      </div>

      {/* The real verdict for this band */}
      <p className="px-4 pt-3.5 text-[0.8125rem] leading-[1.8] text-ink-600">{r.band.description}</p>

      {/* Top concrete recommendations, pulled forward from the dimension page */}
      {advices.length > 0 && (
        <div className="mt-3 space-y-1.5 px-4">
          {advices.map((advice, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full"
                style={{ color: dimension.accent.fg, background: dimension.accent.soft }}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <p className="text-[0.8125rem] font-semibold leading-relaxed text-ink-700">{advice}</p>
            </div>
          ))}
        </div>
      )}

      {/* Into the full dimension — edit answers, read everything */}
      <button
        onClick={onClick}
        className="mt-3.5 flex w-full items-center justify-between border-t border-ink-100 px-4 py-3 text-right text-[0.8125rem] font-bold text-ink-700 transition hover:bg-ink-50 active:scale-[0.99]"
      >
        <span>افتح البُعد · حلّل أعمق وعدّل إجاباتك</span>
        <ChevronLeft className="h-4 w-4 shrink-0 text-ink-300" strokeWidth={2.4} />
      </button>
    </div>
  );
}
