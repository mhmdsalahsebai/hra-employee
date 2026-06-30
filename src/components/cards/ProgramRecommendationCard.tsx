import { ChevronLeft, Video } from "lucide-react";
import { Badge } from "../ui";
import { dimensionsById, tileStyle } from "../../data/dimensions";
import type { RecommendedProgram } from "../../data/programs";

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

  return (
    <button
      onClick={onOpen}
      aria-label={`افتح برنامج ${program.title}`}
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
            يعالج: {matches.map((match) => match.title.replace(/\(.*?\)/g, "").trim()).join("، ")}
          </span>
        </div>
      </div>
      <ChevronLeft className="h-5 w-5 shrink-0 text-ink-300" strokeWidth={2.2} />
    </button>
  );
}
