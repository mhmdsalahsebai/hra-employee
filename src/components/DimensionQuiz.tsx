import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button, OptionCard, QuestionCardDeck, type QuestionCardDeckHandle } from "./ui";
import { cn } from "../lib/cn";
import { dimensionsById, type DimensionId } from "../data/dimensions";
import { hraBySlug } from "../data/hra";
import { useAssessment } from "../assessment/useAssessment";

/**
 * Full-screen, one-question-at-a-time flow for answering a single dimension.
 *
 * Built so a question NEVER scrolls: a tight header, compact graded answer rows
 * (a 7-point scale fits one screen), and a fixed action bar. The whole flow is
 * themed to the dimension's accent so it feels bespoke, not generic. Answers
 * save as you go — leave, step back, and confirm forward at your own pace.
 */
export function DimensionQuiz({ dimId, onClose }: { dimId: DimensionId; onClose: () => void }) {
  const dim = dimensionsById[dimId];
  const hra = hraBySlug[dimId];
  const { answers, setAnswer } = useAssessment();
  const questions = hra.questions;
  const total = questions.length;

  // Freeze the resume point for this deck instance. Recomputing it after every
  // answer would mutate Swiper's initial-slide input while it is already live.
  const [initialIndex] = useState(() => {
    const firstUnanswered = questions.findIndex((q) => answers[q.slug] === undefined);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const [index, setIndex] = useState(initialIndex);
  const [done, setDone] = useState(false);
  const deckRef = useRef<QuestionCardDeckHandle>(null);

  const q = questions[index];
  const value = answers[q.slug];
  const answeredNow = questions.filter((qq) => answers[qq.slug] !== undefined).length;
  const progress = done ? 100 : Math.round((answeredNow / total) * 100);
  const isLast = index + 1 >= total;

  function next() {
    if (value === undefined) return;
    if (isLast) setDone(true);
    else deckRef.current?.next();
  }
  function back() {
    deckRef.current?.previous();
  }

  // Portal to <body>: the dimension screen animates with a transform, which would
  // otherwise trap this fixed overlay in that ancestor's stacking context and let
  // the bottom nav (z-40) paint over it.
  return createPortal(
    <div className="fixed inset-0 z-50 mx-auto flex h-dvh w-full max-w-[480px] flex-col bg-canvas">
      {/* One calm light source washing down from the top — never a gradient hero */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80"
        style={{ background: `radial-gradient(120% 70% at 50% -10%, ${dim.accent.soft}, transparent 70%)` }}
      />

      {done ? (
        <DimensionDone dim={dim} onClose={onClose} />
      ) : (
        <>
          {/* Header — a thin progress line, the step count, and leave-anytime
              (answers are saved as you go), echoing the onboarding survey bar. */}
          <div className="relative z-10 shrink-0 px-5 pt-[max(1.15rem,env(safe-area-inset-top))] pb-1">
            <div className="h-1.5 w-full overflow-hidden rounded-pill bg-ink-100">
              <div
                className="h-full rounded-pill transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%`, background: dim.accent.solid }}
              />
            </div>
            <div className="relative mt-3 flex h-7 items-center justify-center">
              <span dir="ltr" className="nums text-[0.8125rem] font-bold text-ink-500">
                {index + 1}
                <span className="text-ink-300"> / {total}</span>
              </span>
              <button
                onClick={onClose}
                aria-label="الخروج من التقييم"
                className="absolute end-0 top-1/2 -translate-y-1/2 px-1 text-[0.8125rem] font-bold text-ink-400 transition hover:text-ink-700 active:scale-95"
              >
                إنهاء لاحقًا
              </button>
            </div>
          </div>

          {/* Swiper owns the physical card stack and swipe gesture; answer
              validation still belongs to this assessment flow. */}
          <div
            className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3"
          >
            <QuestionCardDeck
              ref={deckRef}
              initialIndex={initialIndex}
              canGoForward={value !== undefined}
              onIndexChange={setIndex}
              label={`أسئلة بُعد ${dim.title}`}
            >
              {questions.map((question, questionIndex) => {
                const slideValue = answers[question.slug];
                const slideAnswered = slideValue !== undefined;
                const slideIsLast = questionIndex + 1 >= total;
                const denseAnswers = question.answers.length > 5;

                return (
                  <div
                    key={question.slug}
                    data-quiz-card
                    className={cn(
                      "flex h-full min-h-0 flex-col rounded-[24px] border border-ink-100 bg-surface",
                      denseAnswers ? "p-5" : "p-6",
                    )}
                  >
                    <span
                      className="inline-flex w-fit items-center gap-1.5 rounded-pill px-3 py-1 text-[11px] font-bold"
                      style={{ color: dim.accent.fg, background: dim.accent.soft }}
                    >
                      <dim.icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                      بُعد {dim.title}
                    </span>

                    <div className="mt-4 flex gap-3">
                      <span
                        className="mt-[9px] h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          background: dim.accent.solid,
                          boxShadow: `0 0 10px ${dim.accent.solid}`,
                        }}
                      />
                      <h1 className="text-balance text-[1.35rem] font-extrabold leading-[1.4] text-ink-900">
                        {question.title}
                      </h1>
                    </div>
                    <p className="mt-2 text-[0.8125rem] font-semibold text-ink-400">
                      اختر الإجابة الأقرب لحالك
                    </p>

                    <div
                      className={cn(
                        "stagger -mx-1 mt-5 px-1 pb-1",
                        denseAnswers
                          ? "grid grid-cols-2 items-stretch gap-2"
                          : "flex min-h-0 flex-1 flex-col gap-2.5",
                      )}
                    >
                      {question.answers.map((option) => (
                        <OptionCard
                          key={option.value}
                          label={option.title}
                          selected={slideValue === option.value}
                          onClick={() => setAnswer(question.slug, option.value)}
                          accent={dim.accent}
                          compact={denseAnswers}
                        />
                      ))}
                    </div>

                    <div className="mt-auto flex shrink-0 items-center gap-3 pt-5">
                      {questionIndex > 0 && (
                        <button
                          data-no-swipe
                          onClick={back}
                          aria-label="السؤال السابق"
                          className="inline-flex h-14 items-center gap-1.5 rounded-[16px] px-4 text-[15px] font-bold text-ink-500 transition hover:text-ink-900 active:scale-[0.98]"
                        >
                          <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
                          السابق
                        </button>
                      )}
                      <button
                        data-no-swipe
                        onClick={next}
                        disabled={!slideAnswered}
                        className={cn(
                          "inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-[16px] text-base font-bold transition-all duration-200 active:scale-[0.98]",
                          !slideAnswered
                            ? "cursor-not-allowed bg-ink-100 text-ink-400"
                            : "text-white",
                        )}
                        style={
                          slideAnswered
                            ? {
                                background: dim.accent.solid,
                                boxShadow: `0 16px 34px -18px ${dim.accent.solid}`,
                              }
                            : undefined
                        }
                      >
                        {slideIsLast ? "إنهاء التقييم" : "التالي"}
                        {slideIsLast ? (
                          <Sparkles className="h-5 w-5" strokeWidth={2.2} />
                        ) : (
                          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </QuestionCardDeck>
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}

function DimensionDone({
  dim,
  onClose,
}: {
  dim: (typeof dimensionsById)[DimensionId];
  onClose: () => void;
}) {
  return (
    <div className="animate-rise relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center">
      <div className="relative grid h-32 w-32 place-items-center">
        <span className="absolute inset-0 rounded-full opacity-40" style={{ background: dim.accent.soft }} />
        <span className="absolute inset-3 rounded-full opacity-75" style={{ background: dim.accent.soft }} />
        <span
          className="relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full text-white shadow-soft"
          style={{ background: dim.accent.solid }}
        >
          <Check className="h-9 w-9" strokeWidth={2.6} />
        </span>
      </div>
      <h1 className="mt-7 text-2xl font-extrabold text-ink-900">اكتمل بُعد {dim.title}</h1>
      <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-500">
        احتسبنا درجتك وجهّزنا قراءة وتوصيات تناسب إجاباتك في هذا البُعد.
      </p>
      <div className="mt-8 w-full">
        <Button fullWidth size="lg" onClick={onClose}>
          عرض نتيجتي
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </Button>
      </div>
    </div>
  );
}
