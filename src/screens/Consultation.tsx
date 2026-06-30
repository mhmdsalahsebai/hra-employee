import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Gift,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  ShieldCheck,
  Sparkles,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { Avatar, Badge, Button } from "../components/ui";
import { Illustration } from "../illustrations/Illustration";
import { PageHeader } from "../components/PageHeader";
import { cn } from "../lib/cn";
import { experts, type Expert } from "../data/app";
import { dimensionsById } from "../data/dimensions";

/** The instant consultation is a small state machine: the employee taps once,
 *  we pretend to match them with an available specialist, ring through, then
 *  drop them into a simulated video call. */
type Phase = "idle" | "matching" | "connecting" | "in-call" | "ended";

/** Western → Arabic-Indic digits, so the call timer matches the RTL UI. */
const toArabic = (s: string) => s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

function formatDuration(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return toArabic(`${m}:${String(s).padStart(2, "0")}`);
}

const MATCHING_MESSAGES = [
  "نبحث عن أفضل مختص متاح لك الآن…",
  "نطابق احتياجك مع التخصص المناسب…",
  "نؤمّن اتصالًا خاصًا ومشفّرًا…",
];

export function Consultation() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const [expert, setExpert] = useState<Expert | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  // Matching → choose a random available specialist, then ring through.
  useEffect(() => {
    if (phase !== "matching") return;
    const cycle = setInterval(
      () => setMsgIndex((i) => (i + 1) % MATCHING_MESSAGES.length),
      1100,
    );
    const handoff = setTimeout(() => {
      setExpert(experts[Math.floor(Math.random() * experts.length)]);
      setPhase("connecting");
    }, 3000);
    return () => {
      clearInterval(cycle);
      clearTimeout(handoff);
    };
  }, [phase]);

  // Connecting → the specialist "picks up" and the call begins.
  useEffect(() => {
    if (phase !== "connecting") return;
    const t = setTimeout(() => setPhase("in-call"), 2600);
    return () => clearTimeout(t);
  }, [phase]);

  // In-call → tick the duration.
  useEffect(() => {
    if (phase !== "in-call") return;
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [phase]);

  function start() {
    setSeconds(0);
    setMsgIndex(0);
    setMuted(false);
    setCameraOff(false);
    setPhase("matching");
  }

  function reset() {
    setExpert(null);
    setPhase("idle");
  }

  /* ── Matching ───────────────────────────────────────────────────────────── */
  if (phase === "matching") {
    return (
      <CallStage>
        <button
          onClick={reset}
          aria-label="إلغاء"
          className="absolute right-5 top-[max(1.25rem,env(safe-area-inset-top))] grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/15 active:scale-95"
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>

        <div className="relative grid h-32 w-32 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/20" />
          <span className="absolute inset-3 rounded-full bg-white/5" />
          <Loader2 className="relative h-14 w-14 animate-spin text-brand-200" strokeWidth={2} />
        </div>

        <h1 className="mt-9 text-2xl font-extrabold text-white">نجهّز استشارتك الفورية</h1>
        <p className="mt-3 h-5 max-w-xs text-[15px] font-medium text-white/65 transition">
          {MATCHING_MESSAGES[msgIndex]}
        </p>

        <div className="mt-8 flex items-center gap-2 rounded-pill bg-white/10 px-4 py-2 text-xs font-bold text-brand-100">
          <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
          جلسة خاصة ومشفّرة من طرف إلى طرف
        </div>
      </CallStage>
    );
  }

  /* ── Connecting (ringing) ──────────────────────────────────────────────── */
  if (phase === "connecting" && expert) {
    const dim = dimensionsById[expert.specialty];
    return (
      <CallStage>
        <div className="relative grid place-items-center">
          <span className="absolute h-40 w-40 animate-ping rounded-full bg-brand-400/15" />
          <span className="absolute h-32 w-32 animate-pulse rounded-full bg-white/5" />
          <Avatar name={expert.name} size={112} className="relative ring-4 ring-white/15" />
        </div>

        <p className="mt-9 flex items-center gap-2 text-sm font-bold text-brand-100">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-300" />
          </span>
          جارٍ الاتصال…
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-white">{expert.name}</h1>
        <p className="mt-1.5 text-sm font-semibold text-white/55">
          {expert.title} · {dim.title}
        </p>

        <button
          onClick={reset}
          className="mt-12 grid h-16 w-16 place-items-center rounded-full bg-coral-500 text-white shadow-soft transition hover:bg-coral-600 active:scale-95"
          aria-label="إنهاء"
        >
          <PhoneOff className="h-6 w-6" strokeWidth={2.2} />
        </button>
      </CallStage>
    );
  }

  /* ── In call (live video simulation) ───────────────────────────────────── */
  if (phase === "in-call" && expert) {
    const dim = dimensionsById[expert.specialty];
    return (
      <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[480px] -translate-x-1/2 flex-col bg-brand-950">
        {/* "Video feed" — the specialist, filling the frame */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 0%, rgba(23,143,163,0.35), transparent 60%), linear-gradient(180deg, #0b2a30, #07181c)",
            }}
          />

          <div className="relative grid h-full place-items-center">
            <div className="flex flex-col items-center">
              <Avatar name={expert.name} size={132} className="ring-4 ring-white/10" />
              <p className="mt-4 text-sm font-semibold text-white/45">الكاميرا قيد التشغيل…</p>
            </div>
          </div>

          {/* Top bar: who you're with + live timer */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-white">{expert.name}</h1>
              <p className="truncate text-xs font-semibold text-white/55">{dim.title}</p>
            </div>
            <span className="nums flex shrink-0 items-center gap-1.5 rounded-pill bg-black/30 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-coral-400" />
              {formatDuration(seconds)}
            </span>
          </div>

          {/* Self preview (picture-in-picture) */}
          <div className="absolute bottom-4 left-4 grid h-32 w-24 place-items-center overflow-hidden rounded-2xl bg-brand-900/80 ring-1 ring-white/15 backdrop-blur">
            {cameraOff ? (
              <VideoOff className="h-6 w-6 text-white/40" strokeWidth={2} />
            ) : (
              <span className="text-2xl font-bold text-white/80">أنت</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 bg-brand-950 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
          <CallControl
            active={muted}
            onClick={() => setMuted((m) => !m)}
            on={<MicOff className="h-6 w-6" strokeWidth={2} />}
            off={<Mic className="h-6 w-6" strokeWidth={2} />}
            label={muted ? "إلغاء الكتم" : "كتم"}
          />
          <button
            onClick={() => setPhase("ended")}
            aria-label="إنهاء المكالمة"
            className="grid h-16 w-16 place-items-center rounded-full bg-coral-500 text-white shadow-soft transition hover:bg-coral-600 active:scale-95"
          >
            <PhoneOff className="h-7 w-7" strokeWidth={2.2} />
          </button>
          <CallControl
            active={cameraOff}
            onClick={() => setCameraOff((c) => !c)}
            on={<VideoOff className="h-6 w-6" strokeWidth={2} />}
            off={<Video className="h-6 w-6" strokeWidth={2} />}
            label={cameraOff ? "تشغيل الكاميرا" : "إيقاف الكاميرا"}
          />
        </div>
      </div>
    );
  }

  /* ── Ended (call summary) ──────────────────────────────────────────────── */
  if (phase === "ended" && expert) {
    return (
      <div className="animate-rise">
        <PageHeader title="انتهت الاستشارة" />
        <div className="flex flex-col items-center px-6 pt-8 text-center">
          <Illustration name="well-done" className="w-48 max-w-[62%]" tone="var(--color-good)" />
          <h1 className="mt-6 text-2xl font-extrabold text-ink-900">شكرًا لك</h1>
          <p className="mt-2.5 max-w-xs text-[15px] leading-relaxed text-ink-500">
            انتهت استشارتك مع {expert.name}. سنرسل لك ملخّصًا وتوصيات المتابعة قريبًا.
          </p>

          <div className="mt-7 flex w-full items-center gap-3.5 rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
            <Avatar name={expert.name} size={48} />
            <div className="flex-1 text-right">
              <p className="text-sm font-bold text-ink-900">{expert.name}</p>
              <p className="text-xs font-semibold text-ink-400">{expert.title}</p>
            </div>
            <Badge className="bg-brand-50 text-brand-700">
              <Clock className="h-3.5 w-3.5" strokeWidth={2.2} />
              {formatDuration(seconds)}
            </Badge>
          </div>

          <div className="mt-7 w-full space-y-3">
            <Button fullWidth size="lg" onClick={() => navigate("/")}>
              العودة للرئيسية
            </Button>
            <Button fullWidth size="lg" variant="outline" onClick={start}>
              استشارة جديدة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Idle (intro) ──────────────────────────────────────────────────────── */
  return (
    <div className="animate-rise">
      <PageHeader title="استشارة فورية" subtitle="مع خبراء معتمدين" />

      {/* Calm hero — sets a warm, human tone before the data-heavy steps */}
      <section className="px-5 pt-2">
        <div className="overflow-hidden rounded-xl bg-sand px-6 pt-7">
          <Illustration name="medical-care" className="mx-auto w-56 max-w-[72%]" />
        </div>
      </section>

      {/* Free banner */}
      <section className="px-5 pt-5">
        <div className="flex items-center gap-4 rounded-xl bg-coral-500 p-5 text-white shadow-soft">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[0.85rem] bg-white/15">
            <Gift className="h-6 w-6" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[1.0625rem] font-bold">جلستك الأولى علينا</p>
            <p className="text-[0.8125rem] font-medium leading-relaxed text-white/85">
              مغطّاة بالكامل ضمن اشتراك شركتك — دون أي تكلفة عليك.
            </p>
          </div>
        </div>
      </section>

      {/* Availability */}
      <section className="px-5 pt-6">
        <div className="flex items-center gap-3.5 rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
          <div className="flex -space-x-3 rtl:space-x-reverse">
            {experts.map((e) => (
              <Avatar key={e.id} name={e.name} size={40} className="ring-2 ring-surface" />
            ))}
          </div>
          <div className="flex-1">
            <p className="flex items-center gap-1.5 text-sm font-bold text-ink-900">
              <span className="h-2 w-2 rounded-full bg-good" />
              مختصون متاحون الآن
            </p>
            <p className="text-xs font-semibold text-ink-400">متوسط زمن الانتظار أقل من دقيقة</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 pt-7">
        <h2 className="mb-3.5 text-[1.0625rem] font-bold text-ink-900">كيف تعمل؟</h2>
        <div className="space-y-3">
          <HowStep
            n="١"
            title="اضغط ابدأ"
            desc="استشارة فيديو فورية بضغطة واحدة — دون حجز موعد."
          />
          <HowStep
            n="٢"
            title="نختار لك مختصًا متاحًا"
            desc="نطابقك تلقائيًا مع أنسب مختص متاح في هذه اللحظة."
          />
          <HowStep
            n="٣"
            title="ادخل المكالمة مباشرة"
            desc="تنضمّ إلى مكالمة فيديو خاصة ومشفّرة على الفور."
          />
        </div>
      </section>

      {/* Sticky start bar */}
      <div className="sticky bottom-0 mt-8 bg-gradient-to-t from-canvas via-canvas to-transparent px-5 pb-2 pt-5">
        <Button fullWidth size="lg" onClick={start}>
          <Sparkles className="h-5 w-5" strokeWidth={2} />
          ابدأ استشارة فورية
        </Button>
      </div>
    </div>
  );
}

/* ── A full-screen immersive stage for matching / ringing ──────────────────── */

function CallStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[480px] -translate-x-1/2 flex-col items-center justify-center bg-brand-950 px-6 text-center">
      {children}
    </div>
  );
}

/* ── A round mic/camera toggle on the call screen ──────────────────────────── */

function CallControl({
  active,
  onClick,
  on,
  off,
  label,
}: {
  active: boolean;
  onClick: () => void;
  on: React.ReactNode;
  off: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid h-14 w-14 place-items-center rounded-full transition active:scale-95",
        active ? "bg-white text-brand-900" : "bg-white/10 text-white hover:bg-white/15",
      )}
    >
      {active ? on : off}
    </button>
  );
}

/* ── One numbered step in the "how it works" explainer ─────────────────────── */

function HowStep({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3.5 rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
      <span className="nums grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-extrabold text-brand-700">
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-bold text-ink-900">{title}</h3>
        <p className="mt-0.5 text-xs font-semibold leading-relaxed text-ink-400">{desc}</p>
      </div>
    </div>
  );
}
