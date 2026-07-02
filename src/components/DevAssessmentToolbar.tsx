import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Dices, LayoutList, Trash2 } from "lucide-react";
import { useAssessment } from "../assessment/useAssessment";
import { dimensions, type DimensionId } from "../data/dimensions";
import { useOnboarding } from "../onboarding/useOnboarding";
import { haptic } from "../motion/haptics";
import { CELEBRATED_KEY } from "./AchievementModal";

/** How many dimensions the "partial" shortcut completes — enough to trip the
 *  report preview / accuracy ladder without finishing all nine. */
const PARTIAL_DIMS = 3;

type Feedback =
  | { type: "filled" | "partial" | "cleared" }
  | { type: "dimension"; title: string; filled: boolean }
  | null;

/** Viewport-anchored local tools for exercising assessment-dependent screens. */
export function DevAssessmentToolbar() {
  const {
    fillRandomAnswers,
    fillDimensions,
    setDimensionFilled,
    resetAnswers,
    resultBySlug,
    totalQuestions,
  } = useAssessment();
  const { isComplete } = useOnboarding();
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isOpen, setIsOpen] = useState(true);
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
    showFeedback({ type: "filled" });
  };

  const handlePartial = () => {
    fillDimensions(PARTIAL_DIMS);
    localStorage.removeItem(CELEBRATED_KEY);
    haptic("select");
    showFeedback({ type: "partial" });
  };

  const handleClear = () => {
    resetAnswers();
    // Let the completion celebration fire again on the next full run.
    localStorage.removeItem(CELEBRATED_KEY);
    haptic("select");
    showFeedback({ type: "cleared" });
  };

  const handleDimension = (slug: DimensionId, title: string, filled: boolean) => {
    setDimensionFilled(slug, filled);
    localStorage.removeItem(CELEBRATED_KEY);
    haptic("select");
    showFeedback({ type: "dimension", title, filled });
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="فتح أدوات الاختبار"
        aria-expanded="false"
        className="fixed left-4 top-1/2 z-[55] flex -translate-y-1/2 items-center gap-2 rounded-full border border-ink-200 bg-surface/95 p-2.5 shadow-pop backdrop-blur-xl transition hover:border-brand-300 hover:bg-brand-50 active:scale-95"
      >
        <Dices className="h-4 w-4 text-brand-700" strokeWidth={2.3} />
        <span className="nums rounded-full bg-ink-900 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-white">
          DEV
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-ink-500" aria-hidden="true" />
      </button>
    );
  }

  return (
    <aside
      aria-label="أدوات تطوير التقييم"
      className="fixed left-4 top-1/2 z-[55] max-h-[calc(100vh-2rem)] w-48 -translate-y-1/2 overflow-y-auto rounded-card border border-ink-200 bg-surface/95 p-2.5 shadow-pop backdrop-blur-xl"
    >
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <span className="text-[11px] font-bold text-ink-700">أدوات الاختبار</span>
        <div className="flex items-center gap-1">
          <span className="nums rounded-full bg-ink-900 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-white">
            DEV
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="طي أدوات الاختبار"
            aria-expanded="true"
            className="grid h-6 w-6 place-items-center rounded-full text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 active:scale-95"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
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

      <fieldset className="mt-2 border-t border-ink-100 pt-2">
        <legend className="px-1 pb-1.5 text-[10px] font-bold text-ink-500">
          ملء بُعد محدد
        </legend>
        <div className="grid gap-0.5">
          {dimensions.map((dimension) => {
            const complete = resultBySlug[dimension.id].complete;
            const Icon = dimension.icon;
            return (
              <label
                key={dimension.id}
                className="flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-[11px] font-semibold text-ink-700 transition hover:bg-ink-50"
              >
                <input
                  type="checkbox"
                  checked={complete}
                  onChange={(event) =>
                    handleDimension(dimension.id, dimension.title, event.target.checked)
                  }
                  className="h-3.5 w-3.5 shrink-0 accent-brand-600"
                />
                <Icon
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: dimension.accent.fg }}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                <span>{dimension.title}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p aria-live="polite" className="mt-2 min-h-4 px-1 text-[10px] font-semibold text-ink-500">
        {feedback?.type === "filled" && (
          <span className="inline-flex items-center gap-1 text-good">
            <Check className="h-3 w-3" /> تم ملء {totalQuestions} سؤالًا
          </span>
        )}
        {feedback?.type === "partial" && (
          <span className="inline-flex items-center gap-1 text-brand-700">
            <Check className="h-3 w-3" /> تم إكمال {PARTIAL_DIMS} أبعاد
          </span>
        )}
        {feedback?.type === "cleared" && "تم مسح جميع الإجابات"}
        {feedback?.type === "dimension" &&
          (feedback.filled ? `تم ملء البُعد ${feedback.title}` : `تم مسح البُعد ${feedback.title}`)}
      </p>
    </aside>
  );
}
