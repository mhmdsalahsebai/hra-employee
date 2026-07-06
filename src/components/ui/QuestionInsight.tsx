import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BookMarked, ChevronLeft, FlaskConical, Sparkles } from "lucide-react";
import { Button } from "./Button";
import type { DimensionAccent } from "../../data/dimensions";
import {
  INSIGHT_KIND_LABEL,
  type InsightStat,
  type QuestionInsight as QuestionInsightData,
} from "../../data/questionInsights";

/**
 * A note that slides up after the person answers a question that carries an
 * insight — either a sourced research finding ("حقيقة علمية") or an
 * encouragement ("تشجيع"). It deliberately pauses the auto-advance so the
 * moment is read, not skipped: the person taps متابعة (or the dimmed backdrop)
 * to go on.
 *
 * When the insight carries a stat, the card leads with the number: it counts
 * up and a meter fills beneath it. The source line (the named study or
 * organization) anchors the whole card in evidence — the stat is the hook,
 * the text is the takeaway.
 *
 * Portaled to <body> and pinned to the bottom so it floats above both quiz
 * flows (the Assessment page and the DimensionQuiz overlay) without being
 * trapped by their transformed/stacked ancestors.
 */

const COUNT_UP_MS = 1100;
const COUNT_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Animates 0 → target with an ease-out, skipped under reduced motion. */
function useCountUp(target: number, duration = COUNT_UP_MS) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/** The headline number: count-up figure, its meaning, and a filling meter. */
function StatBlock({ stat, accent }: { stat: InsightStat; accent: DimensionAccent }) {
  const shown = useCountUp(stat.value);
  const isPercent = Boolean(stat.suffix?.includes("٪")) && stat.value <= 100;

  // The meter starts empty and transitions to its share on the next frame,
  // in step with the count-up. Percent stats fill to their value; other
  // figures get a full decorative sweep.
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="rounded-2xl p-4" style={{ background: accent.soft }}>
      <div className="flex items-baseline gap-1.5" style={{ color: accent.fg }}>
        <span className="animate-pop text-[38px] font-extrabold leading-none tracking-tight tabular-nums">
          {stat.prefix}
          {shown}
          {stat.suffix}
        </span>
      </div>

      <p className="mt-2 text-[13px] font-semibold leading-relaxed text-ink-700">{stat.label}</p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-surface/70">
        <div
          className="h-full rounded-pill"
          style={{
            background: `linear-gradient(90deg, ${accent.solid}, ${accent.fg})`,
            width: filled ? `${isPercent ? stat.value : 100}%` : "0%",
            transition: `width ${COUNT_UP_MS}ms ${COUNT_EASE}`,
          }}
        />
      </div>
    </div>
  );
}

export function QuestionInsight({
  insight,
  accent,
  onContinue,
  continueLabel = "متابعة",
}: {
  insight: QuestionInsightData;
  accent: DimensionAccent;
  onContinue: () => void;
  /** Overrides the button label — e.g. the final question closes the flow. */
  continueLabel?: string;
}) {
  const Icon = insight.kind === "fact" ? FlaskConical : Sparkles;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      {/* Dim the questionnaire behind, and let a tap anywhere continue. */}
      <button
        type="button"
        aria-label="متابعة"
        onClick={onContinue}
        className="absolute inset-0 bg-ink-900/25 backdrop-blur-[1.5px]"
      />

      <div className="relative mx-auto w-full max-w-[480px] px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div
          className="animate-rise stagger rounded-[24px] border bg-surface p-5 shadow-soft"
          style={{ borderColor: accent.soft, boxShadow: `0 -14px 44px -20px ${accent.solid}` }}
          role="status"
        >
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-pill px-3 py-1 text-[11px] font-bold"
            style={{ color: accent.fg, background: accent.soft }}
          >
            <Icon className="animate-pop h-3.5 w-3.5" strokeWidth={2.4} />
            {INSIGHT_KIND_LABEL[insight.kind]}
          </span>

          {insight.stat && (
            <div className="mt-3">
              <StatBlock stat={insight.stat} accent={accent} />
            </div>
          )}

          <p className="mt-3 text-[15px] font-semibold leading-relaxed text-ink-800">
            {insight.text}
          </p>

          {insight.source && (
            <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-ink-500">
              <BookMarked className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} />
              المصدر: {insight.source}
            </p>
          )}

          <div className="mt-4">
            <Button fullWidth size="lg" onClick={onContinue}>
              {continueLabel}
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
