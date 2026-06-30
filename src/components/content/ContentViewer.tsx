import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Headphones,
  RotateCcw,
} from "lucide-react";
import type { ContentItem } from "../../data/content";
import { contentTypeLabels } from "../../data/content";
import { dimensionsById } from "../../data/dimensions";

export function ContentViewer({
  item,
  onClose,
}: {
  item: ContentItem;
  onClose: () => void;
}) {
  const [mediaFailed, setMediaFailed] = useState(false);
  const dim = dimensionsById[item.dimension];

  return (
    <article className="animate-rise overflow-hidden rounded-xl border border-ink-100 bg-surface shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-4 py-3">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-pill px-2 py-1.5 text-xs font-bold text-ink-600 transition hover:bg-ink-50 active:scale-95"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.3} />
          المكتبة
        </button>
        <span
          className="rounded-pill px-2.5 py-1 text-[11px] font-bold"
          style={{ background: dim.accent.soft, color: dim.accent.fg }}
        >
          {contentTypeLabels[item.type]} · {dim.title}
        </span>
      </div>

      {item.type === "video" && item.media ? (
        <div className="bg-ink-900">
          {mediaFailed ? (
            <MediaFallback item={item} onRetry={() => setMediaFailed(false)} />
          ) : (
            <video
              key={item.id}
              controls
              playsInline
              preload="metadata"
              poster={item.media.poster}
              onError={() => setMediaFailed(true)}
              className="aspect-video w-full bg-ink-900 object-contain"
              aria-label={`مشغل فيديو: ${item.title}`}
            >
              <source src={item.media.url} type={item.media.mimeType} />
              متصفحك لا يدعم تشغيل الفيديو.
            </video>
          )}
        </div>
      ) : null}

      {item.type === "audio" && item.media ? (
        <div
          className="relative overflow-hidden px-5 py-7"
          style={{
            background: `linear-gradient(145deg, ${dim.accent.fg}, ${dim.accent.solid})`,
          }}
        >
          <dim.icon
            className="absolute -bottom-8 -left-5 h-40 w-40 text-white/10"
            strokeWidth={1.2}
          />
          <div className="relative flex items-center gap-3 text-white">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-inset ring-white/20">
              <Headphones className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white/65">استمع الآن</p>
              <p className="mt-0.5 truncate text-sm font-bold">{item.author}</p>
            </div>
          </div>
          {mediaFailed ? (
            <div className="relative mt-5">
              <MediaFallback item={item} onRetry={() => setMediaFailed(false)} compact />
            </div>
          ) : (
            <audio
              key={item.id}
              controls
              preload="metadata"
              onError={() => setMediaFailed(true)}
              className="relative mt-5 h-12 w-full"
              aria-label={`مشغل صوت: ${item.title}`}
            >
              <source src={item.media.url} type={item.media.mimeType} />
              متصفحك لا يدعم تشغيل الصوت.
            </audio>
          )}
        </div>
      ) : null}

      <div className="p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold text-ink-400">
          <span>{item.author}</span>
          <span aria-hidden="true">·</span>
          <span className="nums">{item.duration}</span>
          {item.source?.language ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{item.source.language}</span>
            </>
          ) : null}
        </div>
        <h2 className="mt-2 text-xl font-extrabold leading-snug text-ink-900">{item.title}</h2>
        <p className="mt-2 text-sm font-semibold leading-7 text-ink-600">{item.description}</p>

        <section className="mt-5 rounded-lg bg-ink-50 p-4">
          <h3 className="text-sm font-bold text-ink-900">خذها معك</h3>
          <ul className="mt-3 space-y-2.5">
            {item.takeaways.map((takeaway) => (
              <li key={takeaway} className="flex items-start gap-2.5 text-xs font-semibold leading-6 text-ink-600">
                <CheckCircle2
                  className="mt-1 h-4 w-4 shrink-0 text-brand-600"
                  strokeWidth={2.3}
                />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        {item.article ? (
          <div className="selectable mt-6 space-y-6">
            {item.article.map((section) => (
              <section key={section.heading}>
                <h3 className="text-base font-bold text-ink-900">{section.heading}</h3>
                <div className="mt-2 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm font-medium leading-8 text-ink-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {item.source ? (
          <a
            href={item.source.url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center justify-between gap-3 border-t border-ink-100 pt-4 text-[11px] font-bold text-ink-500 transition hover:text-brand-700"
          >
            <span>
              المصدر: {item.source.name} · {item.source.license}
            </span>
            <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={2} />
          </a>
        ) : null}

        <p className="mt-5 rounded-md bg-brand-50 px-3 py-2.5 text-[11px] font-semibold leading-5 text-brand-800">
          هذا المحتوى للتوعية ودعم الرفاهية، ولا يغني عن استشارة مختص عند الحاجة.
        </p>
      </div>
    </article>
  );
}

function MediaFallback({
  item,
  onRetry,
  compact = false,
}: {
  item: ContentItem;
  onRetry: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "rounded-lg bg-white/10 p-4 text-white"
          : "flex aspect-video flex-col items-center justify-center px-6 text-center text-white"
      }
    >
      <p className="text-sm font-bold">تعذّر تحميل الوسائط الآن</p>
      <p className="mt-1 text-xs font-semibold opacity-65">تحقق من اتصالك ثم حاول مرة أخرى.</p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-pill bg-white px-3 py-2 text-[11px] font-bold text-ink-900"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.3} />
          إعادة المحاولة
        </button>
        {item.source ? (
          <a
            href={item.source.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-pill bg-white/10 px-3 py-2 text-[11px] font-bold text-white ring-1 ring-inset ring-white/20"
          >
            افتح المصدر
          </a>
        ) : null}
      </div>
    </div>
  );
}
