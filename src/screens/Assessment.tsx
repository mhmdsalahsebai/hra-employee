import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarHeart,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  MessageCircleHeart,
  PlayCircle,
  ScrollText,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Button,
  QuestionCardDeck,
  QuestionInsight,
  ScaleSelect,
  type QuestionCardDeckHandle,
} from "../components/ui";
import { cn } from "../lib/cn";
import { Illustration } from "../illustrations/Illustration";
import { useAssessment } from "../assessment/useAssessment";
import type { DimensionResult } from "../assessment/useAssessment";
import { dimensions, dimensionsById, type Dimension, type DimensionId } from "../data/dimensions";
import { hraBySlug, higherIsBetter } from "../data/hra";
import { LEVEL_CLASS, LEVEL_HEX } from "../lib/score";
import { getQuestionArt } from "../data/questionArt";
import { getQuestionInsight, type QuestionInsight as QuestionInsightData } from "../data/questionInsights";

/** The nine dimensions as ordered "chapters", each owning its own questions.
 *  Order follows the canonical `dimensions` array (personal dimensions first,
 *  company-related ones last), not the generated data's order. */
const chapters = dimensions.map((d) => ({
  slug: d.id as DimensionId,
  questions: hraBySlug[d.id].questions,
}));
const TOTAL_DIMS = chapters.length;
const TOTAL_QUESTIONS = chapters.reduce((n, c) => n + c.questions.length, 0);

/** Rough read-time so a chapter advertises an honest, small commitment. */
const minutesFor = (count: number) => Math.max(1, Math.round((count * 5) / 60));

type Stage = "intro" | "chapter" | "questions" | "milestone" | "done";

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
  const { answers, setAnswer, started, hasResults, resultBySlug } = useAssessment();

  // Freeze the resume point: the first dimension with an unanswered question.
  const [resume] = useState(() => {
    for (let di = 0; di < chapters.length; di++) {
      const qi = chapters[di].questions.findIndex((q) => answers[q.slug] === undefined);
      if (qi !== -1) return { di, qi };
    }
    const last = chapters.length - 1;
    return { di: last, qi: chapters[last].questions.length - 1 };
  });

  const [stage, setStage] = useState<Stage>(started && !hasResults ? "chapter" : "intro");
  const [dimIndex, setDimIndex] = useState(resume.di);
  const [qIndex, setQIndex] = useState(resume.qi);
  const [deckStart, setDeckStart] = useState(resume.qi);
  // A carried insight pauses auto-advance until the person reads and continues.
  const [pending, setPending] = useState<{
    insight: QuestionInsightData;
    advance: () => void;
    label: string;
  } | null>(null);
  const deckRef = useRef<QuestionCardDeckHandle>(null);
  const advanceRef = useRef<number>(0);

  const chapter = chapters[dimIndex];
  const questions = chapter.questions;
  const dim = dimensionsById[chapter.slug];
  const resuming = stage === "chapter" && deckStart > 0;

  function openChapter(di: number, start: number) {
    window.clearTimeout(advanceRef.current);
    setDimIndex(di);
    setDeckStart(start);
    setQIndex(start);
    setStage("chapter");
  }

  /** Answer + auto-advance: a short beat to confirm the choice, then move on.
   *  When the question carries an insight, hold and surface it first — the
   *  person continues at their own pace from the note. */
  function choose(slug: string, qi: number, value: number) {
    setAnswer(slug, value);
    const isFinal = dimIndex === TOTAL_DIMS - 1 && qi === questions.length - 1;
    const lastInDim = qi === questions.length - 1;
    const advance = () => {
      if (isFinal) return; // final → explicit إنهاء button
      if (lastInDim) setStage("milestone");
      else deckRef.current?.next();
    };
    window.clearTimeout(advanceRef.current);
    const insight = getQuestionInsight(slug);
    if (insight) {
      setPending({ insight, advance, label: lastInDim ? "أنهِ البُعد" : "السؤال التالي" });
      return;
    }
    if (isFinal) return;
    advanceRef.current = window.setTimeout(advance, lastInDim ? 420 : 260);
  }

  function back() {
    window.clearTimeout(advanceRef.current);
    if (stage === "questions") {
      if (qIndex > 0) deckRef.current?.previous();
      else setStage("chapter");
      return;
    }
    if (stage === "milestone") {
      const lastQi = questions.length - 1;
      setDeckStart(lastQi);
      setQIndex(lastQi);
      setStage("questions");
      return;
    }
    if (stage === "chapter") {
      if (dimIndex === 0) {
        setStage("intro");
        return;
      }
      const prev = dimIndex - 1;
      openChapter(prev, chapters[prev].questions.length - 1);
      setStage("questions");
    }
  }

  const showHeader = stage === "chapter" || stage === "questions" || stage === "milestone";

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[480px] flex-col bg-canvas",
        // Questions stage is pinned to the viewport so the card has a definite
        // height and its answer list scrolls internally instead of overflowing
        // the page and colliding with the controls. Other stages may grow.
        stage === "questions" ? "h-dvh overflow-hidden" : "min-h-dvh",
      )}
    >
      {/* Top bar: back/close + dimension-segmented progress */}
      <div className="flex items-center gap-3 px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-3">
        <button
          onClick={() => (stage === "intro" || stage === "done" ? navigate("/") : back())}
          aria-label={stage === "intro" || stage === "done" ? "إغلاق" : "السابق"}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-200 bg-surface text-ink-700 transition hover:border-ink-300 active:scale-95"
        >
          {stage === "intro" || stage === "done" ? (
            <X className="h-5 w-5" strokeWidth={2.2} />
          ) : (
            <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
          )}
        </button>
        {showHeader && (
          <>
            <ChapterProgress
              dimIndex={dimIndex}
              ratio={
                stage === "milestone"
                  ? 1
                  : stage === "questions"
                    ? (qIndex + 1) / questions.length
                    : 0
              }
              accent={dim.accent.solid}
            />
            <span dir="ltr" className="nums shrink-0 text-[0.8125rem] font-bold text-ink-500">
              {dimIndex + 1}
              <span className="text-ink-300"> / {TOTAL_DIMS}</span>
            </span>
          </>
        )}
      </div>

      {stage === "intro" && (
        <Intro
          onStart={() => openChapter(resume.di, resume.qi)}
          resuming={started && !hasResults}
        />
      )}

      {stage === "chapter" && (
        <Chapter
          dim={dim}
          index={dimIndex}
          questionCount={questions.length}
          resuming={resuming}
          onStart={() => setStage("questions")}
        />
      )}

      {stage === "questions" && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">
          <QuestionCardDeck
            key={dimIndex}
            ref={deckRef}
            initialIndex={deckStart}
            canGoForward={answers[questions[qIndex].slug] !== undefined}
            onIndexChange={setQIndex}
          >
            {questions.map((q, i) => {
              const slideAnswered = answers[q.slug] !== undefined;
              const isFinal = dimIndex === TOTAL_DIMS - 1 && i === questions.length - 1;

              return (
                <div
                  key={q.slug}
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
                      dimension accent. Takes the flexible middle space and
                      shrinks first on short screens. */}
                  <div className="flex min-h-0 flex-1 items-center justify-center py-3">
                    <div className="relative grid place-items-center">
                      <span
                        aria-hidden
                        className="absolute h-44 w-44 rounded-full opacity-60 blur-xl"
                        style={{ background: dim.accent.soft }}
                      />
                      <Illustration
                        name={getQuestionArt(q.slug, chapter.slug)}
                        tone={dim.accent.solid}
                        className="relative w-36 max-w-[48%]"
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-3">
                    <span
                      className="mt-[9px] h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        background: dim.accent.solid,
                        boxShadow: `0 0 10px ${dim.accent.solid}`,
                      }}
                    />
                    <h2 className="text-balance text-[1.3rem] font-extrabold leading-[1.4] text-ink-900">
                      {q.title}
                    </h2>
                  </div>

                  {/* The answer spectrum — one tap, no scroll. */}
                  <div className="shrink-0 pt-6">
                    <ScaleSelect
                      answers={q.answers}
                      value={answers[q.slug]}
                      onSelect={(v) => choose(q.slug, i, v)}
                      accent={dim.accent}
                      positiveHigh={higherIsBetter(chapter.slug)}
                    />
                  </div>

                  {/* Final question keeps an explicit submit; everything else
                      auto-advances on tap. */}
                  {isFinal && (
                    <div className="shrink-0 pt-5">
                      <button
                        data-no-swipe
                        onClick={() => slideAnswered && setStage("done")}
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
                                background: dim.accent.solid,
                                boxShadow: `0 16px 34px -18px ${dim.accent.solid}`,
                              }
                            : undefined
                        }
                      >
                        إنهاء التقييم
                        <Check className="h-5 w-5" strokeWidth={2.6} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </QuestionCardDeck>
        </div>
      )}

      {stage === "milestone" && (
        <Milestone
          dim={dim}
          index={dimIndex}
          result={resultBySlug[chapter.slug]}
          onContinue={() => openChapter(dimIndex + 1, 0)}
        />
      )}

      {stage === "done" && <Done onView={() => navigate("/report")} />}

      {pending && (
        <QuestionInsight
          insight={pending.insight}
          accent={dim.accent}
          continueLabel={pending.label}
          onContinue={() => {
            pending.advance();
            setPending(null);
          }}
        />
      )}
    </div>
  );
}

/** Nine segments; past dimensions full, the current one fills with its ratio. */
function ChapterProgress({
  dimIndex,
  ratio,
  accent,
}: {
  dimIndex: number;
  ratio: number;
  accent: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-1">
      {chapters.map((_, i) => {
        const fill = i < dimIndex ? 1 : i === dimIndex ? ratio : 0;
        return (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-pill bg-ink-100">
            <div
              className="h-full rounded-pill transition-[width] duration-500 ease-out"
              style={{
                width: `${fill * 100}%`,
                background: i <= dimIndex ? accent : "transparent",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function Intro({ onStart, resuming }: { onStart: () => void; resuming: boolean }) {
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
          نقسّم التقييم إلى {TOTAL_DIMS} أبعاد قصيرة للرفاهية، تأخذها بُعدًا تلو الآخر. كلما كانت
          إجاباتك أصدق، كانت نتائجك وخطتك أنسب لك أنت.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-ink-50 px-3 py-1.5 text-xs font-bold text-ink-600">
            <Clock className="h-3.5 w-3.5" strokeWidth={2.4} />~{minutesFor(TOTAL_QUESTIONS)} دقيقة
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-ink-50 px-3 py-1.5 text-xs font-bold text-ink-600">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
            {TOTAL_DIMS} أبعاد · يمكنك التوقّف والعودة
          </span>
        </div>

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
        {resuming ? "متابعة التقييم" : "لنبدأ التقييم"}
        <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
      </Button>
    </div>
  );
}

/** The breather before each dimension: what this area is and why it matters. */
function Chapter({
  dim,
  index,
  questionCount,
  resuming,
  onStart,
}: {
  dim: Dimension;
  index: number;
  questionCount: number;
  resuming: boolean;
  onStart: () => void;
}) {
  return (
    <div className="animate-rise flex flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col justify-center py-5">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-pill px-3 py-1.5 text-[11px] font-bold"
          style={{ color: dim.accent.fg, background: dim.accent.soft }}
        >
          البُعد {index + 1} من {TOTAL_DIMS}
        </span>

        <span
          className="mt-5 grid h-16 w-16 place-items-center rounded-[1.1rem]"
          style={{ color: dim.accent.fg, background: dim.accent.soft }}
        >
          <dim.icon className="h-8 w-8" strokeWidth={2} />
        </span>

        <h1 className="mt-5 text-[1.7rem] font-extrabold leading-[1.3] text-ink-900">
          {dim.title}
        </h1>
        <p className="mt-2 text-[15px] font-semibold" style={{ color: dim.accent.fg }}>
          {dim.tagline}
        </p>

        <div
          className="mt-5 rounded-lg border p-4"
          style={{ borderColor: dim.accent.soft, background: dim.accent.soft }}
        >
          <p className="text-[11px] font-bold" style={{ color: dim.accent.fg }}>
            لماذا يهمّك هذا البُعد؟
          </p>
          <p className="mt-1.5 line-clamp-4 text-[13.5px] leading-relaxed text-ink-700">
            {dim.description}
          </p>
        </div>

        <p className="mt-5 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink-400">
          <Clock className="h-3.5 w-3.5" strokeWidth={2.4} />
          {questionCount} {questionCount > 10 ? "سؤالًا" : "أسئلة"} · ~{minutesFor(questionCount)}{" "}
          دقيقة
        </p>
      </div>

      <Button fullWidth size="lg" onClick={onStart}>
        {resuming ? "أكمل هذا البُعد" : "ابدأ"}
        <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
      </Button>
    </div>
  );
}

/** A small celebration after each dimension — turns 9 areas into 9 small wins.
 *  Now also pays out a *real* first result for the dimension just finished, so
 *  value arrives every ~15 questions instead of only after all 140. */
function Milestone({
  dim,
  index,
  result,
  onContinue,
}: {
  dim: Dimension;
  index: number;
  result?: DimensionResult;
  onContinue: () => void;
}) {
  const remaining = TOTAL_DIMS - index - 1;
  const glimpse = result?.complete ? result : undefined;
  return (
    <div className="animate-rise flex flex-1 flex-col items-center justify-center px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center">
      <div className="relative grid h-24 w-24 place-items-center">
        <span className="absolute inset-0 rounded-full" style={{ background: dim.accent.soft }} />
        <span
          className="relative grid h-14 w-14 place-items-center rounded-full text-white shadow-soft"
          style={{ background: dim.accent.solid }}
        >
          <Sparkles className="h-7 w-7" strokeWidth={2.4} />
        </span>
      </div>

      <p className="mt-6 text-[0.8125rem] font-bold" style={{ color: dim.accent.fg }}>
        {index + 1} من {TOTAL_DIMS} أبعاد
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink-900">أنهيت بُعد {dim.title}</h1>

      {glimpse && <ResultGlimpse dim={dim} result={glimpse} />}

      <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink-500">
        {remaining > 0
          ? glimpse
            ? `دي أول إشارة من بُعد واحد — الصورة وتوصياتك بتوضح أكتر مع كل بُعد. تبقّى ${remaining} ${remaining > 10 ? "بُعدًا" : "أبعاد"} فقط.`
            : `أحسنت — تقدّمك يُبني صورتك. تبقّى ${remaining} ${remaining > 10 ? "بُعدًا" : "أبعاد"} فقط.`
          : "أنهيت كل الأبعاد، خطوة أخيرة لعرض نتائجك."}
      </p>

      <div className="mt-7 flex w-full max-w-xs items-center gap-1.5">
        {chapters.map((_, i) => (
          <div
            key={i}
            className={cn("h-1.5 flex-1 rounded-pill", i > index && "bg-ink-100")}
            style={i <= index ? { background: dim.accent.solid } : undefined}
          />
        ))}
      </div>

      <div className="mt-8 w-full max-w-xs">
        <Button fullWidth size="lg" onClick={onContinue}>
          {remaining > 0 ? "البُعد التالي" : "عرض نتائجي"}
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </Button>
      </div>
    </div>
  );
}

/** The first real payout: the finished dimension's score, status and honest
 *  signal — the same verdict language the full report speaks, shown early so
 *  the remaining questions feel like sharpening a picture, not a blind cost. */
function ResultGlimpse({ dim, result }: { dim: Dimension; result: DimensionResult }) {
  const meta = LEVEL_CLASS[result.level];
  const hex = LEVEL_HEX[result.level];
  return (
    <div
      className="mt-5 w-full max-w-xs rounded-lg border bg-surface p-4 text-right shadow-soft"
      style={{ borderColor: `${hex}33` }}
    >
      <div className="flex items-center gap-1.5" style={{ color: dim.accent.fg }}>
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
        <span className="text-[11px] font-bold">لمحة أولى من نتيجتك</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={cn("inline-flex items-center rounded-pill px-3 py-1 text-xs font-bold", meta.soft)}
        >
          {meta.label}
        </span>
        <span dir="ltr" className="nums shrink-0 text-2xl font-extrabold" style={{ color: hex }}>
          {result.score}
          <span className="text-sm font-bold text-ink-300"> / 100</span>
        </span>
      </div>

      {result.band.alert && (
        <p className="mt-3 text-[13px] leading-relaxed text-ink-700">{result.band.alert}</p>
      )}
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
      <h1 className="mt-7 text-2xl font-extrabold text-ink-900">أحسنت، اكتمل تقييمك</h1>
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
