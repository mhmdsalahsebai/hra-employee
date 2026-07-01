import { useEffect, useRef, useState } from "react";
import { Check, Dices, LayoutList, Trash2 } from "lucide-react";
import { useAssessment } from "../assessment/useAssessment";
import { useOnboarding } from "../onboarding/useOnboarding";
import { haptic } from "../motion/haptics";
import { CELEBRATED_KEY } from "./AchievementModal";

/** How many dimensions the "partial" shortcut completes — enough to trip the
 *  report preview / accuracy ladder without finishing all nine. */
const PARTIAL_DIMS = 3;

type Feedback = "filled" | "partial" | "cleared" | null;

/** Viewport-anchored local tools for exercising assessment-dependent screens. */
export function DevAssessmentToolbar() {
  const { fillRandomAnswers, fillDimensions, resetAnswers, totalQuestions } = useAssessment();
  const { isComplete } = useOnboarding();
  const [feedback, setFeedback] = useState<Feedback>(null);
  const resetTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  if (!import.meta.env.DEV || !isComplete) return null;

  const showFeedback = (next: Exclude<Feedback, null>) => {
    setFeedback(next);
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setFeedback(null), 2200);
  };

  const handleFill = () => {
    fillRandomAnswers();
    haptic("select");
    showFeedback("filled");
  };

  const handlePartial = () => {
    fillDimensions(PARTIAL_DIMS);
    localStorage.removeItem(CELEBRATED_KEY);
    haptic("select");
    showFeedback("partial");
  };

  const handleClear = () => {
    resetAnswers();
    // Let the completion celebration fire again on the next full run.
    localStorage.removeItem(CELEBRATED_KEY);
    haptic("select");
    showFeedback("cleared");
  };

  return (
    <aside
      aria-label="أدوات تطوير التقييم"
      className="fixed left-4 top-1/2 z-[55] w-40 -translate-y-1/2 rounded-card border border-ink-200 bg-surface/95 p-2.5 shadow-pop backdrop-blur-xl"
    >
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <span className="text-[11px] font-bold text-ink-700">أدوات الاختبار</span>
        <span className="nums rounded-full bg-ink-900 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-white">
          DEV
        </span>
      </div>

      <div className="grid gap-1.5">
        <button
          type="button"
          onClick={handleFill}
          title={`تعبئة ${totalQuestions} إجابة عشوائية`}
          className="flex h-10 w-full items-center gap-2 rounded-md bg-brand-600 px-3 text-xs font-bold text-white shadow-soft transition hover:bg-brand-700 active:scale-[0.98]"
        >
          <Dices className="h-4 w-4 shrink-0" strokeWidth={2.3} />
          <span>ملء عشوائي</span>
        </button>

        <button
          type="button"
          onClick={handlePartial}
          title={`إكمال ${PARTIAL_DIMS} أبعاد فقط — لمعاينة التقرير المبدئي`}
          className="flex h-10 w-full items-center gap-2 rounded-md border border-brand-200 bg-brand-50 px-3 text-xs font-bold text-brand-700 transition hover:bg-brand-100 active:scale-[0.98]"
        >
          <LayoutList className="h-4 w-4 shrink-0" strokeWidth={2.3} />
          <span>ملء {PARTIAL_DIMS} أبعاد</span>
        </button>

        <button
          type="button"
          onClick={handleClear}
          title="مسح جميع إجابات التقييم"
          className="flex h-10 w-full items-center gap-2 rounded-md border border-alert/20 bg-alert-soft px-3 text-xs font-bold text-alert transition hover:border-alert/35 hover:bg-alert/15 active:scale-[0.98]"
        >
          <Trash2 className="h-4 w-4 shrink-0" strokeWidth={2.2} />
          <span>مسح الإجابات</span>
        </button>
      </div>

      <p aria-live="polite" className="mt-2 min-h-4 px-1 text-[10px] font-semibold text-ink-500">
        {feedback === "filled" && (
          <span className="inline-flex items-center gap-1 text-good">
            <Check className="h-3 w-3" /> تم ملء {totalQuestions} سؤالًا
          </span>
        )}
        {feedback === "partial" && (
          <span className="inline-flex items-center gap-1 text-brand-700">
            <Check className="h-3 w-3" /> تم إكمال {PARTIAL_DIMS} أبعاد
          </span>
        )}
        {feedback === "cleared" && "تم مسح جميع الإجابات"}
      </p>
    </aside>
  );
}
