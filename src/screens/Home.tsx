import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  ChevronLeft,
  Gift,
  GraduationCap,
  ListChecks,
  Lock,
  Map as MapIcon,
  MessageCircleHeart,
  RefreshCw,
  ScrollText,
  Sparkles,
  Timer,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, ProgressBar, ScoreRing, SectionHeader } from "../components/ui";
import { Illustration } from "../illustrations/Illustration";
import { ExpertAvatarStack } from "../components/ExpertAvatarStack";
import { RecommendedContentSwiper } from "../components/cards/RecommendedContentSwiper";
import { ProgramRecommendationCard } from "../components/cards/ProgramRecommendationCard";
import { WellbeingTrackers } from "../components/cards/WellbeingTrackers";
import { JournalSection } from "../components/cards/JournalSection";
import { TrailMap, dimensionStation, type TrailStation } from "../components/TrailMap";
import { cn } from "../lib/cn";
import { scoreMeta } from "../lib/score";
import { useAssessment, type DimensionResult } from "../assessment/useAssessment";
import { useInsights } from "../assessment/useInsights";
import { currentUser } from "../data/app";
import { dimensions, type Dimension } from "../data/dimensions";
import { DIMENSION_ART } from "../data/questionArt";
import { recommendPrograms } from "../data/programs";
import { MIN_DIMS_FOR_PREVIEW } from "../data/report";
import { useContentRecommendations } from "../content/useContentRecommendations";

/** Soft pastel fill from a solid accent — the modern colour-blocked card look. */
const pastel = (hex: string, pct = 12) => `color-mix(in srgb, ${hex} ${pct}%, white)`;

/** Supplied home-card artwork for every wellbeing dimension. */
const DIMENSION_IMAGE: Partial<Record<Dimension["id"], string>> = {
  physical: "/images/physical.png",
  psycho: "/images/psycho.png",
  financial: "/images/financial.png",
  intellectual: "/images/intellectual.png",
  community: "/images/community.png",
  social: "/images/social.png",
  belonging: "/images/belonging.png",
  professional: "/images/professional.png",
  workplace: "/images/workplace.png",
};

/** Arabic count phrase for dimensions: بُعد واحد / بُعدان / N أبعاد. */
const dimsPhrase = (n: number) => (n === 1 ? "بُعدًا واحدًا" : n === 2 ? "بُعدين" : `${n} أبعاد`);

/** Arabic count phrase for questions (3–10 → أسئلة, 11+ → سؤالًا). */
const questionsPhrase = (n: number) => (n <= 10 ? `${n} أسئلة` : `${n} سؤالًا`);

/** "البُعد البدني" for adjective titles, "بُعد بيئة العمل" for noun phrases. */
const dimName = (title: string) => (title.startsWith("ال") ? `البُعد ${title}` : `بُعد ${title}`);

/** Today, in Arabic with Western digits (the app-wide numeral convention). */
const todayLabel = new Intl.DateTimeFormat("ar-u-nu-latn", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

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
      {/* ── Sky header — a soft full-bleed gradient scene the hero card floats on ── */}
      <div
        className="relative overflow-hidden rounded-b-[2.75rem]"
        style={{ background: "linear-gradient(168deg, #cfe4fb 0%, #dfdaf9 55%, #d4edfa 100%)" }}
      >
        <span
          className="pointer-events-none absolute -left-14 -top-16 h-56 w-56 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.75), transparent 68%)" }}
        />
        <span
          className="pointer-events-none absolute -right-10 top-6 h-40 w-40 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(46,128,210,0.25), transparent 70%)" }}
        />
        <span
          className="pointer-events-none absolute -bottom-10 left-16 h-36 w-36 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,110,230,0.22), transparent 70%)" }}
        />
        <span className="dot-cluster pointer-events-none absolute left-6 top-7 h-10 w-14 text-white/70" />

        <section className="relative px-5 pb-[5.75rem] pt-[max(1.5rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={currentUser.name} size={52} className="shadow-soft ring-2 ring-white/80" />
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-bold text-ink-500">{todayLabel}</p>
                <h1 className="mt-0.5 truncate text-[1.45rem] font-extrabold text-ink-900">
                  {greeting}، {currentUser.firstName} 👋
                </h1>
              </div>
            </div>
            <button
              aria-label="الإشعارات"
              className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/65 text-ink-700 shadow-soft ring-1 ring-white/70 backdrop-blur transition hover:-translate-y-0.5 active:scale-95"
            >
              <Bell className="h-[1.2rem] w-[1.2rem]" strokeWidth={2} />
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-coral-500 ring-2 ring-white" />
            </button>
          </div>
        </section>
      </div>

      {/* ── Adaptive wellbeing hero — a white card floating over the sky's curve.
          Shows the overall score once complete, journey progress before that. ── */}
      <section className="relative -mt-[4.25rem] px-5">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-surface p-5 shadow-card ring-1 ring-ink-900/[0.03]">
          <span
            className="pointer-events-none absolute -left-8 -bottom-10 h-32 w-32 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(46,128,210,0.10), transparent 70%)" }}
          />

          <div className="relative flex items-center gap-4">
            <span className="grid place-items-center rounded-full bg-brand-50 p-1.5">
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
                  <span className="inline-flex items-center gap-1 rounded-pill bg-good-soft px-2.5 py-1 text-[11px] font-bold text-good">
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
                className="flex flex-1 items-center justify-center gap-1.5 rounded-pill bg-brand-soft py-3.5 text-[0.875rem] font-bold text-brand-700 ring-1 ring-inset ring-brand-500/15 transition hover:bg-brand-100 active:scale-[0.99]"
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
                ? `تابع: ${dimName(nextDim.title)}`
                : nextDim
                  ? `ابدأ ${dimName(nextDim.title)}`
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
              <img
                src="/images/marker.png"
                alt=""
                aria-hidden
                className="relative mx-auto w-44 max-w-[58%] object-contain"
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
                    desc: `جلسة خاصة وسرّية تدفع عنها ${currentUser.org}، مع خطة مصمّمة لك`,
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

      {/* ── Wellbeing dimensions — an illustrated "next stop" spotlight, then the
          nine stations as a winding trail that ends at the real reward. ── */}
      <section className="px-5 pt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[1.15rem] font-extrabold text-ink-900">أبعاد رفاهيتك</h2>
            <p className="mt-0.5 text-xs font-semibold text-ink-400">
              {hasResults
                ? "اكتمل تقييمك عبر الأبعاد التسعة"
                : "رحلة من 9 محطات — تنتهي بهدية حقيقية"}
            </p>
          </div>
          <span dir="ltr" className="nums shrink-0 pb-0.5 text-[13px] font-bold text-ink-500">
            {completedCount}/{totalDimensions}
          </span>
        </div>

        {/* Journey strip — one segment per dimension, lit in its own accent. */}
        <div className="mb-4 flex gap-1" aria-hidden>
          {dimensions.map((d, i) => (
            <span
              key={d.id}
              className="h-1.5 flex-1 rounded-pill transition-colors duration-500"
              style={{
                background: results[i].complete
                  ? d.accent.solid
                  : i === nextIndex
                    ? pastel(d.accent.solid, 45)
                    : "var(--color-ink-100)",
              }}
            />
          ))}
        </div>

        {nextDim && (
          <NextDimensionSpotlight
            dimension={nextDim}
            result={results[nextIndex]}
            step={nextIndex + 1}
            total={totalDimensions}
            onClick={() => navigate(`/dimension/${nextDim.id}`)}
          />
        )}

        <JourneyTrail
          results={results}
          nextIndex={nextIndex}
          hasResults={hasResults}
          className={nextDim ? "mt-2" : undefined}
          onOpenDimension={(id) => navigate(`/dimension/${id}`)}
          onOpenGift={() => navigate("/consultation")}
        />

        {/* The full journey page — the extended road with every reward, plus
            the points, levels, and badges layer. */}
        <button
          onClick={() => navigate("/journey")}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-pill border border-brand-200 bg-brand-soft/60 py-3 text-[13px] font-bold text-brand-700 transition hover:bg-brand-100 active:scale-[0.99]"
        >
          <MapIcon className="h-4 w-4" strokeWidth={2.2} />
          خريطة رحلتك كاملة — نقاطك ومكافآتك
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </section>

      {/* ── Your deliverables — report + free consultation, as colourful cards ── */}
      <section className="px-5 pt-7">
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

/* ── The next stop on the journey — one big, illustrated, accent-washed card ── */

function NextDimensionSpotlight({
  dimension,
  result,
  step,
  total,
  onClick,
}: {
  dimension: Dimension;
  result: DimensionResult;
  step: number;
  total: number;
  onClick: () => void;
}) {
  const accent = dimension.accent;
  const resume = result.answered > 0;
  const image = DIMENSION_IMAGE[dimension.id];
  const hasDimensionImage = image !== undefined;
  return (
    <button
      onClick={onClick}
      className="relative block w-full overflow-hidden rounded-[1.75rem] p-5 text-right shadow-soft transition duration-200 hover:-translate-y-0.5 active:translate-y-0"
      style={{ background: pastel(accent.solid, 16) }}
    >
      <span
        className="pointer-events-none absolute -left-10 -top-12 h-36 w-36 rounded-full"
        style={{ background: `radial-gradient(circle, ${pastel(accent.solid, 45)}, transparent 70%)` }}
      />
      <span
        className="dot-cluster pointer-events-none absolute bottom-20 left-5 h-10 w-14"
        style={{ color: accent.solid, opacity: 0.3 }}
      />

      <div className={cn("relative flex items-center", hasDimensionImage ? "gap-0" : "gap-3")}>
        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-pill bg-white/80 font-extrabold",
              hasDimensionImage ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
            )}
            style={{ color: accent.fg }}
          >
            <Sparkles className="h-3 w-3" strokeWidth={2.4} />
            محطتك التالية · {step} من {total}
          </span>
          <h3
            className={cn(
              "font-extrabold leading-snug text-ink-900",
              hasDimensionImage ? "mt-2 text-[1.15rem]" : "mt-2.5 text-[1.35rem]",
            )}
          >
            {dimName(dimension.title)}
          </h3>
          <p
            className={cn(
              "mt-1 font-semibold leading-relaxed text-ink-600",
              hasDimensionImage ? "text-[11px]" : "text-xs",
            )}
          >
            {dimension.tagline}
          </p>
          <div
            className={cn(
              "flex flex-wrap items-center gap-y-1.5 font-bold text-ink-500",
              hasDimensionImage ? "mt-2 gap-x-2 text-[10px]" : "mt-3 gap-x-3 text-[11px]",
            )}
          >
            <span className="inline-flex items-center gap-1">
              <ListChecks className="h-3.5 w-3.5" strokeWidth={2.2} />
              {questionsPhrase(result.total)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" strokeWidth={2.2} />
              دقيقة إلى دقيقتين
            </span>
          </div>
        </div>
        {image ? (
          <img
            src={image}
            alt=""
            aria-hidden
            className="w-[9.5rem] max-w-[44%] shrink-0 object-contain"
          />
        ) : (
          <Illustration
            name={DIMENSION_ART[dimension.id]}
            tone={accent.solid}
            className="w-[7.5rem] max-w-[36%] shrink-0"
          />
        )}
      </div>

      {resume && (
        <div className="relative mt-4">
          <ProgressBar
            value={(result.answered / result.total) * 100}
            barStyle={{ background: accent.solid }}
            trackClassName="bg-white/75"
          />
          <p dir="ltr" className="nums mt-1.5 text-left text-[10px] font-bold text-ink-500">
            {result.answered}/{result.total}
          </p>
        </div>
      )}

      <span
        className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-pill py-3.5 text-[0.875rem] font-bold text-white shadow-soft"
        style={{ background: accent.solid }}
      >
        {resume ? "أكمل من حيث توقفت" : "ابدأ الآن"}
        <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
      </span>
    </button>
  );
}

/* ── The journey trail — nine stations on a winding dotted path, in answering
   order, ending at the gift the company already paid for. Rendered by the
   shared TrailMap; the dedicated /journey page shows the extended road. ────── */

function JourneyTrail({
  results,
  nextIndex,
  hasResults,
  className,
  onOpenDimension,
  onOpenGift,
}: {
  results: DimensionResult[];
  nextIndex: number;
  hasResults: boolean;
  className?: string;
  onOpenDimension: (id: Dimension["id"]) => void;
  onOpenGift: () => void;
}) {
  const stations: TrailStation[] = dimensions.map((dimension, i) =>
    dimensionStation({
      dimension,
      result: results[i],
      isNext: i === nextIndex,
      step: i + 1,
      onClick: () => onOpenDimension(dimension.id),
    }),
  );

  // The finale — the employer-paid gift, visible from step one.
  stations.push({
    key: "gift",
    icon: <Gift className="h-6 w-6" strokeWidth={2.1} />,
    size: 58,
    labelWidth: "w-36",
    circleClassName: hasResults
      ? "bg-coral-500 text-white shadow-pop"
      : "border-2 border-dashed border-coral-300 bg-white/80 text-coral-400",
    badge: hasResults ? (
      <span className="absolute -bottom-0.5 -left-0.5 grid h-5 w-5 place-items-center rounded-full bg-good text-white shadow-soft ring-2 ring-white">
        <Check className="h-3 w-3" strokeWidth={3.5} />
      </span>
    ) : undefined,
    title: hasResults ? "احجز استشارتك المجانية" : "هديتك في النهاية",
    titleClassName: hasResults ? "text-coral-600" : "text-ink-600",
    caption: (
      <span className="text-[10px] font-semibold leading-tight text-ink-400">
        {hasResults ? "خبيرك بانتظارك الآن" : "استشارة مجانية + تقريرك الكامل"}
      </span>
    ),
    disabled: !hasResults,
    onClick: hasResults ? onOpenGift : undefined,
  });

  return <TrailMap stations={stations} className={className} />;
}
