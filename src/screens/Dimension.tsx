import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Gauge,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react";
import { Button, ScoreRing } from "../components/ui";
import { IconTile } from "../components/ui/Card";
import { DeltaPill } from "../components/Trend";
import { DetailedInsights } from "../components/cards/DetailedInsights";
import { DimensionMetricsPanel } from "../components/cards/MetricsBreakdown";
import { cn } from "../lib/cn";
import { LEVEL_CLASS, LEVEL_HEX } from "../lib/score";
import { useAssessment } from "../assessment/useAssessment";
import { useInsights } from "../assessment/useInsights";
import { useMetrics } from "../assessment/useMetrics";
import { usePlan } from "../plan/usePlan";
import { dimensionsById, tileStyle, type DimensionId } from "../data/dimensions";
import { hraBySlug } from "../data/hra";
import { DimensionQuiz } from "../components/DimensionQuiz";
import { PrivacyNote } from "../components/PrivacyNote";

const VALID = new Set(Object.keys(dimensionsById));

export function Dimension() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { resultBySlug, answers, setAnswer } = useAssessment();
  const { effort } = usePlan();
  const insights = useInsights();
  const metricGroups = useMetrics();
  const [quizOpen, setQuizOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);

  if (!VALID.has(slug)) return <Navigate to="/" replace />;
  const id = slug as DimensionId;
  const dim = dimensionsById[id];
  const hra = hraBySlug[id];
  const r = resultBySlug[id];
  const metricsGroup = metricGroups.find((g) => g.dimension === id);
  const vsPeers = r.score - dim.benchmark;
  const meta = LEVEL_CLASS[r.level];
  const e = effort[id];
  const complete = r.complete;
  const answeredPct = Math.round((r.answered / r.total) * 100);
  // Same ~5s-per-question heuristic as the full assessment flow: an honest,
  // small commitment beats a scary question count.
  const minutes = Math.max(1, Math.round((r.total * 5) / 60));
  const minutesPhrase = minutes === 1 ? "دقيقة واحدة" : minutes === 2 ? "دقيقتين" : `${minutes} دقائق`;

  return (
    <div className="animate-rise pb-6">
      <header className="flex items-center gap-3 px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <button
          onClick={() => navigate(-1)}
          aria-label="رجوع"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-200 bg-surface text-ink-700 transition hover:border-ink-300 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-ink-400">بُعد الرفاهية</p>
          <h1 className="truncate text-xl font-extrabold text-ink-900">{dim.title}</h1>
        </div>
        <IconTile icon={dim.icon} size="lg" style={tileStyle(dim.accent)} />
      </header>

      {/* Hero — score+verdict when complete, otherwise an invitation to start */}
      <section className="px-5 pt-5">
        {complete ? (
          <div className="flex flex-col items-center rounded-xl border border-ink-100 bg-surface p-6 shadow-card">
            <ScoreRing value={r.score} size={150} stroke={12} className={meta.text} trackClassName="text-ink-100">
              <div className="leading-none">
                <span className="nums text-[3rem] font-extrabold text-ink-900">{r.score}</span>
                <span className="mt-1 block text-xs font-bold text-ink-400">من 100</span>
              </div>
            </ScoreRing>
            <span className={cn("mt-5 rounded-pill px-3 py-1 text-sm font-bold", meta.soft)}>
              {r.band.title}
            </span>
            <div className="mt-3 flex items-center gap-2">
              <DeltaPill diff={dim.trend} />
              <span className="text-[11px] font-semibold text-ink-400">منذ آخر تقييم</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-ink-100 bg-surface p-6 text-center shadow-card">
            <ScoreRing value={answeredPct} size={132} stroke={11} className="text-brand-500" trackClassName="text-ink-100">
              <IconTile icon={dim.icon} size="lg" style={tileStyle(dim.accent)} />
            </ScoreRing>
            <h2 className="mt-5 text-lg font-bold text-ink-900">لنقِس بُعد {dim.title}</h2>
            <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-ink-500">
              <span className="nums">{r.total}</span> سؤالًا بلمسة واحدة — نحو {minutesPhrase} —
              وتظهر درجتك وتحليلك فورًا.
            </p>
            {r.answered > 0 && (
              <p className="nums mt-3 text-xs font-bold text-brand-700">
                {r.answered}/{r.total} مكتمل
              </p>
            )}
            <div className="mt-5 w-full">
              <Button fullWidth size="lg" onClick={() => setQuizOpen(true)}>
                {r.answered > 0 ? "أكمل الإجابة" : "ابدأ الإجابة"}
                <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
              </Button>
              <p className="mt-3 text-xs font-semibold text-ink-400">
                سؤال واحد في كل خطوة · يمكنك الرجوع أو الخروج في أي وقت
              </p>
              <p className="mt-1.5 text-xs font-semibold text-brand-700">
                كل بُعد تكمله يقرّبك من تقريرك واستشارتك المجانية مع مختص
              </p>
            </div>
          </div>
        )}
      </section>

      {/* What the employer sees vs never sees — shown before answering starts. */}
      {!complete && (
        <section className="px-5 pt-3">
          <PrivacyNote />
        </section>
      )}

      {/* What it measures */}
      <section className="px-5 pt-5">
        <h2 className="mb-2 text-[1.0625rem] font-bold text-ink-900">ماذا يقيس هذا البُعد؟</h2>
        <p className="text-[0.875rem] leading-[1.85] text-ink-600">{hra.description}</p>
      </section>

      {complete && (
        <>
          {/* Verdict reading + score vs peers — the same comparison bar the
              report's deep card shows, so the full reading lives here too.
              The fill grows from the right (RTL), so the peer marker is
              anchored from the right on the same 0–100 scale. */}
          <section className="px-5 pt-5">
            <div className="rounded-xl border border-ink-100 bg-surface p-5 shadow-soft">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold">
                <span className="flex items-center gap-1.5 text-ink-700">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: LEVEL_HEX[r.level] }} />
                  درجتك <span dir="ltr" className="nums font-bold">{r.score}</span>
                </span>
                <span className="flex items-center gap-1.5 text-ink-400">
                  <span className="h-3 w-[3px] rounded-full bg-ink-400" />
                  متوسط الزملاء <span dir="ltr" className="nums font-bold">{dim.benchmark}</span>
                </span>
              </div>
              <div className="relative h-2 w-full rounded-pill bg-ink-100">
                <div
                  className="h-full rounded-pill"
                  style={{ width: `${r.score}%`, background: LEVEL_HEX[r.level] }}
                />
                <span
                  className="absolute top-1/2 h-3.5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-400 ring-2 ring-surface"
                  style={{ right: `${dim.benchmark}%` }}
                  title="متوسط الزملاء"
                />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-ink-400">
                {vsPeers === 0 ? (
                  <>بمستوى متوسط الزملاء في القطاع</>
                ) : (
                  <>
                    <span dir="ltr" className={cn("nums font-bold", vsPeers > 0 ? "text-good" : "text-alert")}>
                      {vsPeers > 0 ? "+" : "−"}
                      {Math.abs(vsPeers)}
                    </span>{" "}
                    {vsPeers > 0 ? "فوق متوسط الزملاء في القطاع" : "تحت متوسط الزملاء في القطاع"}
                  </>
                )}
              </p>
              <p className="mt-3.5 border-t border-ink-100 pt-3.5 text-[0.875rem] leading-[1.85] text-ink-700">
                {r.band.description}
              </p>
              {r.band.alert && (
                <div className="mt-3 flex items-start gap-2.5 rounded-md bg-warn-soft/60 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" strokeWidth={2.2} />
                  <p className="text-[0.8125rem] font-semibold leading-relaxed text-ink-700">{r.band.alert}</p>
                </div>
              )}
            </div>
          </section>

          {/* Sub-scale metrics — the same 0–100 indicators the report breaks
              down, scoped to this dimension only */}
          {metricsGroup && metricsGroup.metrics.length > 0 && (
            <section className="px-5 pt-6">
              <h2 className="mb-1 flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
                <Gauge className="h-[1.15rem] w-[1.15rem] text-brand-600" strokeWidth={2.4} />
                مؤشرات هذا البُعد
              </h2>
              <p className="mb-3.5 text-xs font-semibold text-ink-400">
                <span className="nums font-bold text-ink-600">{metricsGroup.metrics.length}</span>{" "}
                مؤشرًا فرعيًا محسوبًا من إجاباتك — درجة كل مؤشر من 100
              </p>
              <DimensionMetricsPanel group={metricsGroup} />
            </section>
          )}

          {/* Detailed health notes — the report's derived findings, scoped to
              this dimension */}
          <DetailedInsights summary={insights} dimension={id} />

          {/* Real advices → recommendations */}
          <section className="px-5 pt-6">
            <h2 className="mb-1 flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
              <Sparkles className="h-[1.15rem] w-[1.15rem] text-brand-600" strokeWidth={2.4} />
              توصيات تناسب نتيجتك
            </h2>
            <p className="mb-3.5 text-xs font-semibold text-ink-400">خطوات عملية مبنية على إجاباتك في هذا البُعد</p>
            <div className="space-y-2.5">
              {r.band.advices.map((advice, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-card border border-ink-100 bg-surface p-3.5 shadow-soft"
                >
                  <span
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full"
                    style={{ color: dim.accent.fg, background: dim.accent.soft }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <p className="text-[0.8125rem] font-semibold leading-relaxed text-ink-800">{advice}</p>
                </div>
              ))}
            </div>
            {e && e.total > 0 && (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-brand-soft/50 p-3 text-[0.8125rem] font-semibold text-ink-700">
                <ClipboardList className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.2} />
                من رحلتك: أنجزت <span dir="ltr" className="nums font-bold text-ink-900">{e.done}/{e.total}</span> مهمة لهذا البُعد
              </div>
            )}
          </section>
        </>
      )}

      {/* Review & edit answers — only once the dimension is complete */}
      {complete && (
        <section className="px-5 pt-6">
          <button
            onClick={() => setShowReview((v) => !v)}
            className="flex w-full items-center justify-between rounded-card border border-ink-100 bg-surface p-4 text-right shadow-soft transition hover:border-ink-300 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <ClipboardList className="h-5 w-5 text-ink-500" strokeWidth={2} />
              <div>
                <p className="text-[15px] font-bold text-ink-900">أسئلتك وإجاباتك</p>
                <p className="text-[11px] font-semibold text-ink-400">
                  <span className="nums">{r.total}</span> سؤال · يمكنك تعديل أي إجابة
                </p>
              </div>
            </div>
            <ChevronLeft
              className={cn("h-4 w-4 text-ink-300 transition-transform", showReview && "-rotate-90")}
              strokeWidth={2.4}
            />
          </button>

          {showReview && (
            <div className="mt-3 space-y-3">
              {hra.questions.map((q, qi) => (
                <div key={q.slug} className="rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
                  <div className="mb-3 flex gap-2.5">
                    <span className="nums grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-50 text-[11px] font-bold text-ink-500">
                      {qi + 1}
                    </span>
                    <p className="text-[0.875rem] font-bold leading-relaxed text-ink-900">{q.title}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {q.answers.map((a) => {
                      const selected = answers[q.slug] === a.value;
                      return (
                        <button
                          key={a.value}
                          onClick={() => setAnswer(q.slug, a.value)}
                          className={cn(
                            "rounded-pill px-3 py-1.5 text-[0.8125rem] font-bold transition active:scale-[0.97]",
                            selected
                              ? "text-white"
                              : "border border-ink-200 bg-surface text-ink-500 hover:border-ink-300",
                          )}
                          style={selected ? { background: dim.accent.solid } : undefined}
                        >
                          {a.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Consultation CTA — only once the dimension is complete: the free
          consultation is a reward for finishing, not an entry point before the
          person has even answered this dimension. */}
      {complete && (
        <section className="px-5 pt-6">
          <button
            onClick={() => navigate("/consultation")}
            className="group flex w-full items-center gap-3.5 rounded-xl border border-ink-100 bg-surface p-4 text-right shadow-card transition hover:-translate-y-0.5 hover:shadow-pop active:translate-y-0"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[0.85rem] bg-coral-soft text-coral-600">
              <MessageCircleHeart className="h-[1.35rem] w-[1.35rem]" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-ink-900">ناقش هذا البُعد مع خبير</p>
              <p className="text-xs font-semibold text-ink-400">استشارة مجانية لتقييم حالتك ووضع خطة</p>
            </div>
            <ChevronLeft className="h-5 w-5 shrink-0 text-ink-300 transition group-hover:-translate-x-0.5" strokeWidth={2.4} />
          </button>
        </section>
      )}

      {/* Keyed by dimension: the quiz's next-dimension hand-off navigates to the
          sibling route while the overlay stays open, so a fresh mount here drops
          the person straight into the next dimension's questions. */}
      {quizOpen && <DimensionQuiz key={id} dimId={id} onClose={() => setQuizOpen(false)} />}
    </div>
  );
}
