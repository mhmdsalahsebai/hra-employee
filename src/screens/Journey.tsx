import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Flag,
  Flame,
  Footprints,
  Lock,
  ScrollText,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Spotlight } from "../components/Spotlight";
import { ProgressBar } from "../components/ui";
import { TrailMap, buildJourneyStations, pastel } from "../components/TrailMap";
import { cn } from "../lib/cn";
import { computeGamification, POINTS } from "../lib/gamification";
import { useAssessment } from "../assessment/useAssessment";
import { useInsights } from "../assessment/useInsights";
import { usePlan } from "../plan/usePlan";
import { recommendPrograms } from "../data/programs";
import { MIN_DIMS_FOR_PREVIEW } from "../data/report";

/**
 * The dedicated journey page: the nine dimension stations *plus* every reward
 * along the road — the preliminary report, the full report, the free expert
 * consultation, the personal plan, the recommended wellness program, and
 * locked future stops. Each point opens its detail, and a derived points +
 * levels + badges layer turns progress into a game worth finishing.
 */
export function Journey() {
  const navigate = useNavigate();
  const {
    results,
    completedCount,
    totalDimensions,
    hasResults,
    started,
    answeredQuestions,
  } = useAssessment();
  const insights = useInsights();
  const { tasks, todayDone, streakDays } = usePlan();

  const nextIndex = results.findIndex((r) => !r.complete);
  const reportReady = completedCount >= MIN_DIMS_FOR_PREVIEW;
  const recommended = hasResults ? recommendPrograms(insights.insights) : [];
  const topProgram = recommended[0]?.program ?? null;

  const game = computeGamification({
    answeredQuestions,
    completedCount,
    hasResults,
    streakDays,
    todayDone,
  });

  /* ── Badges — every one derived from real progress, never stored ─────────── */
  const badges: BadgeDef[] = [
    {
      id: "first-step",
      icon: Footprints,
      tint: "#2563a8",
      title: "أول خطوة",
      desc: "أجب عن أول سؤال",
      earned: started,
    },
    {
      id: "preview",
      icon: ScrollText,
      tint: "#6757b8",
      title: "التقرير المبدئي",
      desc: `أكمل ${MIN_DIMS_FOR_PREVIEW} أبعاد`,
      earned: reportReady,
    },
    {
      id: "half",
      icon: Flag,
      tint: "#b85e34",
      title: "منتصف الطريق",
      desc: "أكمل 5 أبعاد",
      earned: completedCount >= 5,
    },
    {
      id: "full",
      icon: Trophy,
      tint: "#a86512",
      title: "التقييم الكامل",
      desc: "أكمل الأبعاد التسعة",
      earned: hasResults,
    },
    {
      id: "streak",
      icon: Flame,
      tint: "#b24572",
      title: "سلسلة 3 أيام",
      desc: "أنجز مهامك 3 أيام متتالية",
      earned: streakDays >= 3,
    },
    {
      id: "perfect-day",
      icon: CheckCircle2,
      tint: "#087f74",
      title: "يوم مكتمل",
      desc: "أنجز كل مهام يومك",
      earned: tasks.length > 0 && todayDone === tasks.length,
    },
  ];
  const earnedCount = badges.filter((b) => b.earned).length;

  /* ── The full road: dimensions interleaved with the rewards they unlock —
     the exact same builder Home's trail preview uses, so both stay in sync. */
  const stations = buildJourneyStations({
    results,
    nextIndex,
    reportReady,
    hasResults,
    topProgram,
    onOpenDimension: (id) => navigate(`/dimension/${id}`),
    onOpenReport: () => navigate("/report"),
    onOpenConsultation: () => navigate("/consultation"),
    onOpenPlan: () => navigate("/plan"),
    onOpenProgram: (id) => navigate(`/program/${id}`),
  });

  return (
    <div className="animate-rise pb-4">
      <PageHeader title="رحلة رفاهيتك" subtitle="خريطتك، نقاطك، ومكافآتك في مكان واحد" />

      {/* ── Points & level — the game layer, on the deep brand spotlight ────── */}
      <section className="px-5 pt-2">
        <Spotlight className="p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-brand-100">مستواك في الرحلة</p>
              <h2 className="mt-1 flex items-center gap-2 text-xl font-extrabold">
                <Sparkles className="h-5 w-5 shrink-0 text-brand-200" strokeWidth={2.2} />
                {game.level.name}
              </h2>
              {streakDays > 0 && (
                <span
                  className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ring-white/10"
                  style={{ color: "#f2b04a" }}
                >
                  <Flame className="h-3.5 w-3.5" strokeWidth={2.4} />
                  سلسلة التزام: <span className="nums">{streakDays}</span> أيام
                </span>
              )}
            </div>
            <div className="shrink-0 rounded-2xl bg-white/10 px-3.5 py-2 text-center ring-1 ring-inset ring-white/10">
              <p className="nums flex items-center justify-center gap-1 text-xl font-extrabold leading-none">
                <Star className="h-4 w-4" style={{ color: "#f2b04a", fill: "#f2b04a" }} />
                {game.points}
              </p>
              <p className="mt-1 text-[10px] font-bold text-white/60">نقطة</p>
            </div>
          </div>

          {game.nextLevel ? (
            <div className="mt-4">
              <ProgressBar
                value={game.levelPct}
                trackClassName="bg-white/15"
                barStyle={{ background: "linear-gradient(90deg, #83bbee, #c8b8ff)" }}
              />
              <p className="mt-1.5 text-[11px] font-semibold text-white/70">
                <span className="nums font-extrabold text-white">{game.nextLevel.at - game.points}</span>{" "}
                نقطة تفصلك عن مستوى «{game.nextLevel.name}»
              </p>
            </div>
          ) : (
            <p className="mt-4 text-[13px] font-bold text-brand-100">
              وصلت أعلى مستوى في الرحلة — واصل المحافظة على توازنك 🎉
            </p>
          )}

          {/* How points are earned — the whole economy in one glance. */}
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3.5 text-center">
            <EarnRule points={POINTS.question} label="لكل إجابة" />
            <EarnRule points={POINTS.dimension} label="لكل بُعد تكمله" />
            <EarnRule points={POINTS.streakDay} label="لكل يوم التزام" />
          </div>
        </Spotlight>
      </section>

      {/* ── Badges — collectible recognition along the road ─────────────────── */}
      <section className="px-5 pt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[1.05rem] font-extrabold text-ink-900">شاراتك</h2>
            <p className="mt-0.5 text-xs font-semibold text-ink-400">إنجازات تجمعها على الطريق</p>
          </div>
          <span dir="ltr" className="nums shrink-0 pb-0.5 text-[13px] font-bold text-ink-500">
            {earnedCount}/{badges.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {badges.map((badge) => (
            <BadgeTile key={badge.id} badge={badge} />
          ))}
        </div>
      </section>

      {/* ── The full road — every station and reward, all tappable ──────────── */}
      <section className="px-5 pt-7">
        <div className="mb-1 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[1.05rem] font-extrabold text-ink-900">خريطة الرحلة</h2>
            <p className="mt-0.5 text-xs font-semibold text-ink-400">
              الأبعاد تُفتح بالترتيب، والمكافآت تُفتح مع تقدّمك
            </p>
          </div>
          <span dir="ltr" className="nums shrink-0 pb-0.5 text-[13px] font-bold text-ink-500">
            {completedCount}/{totalDimensions}
          </span>
        </div>
        <TrailMap stations={stations} />
      </section>
    </div>
  );
}

/* ── Milestone stations — the rewards the road passes through ─────────────── */

/* ── Small building blocks ──────────────────────────────────────────────── */

/** One rule of the points economy — "+N" over what earns it. */
function EarnRule({ points, label }: { points: number; label: string }) {
  return (
    <div className="rounded-lg bg-white/[0.07] px-1 py-2 ring-1 ring-inset ring-white/[0.06]">
      <p className="nums text-sm font-extrabold text-white">+{points}</p>
      <p className="mt-0.5 text-[9.5px] font-bold text-white/60">{label}</p>
    </div>
  );
}

interface BadgeDef {
  id: string;
  icon: LucideIcon;
  tint: string;
  title: string;
  desc: string;
  earned: boolean;
}

function BadgeTile({ badge }: { badge: BadgeDef }) {
  const Icon = badge.icon;
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-card border p-3 text-center",
        badge.earned ? "border-ink-100 bg-surface shadow-soft" : "border-dashed border-ink-200 bg-surface/50",
      )}
    >
      <span
        className={cn(
          "grid h-11 w-11 place-items-center rounded-full",
          !badge.earned && "bg-sand text-ink-300",
        )}
        style={badge.earned ? { background: pastel(badge.tint, 14), color: badge.tint } : undefined}
      >
        {badge.earned ? (
          <Icon className="h-5 w-5" strokeWidth={2.1} />
        ) : (
          <Lock className="h-4 w-4" strokeWidth={2.2} />
        )}
      </span>
      <p
        className={cn(
          "mt-2 text-[11px] font-extrabold leading-tight",
          badge.earned ? "text-ink-900" : "text-ink-400",
        )}
      >
        {badge.title}
      </p>
      <p className="mt-0.5 text-[9.5px] font-semibold leading-snug text-ink-400">{badge.desc}</p>
    </div>
  );
}
