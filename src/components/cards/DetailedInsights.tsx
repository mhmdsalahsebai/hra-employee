import { Lightbulb } from "lucide-react";
import { cn } from "../../lib/cn";
import {
  CATEGORY_META,
  type Insight,
  type InsightCategory,
  type InsightSeverity,
  type InsightSummary,
} from "../../data/insights";

/* The detailed-insight section of the report: every specific finding the engine
   derived from the individual answers (BMI, chronic conditions, missed
   screenings, burnout sub-scales, depression / anxiety / stress, lifestyle,
   financial and workplace flags), grouped by area and ordered by urgency. */

const SEVERITY: Record<
  InsightSeverity,
  { card: string; dot: string; chip: string; label: string; metric: string }
> = {
  critical: {
    card: "border-alert/25 bg-alert-soft/40",
    dot: "bg-alert",
    chip: "bg-alert-soft text-alert",
    label: "يحتاج تدخّلًا",
    metric: "text-alert",
  },
  warning: {
    card: "border-warn/25 bg-warn-soft/40",
    dot: "bg-warn",
    chip: "bg-warn-soft text-warn",
    label: "يحتاج انتباهًا",
    metric: "text-warn",
  },
  info: {
    card: "border-ink-100 bg-surface",
    dot: "bg-brand-500",
    chip: "bg-brand-soft text-brand-700",
    label: "للمتابعة",
    metric: "text-brand-700",
  },
  positive: {
    card: "border-good/20 bg-good-soft/40",
    dot: "bg-good",
    chip: "bg-good-soft text-good",
    label: "إيجابي",
    metric: "text-good",
  },
};

/** Clinically-urgent areas first. */
const ORDER: InsightCategory[] = [
  "body", "chronic", "screening", "mental", "burnout", "engagement", "lifestyle", "financial", "workplace",
];

function InsightCard({ insight }: { insight: Insight }) {
  const s = SEVERITY[insight.severity];
  return (
    <div className={cn("rounded-card border p-4 shadow-soft", s.card)}>
      <div className="flex items-start gap-3">
        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", s.dot)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-[0.9375rem] font-bold leading-snug text-ink-900">{insight.title}</h4>
            {insight.metric && (
              <div className="shrink-0 text-center leading-none">
                <span className={cn("nums block text-xl font-extrabold", s.metric)}>{insight.metric}</span>
                {insight.metricLabel && (
                  <span className="mt-0.5 block text-[9px] font-bold text-ink-400">{insight.metricLabel}</span>
                )}
              </div>
            )}
          </div>
          <span className={cn("mt-1.5 inline-block rounded-pill px-2 py-0.5 text-[10px] font-bold", s.chip)}>
            {s.label}
          </span>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-600">{insight.detail}</p>
          {insight.recommendation && (
            <div className="mt-2.5 flex items-start gap-2 rounded-md bg-sand/70 p-2.5">
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" strokeWidth={2.4} />
              <p className="text-[0.8125rem] font-semibold leading-relaxed text-ink-700">
                {insight.recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DetailedInsights({ summary }: { summary: InsightSummary }) {
  const { insights, critical, warning, flagged } = summary;
  if (!insights.length) return null;

  const groups = ORDER.map((cat) => ({
    cat,
    meta: CATEGORY_META[cat],
    items: insights.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="px-5 pt-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-[1.0625rem] font-bold text-ink-900">ملاحظات صحية تفصيلية</h2>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          {critical > 0 && (
            <span className="flex items-center gap-1 text-alert">
              <span className="h-2 w-2 rounded-full bg-alert" />
              <span className="nums">{critical}</span>
            </span>
          )}
          {warning > 0 && (
            <span className="flex items-center gap-1 text-warn">
              <span className="h-2 w-2 rounded-full bg-warn" />
              <span className="nums">{warning}</span>
            </span>
          )}
        </div>
      </div>
      <p className="mb-3.5 text-xs font-semibold text-ink-400">
        {flagged > 0 ? (
          <>
            استخلصنا <span className="nums font-bold text-ink-600">{flagged}</span> ملاحظة من إجاباتك التفصيلية —
            مرتّبة حسب الأولوية
          </>
        ) : (
          "تحليل دقيق لإجاباتك عبر كل المؤشرات الصحية"
        )}
      </p>

      <div className="space-y-5">
        {groups.map((g) => {
          const Icon = g.meta.icon;
          return (
            <div key={g.cat}>
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-[0.55rem] bg-ink-50 text-ink-500">
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <h3 className="text-sm font-bold text-ink-700">{g.meta.label}</h3>
                <span className="nums text-[11px] font-bold text-ink-300">{g.items.length}</span>
              </div>
              <div className="space-y-2.5">
                {g.items.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
