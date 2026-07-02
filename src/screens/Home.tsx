import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  ChevronLeft,
  GraduationCap,
  Lock,
  MessageCircleHeart,
  RefreshCw,
  ScrollText,
  Sparkles,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, ScoreRing, SectionHeader } from "../components/ui";
import { Illustration } from "../illustrations/Illustration";
import { ExpertAvatarStack } from "../components/ExpertAvatarStack";
import { RecommendedContentSwiper } from "../components/cards/RecommendedContentSwiper";
import { ProgramRecommendationCard } from "../components/cards/ProgramRecommendationCard";
import { WellbeingTrackers } from "../components/cards/WellbeingTrackers";
import { JournalSection } from "../components/cards/JournalSection";
import { cn } from "../lib/cn";
import { scoreMeta, LEVEL_HEX, LEVEL_CLASS } from "../lib/score";
import { useAssessment, type DimensionResult } from "../assessment/useAssessment";
import { useInsights } from "../assessment/useInsights";
import { currentUser } from "../data/app";
import { dimensions, type Dimension } from "../data/dimensions";
import { recommendPrograms } from "../data/programs";
import { MIN_DIMS_FOR_PREVIEW } from "../data/report";
import { useContentRecommendations } from "../content/useContentRecommendations";

/** Soft pastel fill from a solid accent — the modern colour-blocked card look. */
const pastel = (hex: string, pct = 12) => `color-mix(in srgb, ${hex} ${pct}%, white)`;

/** Arabic count phrase for dimensions: بُعد واحد / بُعدان / N أبعاد. */
const dimsPhrase = (n: number) => (n === 1 ? "بُعدًا واحدًا" : n === 2 ? "بُعدين" : `${n} أبعاد`);

export function Home() {
  const navigate = useNavigate();
  const {
    results,
    completedCount,
    totalDimensions,
    overallScore,
    hasResults,
    started,
  } = useAssessment();
  const insights = useInsights();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صباح الخير" : "مساء الخير";
  const nextIndex = results.findIndex((r) => !r.complete);
  const nextDim = nextIndex === -1 ? null : dimensions[nextIndex];
  const journeyPct = Math.round((completedCount / totalDimensions) * 100);
  // The report opens as a preliminary preview once enough dimensions are in.
  const reportReady = hasResults || completedCount >= MIN_DIMS_FOR_PREVIEW;
  const meta = scoreMeta(overallScore);
  const recommendations = useContentRecommendations(results);
  const recommendedPrograms = hasResults
    ? recommendPrograms(insights.insights).slice(0, 2)
    : [];

  return (
    <div className="animate-rise pb-4">
      {/* ── Friendly greeting — light, airy, personal ── */}
      <section className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={currentUser.name} size={50} className="shadow-soft ring-2 ring-white" />
            <div className="min-w-0 leading-tight">
              <p className="text-[13px] font-semibold text-ink-500">{greeting} 👋</p>
              <h1 className="truncate text-[1.6rem] font-extrabold text-ink-900">
                {currentUser.firstName}
              </h1>
            </div>
          </div>
          <button
            aria-label="الإشعارات"
            className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface text-ink-700 shadow-soft transition hover:-translate-y-0.5 active:scale-95"
          >
            <Bell className="h-[1.2rem] w-[1.2rem]" strokeWidth={2} />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-coral-500 ring-2 ring-surface" />
          </button>
        </div>
      </section>

      {/* ── Adaptive wellbeing hero — a soft pastel card, not a clinical slab.
          Shows the overall score once complete, journey progress before that. ── */}
      <section className="px-5 pt-5">
        <div
          className="relative overflow-hidden rounded-[1.75rem] p-5 shadow-soft"
          style={{ background: "linear-gradient(140deg, #e3f0fd 0%, #eae9fb 54%, #e6f5fb 100%)" }}
        >
          <span
            className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(46,128,210,0.30), transparent 70%)" }}
          />
          <span
            className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(124,110,230,0.22), transparent 70%)" }}
          />

          <div className="relative flex items-center gap-4">
            <span className="grid place-items-center rounded-full bg-white/70 p-1.5 shadow-soft backdrop-blur">
              <ScoreRing
                value={hasResults ? overallScore : journeyPct}
                size={84}
                stroke={9}
                gradient={["#5aa2e6", "#1f68bb"]}
                trackClassName="text-white"
              >
                {hasResults ? (
                  <div className="leading-none">
                    <span className="nums text-[1.5rem] font-extrabold text-ink-900">{overallScore}</span>
                    <span className="mt-0.5 block text-[10px] font-bold text-ink-400">من 100</span>
                  </div>
                ) : (
                  <div className="leading-none">
                    <span dir="ltr" className="nums text-[1.3rem] font-extrabold text-ink-900">
                      {completedCount}
                      <span className="text-ink-400">/{totalDimensions}</span>
                    </span>
                    <span className="mt-0.5 block text-[10px] font-bold text-ink-400">أبعاد</span>
                  </div>
                )}
              </ScoreRing>
            </span>

            <div className="min-w-0 flex-1">
              {hasResults ? (
                <>
                  <span className="inline-flex items-center gap-1 rounded-pill bg-white/70 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                    <Check className="h-3 w-3" strokeWidth={3} />
                    اكتمل تقييمك
                  </span>
                  <p className="mt-2 text-[1.25rem] font-extrabold leading-snug text-ink-900">
                    رفاهيتك {meta.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-600">
                    تحدّث الآن مع مختص في استشارة فورية مجانية
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[0.8125rem] font-bold text-brand-700">
                    {started ? "رحلة رفاهيتك" : "أهلًا بك في رحلتك"}
                  </p>
                  <p className="mt-1.5 text-[1.25rem] font-extrabold leading-snug text-ink-900">
                    {started ? "خطوة كل يوم نحو توازنك" : "لنبدأ رحلتك نحو توازن أفضل"}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-600">
                    {completedCount < MIN_DIMS_FOR_PREVIEW
                      ? `أكمل ${dimsPhrase(MIN_DIMS_FOR_PREVIEW - completedCount)} ويفتح تقريرك المبدئي`
                      : `أكمل ${dimsPhrase(totalDimensions - completedCount)} وتفتح استشارتك المجانية مع مختص`}
                  </p>
                </>
              )}
            </div>
          </div>

          {hasResults ? (
            <div className="relative mt-5 flex items-center gap-2.5">
              <button
                onClick={() => navigate("/consultation")}
                className="flex flex-[1.4] items-center justify-center gap-2 rounded-pill bg-brand-600 py-3.5 text-[0.875rem] font-bold text-white shadow-soft transition hover:bg-brand-700 active:scale-[0.99]"
              >
                <Video className="h-4 w-4" strokeWidth={2.2} />
                استشارة فورية الآن
              </button>
              <button
                onClick={() => navigate("/report")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-pill bg-white/80 py-3.5 text-[0.875rem] font-bold text-brand-700 shadow-soft ring-1 ring-inset ring-brand-500/15 backdrop-blur transition hover:bg-white active:scale-[0.99]"
              >
                <ScrollText className="h-4 w-4" strokeWidth={2.2} />
                التقرير
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                nextDim ? navigate(`/dimension/${nextDim.id}`) : navigate("/report")
              }
              className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-pill bg-brand-600 py-3.5 text-[0.875rem] font-bold text-white shadow-soft transition hover:bg-brand-700 active:scale-[0.99]"
            >
              {started && nextDim
                ? `تابع: بُعد ${nextDim.title}`
                : nextDim
                  ? `ابدأ ببُعد ${nextDim.title}`
                  : "اعرض تقريرك"}
              <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
            </button>
          )}
        </div>
      </section>

      {/* Why answer? The reward ladder — what unlocks and when. It answers the
          "what's in it for me?" question and stays until the results land. */}
      {!hasResults && (
        <section className="px-5 pt-4">
          <div
            className="relative overflow-hidden rounded-[1.75rem] p-5"
            style={{ background: pastel("#7f6ee6", 11) }}
          >
            {/* decorative shapes */}
            <span
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(46,128,210,0.22), transparent 70%)" }}
            />
            <span className="dot-cluster pointer-events-none absolute bottom-4 left-4 h-12 w-16 text-violet-400/40" />
            {!started && (
              <Illustration
                name="journey"
                className="relative mx-auto w-44 max-w-[58%]"
                tone="#6757b8"
              />
            )}
            <div className="relative pt-2">
              <h2 className="text-base font-extrabold text-ink-900">
                {started ? "مكافآت رحلتك" : "رحلتك تبدأ من هنا — وهذا ما تكسبه"}
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-600">
                دقيقة إلى دقيقتين لكل بُعد، وتقدّمك محفوظ دائمًا — وكل خطوة تفتح مكافأة حقيقية.
              </p>
              <ol className="mt-4 space-y-3">
                {[
                  {
                    at: 1,
                    title: "نتيجتك الأولى فورًا",
                    desc: "درجة وتحليل لحظي بعد كل بُعد تكمله",
                  },
                  {
                    at: MIN_DIMS_FOR_PREVIEW,
                    title: "تقريرك المبدئي",
                    desc: `يفتح بعد ${MIN_DIMS_FOR_PREVIEW} أبعاد فقط، ويزداد دقة مع كل بُعد`,
                  },
                  {
                    at: totalDimensions,
                    title: "استشارة مجانية مع مختص + تقريرك الكامل",
                    desc: "جلسة خاصة وسرّية تدفع عنها شركتك، مع خطة مصمّمة لك",
                  },
                ].map((step) => {
                  const reached = completedCount >= step.at;
                  return (
                    <li key={step.at} className="flex items-start gap-3">
                      <span
                        className={cn(
                          "nums mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-extrabold shadow-soft",
                          reached ? "bg-good text-white" : "bg-white text-violet-600",
                        )}
                      >
                        {reached ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.at}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-extrabold text-ink-900">{step.title}</p>
                        <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-ink-500">
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* ── Wellbeing dimensions — soft pastel colour-blocked cards ── */}
      <section className="px-5 pt-7">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[1.15rem] font-extrabold text-ink-900">أبعاد رفاهيتك</h2>
            <p className="mt-0.5 text-xs font-semibold text-ink-400">
              {hasResults ? "اكتمل تقييمك عبر الأبعاد التسعة" : "أجب لتكشف صورتك الكاملة"}
            </p>
          </div>
          <span className="nums shrink-0 rounded-pill bg-brand-600 px-3 py-1.5 text-[12px] font-bold text-white shadow-soft">
            {completedCount}/{totalDimensions}
          </span>
        </div>

        <div className="stagger space-y-3">
          {dimensions.map((d, i) => (
            <DimensionCard
              key={d.id}
              dimension={d}
              result={results[i]}
              isNext={i === nextIndex}
              onClick={() => navigate(`/dimension/${d.id}`)}
            />
          ))}
        </div>
      </section>

      {/* ── Your deliverables — report + free consultation, as colourful cards ── */}
      <section className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <DeliverableTile
            icon={ScrollText}
            title="تقريرك"
            desc={
              hasResults
                ? "تحليل مفصّل لإجاباتك"
                : reportReady
                  ? "تقرير مبدئي جاهز · يزداد دقّة"
                  : `يُفتح بعد ${MIN_DIMS_FOR_PREVIEW} أبعاد`
            }
            cta={reportReady && !hasResults ? "اعرض المبدئي" : "اعرض التقرير"}
            tint="#7c6ee6"
            unlocked={reportReady}
            onClick={() => navigate("/report")}
          />
          <DeliverableTile
            icon={MessageCircleHeart}
            title="استشارة خبير"
            desc={hasResults ? "جلسة فورية مجانية الآن" : "جلسة مجانية مع مختص · تُفتح بعد التقييم"}
            cta="ابدأ فورًا"
            tint="#dc604f"
            unlocked={hasResults}
            experts
            onClick={() => navigate("/consultation")}
          />
        </div>
      </section>

      {/* Daily wellbeing trackers */}
      <WellbeingTrackers />

      {/* Daily journaling */}
      <JournalSection />

      {/* Recommended expert-led programs — only after the full assessment. */}
      {hasResults && recommendedPrograms.length > 0 && (
        <section className="px-5 pt-8">
          <SectionHeader
            title="برامج رفاهية مقترحة"
            action="عرض الخطة"
            onAction={() => navigate("/plan")}
          />
          <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-brand-700 shadow-soft">
              <GraduationCap className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <p className="text-[11px] font-bold leading-relaxed text-brand-800">
              أعلى البرامج أولوية لك بعد تحليل نتائج تقييمك الكامل
            </p>
          </div>
          <div className="space-y-2.5">
            {recommendedPrograms.map((recommendation) => (
              <ProgramRecommendationCard
                key={recommendation.program.id}
                recommendation={recommendation}
                onOpen={() => navigate(`/program/${recommendation.program.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recommended content — swipeable carousel */}
      <section className="pt-8">
        <div className="px-5">
          <SectionHeader title="موصى لك" action="المكتبة" onAction={() => navigate("/content")} />
          <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-brand-700 shadow-soft">
              <Sparkles className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <p className="min-w-0 flex-1 text-[11px] font-bold leading-relaxed text-brand-800">
              {recommendations.reason}
            </p>
            <button
              onClick={recommendations.refresh}
              aria-label="اعرض اقتراحات أخرى"
              title="اقتراحات أخرى"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-brand-700 transition hover:bg-surface active:rotate-45 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
        </div>
        <RecommendedContentSwiper
          items={recommendations.items}
          openedIds={recommendations.openedIds}
          onOpen={(item) => {
            recommendations.markOpened(item.id);
            navigate(`/content?item=${item.id}`);
          }}
        />
      </section>
    </div>
  );
}

/* ── A deliverable (report / consultation) as a colourful pastel tile ───────── */

function DeliverableTile({
  icon: Icon,
  title,
  desc,
  cta,
  tint,
  unlocked,
  onClick,
  experts,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  cta: string;
  tint: string;
  unlocked: boolean;
  onClick: () => void;
  /** Show a live doctor-avatar stack — used to make the consultation inviting. */
  experts?: boolean;
}) {
  return (
    <button
      disabled={!unlocked}
      onClick={onClick}
      style={{ background: unlocked ? pastel(tint, 13) : undefined }}
      className={cn(
        "relative flex h-full flex-col items-start gap-2 overflow-hidden rounded-[1.4rem] p-4 text-right transition duration-200",
        unlocked
          ? "shadow-soft hover:-translate-y-0.5 active:translate-y-0"
          : "cursor-not-allowed border border-ink-100 bg-surface/60",
      )}
    >
      {unlocked && (
        <span
          className="pointer-events-none absolute -left-6 -top-6 h-20 w-20 rounded-full"
          style={{ background: `radial-gradient(circle, ${pastel(tint, 40)}, transparent 70%)` }}
        />
      )}
      <span
        className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-soft"
        style={{ color: unlocked ? tint : "var(--color-ink-300)" }}
      >
        {unlocked ? <Icon className="h-5 w-5" strokeWidth={2.1} /> : <Lock className="h-4 w-4" strokeWidth={2.2} />}
      </span>
      <div className="min-w-0">
        <h3 className={cn("text-[15px] font-extrabold", unlocked ? "text-ink-900" : "text-ink-400")}>
          {title}
        </h3>
        <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-ink-500">{desc}</p>
      </div>
      {experts && unlocked && (
        <div className="mt-1 flex items-center gap-2">
          <ExpertAvatarStack size={26} max={3} ringClassName="ring-white" />
          <span className="flex items-center gap-1 text-[10px] font-bold text-good">
            <span className="h-1.5 w-1.5 rounded-full bg-good" />
            متاحون الآن
          </span>
        </div>
      )}
      <span
        className="mt-auto text-[11px] font-bold"
        style={{ color: unlocked ? tint : "var(--color-ink-400)" }}
      >
        {unlocked ? `${cta} ←` : "مقفل"}
      </span>
    </button>
  );
}

/* ── One wellbeing dimension — a soft, colour-blocked card in its own accent ── */

function DimensionCard({
  dimension,
  result,
  isNext,
  onClick,
}: {
  dimension: Dimension;
  result: DimensionResult;
  isNext: boolean;
  onClick: () => void;
}) {
  const done = result.complete;
  const meta = LEVEL_CLASS[result.level];
  return (
    <button
      onClick={onClick}
      style={{
        background: pastel(dimension.accent.solid, 12),
        boxShadow: isNext && !done ? `0 0 0 2px ${dimension.accent.solid}` : undefined,
      }}
      className="flex w-full items-center gap-3.5 rounded-[1.4rem] p-3.5 text-right shadow-soft transition duration-200 hover:-translate-y-0.5 active:translate-y-0"
    >
      {/* icon tile */}
      <span
        className="relative grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-[1.05rem] shadow-soft"
        style={
          done
            ? { background: dimension.accent.solid, color: "#fff" }
            : { background: "#fff", color: dimension.accent.fg }
        }
      >
        <dimension.icon className="h-6 w-6" strokeWidth={2} />
        {done && (
          <span className="absolute -bottom-1 -left-1 grid h-5 w-5 place-items-center rounded-full bg-surface text-good shadow-soft ring-2 ring-surface">
            <Check className="h-3 w-3" strokeWidth={3.5} />
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-extrabold text-ink-900">{dimension.title}</h3>
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: done ? LEVEL_HEX[result.level] : dimension.accent.solid }}
          />
          <span
            className={cn(
              "line-clamp-1 text-xs font-semibold",
              done ? meta.text : "text-ink-500",
            )}
          >
            {done ? result.band.title : isNext ? "ابدأ الآن — لم تُجب بعد" : dimension.tagline}
          </span>
        </div>
      </div>

      {done ? (
        <div className="shrink-0 text-left leading-none">
          <span
            className="nums text-[1.4rem] font-extrabold"
            style={{ color: LEVEL_HEX[result.level] }}
          >
            {result.score}
          </span>
          <span className="mt-0.5 block text-[10px] font-bold text-ink-400">من 100</span>
        </div>
      ) : isNext ? (
        <span
          className="shrink-0 rounded-pill px-3.5 py-1.5 text-[11px] font-bold text-white shadow-soft"
          style={{ background: dimension.accent.solid }}
        >
          ابدأ
        </span>
      ) : (
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/70"
          style={{ color: dimension.accent.fg }}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
        </span>
      )}
    </button>
  );
}
