import { useState } from "react";
import { Play, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Chip } from "../components/ui";
import { ContentRow } from "../components/cards/ContentCard";
import { useAssessment } from "../assessment/useAssessment";
import { content, type ContentType, contentTypeLabels } from "../data/content";
import { dimensionsById } from "../data/dimensions";

type Filter = "all" | ContentType;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "video", label: "مقاطع" },
  { id: "audio", label: "بودكاست" },
  { id: "article", label: "مقالات" },
];

export function Content() {
  const { focus } = useAssessment();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const requestedItem = searchParams.get("item");
  const requestedContent = content.find((item) => item.id === requestedItem);
  const personalized = focus.length > 0;
  const dimensionRank = new Map(focus.map((result, index) => [result.slug, index]));
  const rankedContent = [...content].sort(
    (a, b) =>
      (dimensionRank.get(a.dimension) ?? Number.MAX_SAFE_INTEGER) -
      (dimensionRank.get(b.dimension) ?? Number.MAX_SAFE_INTEGER),
  );
  const featured =
    requestedContent ??
    (personalized ? rankedContent[0] : content.find((item) => item.featured)) ??
    rankedContent[0];
  const featuredDim = dimensionsById[featured.dimension];
  const list = rankedContent.filter((item) => filter === "all" || item.type === filter);

  return (
    <div className="animate-rise">
      <header className="px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <h1 className="text-2xl font-extrabold text-ink-900">المكتبة</h1>
        <p className="text-[0.8125rem] font-semibold text-ink-400">
          {personalized ? "محتوى مختار يناسب نتائج تقييمك" : "محتوى مختار لرفاهيتك"}
        </p>
      </header>

      {/* Search */}
      <div className="px-5 pt-4">
        <div className="flex items-center gap-2.5 rounded-md border border-ink-200 bg-surface px-4 py-3 transition focus-within:border-brand-400">
          <Search className="h-5 w-5 text-ink-400" strokeWidth={2} />
          <input
            placeholder="ابحث عن موضوع يهمك…"
            className="w-full bg-transparent text-sm font-semibold text-ink-800 placeholder:font-medium placeholder:text-ink-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Featured */}
      <section className="px-5 pt-5">
        <button
          className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl text-right shadow-card"
          style={{
            background: `linear-gradient(145deg, ${featuredDim.accent.fg}, ${featuredDim.accent.solid})`,
          }}
        >
          <featuredDim.icon
            className="absolute -bottom-6 -left-4 h-44 w-44 text-white/10"
            strokeWidth={1.25}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-white text-ink-900 shadow-pop">
            <Play className="h-5 w-5 translate-x-0.5 fill-current" strokeWidth={0} />
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <span className="rounded-pill bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">
              {contentTypeLabels[featured.type]} {requestedContent ? "اخترته" : "مميّز"}
            </span>
            <h2 className="mt-2.5 max-w-[85%] text-lg font-bold leading-snug">{featured.title}</h2>
            <p className="mt-1 text-xs font-semibold text-white/75">
              {featured.author} · <span className="nums">{featured.duration}</span>
            </p>
          </div>
        </button>
      </section>

      {/* Filters */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-5">
        {filters.map((f) => (
          <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </Chip>
        ))}
      </div>

      {/* List */}
      <section className="stagger space-y-2.5 px-5 pt-4">
        {list.map((item) => (
          <ContentRow key={item.id} item={item} />
        ))}
      </section>

      <p className="px-5 pt-4 text-center text-xs font-semibold text-ink-400">
        {personalized ? (
          <>
            مرتّب حسب أبعادك الأكثر حاجة:{" "}
            <span className="text-ink-600">
              {focus
                .slice(0, 2)
                .map((result) => dimensionsById[result.slug].title)
                .join("، ")}
            </span>
          </>
        ) : (
          "أكمل تقييمك ليصبح المحتوى مخصصًا لاحتياجك بدقة"
        )}
      </p>
    </div>
  );
}
