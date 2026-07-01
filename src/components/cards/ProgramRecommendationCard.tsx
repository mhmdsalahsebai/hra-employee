import { ChevronLeft, Clock, Sparkles, Video } from "lucide-react";
import { Badge } from "../ui";
import { dimensionsById, tileStyle } from "../../data/dimensions";
import type { RecommendedProgram } from "../../data/programs";

const ar = (n: number) => n.toLocaleString("en-US");

export function ProgramRecommendationCard({
  recommendation,
  onOpen,
}: {
  recommendation: RecommendedProgram;
  onOpen: () => void;
}) {
  const { program, matches } = recommendation;
  const dim = dimensionsById[program.dimension];
  const Icon = program.icon;
  const totalMin = program.sessions.reduce((n, s) => n + s.durationMin, 0);
  const treated = matches.map((m) => m.title.replace(/\(.*?\)/g, "").trim());

  return (
    <button
      onClick={onOpen}
      aria-label={`افتح برنامج ${program.title}`}
      className="block w-full overflow-hidden rounded-card border border-ink-100 bg-surface text-right shadow-soft transition duration-200 hover:border-ink-200 active:scale-[0.99]"
    >
      {/* Header — what it is, who leads it, how long */}
      <div className="flex items-start gap-3.5 p-4">
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
              <span className="nums">{ar(program.sessions.length)}</span> جلسات
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.2} />
              <span className="nums">{ar(totalMin)}</span> دقيقة
            </span>
          </div>
        </div>
        <ChevronLeft className="mt-0.5 h-5 w-5 shrink-0 text-ink-300" strokeWidth={2.2} />
      </div>

      {/* Value — the tangible gains this program brings the employee */}
      <div className="mx-4 rounded-lg bg-good-soft/50 p-3">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-good">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
          ما ستكسبه من هذا البرنامج
        </p>
        <ul className="space-y-1.5">
          {program.outcomes.map((outcome) => (
            <li
              key={outcome}
              className="flex items-start gap-2 text-[0.8125rem] font-semibold leading-snug text-ink-700"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-good" />
              {outcome}
            </li>
          ))}
        </ul>
      </div>

      {/* Why it was recommended — the employee's own findings it treats */}
      <div className="flex items-start gap-1.5 px-4 pb-4 pt-3">
        <span className="shrink-0 text-[11px] font-bold text-ink-400">يعالج من تقريرك:</span>
        <div className="flex flex-wrap gap-1">
          {treated.map((t) => (
            <span
              key={t}
              className="rounded-pill bg-sand px-2 py-0.5 text-[10px] font-bold text-ink-600"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
