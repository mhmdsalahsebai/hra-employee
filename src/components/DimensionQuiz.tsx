import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AutosaveNote,
  Button,
  ConfettiBurst,
  QuestionCardDeck,
  QuestionInsight,
  ScaleSelect,
  ScoreRing,
  type QuestionCardDeckHandle,
} from "./ui";
import { Illustration } from "../illustrations/Illustration";
import { dimensions, dimensionsById, type DimensionId } from "../data/dimensions";
import { hraBySlug } from "../data/hra";
import { getQuestionArt } from "../data/questionArt";
import { getQuestionInsight, type QuestionInsight as QuestionInsightData } from "../data/questionInsights";
import { LEVEL_CLASS } from "../lib/score";
import { useAnalysis } from "../assessment/useAnalysis";
import { useAssessment } from "../assessment/useAssessment";
import { useFindings } from "../assessment/useFindings";
import { useMetrics } from "../assessment/useMetrics";

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
  // A carried insight pauses auto-advance until the person reads and continues.
  const [pending, setPending] = useState<{
    insight: QuestionInsightData;
    advance: () => void;
    last: boolean;
  } | null>(null);
  const deckRef = useRef<QuestionCardDeckHandle>(null);

  const q = questions[index];
  const value = answers[q.slug];
  const answeredNow = questions.filter((qq) => answers[qq.slug] !== undefined).length;
  const progress = done ? 100 : Math.round((answeredNow / total) * 100);

  const advanceRef = useRef(0);

  /** Answer + auto-advance: a short beat to confirm the choice, then move on.
   *  When the question carries an insight, hold instead and surface it — the
   *  person continues at their own pace from the note. */
  function choose(slug: string, qIndex: number, optionValue: number) {
    setAnswer(slug, optionValue);
    const last = qIndex + 1 >= total;
    const advance = () => {
      if (last) setDone(true);
      else deckRef.current?.next();
    };
    window.clearTimeout(advanceRef.current);
    const insight = getQuestionInsight(slug);
    if (insight) {
      setPending({ insight, advance, last });
      return;
    }
    advanceRef.current = window.setTimeout(advance, 260);
  }
  function back() {
    window.clearTimeout(advanceRef.current);
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
            <div className="relative mt-3 flex h-10 items-center justify-center">
              {index > 0 && (
                <button
                  onClick={back}
                  aria-label="السؤال السابق"
                  className="absolute start-0 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-ink-200 bg-surface text-ink-700 transition hover:border-ink-300 active:scale-95"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
                </button>
              )}
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
            <AutosaveNote className="mt-1" />
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

                return (
                  <div
                    key={question.slug}
                    data-quiz-card
                    className="flex h-full min-h-0 flex-col rounded-[24px] border border-ink-100 bg-surface p-6"
                  >
                    <span
                      className="inline-flex w-fit items-center gap-1.5 rounded-pill px-3 py-1 text-[11px] font-bold"
                      style={{ color: dim.accent.fg, background: dim.accent.soft }}
                    >
                      <dim.icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                      بُعد {dim.title}
                    </span>

                    {/* Topic art on a soft accent stage, recolored to the
                        dimension accent. Fills the flexible middle space and
                        scales to *contain* within it, so tall art never
                        overflows onto the question title on short screens. */}
                    <div className="relative flex min-h-0 flex-1 items-center justify-center py-3">
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-xl"
                        style={{ background: dim.accent.soft }}
                      />
                      <Illustration
                        name={getQuestionArt(question.slug, dimId)}
                        tone={dim.accent.solid}
                        className="is-contained relative h-full w-full max-w-[9.5rem]"
                      />
                    </div>

                    <div className="flex shrink-0 gap-3">
                      <span
                        className="mt-[9px] h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          background: dim.accent.solid,
                          boxShadow: `0 0 10px ${dim.accent.solid}`,
                        }}
                      />
                      <h1 className="text-balance text-[1.3rem] font-extrabold leading-[1.4] text-ink-900">
                        {question.title}
                      </h1>
                    </div>

                    {/* The answer spectrum — one tap, no scroll. */}
                    <div className="shrink-0 pt-6">
                      <ScaleSelect
                        answers={question.answers}
                        value={slideValue}
                        onSelect={(v) => choose(question.slug, questionIndex, v)}
                        accent={dim.accent}
                      />
                    </div>
                  </div>
                );
              })}
            </QuestionCardDeck>
          </div>
        </>
      )}

      {pending && (
        <QuestionInsight
          insight={pending.insight}
          accent={dim.accent}
          continueLabel={pending.last ? "أنهِ البُعد" : "السؤال التالي"}
          onContinue={() => {
            pending.advance();
            setPending(null);
          }}
        />
      )}
    </div>,
    document.body,
  );
}

/** The celebration after the last answer: a confetti-backed achievement pop,
 *  then a straight hand-off into the next unfinished dimension so the momentum
 *  isn't dropped at the moment it's highest. Dimensions unlock in order, so
 *  "the next one" is simply the first incomplete dimension. */
function DimensionDone({
  dim,
  onClose,
}: {
  dim: (typeof dimensionsById)[DimensionId];
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { results, resultBySlug, completedCount, totalDimensions } = useAssessment();
  const metricGroups = useMetrics();
  const analysis = useAnalysis();
  const { findings } = useFindings();
  const nextIndex = results.findIndex((r) => !r.complete);
  const next = nextIndex === -1 ? undefined : dimensions[nextIndex];

  // The real payoff of the answers just given: the computed score + verdict,
  // and exactly how much analysis those answers unlocked on the dimension page.
  const r = resultBySlug[dim.id];
  const level = LEVEL_CLASS[r.level];
  const subMetrics = metricGroups.find((g) => g.dimension === dim.id)?.metrics.length ?? 0;
  const discoveries = findings.filter((f) => f.dims.includes(dim.id)).length;
  const composites = analysis.composites.filter((c) => c.dims.includes(dim.id)).length;
  const unlocked = [
    discoveries > 0 ? `${discoveries.toLocaleString("en-US")} اكتشافات مترابطة` : null,
    subMetrics > 0 ? `${subMetrics.toLocaleString("en-US")} مؤشرات فرعية` : null,
    composites > 0 ? `${composites.toLocaleString("en-US")} تحليلات مركّبة` : null,
    r.band.advices.length > 0 ? `${r.band.advices.length.toLocaleString("en-US")} توصيات` : null,
  ].filter(Boolean);

  return (
    <div className="animate-rise relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center">
      <div className="relative grid h-32 w-32 place-items-center">
        <ConfettiBurst accent={dim.accent.solid} />
        <span className="absolute inset-0 rounded-full opacity-40" style={{ background: dim.accent.soft }} />
        <span className="absolute inset-3 rounded-full opacity-75" style={{ background: dim.accent.soft }} />
        <motion.span
          className="relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full text-white shadow-soft"
          style={{ background: dim.accent.solid }}
          initial={reduce ? { opacity: 0 } : { scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.05 }}
        >
          <Check className="h-9 w-9" strokeWidth={2.6} />
        </motion.span>
      </div>

      <p className="nums mt-6 text-[0.8125rem] font-bold" style={{ color: dim.accent.fg }}>
        {completedCount} من {totalDimensions} أبعاد مكتملة
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink-900">أحسنت! اكتمل بُعد {dim.title} 🎉</h1>

      {/* The computed result, immediately — not a promise that it exists. */}
      <div className="mt-5 flex w-full max-w-xs items-center gap-4 rounded-xl border border-ink-100 bg-surface p-4 text-right shadow-card">
        <ScoreRing value={r.score} size={72} stroke={7} className={level.text} trackClassName="text-ink-100">
          <span className="nums text-xl font-extrabold text-ink-900">{r.score}</span>
        </ScoreRing>
        <div className="min-w-0 flex-1">
          <span className={`inline-block rounded-pill px-2.5 py-0.5 text-[0.8125rem] font-bold ${level.soft}`}>
            {r.band.title}
          </span>
          {unlocked.length > 0 && (
            <p className="nums mt-2 text-[11px] font-semibold leading-relaxed text-ink-500">
              جُهّز لك الآن: {unlocked.join(" · ")}
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink-500">
        {next
          ? "تحليلك الكامل بانتظارك في صفحة البُعد — والبُعد التالي مفتوح، واصل وأنت في أفضل انطلاقة."
          : "تحليلك الكامل — مؤشرات، قراءات، وتوصيات مبنية على إجاباتك — جاهز في صفحة البُعد."}
      </p>

      {/* The walked/next segment bar — the same nine steps the maps speak. */}
      <div className="mt-7 flex w-full max-w-xs items-center gap-1.5">
        {results.map((r, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-pill"
            style={{ background: r.complete ? dim.accent.solid : "var(--color-ink-100)" }}
          />
        ))}
      </div>

      <div className="mt-8 w-full space-y-3">
        {next ? (
          <>
            <Button
              fullWidth
              size="lg"
              onClick={() => navigate(`/dimension/${next.id}`)}
            >
              البُعد التالي: {next.title}
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
            </Button>
            <Button fullWidth size="lg" variant="ghost" onClick={onClose}>
              عرض نتيجتي
            </Button>
          </>
        ) : (
          <Button fullWidth size="lg" onClick={onClose}>
            عرض نتيجتي
            <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
          </Button>
        )}
      </div>
    </div>
  );
}
