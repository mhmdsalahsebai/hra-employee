import { Check, Headphones, type LucideIcon, Play, Text } from "lucide-react";
import { cn } from "../../lib/cn";
import { type ContentItem, contentTypeLabels } from "../../data/content";
import { dimensionsById } from "../../data/dimensions";

const typeIcon: Record<ContentItem["type"], LucideIcon> = {
  video: Play,
  audio: Headphones,
  article: Text,
};

/** Compact content tile for horizontal "recommended" shelves. */
export function ContentCard({
  item,
  className,
  opened = false,
  onClick,
}: {
  item: ContentItem;
  className?: string;
  opened?: boolean;
  onClick?: () => void;
}) {
  const Icon = typeIcon[item.type];
  const dim = dimensionsById[item.dimension];

  return (
    <button
      onClick={onClick}
      aria-label={`${opened ? "شاهدته سابقًا: " : "افتح: "}${item.title}`}
      className={cn(
        "group flex w-[10.5rem] shrink-0 flex-col overflow-hidden rounded-card border bg-surface text-right shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:scale-[0.98]",
        opened ? "border-ink-200" : "border-ink-100",
        className,
      )}
    >
      <div className="relative h-24 overflow-hidden" style={{ background: dim.accent.soft }}>
        {/* faint dimension watermark */}
        <dim.icon
          className="absolute -left-3 -top-3 h-20 w-20 opacity-[0.13]"
          style={{ color: dim.accent.fg }}
          strokeWidth={1.5}
        />
        <span
          className="absolute right-3 top-3 rounded-pill bg-surface/80 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm"
          style={{ color: dim.accent.fg }}
        >
          {contentTypeLabels[item.type]}
        </span>
        <span
          className={cn(
            "absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full shadow-soft transition group-hover:scale-105",
            opened ? "bg-good text-white" : "bg-surface text-ink-900",
          )}
        >
          {opened ? (
            <Check className="h-[1.05rem] w-[1.05rem]" strokeWidth={2.8} />
          ) : (
            <Icon className="h-[1.05rem] w-[1.05rem] translate-x-px" strokeWidth={2.2} />
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 text-[0.8125rem] font-bold leading-snug text-ink-900">
          {item.title}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3 text-[11px] font-bold">
          <span style={{ color: dim.accent.fg }}>{dim.title}</span>
          <span className={cn("nums", opened ? "text-good" : "text-ink-400")}>
            {opened ? "شوهد" : item.duration}
          </span>
        </div>
      </div>
    </button>
  );
}

/** Wide content row for the library list. */
export function ContentRow({ item }: { item: ContentItem }) {
  const Icon = typeIcon[item.type];
  const dim = dimensionsById[item.dimension];

  return (
    <button className="flex w-full items-center gap-3.5 rounded-card border border-ink-100 bg-surface p-3 text-right shadow-soft transition duration-200 hover:border-ink-200 active:scale-[0.99]">
      <div
        className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-md"
        style={{ background: dim.accent.soft }}
      >
        <dim.icon
          className="absolute -bottom-2 -left-2 h-12 w-12 opacity-[0.14]"
          style={{ color: dim.accent.fg }}
          strokeWidth={1.5}
        />
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-surface text-ink-900 shadow-soft">
          <Icon className="h-[1.05rem] w-[1.05rem] translate-x-px" strokeWidth={2.2} />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-bold" style={{ color: dim.accent.fg }}>
          {contentTypeLabels[item.type]} · {dim.title}
        </span>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-ink-900">
          {item.title}
        </h3>
        <p className="mt-1 text-[11px] font-semibold text-ink-400">
          {item.author} · <span className="nums">{item.duration}</span>
        </p>
      </div>
    </button>
  );
}
