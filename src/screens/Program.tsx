import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, Clock, Star, Video } from "lucide-react";
import { Avatar, Badge, Button, IconTile } from "../components/ui";
import { PageHeader } from "../components/PageHeader";
import { programsById } from "../data/programs";
import { dimensionsById, tileStyle } from "../data/dimensions";

const ar = (n: number) => n.toLocaleString("en-US");

export function Program() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const program = programsById[id];

  if (!program) {
    return (
      <div className="animate-rise">
        <PageHeader title="البرنامج" />
        <div className="px-5 pt-10 text-center">
          <p className="text-sm font-semibold text-ink-500">لم نعثر على هذا البرنامج.</p>
          <Button className="mt-5" onClick={() => navigate("/plan")}>
            العودة لخطتي
          </Button>
        </div>
      </div>
    );
  }

  const dim = dimensionsById[program.dimension];
  const totalMin = program.sessions.reduce((n, s) => n + s.durationMin, 0);

  return (
    <div className="animate-rise pb-6">
      <PageHeader title={program.title} subtitle={program.tagline} />

      {/* ── Hero — what this program is and who leads it ──────────────────── */}
      <section className="px-5 pt-2">
        <div className="rounded-xl border border-ink-100 bg-surface p-5 shadow-card">
          <div className="flex items-center gap-3.5">
            <IconTile icon={program.icon} size="lg" style={tileStyle(dim.accent)} strokeWidth={2} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge style={tileStyle(dim.accent)}>{program.tag}</Badge>
                <span className="text-[11px] font-bold text-ink-400">{dim.title}</span>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-ink-400">
                <span className="inline-flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" strokeWidth={2.2} />
                  <span className="nums">{ar(program.sessions.length)}</span> جلسات
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" strokeWidth={2.2} />
                  <span className="nums">{ar(totalMin)}</span> دقيقة إجمالًا
                </span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-600">{program.description}</p>
        </div>
      </section>

      {/* ── Expert ─────────────────────────────────────────────────────────── */}
      <section className="px-5 pt-5">
        <h2 className="mb-2.5 text-[1.0625rem] font-bold text-ink-900">الخبير المرافق</h2>
        <div className="flex items-center gap-3.5 rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
          <Avatar name={program.expert.name} size={52} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink-900">{program.expert.name}</p>
            <p className="text-xs font-semibold text-ink-400">{program.expert.title}</p>
          </div>
          <Badge className="bg-brand-50 text-brand-700">
            <Star className="h-3.5 w-3.5" strokeWidth={2.2} />
            <span className="nums">{ar(program.expert.years)}</span> سنة خبرة
          </Badge>
        </div>
      </section>

      {/* ── The five sessions ──────────────────────────────────────────────── */}
      <section className="px-5 pt-6">
        <h2 className="mb-1 text-[1.0625rem] font-bold text-ink-900">مسار البرنامج</h2>
        <p className="mb-3.5 text-xs font-semibold text-ink-400">
          خمس جلسات متدرّجة مع الخبير — كل جلسة تبني على ما قبلها
        </p>
        <ol className="relative space-y-2.5 before:absolute before:bottom-4 before:top-4 before:start-[1.05rem] before:w-px before:bg-ink-100">
          {program.sessions.map((session) => (
            <li
              key={session.order}
              className="relative flex items-start gap-3.5 rounded-card border border-ink-100 bg-surface p-3.5 shadow-soft"
            >
              <span
                className="nums relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-extrabold"
                style={tileStyle(dim.accent)}
              >
                {ar(session.order)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[0.9375rem] font-bold leading-snug text-ink-900">{session.title}</h3>
                  <span className="nums shrink-0 text-[11px] font-bold text-ink-400">
                    {ar(session.durationMin)} د
                  </span>
                </div>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-500">{session.focus}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── What you'll gain ───────────────────────────────────────────────── */}
      <section className="px-5 pt-6">
        <div className="rounded-card border border-good/20 bg-good-soft/40 p-4">
          <h3 className="mb-2.5 flex items-center gap-2 text-sm font-bold text-ink-900">
            <Check className="h-4 w-4 text-good" strokeWidth={2.6} />
            ما الذي تكسبه
          </h3>
          <ul className="space-y-1.5 text-[0.8125rem] font-semibold leading-relaxed text-ink-600">
            <li>• خطة شخصية يضعها معك خبير مختص في هذا المجال</li>
            <li>• متابعة عبر خمس جلسات حتى تلمس نتيجة ملموسة</li>
            <li>• أدوات عملية تكمل مهامك اليومية في الخطة</li>
          </ul>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <div className="sticky bottom-0 mt-6 bg-gradient-to-t from-canvas via-canvas to-transparent px-5 pb-2 pt-5">
        <Button fullWidth size="lg" onClick={() => navigate("/consultation")}>
          ابدأ البرنامج مع {program.expert.name.replace(/^(د\.|أ\.)\s*/, "")}
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
        </Button>
      </div>
    </div>
  );
}
