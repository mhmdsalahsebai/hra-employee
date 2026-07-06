import {
  ArrowDownWideNarrow,
  BadgeCheck,
  BookOpenCheck,
  Fingerprint,
  FlaskConical,
  Microscope,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { LEVEL_CLASS, LEVEL_HEX, scoreMeta } from "../../lib/score";
import { dimensionsById, type DimensionId } from "../../data/dimensions";
import type {
  CompositeIndex,
  DeepAnalysisResult,
  MetricExtreme,
  TraitScore,
} from "../../data/analysis";
import { ProgressBar, ScoreRing } from "../ui";

/* The deep-analysis view: the composite indices computed *across* dimensions
   (burnout profile, JD-R balance, retention, resilience, WHO activity target,
   cardiometabolic flags) and the Big-Five work-style profile — each card
   showing the concrete numbers it was derived from and the named instrument
   behind it. The cross-answer discoveries live in Findings.tsx. */

function DimChips({ dims }: { dims: DimensionId[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {dims.map((id) => {
        const d = dimensionsById[id];
        return (
          <span
            key={id}
            className="rounded-pill px-2 py-0.5 text-[10px] font-bold"
            style={{ color: d.accent.fg, background: d.accent.soft }}
          >
            {d.title}
          </span>
        );
      })}
    </div>
  );
}

function CompositeCard({ index }: { index: CompositeIndex }) {
  const m = LEVEL_CLASS[index.level];
  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-surface shadow-card">
      <div className="flex items-center gap-4 border-b border-ink-100 p-4">
        <ScoreRing
          value={index.score}
          size={64}
          stroke={6}
          className={m.text}
          trackClassName="text-ink-100"
        >
          <span className="nums text-lg font-extrabold text-ink-900">{index.score}</span>
        </ScoreRing>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[0.9375rem] font-extrabold text-ink-900">{index.label}</h3>
            <span className={cn("rounded-pill px-2 py-0.5 text-[10px] font-bold", m.soft)}>
              {m.label}
            </span>
          </div>
          <p className="mt-1 text-[0.8125rem] font-bold" style={{ color: LEVEL_HEX[index.level] }}>
            {index.headline}
          </p>
          <div className="mt-1.5">
            <DimChips dims={index.dims} />
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[0.8125rem] leading-[1.85] text-ink-700">{index.detail}</p>

        <div className="mt-3 space-y-1.5 rounded-md bg-sand/60 p-3">
          {index.evidence.map((e, i) => (
            <div key={i} className="flex items-baseline justify-between gap-3 text-[0.8125rem]">
              <span className="font-semibold text-ink-500">{e.label}</span>
              <span
                dir="ltr"
                className={cn("nums shrink-0 text-left font-bold", !e.level && "text-ink-800")}
                style={e.level ? { color: LEVEL_HEX[e.level] } : undefined}
              >
                {e.value}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-[11px] font-semibold leading-relaxed text-ink-400">
          <BookOpenCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
          المرجع: {index.basis}
        </p>
      </div>
    </div>
  );
}

/* ── Big-Five trait bars — descriptive positions, deliberately not good/bad ── */

function TraitRow({ trait }: { trait: TraitScore }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h4 className="text-[0.875rem] font-bold text-ink-900">{trait.label}</h4>
        <span className="nums text-[0.9375rem] font-extrabold text-brand-700">{trait.score}</span>
      </div>
      <ProgressBar value={trait.score} barClassName="bg-brand-500" />
      <div className="mt-1 flex justify-between text-[10px] font-bold text-ink-400">
        <span>{trait.highPole}</span>
        <span>{trait.lowPole}</span>
      </div>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-600">{trait.reading}</p>
    </div>
  );
}

function PersonaCard({ analysis }: { analysis: DeepAnalysisResult }) {
  if (!analysis.traits.length) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-surface shadow-card">
      <div className="border-b border-ink-100 bg-gradient-to-br from-brand-soft to-surface p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-bold text-brand-600">
          <Fingerprint className="h-3.5 w-3.5" strokeWidth={2.4} />
          ملف أسلوبك — العوامل الخمسة الكبرى
        </p>
        {analysis.persona && (
          <>
            <h3 className="mt-1 text-xl font-extrabold text-ink-900">{analysis.persona.name}</h3>
            <p className="mt-1.5 text-[0.8125rem] leading-[1.85] text-ink-600">
              {analysis.persona.blurb}
            </p>
          </>
        )}
      </div>
      <div className="divide-y divide-ink-100 px-4 py-3">
        {analysis.traits.map((t) => (
          <TraitRow key={t.id} trait={t} />
        ))}
      </div>
      <p className="flex items-start gap-1.5 border-t border-ink-100 px-4 py-3 text-[11px] font-semibold leading-relaxed text-ink-400">
        <BookOpenCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
        المرجع: نموذج العوامل الخمسة الكبرى للشخصية (NEO — Costa & McCrae)، محسوب من إجاباتك في
        الأبعاد الفكري والمجتمعي والاجتماعي والشمولي والنفسي
      </p>
    </div>
  );
}

/* ── Peaks & troughs — the 5 strongest / 5 weakest of all sub-scale metrics ── */

function ExtremeRow({ m }: { m: MetricExtreme }) {
  const d = dimensionsById[m.dimension];
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="shrink-0 rounded-pill px-1.5 py-0.5 text-[9px] font-bold"
          style={{ color: d.accent.fg, background: d.accent.soft }}
        >
          {d.title}
        </span>
        <span className="truncate text-[0.8125rem] font-semibold text-ink-800">{m.label}</span>
      </div>
      <span
        className="nums shrink-0 text-[0.875rem] font-extrabold"
        style={{ color: LEVEL_HEX[scoreMeta(m.score).level] }}
      >
        {m.score}
      </span>
    </div>
  );
}

function ExtremesCard({ extremes }: { extremes: NonNullable<DeepAnalysisResult["extremes"]> }) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-surface shadow-card">
      <div className="border-b border-ink-100 p-4 pb-3">
        <p className="flex items-center gap-1.5 text-[11px] font-bold text-brand-600">
          <ArrowDownWideNarrow className="h-4 w-4" strokeWidth={2.4} />
          قمم وقيعان مؤشراتك
        </p>
        <p className="mt-0.5 text-[0.8125rem] font-semibold text-ink-500">
          ترتيب <span className="nums font-bold text-ink-700">{extremes.total}</span> مؤشرًا محسوبًا
          من إجاباتك — هذه أطرافه
        </p>
      </div>
      <div className="grid grid-cols-1 divide-y divide-ink-100 sm:grid-cols-2 sm:divide-x sm:divide-x-reverse sm:divide-y-0">
        <div className="p-4 pt-3">
          <p className="mb-1 text-[11px] font-bold text-good">أقوى 5</p>
          {extremes.top.map((m) => (
            <ExtremeRow key={m.id} m={m} />
          ))}
        </div>
        <div className="p-4 pt-3">
          <p className="mb-1 text-[11px] font-bold text-alert">أضعف 5</p>
          {extremes.bottom.map((m) => (
            <ExtremeRow key={m.id} m={m} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Public sections ───────────────────────────────────────────────────────── */

export function DeepAnalysis({
  analysis,
  dimension,
}: {
  analysis: DeepAnalysisResult;
  /** When set, scope to composites/signals touching this dimension only. */
  dimension?: DimensionId;
}) {
  const composites = dimension
    ? analysis.composites.filter((c) => c.dims.includes(dimension))
    : analysis.composites;
  const showTraits = !dimension && analysis.traits.length > 0;

  if (!composites.length && !showTraits) return null;

  return (
    <>
      {composites.length > 0 && (
        <section className="px-5 pt-6">
          <h2 className="mb-1 flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
            <Microscope className="h-[1.15rem] w-[1.15rem] text-brand-600" strokeWidth={2.4} />
            التحليل المعمّق
          </h2>
          <p className="mb-3.5 text-xs font-semibold text-ink-400">
            <span className="nums font-bold text-ink-600">{composites.length}</span> مؤشرات مركّبة
            تقرأ إجاباتك عبر الأبعاد معًا — كلٌّ منها وفق مقياس علمي منشور، مع الأرقام التي بُني عليها
          </p>

          {/* Measurement quality: coverage + response consistency — the meta
              that says how much the readings below can be trusted. */}
          {!dimension && analysis.quality && (
            <div className="mb-3 flex items-start gap-3 rounded-xl border border-ink-100 bg-surface p-4 shadow-soft">
              <span
                className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full"
                style={{
                  color: LEVEL_HEX[analysis.quality.level],
                  background: `color-mix(in srgb, ${LEVEL_HEX[analysis.quality.level]} 12%, transparent)`,
                }}
              >
                <BadgeCheck className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-[0.875rem] font-bold text-ink-900">جودة القياس</p>
                  <span className="nums text-[11px] font-bold text-ink-500">
                    {analysis.answeredCount} إجابة · تغطية {analysis.quality.coverage}%
                  </span>
                  <span
                    className="nums rounded-pill px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: LEVEL_HEX[analysis.quality.level] }}
                  >
                    اتساق {analysis.quality.consistency}/100
                  </span>
                </div>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-600">
                  {analysis.quality.reading}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {!dimension && analysis.extremes && <ExtremesCard extremes={analysis.extremes} />}
            {composites.map((c) => (
              <CompositeCard key={c.id} index={c} />
            ))}
          </div>
        </section>
      )}

      {showTraits && (
        <section className="px-5 pt-6">
          <h2 className="mb-1 flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
            <FlaskConical className="h-[1.15rem] w-[1.15rem] text-brand-600" strokeWidth={2.4} />
            شخصيتك في العمل
          </h2>
          <p className="mb-3.5 text-xs font-semibold text-ink-400">
            مواضعك على السمات الخمس الكبرى — وصفٌ لأسلوبك، لا درجات نجاح ورسوب
          </p>
          <PersonaCard analysis={analysis} />
        </section>
      )}

    </>
  );
}
