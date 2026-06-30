import { Gauge } from "lucide-react";
import { cn } from "../../lib/cn";
import { LEVEL_CLASS, LEVEL_HEX } from "../../lib/score";
import { dimensionsById, tileStyle, type DimensionId } from "../../data/dimensions";
import type { DimensionMetrics, Metric } from "../../data/metrics";
import { IconTile } from "../ui/Card";
import { ProgressBar } from "../ui";

/* The metrics breakdown: every measured sub-scale behind the nine dimensions,
   grouped by dimension and always shown (not only when a flag fires). Each row
   is a 0–100 score (higher = better), a level pill, and a one-line reading
   derived live from the employee's own answers. */

function MetricRow({ metric }: { metric: Metric }) {
  const m = LEVEL_CLASS[metric.level];
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h4 className="truncate text-[0.875rem] font-bold text-ink-900">{metric.label}</h4>
          {metric.note && (
            <span className="nums shrink-0 rounded-pill bg-ink-50 px-1.5 py-0.5 text-[10px] font-bold text-ink-500">
              {metric.note}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="nums text-[0.9375rem] font-extrabold" style={{ color: LEVEL_HEX[metric.level] }}>
            {metric.score}
          </span>
          <span className={cn("rounded-pill px-1.5 py-0.5 text-[10px] font-bold", m.soft)}>{m.label}</span>
        </div>
      </div>
      <ProgressBar value={metric.score} barStyle={{ background: LEVEL_HEX[metric.level] }} />
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-600">{metric.reading}</p>
    </div>
  );
}

function DimensionGroup({ group }: { group: DimensionMetrics }) {
  const d = dimensionsById[group.dimension as DimensionId];
  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-surface shadow-card">
      <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3">
        <IconTile icon={d.icon} style={tileStyle(d.accent)} />
        <div className="min-w-0 flex-1">
          <h3 className="text-[0.9375rem] font-bold text-ink-900">{d.title}</h3>
          <p className="text-[11px] font-semibold text-ink-400">
            <span className="nums">{group.metrics.length}</span> مؤشر
            {group.attention > 0 && (
              <>
                {" · "}
                <span className="font-bold text-alert">
                  <span className="nums">{group.attention}</span> يحتاج عناية
                </span>
              </>
            )}
          </p>
        </div>
        <div className="shrink-0 text-center leading-none">
          <span className="nums block text-lg font-extrabold" style={{ color: d.accent.fg }}>
            {group.average}
          </span>
          <span className="text-[9px] font-bold text-ink-400">المتوسط</span>
        </div>
      </div>
      <div className="divide-y divide-ink-100 px-4">
        {group.metrics.map((metric) => (
          <MetricRow key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}

export function MetricsBreakdown({ groups }: { groups: DimensionMetrics[] }) {
  if (!groups.length) return null;
  const total = groups.reduce((n, g) => n + g.metrics.length, 0);

  return (
    <section className="px-5 pt-6">
      <h2 className="mb-1 flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
        <Gauge className="h-[1.15rem] w-[1.15rem] text-brand-600" strokeWidth={2.4} />
        كل المؤشرات التفصيلية
      </h2>
      <p className="mb-3.5 text-xs font-semibold text-ink-400">
        <span className="nums font-bold text-ink-600">{total}</span> مؤشرًا فرعيًا محسوبًا من إجاباتك عبر الأبعاد التسعة — درجة كل مؤشر من ١٠٠
      </p>
      <div className="space-y-3">
        {groups.map((group) => (
          <DimensionGroup key={group.dimension} group={group} />
        ))}
      </div>
    </section>
  );
}
