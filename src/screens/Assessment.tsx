import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarHeart,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  MessageCircleHeart,
  PlayCircle,
  ScrollText,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Button,
  OptionCard,
  QuestionCardDeck,
  type QuestionCardDeckHandle,
} from "../components/ui";
import { cn } from "../lib/cn";
import { useAssessment } from "../assessment/useAssessment";
import { dimensionsById, type DimensionId } from "../data/dimensions";
import { hraData } from "../data/hra";

/** Every wellbeing question, flattened across the nine dimensions in order. */
const questions = hraData.flatMap((d) =>
  d.questions.map((q) => ({ ...q, dimension: d.slug as DimensionId })),
);

type Stage = "intro" | "questions" | "done";

interface Deliverable {
  icon: LucideIcon;
  label: string;
  fg: string;
  soft: string;
}

const deliverables: Deliverable[] = [
  { icon: ScrollText, label: "تقرير مفصّل بتحليل إجاباتك", fg: "#176b91", soft: "#e6f1f6" },
  { icon: MessageCircleHeart, label: "استشارة مجانية مع خبير", fg: "#b8453b", soft: "#fbe6e2" },
  { icon: CalendarHeart, label: "خطة ورحلة لتتبّع تقدّمك", fg: "#2f8a66", soft: "#e4efe9" },
  { icon: PlayCircle, label: "محتوى يناسب احتياجك", fg: "#ac7a2e", soft: "#f3ecdc" },
];

export function Assessment() {
  const navigate = useNavigate();
  const { answers, setAnswer, started, hasResults } = useAssessment();
  const total = questions.length;

  // Freeze the resume point for this deck instance. Recomputing it after every
  // answer would mutate Swiper's initial-slide input while it is already live.
  const [initialIndex] = useState(() => {
    const firstUnanswered = questions.findIndex((q) => answers[q.slug] === undefined);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const [stage, setStage] = useState<Stage>(started && !hasResults ? "questions" : "intro");
  const [index, setIndex] = useState(initialIndex);
  const deckRef = useRef<QuestionCardDeckHandle>(null);

  const question = questions[index];
  const dim = dimensionsById[question.dimension];
  const answered = answers[question.slug] !== undefined;
  const progress = stage === "questions" ? (index / total) * 100 : 0;

  function next() {
    if (!answered) return;
    if (index + 1 < total) deckRef.current?.next();
    else setStage("done");
  }

  function back() {
    if (index === 0) setStage("intro");
    else deckRef.current?.previous();
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-canvas">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-3">
        <button
          onClick={() => (stage === "questions" ? back() : navigate("/"))}
          aria-label={stage === "questions" ? "السابق" : "إغلاق"}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-200 bg-surface text-ink-700 transition hover:border-ink-300 active:scale-95"
        >
          {stage === "questions" ? (
            <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
          ) : (
            <X className="h-5 w-5" strokeWidth={2.2} />
          )}
        </button>
        {stage === "questions" && (
          <>
            <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-ink-100">
              <div
                className="h-full rounded-pill transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%`, background: dim.accent.solid }}
              />
            </div>
            <span dir="ltr" className="nums text-[0.8125rem] font-bold text-ink-500">
              {index + 1}
              <span className="text-ink-300"> / {total}</span>
            </span>
          </>
        )}
      </div>

      {stage === "intro" && <Intro onStart={() => setStage("questions")} />}

      {stage === "questions" && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">
          <QuestionCardDeck
            ref={deckRef}
            initialIndex={initialIndex}
            canGoForward={answered}
            onIndexChange={setIndex}
          >
            {questions.map((slideQuestion, questionIndex) => {
              const slideDim = dimensionsById[slideQuestion.dimension];
              const slideAnswered = answers[slideQuestion.slug] !== undefined;
              const denseAnswers = slideQuestion.answers.length > 5;

              return (
                <div
                  key={slideQuestion.slug}
                  className={cn(
                    "flex h-full min-h-0 flex-col rounded-[24px] border border-ink-100 bg-surface",
                    denseAnswers ? "p-5" : "p-6",
                  )}
                >
                  <span
                    className="inline-flex w-fit items-center gap-1.5 rounded-pill px-3 py-1 text-[11px] font-bold"
                    style={{ color: slideDim.accent.fg, background: slideDim.accent.soft }}
                  >
                    <slideDim.icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                    بُعد {slideDim.title}
                  </span>

                  <div className="mt-4 flex gap-3">
                    <span
                      className="mt-[9px] h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        background: slideDim.accent.solid,
                        boxShadow: `0 0 10px ${slideDim.accent.solid}`,
                      }}
                    />
                    <h2 className="text-balance text-[1.35rem] font-extrabold leading-[1.4] text-ink-900">
                      {slideQuestion.title}
                    </h2>
                  </div>
                  <p className="mt-2 text-[0.8125rem] font-semibold text-ink-400">
                    اختر ما يصف حالتك بدقة أكبر
                  </p>

                  <div
                    className={cn(
                      "stagger -mx-1 mt-5 px-1",
                      denseAnswers
                        ? "grid grid-cols-2 items-stretch gap-2"
                        : "flex flex-col gap-2.5",
                    )}
                  >
                    {slideQuestion.answers.map((answer) => (
                      <OptionCard
                        key={answer.value}
                        label={answer.title}
                        selected={answers[slideQuestion.slug] === answer.value}
                        onClick={() => setAnswer(slideQuestion.slug, answer.value)}
                        accent={slideDim.accent}
                        compact={denseAnswers}
                      />
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      data-no-swipe
                      onClick={next}
                      disabled={!slideAnswered}
                      className={cn(
                        "inline-flex h-14 w-full items-center justify-center gap-2 rounded-[16px] text-base font-bold transition-all duration-200 active:scale-[0.98]",
                        !slideAnswered
                          ? "cursor-not-allowed bg-ink-100 text-ink-400"
                          : "text-white",
                      )}
                      style={
                        slideAnswered
                          ? {
                              background: slideDim.accent.solid,
                              boxShadow: `0 16px 34px -18px ${slideDim.accent.solid}`,
                            }
                          : undefined
                      }
                    >
                      {questionIndex + 1 === total ? "إنهاء التقييم" : "التالي"}
                      <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              );
            })}
          </QuestionCardDeck>
        </div>
      )}

      {stage === "done" && <Done onView={() => navigate("/report")} />}
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-rise flex flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col justify-center py-5">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-brand-50 px-3 py-1.5 text-[11px] font-bold text-brand-700">
          تقييم الرفاهية الشامل
        </span>
        <h1 className="mt-4 text-[1.65rem] font-extrabold leading-[1.3] text-ink-900">
          دقائق قليلة من أجل صورة أوضح عن حالك
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
          أجب بصدق عن مجموعة من الأسئلة عبر تسعة أبعاد للرفاهية. كلما كانت إجاباتك أدق، كانت نتائجك
          وتوصياتك أنسب لك.
        </p>

        <div className="mt-7">
          <p className="mb-3 text-[0.8125rem] font-bold text-ink-900">بنهاية التقييم تحصل على:</p>
          <div className="space-y-2.5">
            {deliverables.map((d) => (
              <div
                key={d.label}
                className="flex items-center gap-3 rounded-md border border-ink-100 bg-surface p-3 shadow-soft"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.7rem]"
                  style={{ color: d.fg, background: d.soft }}
                >
                  <d.icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="text-[0.8125rem] font-semibold text-ink-700">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-ink-400">
          <Lock className="h-3.5 w-3.5" strokeWidth={2.2} />
          إجاباتك سرية ولا تطّلع عليها جهة عملك إطلاقًا
        </p>
      </div>

      <Button fullWidth size="lg" onClick={onStart}>
        لنبدأ التقييم
        <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
      </Button>
    </div>
  );
}

function Done({ onView }: { onView: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="animate-rise flex flex-1 flex-col items-center justify-center px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center">
      <div className="relative grid h-28 w-28 place-items-center">
        <span className="absolute inset-0 rounded-full bg-good-soft" />
        <span className="absolute inset-[0.85rem] rounded-full bg-good/15" />
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-good text-white shadow-soft">
          <Check className="h-8 w-8" strokeWidth={2.6} />
        </span>
      </div>
      <h1 className="mt-7 text-2xl font-extrabold text-ink-900">
        أحسنت، اكتمل تقييمك
      </h1>
      <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-500">
        حللنا إجاباتك وجهّزنا لك تقريرًا وخطة ومحتوى مخصصًا. هذه بداية رحلتك نحو توازن أفضل.
      </p>
      <div className="mt-8 w-full space-y-3">
        <Button fullWidth size="lg" onClick={onView}>
          عرض تقريرك
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </Button>
        <Button fullWidth size="lg" variant="ghost" onClick={() => navigate("/")}>
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}
