import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  ChevronLeft,
  GraduationCap,
  ListChecks,
  Lock,
  MessageCircleHeart,
  RefreshCw,
  ScrollText,
  Sparkles,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, ProgressBar, ScoreRing, SectionHeader } from "../components/ui";
import { Spotlight } from "../components/Spotlight";
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
import { useContentRecommendations } from "../content/useContentRecommendations";

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
  const meta = scoreMeta(overallScore);
  const recommendations = useContentRecommendations(results);
  const recommendedPrograms = hasResults
    ? recommendPrograms(insights.insights).slice(0, 2)
    : [];

  return (
    <div className="animate-rise pb-4">
      {/* ── Header — a premium dark spotlight that unifies the greeting with the
          adaptive wellbeing hero: the overall score once the assessment is
          complete, the journey progress before that, each with its own next
          best action. This is the one place the home goes dark. ── */}
      <section className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Spotlight className="p-5">
          {/* identity + notifications */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={currentUser.name} size={46} className="ring-2 ring-white/15" />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[13px] font-bold text-white">{currentUser.org}</p>
                <p className="truncate text-[11px] font-semibold text-white/55">{currentUser.role}</p>
              </div>
            </div>
            <button
              aria-label="الإشعارات"
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white/90 backdrop-blur transition hover:bg-white/20 active:scale-95"
            >
              <Bell className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-coral-500 ring-2 ring-brand-900" />
            </button>
          </div>

          {/* greeting */}
          <div className="mt-5">
            <p className="text-[13px] font-semibold text-white/55">{greeting}،</p>
            <h1 className="mt-1 text-[1.85rem] font-extrabold leading-tight text-white">
              {currentUser.firstName}
            </h1>
          </div>

          {/* adaptive hero block */}
          <div className="mt-5 rounded-lg bg-white/[0.07] p-4 ring-1 ring-inset ring-white/10">
            <div className="flex items-center gap-4">
              <ScoreRing
                value={hasResults ? overallScore : journeyPct}
                size={82}
                stroke={8}
                gradient={["#9fe3ef", "#39b4cb"]}
                trackClassName="text-white/12"
              >
                {hasResults ? (
                  <div className="leading-none">
                    <span className="nums text-[1.5rem] font-extrabold text-white">{overallScore}</span>
                    <span className="mt-0.5 block text-[10px] font-bold text-white/45">من ١٠٠</span>
                  </div>
                ) : (
                  <div className="leading-none">
                    <span dir="ltr" className="nums text-[1.3rem] font-extrabold text-white">
                      {completedCount}
                      <span className="text-white/45">/{totalDimensions}</span>
                    </span>
                    <span className="mt-0.5 block text-[10px] font-bold text-white/45">أبعاد</span>
                  </div>
                )}
              </ScoreRing>

              <div className="min-w-0 flex-1">
                {hasResults ? (
                  <>
                    <span className="inline-flex items-center gap-1 rounded-pill bg-white/10 px-2.5 py-1 text-[11px] font-bold text-[#9fe3ef]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                      اكتمل تقييمك
                    </span>
                    <p className="mt-2 text-[1.2rem] font-extrabold leading-snug text-white">
                      رفاهيتك {meta.label}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-white/55">
                      تحدّث الآن مع مختص رفاهية في استشارة فورية مجانية
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[0.8125rem] font-bold text-[#9fe3ef]">
                      {started ? "رحلة رفاهيتك" : "أهلًا بك في رحلتك"}
                    </p>
                    <p className="mt-1.5 text-[1.2rem] font-extrabold leading-snug text-white">
                      {started ? "خطوة كل يوم نحو توازنك" : "لنبدأ رحلتك نحو توازن أفضل"}
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() =>
                hasResults
                  ? navigate("/consultation")
                  : nextDim
                    ? navigate(`/dimension/${nextDim.id}`)
                    : navigate("/report")
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-pill bg-white py-3.5 text-[0.8125rem] font-bold text-brand-900 shadow-soft transition hover:bg-white/90 active:scale-[0.99]"
            >
              {hasResults ? (
                <>
                  <Video className="h-4 w-4" strokeWidth={2.2} />
                  ابدأ استشارة فورية الآن
                </>
              ) : (
                <>
                  {started && nextDim
                    ? `تابع: بُعد ${nextDim.title}`
                    : nextDim
                      ? `ابدأ ببُعد ${nextDim.title}`
                      : "اعرض تقريرك"}
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
                </>
              )}
            </button>
          </div>
        </Spotlight>
      </section>

      {/* Wellbeing path — assessment → report → expert consultation */}
      <section className="px-5 pt-7">
        <div className="mb-4">
          <h2 className="text-[1.0625rem] font-bold text-ink-900">مسار رفاهيتك</h2>
          <p className="mt-0.5 text-xs font-semibold text-ink-400">
            من التقييم إلى استشارة خبير الرفاهية
          </p>
        </div>

        <div>
          {/* Stage 1 — the assessment, with its nine dimensions */}
          <StageRow state={hasResults ? "done" : "active"} icon={ListChecks}>
            <div className="rounded-xl bg-surface p-4 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-ink-900">التقييم</h3>
                  <p className="mt-0.5 text-xs font-semibold text-ink-400">
                    {hasResults
                      ? "اكتمل تقييمك عبر الأبعاد التسعة"
                      : "أجب عن أبعادك التسعة لتكشف حالتك"}
                  </p>
                </div>
                <span className="nums shrink-0 rounded-pill bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-700">
                  {completedCount}/{totalDimensions}
                </span>
              </div>
              <ProgressBar value={journeyPct} barClassName="bg-brand-500" className="mt-3" />
            </div>

            <div className="stagger mt-3 space-y-2.5">
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
          </StageRow>

          {/* Stage 2 — the report, unlocked once the assessment is complete */}
          <StageRow state={hasResults ? "active" : "locked"} icon={ScrollText}>
            <DeliverableCard
              title="تقريرك"
              desc={
                hasResults
                  ? "تحليل مفصّل لإجاباتك ونقاط تركيزك"
                  : "يُفتح بعد إنهاء التقييم"
              }
              cta="اعرض التقرير"
              unlocked={hasResults}
              onClick={() => navigate("/report")}
            />
          </StageRow>

          {/* Stage 3 — a free session with a wellbeing expert */}
          <StageRow state={hasResults ? "active" : "locked"} icon={MessageCircleHeart} last>
            <DeliverableCard
              title="استشارة مع خبير الرفاهية"
              desc={
                hasResults
                  ? "استشارة فورية مجانية مع مختص متاح الآن"
                  : "تُفتح بعد ظهور تقريرك"
              }
              cta="ابدأ فورًا"
              unlocked={hasResults}
              onClick={() => navigate("/consultation")}
            />
          </StageRow>
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

/* ── One milestone on the wellbeing path (assessment → report → consult) ───── */

type StageState = "done" | "active" | "locked";

function StageRow({
  state,
  icon: Icon,
  last,
  children,
}: {
  state: StageState;
  icon: LucideIcon;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      {/* connector rail */}
      <div className="flex w-9 shrink-0 flex-col items-center">
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full shadow-soft",
            state === "done" && "bg-good text-white",
            state === "active" && "bg-brand-600 text-white ring-4 ring-brand-100",
            state === "locked" && "bg-ink-100 text-ink-400",
          )}
        >
          {state === "done" ? (
            <Check className="h-[1.05rem] w-[1.05rem]" strokeWidth={3} />
          ) : state === "locked" ? (
            <Lock className="h-4 w-4" strokeWidth={2.4} />
          ) : (
            <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={2.2} />
          )}
        </span>
        {!last && (
          <span
            className={cn(
              "mt-1.5 w-0.5 flex-1 rounded-full",
              state === "locked" ? "bg-ink-100" : "bg-brand-200",
            )}
          />
        )}
      </div>

      <div className={cn("min-w-0 flex-1", !last && "pb-4")}>{children}</div>
    </div>
  );
}

/* ── A deliverable on the path that unlocks after the assessment ───────────── */

function DeliverableCard({
  title,
  desc,
  cta,
  unlocked,
  onClick,
}: {
  title: string;
  desc: string;
  cta: string;
  unlocked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={!unlocked}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl p-4 text-right shadow-soft transition duration-200",
        unlocked
          ? "bg-surface hover:-translate-y-0.5 hover:shadow-card active:translate-y-0"
          : "cursor-not-allowed bg-surface/60",
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className={cn("text-[15px] font-bold", unlocked ? "text-ink-900" : "text-ink-400")}>
          {title}
        </h3>
        <p className="mt-0.5 text-xs font-semibold text-ink-400">{desc}</p>
      </div>
      {unlocked ? (
        <span className="shrink-0 rounded-pill bg-brand-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-soft">
          {cta}
        </span>
      ) : (
        <Lock className="h-4 w-4 shrink-0 text-ink-300" strokeWidth={2.2} />
      )}
    </button>
  );
}

/* ── One dimension on the wellbeing journey ────────────────────────────────── */

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
      className={cn(
        "flex w-full items-center gap-3.5 rounded-xl bg-surface p-3.5 text-right shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:translate-y-0",
        isNext && !done && "ring-2 ring-brand-500/55 ring-offset-2 ring-offset-canvas",
      )}
    >
      {/* pastel squircle icon tile */}
      <span
        className="relative grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-[1.05rem] transition"
        style={
          done
            ? { background: dimension.accent.solid, color: "#fff" }
            : { background: dimension.accent.soft, color: dimension.accent.fg }
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
        <h3 className="text-[15px] font-bold text-ink-900">{dimension.title}</h3>
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              background: done
                ? LEVEL_HEX[result.level]
                : isNext
                  ? "#178fa3"
                  : "#bcc5c2",
            }}
          />
          <span
            className={cn(
              "line-clamp-1 text-xs font-semibold",
              done ? meta.text : isNext ? "text-brand-700" : "text-ink-400",
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
          <span className="mt-0.5 block text-[10px] font-bold text-ink-300">من ١٠٠</span>
        </div>
      ) : isNext ? (
        <span className="shrink-0 rounded-pill bg-brand-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-soft">
          ابدأ
        </span>
      ) : (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-50 text-ink-400">
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
        </span>
      )}
    </button>
  );
}
