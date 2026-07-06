import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Lightbulb,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ExpertAvatarStack } from "../components/ExpertAvatarStack";
import { Spotlight } from "../components/Spotlight";
import { cn } from "../lib/cn";
import { useInsights } from "../assessment/useInsights";
import { tileStyle } from "../data/dimensions";
import { buildPlan, type PlanFocusItem } from "../data/planEngine";
import type { InsightSeverity } from "../data/insights";

/* Severity styling — kept in step with the report and the plan so a finding
   reads the same wherever it appears. */
const SEV: Record<Exclude<InsightSeverity, "positive">, {
  chip: string;
  label: string;
  dot: string;
  tone: string;
  icon: LucideIcon;
  /** How the employee should read this severity level. */
  desc: string;
}> = {
  critical: {
    chip: "bg-alert-soft text-alert",
    label: "يحتاج تدخّلًا",
    dot: "bg-alert",
    tone: "text-alert",
    icon: ShieldAlert,
    desc: "ملاحظات يصعب معالجتها وحدك — الأفضل أن تبدأ بها مع خبير، وقد جهّزنا لك استشارة مجانية",
  },
  warning: {
    chip: "bg-warn-soft text-warn",
    label: "يحتاج انتباهًا",
    dot: "bg-warn",
    tone: "text-warn",
    icon: TriangleAlert,
    desc: "ملاحظات مهمة تعالجها بخطوات صغيرة الآن — قبل أن تتحوّل إلى ما يحتاج تدخّلًا",
  },
  info: {
    chip: "bg-brand-soft text-brand-700",
    label: "للمتابعة",
    dot: "bg-brand-500",
    tone: "text-brand-600",
    icon: Eye,
    desc: "ملاحظات خفيفة تستحق المتابعة ضمن روتينك — الوعي بها وحده يقطع نصف الطريق",
  },
};

const VALID = new Set(Object.keys(SEV));

/**
 * Findings drill-down for one severity level. The plan overview counts
 * "2 يحتاج تدخّلًا" — tapping that count lands here: every finding at that
 * level with its full story (what we noticed, what it means, the first step)
 * and the way to act on it.
 */
export function PlanFindings() {
  const { severity = "" } = useParams();
  const navigate = useNavigate();
  const insights = useInsights();

  if (!VALID.has(severity)) return <Navigate to="/plan" replace />;
  const sev = severity as Exclude<InsightSeverity, "positive">;
  const meta = SEV[sev];
  const Icon = meta.icon;

  const plan = buildPlan(insights);
  const items = plan.items.filter((i) => i.insight.severity === sev);

  // All findings at this level resolved (or none existed) — nothing to show.
  if (items.length === 0) return <Navigate to="/plan" replace />;

  return (
    <div className="animate-rise pb-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <button
          onClick={() => navigate(-1)}
          aria-label="رجوع"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-200 bg-surface text-ink-700 transition hover:border-ink-300 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-ink-400">ملاحظات من تقريرك</p>
          <h1 className="truncate text-xl font-extrabold text-ink-900">{meta.label}</h1>
        </div>
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-[0.85rem]", meta.chip)}>
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>
      </header>

      {/* ── What this level means ───────────────────────────────────────────── */}
      <section className="px-5 pt-5">
        <div className="rounded-xl border border-ink-100 bg-surface p-5 shadow-card">
          <h2 className="text-lg font-extrabold leading-snug text-ink-900">
            <span className={cn("nums", meta.tone)}>{items.length}</span>{" "}
            {items.length === 1 ? "ملاحظة" : "ملاحظات"} بهذا المستوى
          </h2>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-400">{meta.desc}</p>
        </div>
      </section>

      {/* ── The findings, each with its full detail ─────────────────────────── */}
      <section className="space-y-3 px-5 pt-4">
        {items.map((item) => (
          <FindingCard
            key={item.insight.id}
            item={item}
            chip={meta.chip}
            dot={meta.dot}
            onOpen={() => navigate(`/focus/${item.dimension.id}`)}
          />
        ))}
      </section>

      {/* ── Critical findings route to the free expert consultation ─────────── */}
      {sev === "critical" && (
        <section className="px-5 pt-5">
          <Spotlight className="p-5 text-white">
            <div className="flex items-center gap-3">
              <ExpertAvatarStack size={40} ringClassName="ring-brand-900" />
              <p className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good/80" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-good" />
                </span>
                مختصون متاحون الآن
              </p>
            </div>
            <p className="mt-3.5 text-[1.0625rem] font-bold">لا تواجه هذه الملاحظات وحدك</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-white/65">
              خبير يناقش معك هذه النتائج ويضع معك خطة آمنة للتعامل معها — استشارتك الأولى مجانية
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

/** One finding in full: the area it belongs to, the evidence, what it means,
 *  and the first concrete step — plus the door into its dimension's focus hub. */
function FindingCard({
  item,
  chip,
  dot,
  onOpen,
}: {
  item: PlanFocusItem;
  chip: string;
  dot: string;
  onOpen: () => void;
}) {
  const { insight, area, dimension } = item;
  const AreaIcon = area.icon;
  return (
    <div className="rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
      {/* Where this finding lives */}
      <div className="mb-2.5 flex items-center gap-2">
        <span
          className="grid h-7 w-7 place-items-center rounded-[0.55rem]"
          style={tileStyle(dimension.accent)}
        >
          <AreaIcon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <span className="text-[11px] font-bold text-ink-500">{area.label}</span>
        <span className={cn("ms-auto shrink-0 rounded-pill px-2 py-0.5 text-[10px] font-bold", chip)}>
          {dimension.title}
        </span>
      </div>

      {/* The finding itself */}
      <div className="flex items-start gap-2">
        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dot)} />
        <h3 className="text-[0.9375rem] font-bold leading-snug text-ink-900">{insight.title}</h3>
      </div>

      {insight.metric && (
        <div className="mt-2 inline-flex items-baseline gap-1.5 rounded-md bg-sand/70 px-2.5 py-1">
          <span className="nums text-sm font-extrabold text-ink-900">{insight.metric}</span>
          {insight.metricLabel && (
            <span className="text-[10px] font-bold text-ink-400">{insight.metricLabel}</span>
          )}
        </div>
      )}

      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-500">{insight.detail}</p>

      {/* The one concrete thing to do about it */}
      <div className="mt-2.5 flex items-start gap-2 rounded-md bg-brand-soft/60 p-2.5">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.4} />
        <div className="min-w-0">
          <p className="mb-0.5 text-[10px] font-bold text-brand-700">خطوتك الأولى</p>
          <p className="text-[0.8125rem] font-semibold leading-relaxed text-ink-700">{item.step}</p>
        </div>
      </div>

      <button
        onClick={onOpen}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-pill border border-brand-200 bg-brand-soft/40 py-2.5 text-[0.8125rem] font-bold text-brand-700 transition hover:bg-brand-soft active:scale-[0.98]"
      >
        ابدأ العمل على {dimension.title}
        <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
      </button>
    </div>
  );
}
