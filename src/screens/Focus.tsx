import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Lightbulb,
  ScrollText,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { ExpertAvatarStack } from "../components/ExpertAvatarStack";
import { Spotlight } from "../components/Spotlight";
import { ProgramRecommendationCard } from "../components/cards/ProgramRecommendationCard";
import { IconTile } from "../components/ui/Card";
import { cn } from "../lib/cn";
import { LEVEL_CLASS } from "../lib/score";
import { useAssessment } from "../assessment/useAssessment";
import { useInsights } from "../assessment/useInsights";
import { dimensionsById, tileStyle, type DimensionId } from "../data/dimensions";
import { buildPlan, CATEGORY_DIMENSION, type PlanFocusItem } from "../data/planEngine";
import { recommendPrograms } from "../data/programs";
import type { InsightSeverity } from "../data/insights";

/* Severity styling — kept in step with the report and the plan so a finding
   reads the same wherever it appears. */
const SEV: Record<InsightSeverity, { chip: string; label: string; dot: string }> = {
  critical: { chip: "bg-alert-soft text-alert", label: "يحتاج تدخّلًا", dot: "bg-alert" },
  warning: { chip: "bg-warn-soft text-warn", label: "يحتاج انتباهًا", dot: "bg-warn" },
  info: { chip: "bg-brand-soft text-brand-700", label: "للمتابعة", dot: "bg-brand-500" },
  positive: { chip: "bg-good-soft text-good", label: "إيجابي", dot: "bg-good" },
};

const VALID = new Set(Object.keys(dimensionsById));

/**
 * The "work on it" hub for a single wellbeing dimension. Where the dimension
 * screen reads like a report (score + verdict), this page is purely
 * action-oriented: it gathers everything that helps the employee actually fix
 * the issues the report surfaced for this area — the concrete first steps, the
 * expert-led programs, and a free consultation — in one focused place.
 */
export function Focus() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { resultBySlug } = useAssessment();
  const insights = useInsights();

  if (!VALID.has(slug)) return <Navigate to="/" replace />;
  const id = slug as DimensionId;
  const dim = dimensionsById[id];

  const plan = buildPlan(insights);
  const items = plan.items.filter((i) => i.dimension.id === id);
  const priority = items.filter((i) => i.needsExpert);
  const steps = items.filter((i) => !i.needsExpert);
  const dimPrograms = recommendPrograms(insights.insights).filter(
    (r) => r.program.dimension === id,
  );
  const wins = plan.wins.filter((w) => CATEGORY_DIMENSION[w.category] === id);

  const r = resultBySlug[id];
  const meta = r?.complete ? LEVEL_CLASS[r.level] : null;

  return (
    <div className="animate-rise pb-6">
      {/* ── Header — identity of the area we're working on ─────────────────── */}
      <header className="flex items-center gap-3 px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <button
          onClick={() => navigate(-1)}
          aria-label="رجوع"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-200 bg-surface text-ink-700 transition hover:border-ink-300 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-ink-400">لنعمل على تحسينه</p>
          <h1 className="truncate text-xl font-extrabold text-ink-900">{dim.title}</h1>
        </div>
        <IconTile icon={dim.icon} size="lg" style={tileStyle(dim.accent)} />
      </header>

      {/* ── What we'll work on — a warm framing of this focus session ──────── */}
      <section className="px-5 pt-5">
        <div className="rounded-xl border border-ink-100 bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2">
            <p className="text-[0.8125rem] font-semibold text-brand-600">خطة العمل على هذا البُعد</p>
            {meta && (
              <span className={cn("rounded-pill px-2 py-0.5 text-[11px] font-bold", meta.soft)}>
                {r.band.title}
              </span>
            )}
          </div>
          <h2 className="mt-1 text-xl font-extrabold leading-snug text-ink-900">
            {items.length > 0 ? (
              <>
                لديك <span className="nums">{items.length}</span>{" "}
                {items.length === 1 ? "ملاحظة" : "ملاحظات"} لنعمل عليها معًا
              </>
            ) : (
              "لنحافظ على توازنك في هذا البُعد"
            )}
          </h2>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-400">
            جمعنا هنا كل ما يساعدك على تحسين هذا الجانب — خطوات تبدأ بها اليوم، برامج مختصة، واستشارة
            مع خبير.
          </p>

          {/* Mini contents preview */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
            {steps.length > 0 && <ContentChip icon={ClipboardList} label="توصيات عملية" />}
            {dimPrograms.length > 0 && <ContentChip icon={GraduationCap} label="برامج مختصة" />}
            <ContentChip icon={Stethoscope} label="استشارة مجانية" />
          </div>
        </div>
      </section>

      {/* ── Priority — critical findings routed to expert support first ─────── */}
      {priority.length > 0 && (
        <section className="px-5 pt-6">
          <SectionTitle
            icon={ShieldAlert}
            tone="text-alert"
            title="ابدأ بهذه مع خبير"
            subtitle="ملاحظات يصعب معالجتها وحدك — الأفضل مناقشتها مع مختص أولًا"
          />
          <div className="space-y-2.5">
            {priority.map((item) => (
              <FindingCard key={item.insight.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* ── Self-driven first steps ─────────────────────────────────────────── */}
      {steps.length > 0 && (
        <section className="px-5 pt-6">
          <SectionTitle
            icon={ClipboardList}
            tone="text-brand-600"
            title="خطوات تبدأ بها بنفسك"
            subtitle="لكل ملاحظة: ما تعنيه، وخطوة عملية صغيرة تبدأ بها اليوم"
          />
          <div className="space-y-2.5">
            {steps.map((item) => (
              <FindingCard key={item.insight.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* ── Expert-led programs for this dimension ──────────────────────────── */}
      {dimPrograms.length > 0 && (
        <section className="px-5 pt-6">
          <SectionTitle
            icon={GraduationCap}
            tone="text-brand-600"
            title="برامج مختصة تعالج جذر المشكلة"
            subtitle="برامج من 5 جلسات مع خبير مختص — مختارة لما أظهره تقريرك في هذا البُعد"
          />
          <div className="space-y-3">
            {dimPrograms.map((rec) => (
              <ProgramRecommendationCard
                key={rec.program.id}
                recommendation={rec}
                onOpen={() => navigate(`/program/${rec.program.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Free consultation — always available ────────────────────────────── */}
      <section className="px-5 pt-6">
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
          <p className="mt-3.5 text-[1.0625rem] font-bold">ناقش {dim.title} مع خبير</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-white/65">
            استشارتك الأولى مجانية — يراجع معك نتائجك في هذا البُعد ويضع معك خطة عملية آمنة.
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

      {/* ── Wins to protect — positive findings in this area ────────────────── */}
      {wins.length > 0 && (
        <section className="px-5 pt-6">
          <SectionTitle
            icon={Sparkles}
            tone="text-good"
            title="مكاسب حافظ عليها"
            subtitle="نقاط مضيئة في هذا البُعد — الاستمرارية وحدها كفيلة بحمايتها"
          />
          <div className="space-y-2.5">
            {wins.map((win) => (
              <div
                key={win.id}
                className="rounded-card border border-good/20 bg-good-soft/40 p-3.5"
              >
                <h3 className="text-sm font-bold text-ink-900">{win.title}</h3>
                <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-600">{win.detail}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Deep-dive — the full dimension report ───────────────────────────── */}
      <section className="px-5 pt-6">
        <button
          onClick={() => navigate(`/dimension/${id}`)}
          className="group flex w-full items-center gap-3.5 rounded-xl border border-ink-100 bg-surface p-4 text-right shadow-soft transition hover:border-ink-300 active:scale-[0.99]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[0.85rem] bg-brand-soft text-brand-600">
            <ScrollText className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink-900">اعرض تقرير هذا البُعد كاملًا</p>
            <p className="text-xs font-semibold text-ink-400">الدرجة، التحليل، وكل إجاباتك</p>
          </div>
          <ChevronLeft
            className="h-5 w-5 shrink-0 text-ink-300 transition group-hover:-translate-x-0.5"
            strokeWidth={2.4}
          />
        </button>
      </section>
    </div>
  );
}

/* ── Small building blocks ──────────────────────────────────────────────── */

function ContentChip({ icon: Icon, label }: { icon: typeof Stethoscope; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-sand/70 px-2.5 py-1 text-[11px] font-bold text-ink-600">
      <Icon className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.2} />
      {label}
    </span>
  );
}

function SectionTitle({
  icon: Icon,
  tone,
  title,
  subtitle,
}: {
  icon: typeof Stethoscope;
  tone: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-3.5">
      <h2 className="flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
        <Icon className={cn("h-[1.15rem] w-[1.15rem]", tone)} strokeWidth={2.4} />
        {title}
      </h2>
      <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-400">{subtitle}</p>
    </div>
  );
}

/** A single finding paired with its one concrete first step. */
function FindingCard({ item }: { item: PlanFocusItem }) {
  const sev = SEV[item.insight.severity];
  const { insight } = item;
  return (
    <div className="rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", sev.dot)} />
          <h4 className="text-[0.9375rem] font-bold leading-snug text-ink-900">{insight.title}</h4>
        </div>
        <span className={cn("shrink-0 rounded-pill px-2 py-0.5 text-[10px] font-bold", sev.chip)}>
          {sev.label}
        </span>
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

      <div className="mt-2.5 flex items-start gap-2 rounded-md bg-brand-soft/60 p-2.5">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.4} />
        <div className="min-w-0">
          <p className="mb-0.5 text-[10px] font-bold text-brand-700">خطوتك الأولى</p>
          <p className="text-[0.8125rem] font-semibold leading-relaxed text-ink-700">{item.step}</p>
        </div>
      </div>
    </div>
  );
}
