import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarHeart,
  CheckCircle2,
  ChevronLeft,
  Quote,
  Share2,
  Sparkles,
  TrendingDown,
  Users,
} from "lucide-react";
import { ProgressBar, ScoreRing } from "../components/ui";
import { IconTile } from "../components/ui/Card";
import { ExpertAvatarStack } from "../components/ExpertAvatarStack";
import { DimensionDeepCard } from "../components/cards/DimensionCard";
import { DetailedInsights } from "../components/cards/DetailedInsights";
import { MetricsBreakdown } from "../components/cards/MetricsBreakdown";
import { Spotlight } from "../components/Spotlight";
import { Radar } from "../components/charts/Radar";
import { Sparkline } from "../components/charts/Sparkline";
import { DeltaPill } from "../components/Trend";
import { LockedState } from "../components/LockedState";
import { cn } from "../lib/cn";
import { scoreMeta, LEVEL_CLASS, LEVEL_HEX } from "../lib/score";
import { useAssessment } from "../assessment/useAssessment";
import { useInsights } from "../assessment/useInsights";
import { useMetrics } from "../assessment/useMetrics";
import { usePlan } from "../plan/usePlan";
import { dimensionsById, tileStyle } from "../data/dimensions";
import {
  answeredQuestions,
  delta,
  MIN_DIMS_FOR_PREVIEW,
  pastHistory,
  patterns,
  percentile,
  prevOverall,
} from "../data/report";

function ImpactStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-card bg-sand/70 py-3">
      <p dir="ltr" className="nums text-2xl font-extrabold text-brand-700">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold text-ink-500">{label}</p>
    </div>
  );
}

export function Report() {
  const navigate = useNavigate();
  const plan = usePlan();
  const insights = useInsights();
  const metricGroups = useMetrics();
  const {
    overallScore,
    results,
    resultBySlug,
    strengths,
    focus,
    strongCount,
    attentionCount,
    hasResults,
    started,
    progressPct,
    completedCount,
    totalDimensions,
  } = useAssessment();

  // A preliminary preview once "enough" dimensions are in: the report opens
  // early, and finishing the rest is framed as sharpening it — not unlocking it.
  const preview = !hasResults && completedCount >= MIN_DIMS_FOR_PREVIEW;
  const remainingDims = totalDimensions - completedCount;

  const meta = scoreMeta(overallScore);
  const overallDelta = delta(overallScore, prevOverall);
  const focusTop = focus.slice(0, 3);
  const topStrengths = strengths.slice(0, 2);
  const history = [...pastHistory, { label: "الآن", score: overallScore }];
  const radarPoints = results.map((r) => ({
    title: dimensionsById[r.slug].title,
    score: r.score,
    color: LEVEL_HEX[r.level],
  }));

  if (!preview && !hasResults) {
    return (
      <div className="animate-rise">
        <header className="px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
          <h1 className="text-2xl font-extrabold text-ink-900">تقريرك</h1>
        </header>
        <LockedState
          title={started ? "تقريرك بدأ يتشكّل" : "لا يوجد تقرير بعد"}
          subtitle={
            started
              ? `أكمل ${MIN_DIMS_FOR_PREVIEW} أبعاد لفتح تقريرك المبدئي (أكملت ${completedCount})، ثم تزيد دقّته مع كل بُعد.`
              : "أكمل تقييم الرفاهية لأول مرة لتحصل على تقرير مفصّل بتحليل إجاباتك عبر تسعة أبعاد."
          }
          ctaLabel={started ? "أكمل التقييم" : "ابدأ التقييم"}
          onCta={() => navigate(started ? "/assessment" : "/")}
          progress={started ? progressPct : undefined}
        />
      </div>
    );
  }

  return (
    <div className="animate-rise pb-4">
      <header className="flex items-center justify-between px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">تقريرك</h1>
          <p className="text-[0.8125rem] font-semibold text-ink-400">
            {preview ? (
              <>
                تقرير مبدئي · <span className="nums">{completedCount}</span> من{" "}
                <span className="nums">{totalDimensions}</span> أبعاد
              </>
            ) : (
              <>
                آخر تقييم قبل 6 أيام · <span className="nums">{answeredQuestions}</span> سؤال
              </>
            )}
          </p>
        </div>
        <button
          aria-label="مشاركة"
          className="grid h-11 w-11 place-items-center rounded-full border border-ink-200 bg-surface text-ink-700 transition hover:border-ink-300 active:scale-95"
        >
          <Share2 className="h-5 w-5" strokeWidth={2} />
        </button>
      </header>

      {/* ── Accuracy ladder — preview only: the report is open, and finishing
             the rest visibly sharpens it rather than unlocking it. ────────── */}
      {preview && (
        <section className="px-5 pt-4">
          <div className="rounded-xl border border-brand-200 bg-brand-soft/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-brand-700">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
                  تقرير مبدئي
                </p>
                <h2 className="mt-0.5 text-[15px] font-extrabold text-ink-900">
                  دقّته تزيد مع كل بُعد تكمّله
                </h2>
              </div>
              <span dir="ltr" className="nums shrink-0 text-2xl font-extrabold text-brand-700">
                {completedCount}
                <span className="text-sm font-bold text-ink-300"> / {totalDimensions}</span>
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={Math.round((completedCount / totalDimensions) * 100)} barClassName="bg-brand-500" />
            </div>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-600">
              الصورة الكاملة — توازن أبعادك، مقارنتك بزملائك، والأنماط بينها — تكتمل لمّا تخلّص الأبعاد
              الباقية.
            </p>
            <button
              onClick={() => navigate("/assessment")}
              className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-pill bg-brand-600 py-3 text-[0.8125rem] font-bold text-white transition hover:bg-brand-700 active:scale-[0.99]"
            >
              أكمل التقييم · تبقّى <span dir="ltr" className="nums">{remainingDims}</span>{" "}
              {remainingDims > 10 ? "بُعدًا" : remainingDims === 1 ? "بُعد" : "أبعاد"}
              <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </div>
        </section>
      )}

      {/* ── Verdict ──────────────────────────────────────────────────────── */}
      <section className="px-5 pt-5">
        <Spotlight>
          <div className="flex items-center gap-5 p-5 text-white">
            <ScoreRing
              value={overallScore}
              size={120}
              stroke={10}
              gradient={["#bfe0ff", "#4f9ae2"]}
              trackClassName="text-white/12"
            >
              <div className="leading-none">
                <span className="nums text-[2.25rem] font-extrabold">{overallScore}</span>
                <span className="mt-0.5 block text-[10px] font-bold text-white/55">من 100</span>
              </div>
            </ScoreRing>
            <div className="min-w-0 flex-1">
              <p className="text-[0.8125rem] font-semibold text-brand-200">
                {preview ? "رفاهيتك العامة (مبدئية)" : "رفاهيتك العامة"}
              </p>
              <p className="mt-0.5 text-2xl font-extrabold">{meta.label}</p>
              {preview ? (
                <p className="mt-2 text-[11px] font-semibold text-white/55">
                  محسوبة على <span className="nums">{completedCount}</span> أبعاد حتى الآن
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <DeltaPill diff={overallDelta.diff} onDark />
                  <span className="text-[11px] font-semibold text-white/55">منذ آخر تقييم</span>
                </div>
              )}
            </div>
          </div>
          {!preview && (
            <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3 text-[0.8125rem] font-semibold text-brand-100">
              <Users className="h-4 w-4 shrink-0" strokeWidth={2.2} />
              <span>
                نتيجتك أفضل من <span className="nums font-bold text-white">{percentile}%</span> من زملائك في القطاع
              </span>
            </div>
          )}
        </Spotlight>
      </section>

      {/* ── Featured narrative — the headline reading of the whole report ── */}
      {!preview && (
      <section className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-xl border border-brand-200 bg-gradient-to-br from-brand-soft via-surface to-surface p-5 shadow-card">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full bg-brand-100/50 blur-2xl"
          />
          <div className="relative">
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.7rem] bg-brand-600 text-white shadow-soft">
                <Quote className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600">
                  ملخّص مخصّص لك
                </p>
                <h2 className="text-[1.15rem] font-extrabold text-ink-900">خلاصة نتائجك</h2>
              </div>
            </div>
            <p className="text-[0.9375rem] font-medium leading-[1.9] text-ink-700">
              {insights.narrative}
            </p>
          </div>
        </div>
      </section>
      )}

      {/* ── Trend over time ──────────────────────────────────────────────── */}
      {!preview && (
      <section className="px-5 pt-4">
        <div className="rounded-xl border border-ink-100 bg-surface p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[1.0625rem] font-bold text-ink-900">مسارك مع الوقت</h2>
              <p className="text-xs font-semibold text-ink-400">رفاهيتك العامة عبر آخر أربعة تقييمات</p>
            </div>
            <DeltaPill diff={overallDelta.diff} />
          </div>
          <Sparkline data={history} />
          <div dir="ltr" className="mt-1 flex justify-between px-3">
            {history.map((p) => (
              <span key={p.label} className="text-[11px] font-semibold text-ink-400">
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Wellbeing balance (radar) ────────────────────────────────────── */}
      {!preview && (
      <section className="px-5 pt-4">
        <div className="rounded-xl border border-ink-100 bg-surface p-5 shadow-card">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-[1.0625rem] font-bold text-ink-900">توازن رفاهيتك</h2>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-good">
                <span className="h-2 w-2 rounded-full bg-good" />
                <span className="nums">{strongCount}</span> قوية
              </span>
              <span className="flex items-center gap-1 text-alert">
                <span className="h-2 w-2 rounded-full bg-alert" />
                <span className="nums">{attentionCount}</span> تحتاج عناية
              </span>
            </div>
          </div>
          <Radar data={radarPoints} />
        </div>
      </section>
      )}

      {/* ── Detailed health insights — derived live from every answer ────── */}
      {!preview && <DetailedInsights summary={insights} />}

      {/* ── Full metrics breakdown — every sub-scale, scored 0–100 ────────── */}
      {!preview && <MetricsBreakdown groups={metricGroups} />}

      {/* ── Strengths ────────────────────────────────────────────────────── */}
      <section className="px-5 pt-6">
        <h2 className="mb-3.5 flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
          <Sparkles className="h-[1.15rem] w-[1.15rem] text-good" strokeWidth={2.4} />
          نقاط قوتك
        </h2>
        <div className="space-y-2.5">
          {topStrengths.map((r) => {
            const d = dimensionsById[r.slug];
            return (
              <button
                key={r.slug}
                onClick={() => navigate(`/dimension/${r.slug}`)}
                className="flex w-full items-start gap-3.5 rounded-card border border-good/20 bg-good-soft/40 p-3.5 text-right transition active:scale-[0.99]"
              >
                <IconTile icon={d.icon} size="lg" style={tileStyle(d.accent)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-ink-900">{d.title}</h3>
                    <span className="nums text-lg font-extrabold text-good">{r.score}</span>
                  </div>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-600">{r.band.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Focus areas ──────────────────────────────────────────────────── */}
      <section className="px-5 pt-6">
        <h2 className="mb-3.5 flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
          <TrendingDown className="h-[1.15rem] w-[1.15rem] text-alert" strokeWidth={2.4} />
          أبرز ما يحتاج انتباهك
        </h2>
        <div className="space-y-2.5">
          {focusTop.map((r) => {
            const d = dimensionsById[r.slug];
            const m = LEVEL_CLASS[r.level];
            const e = plan.effort[r.slug];
            return (
              <button
                key={r.slug}
                onClick={() => navigate(`/dimension/${r.slug}`)}
                className="w-full rounded-card border border-alert/20 bg-alert-soft/40 p-3.5 text-right transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <IconTile icon={d.icon} size="lg" style={tileStyle(d.accent)} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-bold text-ink-900">{d.title}</h3>
                    <p className="line-clamp-1 text-xs font-semibold text-ink-400">{r.band.title}</p>
                  </div>
                  <div className="pl-1 text-center">
                    <span className="nums block text-xl font-extrabold" style={{ color: LEVEL_HEX[r.level] }}>
                      {r.score}
                    </span>
                    <span className={cn("text-[10px] font-bold", m.text)}>{m.label}</span>
                  </div>
                </div>
                <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-600">{r.band.description}</p>
                {e && e.done > 0 && (
                  <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-pill bg-good-soft px-2.5 py-1 text-[11px] font-bold text-good">
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.4} />
                    جهدك يظهر · أنجزت <span dir="ltr" className="nums">{e.done}</span> مهمة من خطتك
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {!preview && (
          <button
            onClick={() => navigate("/plan")}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-pill border border-ink-200 bg-surface py-3 text-[0.8125rem] font-bold text-ink-700 transition hover:border-ink-300 active:scale-[0.99]"
          >
            ابدأ خطة عملية لهذه الأبعاد
            <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
          </button>
        )}
      </section>

      {/* ── Your journey's impact (plan → report loop) ───────────────────── */}
      {!preview && plan.activeDimensions.length > 0 && (
        <section className="px-5 pt-6">
          <h2 className="mb-1 flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
            <CalendarHeart className="h-[1.15rem] w-[1.15rem] text-brand-600" strokeWidth={2.4} />
            أثر رحلتك
          </h2>
          <p className="mb-3.5 text-xs font-semibold text-ink-400">
            كل مهمة تنجزها في خطتك تظهر هنا — والمجهود يعمل لصالحك
          </p>
          <div className="rounded-xl border border-ink-100 bg-surface p-5 shadow-card">
            <div className="mb-4 grid grid-cols-3 gap-3 text-center">
              <ImpactStat value={plan.totalCompleted} label="مهمة مكتملة" />
              <ImpactStat value={plan.streakDays} label="أيام نشطة" />
              <ImpactStat value={plan.activeDimensions.length} label="أبعاد قيد العمل" />
            </div>
            <div className="space-y-3.5">
              {plan.activeDimensions.slice(0, 4).map((id) => {
                const d = dimensionsById[id];
                const e = plan.effort[id]!;
                const pct = Math.round((e.done / e.total) * 100);
                const needsCare = resultBySlug[id].level === "attention";
                return (
                  <div key={id} className="flex items-center gap-3">
                    <IconTile icon={d.icon} style={tileStyle(d.accent)} />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-ink-900">
                          {d.title}
                          {needsCare && (
                            <span className="rounded-pill bg-alert-soft px-1.5 py-0.5 text-[10px] font-bold text-alert">
                              تحتاج عناية
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 text-[11px] font-semibold text-ink-400">
                          <span dir="ltr" className="nums font-bold text-ink-700">
                            {e.done}/{e.total}
                          </span>{" "}
                          مهمة
                        </span>
                      </div>
                      <ProgressBar value={pct} barClassName="bg-brand-500" />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-md bg-brand-soft/50 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.2} />
              <p className="text-[0.8125rem] leading-relaxed text-ink-700">
                واصل خطواتك الصغيرة — سينعكس أثر هذا الالتزام في تقييمك القادم.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Patterns we noticed ──────────────────────────────────────────── */}
      {!preview && (
      <section className="px-5 pt-6">
        <h2 className="mb-1 text-[1.0625rem] font-bold text-ink-900">أنماط لاحظناها</h2>
        <p className="mb-3.5 text-xs font-semibold text-ink-400">
          روابط بين أبعادك تساعدك على فهم الصورة الأكبر
        </p>
        <div className="space-y-2.5">
          {patterns.map((p) => {
            const accent = p.kind === "strength" ? "var(--color-good)" : "var(--color-warn)";
            return (
              <div key={p.id} className="rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
                    style={{
                      background: p.kind === "strength" ? "var(--color-good-soft)" : "var(--color-warn-soft)",
                      color: accent,
                    }}
                  >
                    {p.kind === "strength" ? (
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                    )}
                  </span>
                  <h3 className="text-sm font-bold text-ink-900">{p.title}</h3>
                </div>
                <p className="text-[0.8125rem] leading-relaxed text-ink-600">{p.body}</p>
              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* ── Full breakdown — every dimension, tap to open ────────────────── */}
      <section className="px-5 pt-6">
        <h2 className="mb-1 text-[1.0625rem] font-bold text-ink-900">
          {preview ? "أبعادك المكتملة" : "تفاصيل الأبعاد"}
        </h2>
        <p className="mb-3.5 text-xs font-semibold text-ink-400">
          {preview
            ? "قراءة حالتك وأهم التوصيات في كل بُعد أكملته — والباقي يظهر هنا فور إكماله"
            : "درجتك مقابل زملائك، قراءة حالتك، وأهم التوصيات في كل بُعد — مرتّبة من الأكثر حاجة للانتباه"}
        </p>
        <div className="space-y-3">
          {focus.map((r) => (
            <DimensionDeepCard
              key={r.slug}
              dimension={dimensionsById[r.slug]}
              onClick={() => navigate(`/dimension/${r.slug}`)}
            />
          ))}
        </div>
      </section>

      {/* ── Next step — preview: a clear terminal incentive to finish. ───── */}
      {preview && (
        <section className="px-5 pt-6">
          <div className="rounded-xl border border-brand-200 bg-brand-soft/60 p-5">
            <h2 className="text-[1.0625rem] font-extrabold text-ink-900">
              يفصلك <span className="nums">{remainingDims}</span>{" "}
              {remainingDims > 10 ? "بُعدًا" : remainingDims === 1 ? "بُعد" : "أبعاد"} عن تقريرك الكامل
            </h2>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-600">
              بإكمالها يُفتح توازن أبعادك، مقارنتك بزملائك، الأنماط بينها، والاستشارة المجانية مع خبير.
            </p>
            <button
              onClick={() => navigate("/assessment")}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-pill bg-brand-600 py-3 text-[15px] font-bold text-white transition hover:bg-brand-700 active:scale-[0.98]"
            >
              أكمل التقييم
              <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </div>
        </section>
      )}

      {/* ── Next step ────────────────────────────────────────────────────── */}
      {!preview && (
      <section className="px-5 pt-6">
        <Spotlight className="p-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ExpertAvatarStack size={44} ringClassName="ring-brand-900" />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-white">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good/80" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-good" />
                  </span>
                  مختصون متاحون الآن
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/55">انتظار أقل من دقيقة</p>
              </div>
            </div>
            <span className="shrink-0 rounded-pill bg-white/10 px-2.5 py-1 text-[11px] font-bold text-brand-100 ring-1 ring-inset ring-white/10">
              مجانًا
            </span>
          </div>
          <p className="mt-4 text-[1.0625rem] font-bold">تحدّث مع خبير حول نتائجك</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-white/65">
            احجز استشارتك المجانية لمناقشة تقريرك ووضع خطة عملية تناسبك — جلسة فيديو فورية بضغطة واحدة.
          </p>
          <button
            onClick={() => navigate("/consultation")}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-pill bg-white py-3 text-[15px] font-bold text-brand-900 transition hover:bg-brand-50 active:scale-[0.98]"
          >
            احجز استشارتك المجانية
            <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </Spotlight>
      </section>
      )}
    </div>
  );
}
