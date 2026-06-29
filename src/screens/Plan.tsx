import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Dumbbell,
  Flame,
  GraduationCap,
  Lightbulb,
  NotebookPen,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Video,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, Badge } from "../components/ui";
import { Spotlight } from "../components/Spotlight";
import { LockedState } from "../components/LockedState";
import { cn } from "../lib/cn";
import { useAssessment } from "../assessment/useAssessment";
import { useInsights } from "../assessment/useInsights";
import { usePlan } from "../plan/usePlan";
import { type TaskKind } from "../data/app";
import { dimensionsById, tileStyle } from "../data/dimensions";
import { buildPlan, type PlanFocusItem } from "../data/planEngine";
import { recommendPrograms, type RecommendedProgram } from "../data/programs";
import type { InsightSeverity } from "../data/insights";

const kindIcon: Record<TaskKind, LucideIcon> = {
  meditation: Wind,
  reading: BookOpen,
  exercise: Dumbbell,
  reflection: NotebookPen,
  session: BookOpen,
};

/* Severity styling, kept in step with the report's DetailedInsights so a
   finding reads the same wherever it appears. */
const SEV: Record<InsightSeverity, { chip: string; label: string; dot: string }> = {
  critical: { chip: "bg-alert-soft text-alert", label: "يحتاج تدخّلًا", dot: "bg-alert" },
  warning: { chip: "bg-warn-soft text-warn", label: "يحتاج انتباهًا", dot: "bg-warn" },
  info: { chip: "bg-brand-soft text-brand-700", label: "للمتابعة", dot: "bg-brand-500" },
  positive: { chip: "bg-good-soft text-good", label: "إيجابي", dot: "bg-good" },
};

export function Plan() {
  const navigate = useNavigate();
  const { tasks, toggle, todayDone: done, streakDays, effort } = usePlan();
  const { hasResults, started, progressPct } = useAssessment();
  const insights = useInsights();
  const plan = buildPlan(insights);
  const recommendedPrograms = recommendPrograms(insights.insights);

  const allTodayDone = tasks.length > 0 && done === tasks.length;
  const hasRecommendations = plan.actions.length > 0 || tasks.length > 0;

  if (!hasResults) {
    return (
      <div className="animate-rise">
        <header className="px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
          <h1 className="text-2xl font-extrabold text-ink-900">خطتي</h1>
        </header>
        <LockedState
          title={started ? "خطتك بانتظارك" : "لم تبدأ خطتك بعد"}
          subtitle={
            started
              ? "أكمل بقية الأبعاد لنحوّل ملاحظات تقريرك إلى خطة عملية تعالجها خطوة بخطوة."
              : "بعد إكمال التقييم سنبني لك خطة تعالج كل ملاحظة في تقريرك — من نقاط القوة إلى ما يحتاج عناية."
          }
          ctaLabel={started ? "أكمل التقييم" : "ابدأ التقييم"}
          onCta={() => navigate("/")}
          progress={started ? progressPct : undefined}
        />
      </div>
    );
  }

  return (
    <div className="animate-rise pb-4">
      <header className="px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <h1 className="text-2xl font-extrabold text-ink-900">خطتي</h1>
        <p className="text-[0.8125rem] font-semibold text-ink-400">
          خطة علاجية مبنية على نتائج تقريرك — استشارة مع خبير، برامج مختصة، وتوصيات تطبّقها يومًا بيوم
        </p>
      </header>

      {/* ── Plan overview — what it addresses, and what it's made of ───────── */}
      <section className="px-5 pt-5">
        <div className="rounded-xl border border-ink-100 bg-surface p-5 shadow-card">
          <p className="text-[0.8125rem] font-semibold text-brand-600">خطتك الشخصية</p>
          <h2 className="mt-1 text-xl font-extrabold leading-snug text-ink-900">
            {plan.flagged > 0 ? (
              <>
                تعالج <span className="nums">{plan.flagged}</span> ملاحظة من تقريرك
              </>
            ) : (
              "تحافظ على توازنك الصحي"
            )}
          </h2>
          <p className="mt-1 text-xs font-semibold text-ink-400">
            {plan.flagged > 0 ? (
              <>
                عبر <span className="nums font-bold text-ink-700">{plan.areaCount}</span> مجالات من
                رفاهيتك — مرتّبة حسب الأولوية
              </>
            ) : (
              "لا توجد ملاحظات تستدعي تدخّلًا الآن — والخطة تساعدك على الاستمرار"
            )}
          </p>

          {plan.flagged > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
              <SeverityStat count={plan.critical} label="يحتاج تدخّلًا" tone="text-alert" />
              <SeverityStat count={plan.warning} label="يحتاج انتباهًا" tone="text-warn" />
              <SeverityStat count={plan.info} label="للمتابعة" tone="text-brand-700" />
            </div>
          )}

          {/* What the plan is made of — sets up the three sections below */}
          <div className="mt-4 space-y-2.5 border-t border-ink-100 pt-4">
            <p className="text-[11px] font-bold text-ink-500">تتكوّن خطتك من ثلاث خطوات:</p>
            <PlanStep
              n={1}
              icon={Stethoscope}
              title="استشارة مجانية مع خبير"
              desc="يراجع نتائجك ويساعدك على ترتيب أولوياتك"
            />
            <PlanStep
              n={2}
              icon={GraduationCap}
              title="برامج مختصة موصى بها"
              desc="جلسات متدرّجة مع خبير لكل تحدٍّ كبير"
            />
            <PlanStep
              n={3}
              icon={ClipboardList}
              title="توصيات تطبّقها بنفسك"
              desc="خطوات عملية صغيرة لكل ملاحظة في تقريرك"
            />
          </div>
        </div>
      </section>

      {/* ── Step 1 — Free expert consultation ─────────────────────────────── */}
      <section className="px-5 pt-7">
        <StepHeader
          n={1}
          title="ابدأ باستشارتك المجانية"
          subtitle={
            plan.priority.length > 0
              ? "ملاحظات يصعب معالجتها وحدك — ابدأ بها مع خبير قبل بقية الخطة"
              : "خبير يراجع معك نتائجك ويساعدك على ترتيب أولويات خطتك"
          }
          icon={plan.priority.length > 0 ? ShieldAlert : Stethoscope}
          tone={plan.priority.length > 0 ? "text-alert" : "text-brand-600"}
        />

        {plan.priority.length > 0 && (
          <div className="mb-3 space-y-2.5">
            {plan.priority.map((item) => (
              <PriorityCard key={item.insight.id} item={item} />
            ))}
          </div>
        )}

        <Spotlight className="p-5 text-white">
          {plan.priority.length === 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-3 py-1 text-[11px] font-bold text-brand-100 ring-1 ring-inset ring-white/10">
              الخطوة الأولى في خطتك
            </span>
          )}
          <div className={cn("flex items-center gap-3.5", plan.priority.length === 0 && "mt-3.5")}>
            <Avatar name="ليان القحطاني" size={48} className="ring-white/15" />
            <div className="min-w-0 flex-1">
              <p className="text-[1.0625rem] font-bold">استشارتك الأولى مجانية</p>
              <p className="text-[0.8125rem] leading-relaxed text-white/65">
                {plan.priority.length > 0
                  ? "خبير يناقش معك هذه الملاحظات ويضع معك خطة آمنة للتعامل معها"
                  : "يراجع معك نتائجك، ويساعدك على ترتيب أولويات خطتك"}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/consultation")}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-pill bg-white py-3 text-[15px] font-bold text-brand-900 transition hover:bg-brand-50 active:scale-[0.98]"
          >
            احجز استشارتك المجانية
            <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </Spotlight>
      </section>

      {/* ── Step 2 — Recommended specialist programs ──────────────────────── */}
      {recommendedPrograms.length > 0 && (
        <section className="px-5 pt-7">
          <StepHeader
            n={2}
            title="برامج موصى بها لك"
            subtitle="برامج علاجية من ٥ جلسات مع خبير مختص — مختارة حسب ما أظهره تقريرك"
            icon={GraduationCap}
            tone="text-brand-600"
          />
          <div className="space-y-2.5">
            {recommendedPrograms.map((rec) => (
              <ProgramCard
                key={rec.program.id}
                rec={rec}
                onOpen={() => navigate(`/program/${rec.program.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Step 3 — Self-applied recommendations & daily habits ───────────── */}
      {hasRecommendations && (
        <section className="px-5 pt-7">
          <StepHeader
            n={3}
            title="توصياتك وإرشاداتك"
            subtitle="خطوات تطبّقها بنفسك — ابدأ بمهام اليوم، ثم توصية واضحة لكل ملاحظة"
            icon={ClipboardList}
            tone="text-brand-600"
          />

          {/* Today's habits — the checkable daily layer */}
          {tasks.length > 0 && (
            <div className="mb-6">
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink-700">مهام اليوم</h3>
                <div className="flex items-center gap-2">
                  {streakDays > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-pill bg-warn-soft px-2 py-0.5 text-[11px] font-bold text-warn">
                      <Flame className="h-3.5 w-3.5" strokeWidth={2.4} />
                      <span className="nums">{streakDays}</span> أيام
                    </span>
                  )}
                  <span dir="ltr" className="nums text-[0.8125rem] font-bold text-ink-500">
                    {done}/{tasks.length}
                  </span>
                </div>
              </div>

              {allTodayDone && (
                <div className="mb-3 flex items-center gap-3.5 rounded-card border border-good/25 bg-good-soft/50 p-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-good text-white shadow-soft">
                    <Sparkles className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink-900">أنجزت كل مهام اليوم</p>
                    <p className="text-[11px] font-semibold text-ink-500">عُد غدًا لمواصلة سلسلتك</p>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                {tasks.map((task) => {
                  const dim = dimensionsById[task.dimension];
                  const Icon = kindIcon[task.kind];
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggle(task.id)}
                      className={cn(
                        "flex w-full items-center gap-3.5 rounded-card border bg-surface p-3.5 text-right shadow-soft transition duration-200 active:scale-[0.99]",
                        task.done
                          ? "border-good/25 bg-good-soft/40"
                          : "border-ink-100 hover:border-ink-200",
                      )}
                    >
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-[0.85rem]"
                        style={{ color: dim.accent.fg, background: dim.accent.soft }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-[0.8125rem] font-semibold",
                            task.done ? "text-ink-400 line-through" : "text-ink-900",
                          )}
                        >
                          {task.title}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold text-ink-400">
                          {dim.title} · <span className="nums">{task.durationMin}</span> دقائق
                        </p>
                      </div>
                      <span
                        className={cn(
                          "grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition",
                          task.done ? "border-good bg-good text-white" : "border-ink-200",
                        )}
                      >
                        {task.done && <Check className="h-4 w-4" strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Per-finding recommendations — each report finding paired with a step */}
          {plan.actions.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-bold text-ink-700">توصية لكل ملاحظة في تقريرك</h3>
              <div className="space-y-5">
                {plan.actionGroups.map((group) => {
                  const Icon = group.area.icon;
                  const e = effort[group.dimension.id];
                  return (
                    <div key={group.category}>
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className="grid h-7 w-7 place-items-center rounded-[0.55rem]"
                          style={tileStyle(group.dimension.accent)}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2.2} />
                        </span>
                        <h4 className="text-sm font-bold text-ink-700">{group.area.label}</h4>
                        <span className="nums text-[11px] font-bold text-ink-300">
                          {group.items.length}
                        </span>
                        {e && e.done > 0 && (
                          <span className="ms-auto inline-flex items-center gap-1 rounded-pill bg-good-soft px-2 py-0.5 text-[10px] font-bold text-good">
                            <CheckCircle2 className="h-3 w-3" strokeWidth={2.6} />
                            جهدك يظهر
                          </span>
                        )}
                      </div>
                      <div className="space-y-2.5">
                        {group.items.map((item) => (
                          <ActionCard
                            key={item.insight.id}
                            item={item}
                            onOpen={() => navigate(`/dimension/${item.dimension.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Wins to keep — positive findings worth protecting ────────────── */}
      {plan.wins.length > 0 && (
        <section className="px-5 pt-7">
          <h2 className="mb-1 flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
            <Sparkles className="h-[1.15rem] w-[1.15rem] text-good" strokeWidth={2.4} />
            مكاسب حافظ عليها
          </h2>
          <p className="mb-3.5 text-xs font-semibold text-ink-400">
            نقاط مضيئة في تقريرك — الاستمرارية وحدها كفيلة بحمايتها
          </p>
          <div className="space-y-2.5">
            {plan.wins.map((win) => (
              <div
                key={win.id}
                className="flex items-start gap-3 rounded-card border border-good/20 bg-good-soft/40 p-3.5"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-good text-white">
                  <Check className="h-4 w-4" strokeWidth={2.8} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-ink-900">{win.title}</h3>
                  <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-600">{win.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Small building blocks ──────────────────────────────────────────────── */

/** A numbered eyebrow + title + subtitle, used to head each of the three steps. */
function StepHeader({
  n,
  title,
  subtitle,
  icon: Icon,
  tone,
}: {
  n: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: string;
}) {
  return (
    <div className="mb-3.5">
      <span className="mb-1.5 inline-flex items-center gap-1 rounded-pill bg-brand-soft px-2.5 py-0.5 text-[10px] font-bold text-brand-700">
        الخطوة <span className="nums">{n}</span>
      </span>
      <h2 className="flex items-center gap-2 text-[1.0625rem] font-bold text-ink-900">
        <Icon className={cn("h-[1.15rem] w-[1.15rem]", tone)} strokeWidth={2.3} />
        {title}
      </h2>
      <p className="mt-1 text-xs font-semibold text-ink-400">{subtitle}</p>
    </div>
  );
}

/** A single line in the overview's "what your plan is made of" list. */
function PlanStep({
  n,
  icon: Icon,
  title,
  desc,
}: {
  n: number;
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-[0.7rem] bg-brand-soft text-brand-600">
        <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={2.1} />
        <span className="nums absolute -end-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-brand-600 text-[9px] font-extrabold text-white">
          {n}
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.8125rem] font-bold text-ink-900">{title}</p>
        <p className="text-[11px] font-semibold leading-snug text-ink-400">{desc}</p>
      </div>
    </div>
  );
}

function SeverityStat({ count, label, tone }: { count: number; label: string; tone: string }) {
  return (
    <div className="rounded-card bg-sand/70 py-2.5">
      <p className={cn("nums text-xl font-extrabold", count > 0 ? tone : "text-ink-300")}>{count}</p>
      <p className="mt-0.5 text-[10px] font-bold text-ink-500">{label}</p>
    </div>
  );
}

function PriorityCard({ item }: { item: PlanFocusItem }) {
  const Icon = item.area.icon;
  return (
    <div className="rounded-card border border-alert/25 bg-alert-soft/40 p-3.5 shadow-soft">
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.7rem]"
          style={tileStyle(item.dimension.accent)}
        >
          <Icon className="h-5 w-5" strokeWidth={2.1} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold leading-snug text-ink-900">{item.insight.title}</h3>
          <p className="mt-0.5 text-[11px] font-semibold text-ink-400">{item.area.label}</p>
        </div>
      </div>
      <p className="mt-2.5 text-[0.8125rem] font-semibold leading-relaxed text-ink-700">{item.step}</p>
    </div>
  );
}

function ProgramCard({ rec, onOpen }: { rec: RecommendedProgram; onOpen: () => void }) {
  const { program, matches } = rec;
  const dim = dimensionsById[program.dimension];
  const Icon = program.icon;
  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center gap-3.5 rounded-card border border-ink-100 bg-surface p-4 text-right shadow-soft transition duration-200 hover:border-ink-200 active:scale-[0.99]"
    >
      <span
        className="grid h-12 w-12 shrink-0 place-items-center rounded-[0.8rem]"
        style={tileStyle(dim.accent)}
      >
        <Icon className="h-6 w-6" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[0.9375rem] font-bold text-ink-900">{program.title}</h3>
          <Badge className="shrink-0 bg-brand-soft text-brand-700">{program.tag}</Badge>
        </div>
        <p className="mt-0.5 truncate text-[11px] font-semibold text-ink-400">
          مع {program.expert.name} · {program.expert.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Video className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.2} />
            <span className="nums">{program.sessions.length.toLocaleString("ar-EG")}</span> جلسات
          </span>
          <span className="truncate text-ink-400">
            يعالج: {matches.map((m) => m.title.replace(/\(.*?\)/g, "").trim()).join("، ")}
          </span>
        </div>
      </div>
      <ChevronLeft className="h-5 w-5 shrink-0 text-ink-300" strokeWidth={2.2} />
    </button>
  );
}

function ActionCard({ item, onOpen }: { item: PlanFocusItem; onOpen: () => void }) {
  const sev = SEV[item.insight.severity];
  return (
    <div className="rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", sev.dot)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-[0.9375rem] font-bold leading-snug text-ink-900">
              {item.insight.title}
            </h4>
            <span
              className={cn("shrink-0 rounded-pill px-2 py-0.5 text-[10px] font-bold", sev.chip)}
            >
              {sev.label}
            </span>
          </div>
          <div className="mt-2.5 flex items-start gap-2 rounded-md bg-sand/70 p-2.5">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" strokeWidth={2.4} />
            <p className="text-[0.8125rem] font-semibold leading-relaxed text-ink-700">{item.step}</p>
          </div>
          <button
            onClick={onOpen}
            className="mt-2.5 flex items-center gap-1 text-[0.8125rem] font-bold text-brand-600 transition hover:text-brand-700"
          >
            افتح بُعد {item.dimension.title}
            <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
