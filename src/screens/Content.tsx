import { useEffect, useState } from "react";
import { BookOpenText, Headphones, Play, Search, type LucideIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Chip } from "../components/ui";
import { ContentRow } from "../components/cards/ContentCard";
import { ContentViewer } from "../components/content/ContentViewer";
import { useAssessment } from "../assessment/useAssessment";
import { content, type ContentType, contentTypeLabels } from "../data/content";
import { dimensionsById } from "../data/dimensions";
import { recordContentOpened } from "../content/useContentRecommendations";

type Filter = "all" | ContentType;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "video", label: "مقاطع" },
  { id: "audio", label: "صوتيات" },
  { id: "article", label: "مقالات" },
];

const typeIcons: Record<ContentType, LucideIcon> = {
  video: Play,
  audio: Headphones,
  article: BookOpenText,
};

export function Content() {
  const { focus } = useAssessment();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
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
  const FeaturedIcon = typeIcons[featured.type];
  const normalizedQuery = query.trim().toLocaleLowerCase("ar");
  const list = rankedContent.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesQuery =
      !normalizedQuery ||
      [item.title, item.author, item.description, dimensionsById[item.dimension].title]
        .join(" ")
        .toLocaleLowerCase("ar")
        .includes(normalizedQuery);
    return matchesFilter && matchesQuery;
  });

  useEffect(() => {
    if (requestedContent) recordContentOpened(requestedContent.id);
  }, [requestedContent]);

  function openItem(id: string) {
    recordContentOpened(id);
    setSearchParams({ item: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeItem() {
    setSearchParams({});
  }

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
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="ابحث في مكتبة المحتوى"
            className="w-full bg-transparent text-sm font-semibold text-ink-800 placeholder:font-medium placeholder:text-ink-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Featured */}
      <section className="px-5 pt-5">
        {requestedContent ? (
          <ContentViewer key={requestedContent.id} item={requestedContent} onClose={closeItem} />
        ) : (
          <button
            onClick={() => openItem(featured.id)}
            aria-label={`افتح المحتوى المميز: ${featured.title}`}
            className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl text-right shadow-card transition active:scale-[0.99]"
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
              <FeaturedIcon
                className="h-5 w-5 translate-x-0.5"
                fill={featured.type === "video" ? "currentColor" : "none"}
                strokeWidth={featured.type === "video" ? 0 : 2.2}
              />
            </span>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="rounded-pill bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">
                {contentTypeLabels[featured.type]} مميّز
              </span>
              <h2 className="mt-2.5 max-w-[85%] text-lg font-bold leading-snug">{featured.title}</h2>
              <p className="mt-1 text-xs font-semibold text-white/75">
                {featured.author} · <span className="nums">{featured.duration}</span>
              </p>
            </div>
          </button>
        )}
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
          <ContentRow
            key={item.id}
            item={item}
            active={requestedContent?.id === item.id}
            onClick={() => openItem(item.id)}
          />
        ))}
        {list.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-200 bg-surface px-5 py-10 text-center">
            <Search className="mx-auto h-6 w-6 text-ink-300" strokeWidth={1.8} />
            <p className="mt-3 text-sm font-bold text-ink-700">لا توجد نتائج مطابقة</p>
            <button
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="mt-2 text-xs font-bold text-brand-700"
            >
              اعرض كل المحتوى
            </button>
          </div>
        ) : null}
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
