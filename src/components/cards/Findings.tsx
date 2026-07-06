import {
  AlertTriangle,
  ArrowLeft,
  BookOpenCheck,
  Crosshair,
  Eye,
  FlaskConical,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Waypoints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LEVEL_HEX, scoreMeta } from "../../lib/score";
import { dimensionsById, type DimensionId } from "../../data/dimensions";
import type { Finding, FindingTone, FindingsResult, Leverage } from "../../data/findings";

/* The findings view — the "so what" of the whole assessment. Each card is a
   discovery that required crossing answers from different scales: the person
   could not have written its headline themselves right after answering. The
   leverage card on top answers the one question a 150-question assessment owes
   its taker: "if I change a single thing, which one — and why that one?" */

const TONE_META: Record<FindingTone, { label: string; icon: LucideIcon; hex: string; soft: string }> = {
  risk: { label: "يستحق تدخلًا", icon: AlertTriangle, hex: LEVEL_HEX.attention, soft: "rgba(204,77,63,0.1)" },
  watch: { label: "انتبه له", icon: Eye, hex: LEVEL_HEX.moderate, soft: "rgba(183,113,24,0.1)" },
  strength: { label: "قوة مؤكدة", icon: ShieldCheck, hex: LEVEL_HEX.good, soft: "rgba(22,133,95,0.1)" },
};

function FindingCard({ finding, order }: { finding: Finding; order: number }) {
  const tone = TONE_META[finding.tone];
  const ToneIcon = tone.icon;
  return (
    <article className="overflow-hidden rounded-xl border border-ink-100 bg-surface shadow-card">
      {/* Case-note header: number, tone, and the discovery itself */}
      <div className="border-b border-ink-100 p-4" style={{ background: tone.soft }}>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="nums rounded-pill bg-surface/80 px-2.5 py-0.5 text-[10px] font-bold text-ink-500">
            الاكتشاف {order}
          </span>
          <span
            className="flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-[10px] font-bold text-white"
            style={{ background: tone.hex }}
          >
            <ToneIcon className="h-3 w-3" strokeWidth={2.6} />
            {tone.label}
          </span>
        </div>
        <h3 className="text-[1.0625rem] font-extrabold leading-snug text-ink-900">{finding.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {finding.receipts.map((r, i) => (
            <span
              key={i}
              className="rounded-pill border border-ink-100 bg-surface px-2 py-0.5 text-[10px] font-bold text-ink-600"
            >
              {r.label}: <span dir="ltr" className="nums">{r.value}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-[0.875rem] leading-[1.9] text-ink-800">{finding.story}</p>

        <div className="rounded-md bg-sand/60 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-ink-500">
            <BookOpenCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
            الآلية والدليل
          </p>
          <p className="text-[0.8125rem] leading-[1.85] text-ink-600">{finding.why}</p>
        </div>

        <div className="flex items-start gap-2.5 rounded-md border border-brand-200 bg-brand-soft/50 p-3">
          <Crosshair className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.2} />
          <div>
            <p className="text-[11px] font-bold text-brand-700">الخطوة — واحدة فقط</p>
            <p className="mt-0.5 text-[0.8125rem] font-semibold leading-relaxed text-ink-800">
              {finding.move}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {finding.dims.map((id) => {
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
      </div>
    </article>
  );
}

function LeverageCard({ leverage }: { leverage: Leverage }) {
  return (
    <article className="overflow-hidden rounded-xl border-2 border-brand-300 bg-surface shadow-card">
      <div className="bg-gradient-to-br from-brand-soft via-surface to-surface p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-600">
          <Waypoints className="h-4 w-4" strokeWidth={2.4} />
          لو غيّرت شيئًا واحدًا
        </p>
        <h3 className="mt-1 text-xl font-extrabold text-ink-900">
          ابدأ من: {leverage.source.label}
        </h3>

        {/* The cascade: source → the weak metrics it drags with it (RTL flows right→left) */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            className="nums rounded-pill px-2.5 py-1 text-[11px] font-bold text-white"
            style={{ background: LEVEL_HEX[scoreMeta(leverage.source.score).level] }}
          >
            {leverage.source.label} · {leverage.source.score}
          </span>
          {leverage.downstream.map((d) => (
            <span key={d.id} className="flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5 text-ink-300" strokeWidth={2.4} />
              <span className="nums rounded-pill border border-ink-200 bg-surface px-2.5 py-1 text-[11px] font-bold text-ink-700">
                {d.label} · {d.score}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 p-4 pt-3">
        <p className="text-[0.875rem] leading-[1.9] text-ink-800">{leverage.story}</p>

        {/* What-if: the same engines re-run with the improved answers — the
            numbers that would move on this very report, not a vague promise. */}
        {leverage.projection.length > 0 && (
          <div className="rounded-md bg-sand/60 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-ink-500">
              <FlaskConical className="h-3.5 w-3.5" strokeWidth={2.2} />
              لو تحسّنت إجاباتك هنا درجة واحدة فقط — هذا ما يتغيّر في تقريرك مباشرة
            </p>
            <div className="space-y-1.5">
              {leverage.projection.map((p) => (
                <div key={p.label} className="flex items-center justify-between gap-3 text-[0.8125rem]">
                  <span className="font-semibold text-ink-600">{p.label}</span>
                  <span className="flex shrink-0 items-center gap-1.5 font-bold">
                    <span className="nums text-ink-400">{p.from}</span>
                    <TrendingUp className="h-3.5 w-3.5 text-good" strokeWidth={2.4} />
                    <span className="nums text-good">{p.to}</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] font-semibold leading-relaxed text-ink-400">
              محاكاة فعلية بنفس معادلات التقرير — والأثر غير المباشر على بقية المؤشرات يأتي فوقها مع الوقت
            </p>
          </div>
        )}

        <div className="flex items-start gap-2.5 rounded-md border border-brand-200 bg-brand-soft/50 p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.2} />
          <div>
            <p className="text-[11px] font-bold text-brand-700">أول خطوة</p>
            <p className="mt-0.5 text-[0.8125rem] font-semibold leading-relaxed text-ink-800">
              {leverage.move}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Findings({
  result,
  dimension,
}: {
  result: FindingsResult;
  /** When set, scope to findings touching this dimension (leverage stays global). */
  dimension?: DimensionId;
}) {
  const findings = dimension
    ? result.findings.filter((f) => f.dims.includes(dimension))
    : result.findings;
  const showLeverage = !dimension && result.leverage;

  if (!findings.length && !showLeverage) return null;

  return (
    <section className="px-5 pt-6">
      <h2 className="mb-1 flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
        <Crosshair className="h-[1.15rem] w-[1.15rem] text-brand-600" strokeWidth={2.4} />
        {dimension ? "اكتشافات تمس هذا البُعد" : "ما اكتشفناه بتقاطع إجاباتك"}
      </h2>
      <p className="mb-3.5 text-xs font-semibold text-ink-400">
        {dimension
          ? "أنماط ظهرت من ربط إجاباتك هنا بإجاباتك في أبعاد أخرى"
          : "استنتاجات لا تظهر في أي درجة منفردة — كل اكتشاف مبني على ربط إجاباتك عبر المقاييس، بأرقامه ومرجعه وخطوته"}
      </p>
      <div className="space-y-3">
        {showLeverage && <LeverageCard leverage={result.leverage!} />}
        {findings.map((f, i) => (
          <FindingCard key={f.id} finding={f} order={i + 1} />
        ))}
      </div>
    </section>
  );
}
