import { createPortal } from "react-dom";
import { ChevronLeft, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "./Button";
import type { DimensionAccent } from "../../data/dimensions";
import {
  INSIGHT_KIND_LABEL,
  type QuestionInsight as QuestionInsightData,
} from "../../data/questionInsights";

/**
 * A warm little note that slides up after the person answers a question that
 * carries an insight — either an encouragement ("تشجيع") or a useful, grounded
 * fact ("معلومة مفيدة"). It deliberately pauses the auto-advance so the moment
 * is read, not skipped: the person taps متابعة (or the dimmed backdrop) to go on.
 *
 * Portaled to <body> and pinned to the bottom so it floats above both quiz
 * flows (the Assessment page and the DimensionQuiz overlay) without being
 * trapped by their transformed/stacked ancestors.
 */
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
  const isTip = insight.kind === "tip";
  const Icon = isTip ? Lightbulb : Sparkles;

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
          className="animate-rise rounded-[24px] border bg-surface p-5 shadow-soft"
          style={{ borderColor: accent.soft, boxShadow: `0 -14px 44px -20px ${accent.solid}` }}
          role="status"
        >
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-pill px-3 py-1 text-[11px] font-bold"
            style={{ color: accent.fg, background: accent.soft }}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
            {INSIGHT_KIND_LABEL[insight.kind]}
          </span>

          <p className="mt-3 text-[15px] font-semibold leading-relaxed text-ink-800">
            {insight.text}
          </p>

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
