import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  Droplet,
  Flame,
  Footprints,
  Frown,
  Laugh,
  Meh,
  Minus,
  Moon,
  Pencil,
  Plus,
  Save,
  Smile,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button, ScoreRing } from "../ui";
import {
  localDateKey,
  persistDailyWellbeing,
  readDailyWellbeing,
  type DailyWellbeingEntry,
  type WellbeingMoodId,
} from "../../wellbeing/wellbeingStorage";

/* Daily wellbeing trackers — light, glanceable habit metrics that live alongside
   the assessment journey. Each day owns a separate local record so manual
   updates survive navigation and reloads without leaking into tomorrow. */

const goals = {
  waterLiters: 2,
  waterCups: 8,
  steps: 8000,
  sleepHours: 8,
  activeMinutes: 30,
  calories: 600,
};
const litersPerCup = goals.waterLiters / goals.waterCups;

const ar = (n: number) => n.toLocaleString("en-US");
const pct = (cur: number, goal: number) => Math.min(100, Math.round((cur / goal) * 100));
/** Soft pastel fill from a solid accent — the modern colour-blocked card look. */
const pastel = (hex: string, p = 12) => `color-mix(in srgb, ${hex} ${p}%, white)`;

const moods: { id: WellbeingMoodId; icon: LucideIcon; label: string; color: string }[] = [
  { id: "hard", icon: Frown, label: "سيئ", color: "#c0653e" },
  { id: "tired", icon: Meh, label: "متعب", color: "#b8923a" },
  { id: "good", icon: Smile, label: "جيد", color: "#2f8a66" },
  { id: "great", icon: Laugh, label: "رائع", color: "#e23e6b" },
];

type EditableMetric = "waterCups" | "steps" | "sleepHours" | "activeMinutes" | "calories";

const metricEditors: Record<
  EditableMetric,
  { label: string; hint: string; unit: string; min: number; max: number; step: number }
> = {
  waterCups: { label: "الماء", hint: "كم كوبًا شربت اليوم؟", unit: "كوب", min: 0, max: 16, step: 1 },
  steps: { label: "الخطوات", hint: "أدخل عدد خطواتك اليوم", unit: "خطوة", min: 0, max: 100_000, step: 500 },
  sleepHours: { label: "النوم", hint: "كم ساعة نمت؟", unit: "ساعة", min: 0, max: 24, step: 0.5 },
  activeMinutes: { label: "دقائق النشاط", hint: "أدخل مدة نشاطك اليوم", unit: "دقيقة", min: 0, max: 1_440, step: 5 },
  calories: { label: "السعرات", hint: "أدخل السعرات النشطة", unit: "سعرة", min: 0, max: 10_000, step: 50 },
};

function clampMetric(metric: EditableMetric, value: number) {
  const config = metricEditors[metric];
  const inRange = Math.min(config.max, Math.max(config.min, value));
  return config.step < 1 ? Math.round(inRange * 10) / 10 : Math.round(inRange);
}

/** A water bottle that fills with the day's intake. */
function WaterBottle({ level }: { level: number }) {
  const top = 16;
  const bottom = 128;
  const waterY = bottom - Math.max(0, Math.min(1, level)) * (bottom - top);
  return (
    <svg viewBox="0 0 56 132" className="h-full w-auto" aria-hidden>
      <defs>
        <clipPath id="bottleClip">
          <rect x="6" y="16" width="44" height="112" rx="18" />
        </clipPath>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5cb8d4" />
          <stop offset="1" stopColor="#178fa3" />
        </linearGradient>
      </defs>
      <rect x="6" y="16" width="44" height="112" rx="18" fill="#eaf4f7" />
      <g clipPath="url(#bottleClip)">
        <path d={`M6 ${waterY} q11 -7 22 0 t22 0 V132 H6 Z`} fill="url(#waterGrad)" />
        <circle cx="20" cy={waterY + 26} r="2" fill="#fff" opacity="0.45" />
        <circle cx="35" cy={waterY + 46} r="3" fill="#fff" opacity="0.3" />
        <circle cx="24" cy={waterY + 64} r="1.6" fill="#fff" opacity="0.35" />
      </g>
      <rect x="6" y="16" width="44" height="112" rx="18" fill="none" stroke="#bcd9e2" strokeWidth="2.5" />
      <rect x="22" y="9" width="12" height="9" fill="#cfe5ec" />
      <rect x="19" y="0" width="18" height="10" rx="3" fill="#178fa3" />
    </svg>
  );
}

/** Small icon chip used beside a tracker label. */
function LabelChip({ icon: Icon, label, fg }: { icon: LucideIcon; label: string; fg: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-[0.65rem] bg-white shadow-soft" style={{ color: fg }}>
        <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={2.2} />
      </span>
      <p className="text-xs font-bold text-ink-600">{label}</p>
    </div>
  );
}

/** A compact tracker card built around a progress ring with the value centred. */
function RingTracker({
  icon,
  label,
  value,
  unit,
  goal,
  ratio,
  gradient,
  fg,
  soft,
  onEdit,
  onDecrease,
  onIncrease,
  stepLabel,
  canDecrease,
  canIncrease,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  goal: string;
  ratio: number;
  gradient: [string, string];
  fg: string;
  soft: string;
  onEdit: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  stepLabel: string;
  canDecrease: boolean;
  canIncrease: boolean;
}) {
  return (
    <div className="flex w-full flex-col rounded-[1.4rem] p-4 shadow-soft" style={{ background: soft }}>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`إدخال قيمة ${label}`}
        className="flex w-full flex-1 flex-col text-right transition active:scale-[0.98]"
      >
        <div className="flex w-full items-center justify-between gap-2">
          <LabelChip icon={icon} label={label} fg={fg} />
          <Pencil className="h-3.5 w-3.5 text-ink-300" strokeWidth={2.2} />
        </div>
        <div className="my-2.5 grid w-full place-items-center">
          <ScoreRing value={ratio} size={82} stroke={8} gradient={gradient} trackClassName="text-ink-100">
            <div className="leading-none">
              <span className="nums text-[1.05rem] font-extrabold text-ink-900">{value}</span>
              {unit && <span className="mt-0.5 block text-[10px] font-bold text-ink-400">{unit}</span>}
            </div>
          </ScoreRing>
        </div>
        <p className="w-full text-center text-[11px] font-semibold text-ink-400">من {goal}</p>
      </button>

      <div className="mt-2.5 flex w-full items-center gap-2 border-t border-ink-900/5 pt-2.5" dir="ltr">
        <button
          type="button"
          onClick={onDecrease}
          disabled={!canDecrease}
          aria-label={`تقليل ${label}`}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/70 text-ink-600 shadow-soft transition hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2.6} />
        </button>
        <span className="nums min-w-0 flex-1 text-center text-[9px] font-bold text-ink-400">
          {stepLabel}
        </span>
        <button
          type="button"
          onClick={onIncrease}
          disabled={!canIncrease}
          aria-label={`زيادة ${label}`}
          style={{ color: fg }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white shadow-soft transition hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}

export function WellbeingTrackers() {
  const [entry, setEntry] = useState<DailyWellbeingEntry>(readDailyWellbeing);
  const [editing, setEditing] = useState<EditableMetric | null>(null);
  const waterLiters = entry.waterCups * litersPerCup;

  function commit(patch: Partial<DailyWellbeingEntry>) {
    setEntry((current) => {
      const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
      persistDailyWellbeing(next);
      return next;
    });
  }

  function adjust(metric: EditableMetric, direction: -1 | 1) {
    const config = metricEditors[metric];
    commit({ [metric]: clampMetric(metric, entry[metric] + config.step * direction) });
  }

  useEffect(() => {
    function syncToday() {
      setEntry(readDailyWellbeing());
    }

    function syncVisible() {
      if (document.visibilityState === "visible" && entry.date !== localDateKey()) {
        setEditing(null);
        syncToday();
      }
    }

    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 1, 0);
    const midnightTimer = window.setTimeout(() => {
      setEditing(null);
      syncToday();
    }, tomorrow.getTime() - Date.now());

    window.addEventListener("storage", syncToday);
    document.addEventListener("visibilitychange", syncVisible);
    return () => {
      window.clearTimeout(midnightTimer);
      window.removeEventListener("storage", syncToday);
      document.removeEventListener("visibilitychange", syncVisible);
    };
  }, [entry.date]);

  return (
    <section className="px-5 pt-7">
      <div className="mb-3.5">
        <h2 className="text-[1.15rem] font-extrabold text-ink-900">تتبّع يومك</h2>
        <p className="mt-0.5 text-xs font-semibold text-ink-400">تقدّم اليوم يُحفظ تلقائيًا</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Water — tall feature card with a filling bottle */}
        <div
          className="row-span-2 flex flex-col rounded-[1.4rem] p-4 shadow-soft"
          style={{ background: pastel("#178fa3", 11) }}
        >
          <div className="flex items-start justify-between">
            <LabelChip icon={Droplet} label="الماء" fg="#0e7d92" />
            <button
              type="button"
              onClick={() => commit({ waterCups: Math.min(16, entry.waterCups + 1) })}
              disabled={entry.waterCups >= 16}
              aria-label="أضف كوبًا"
              style={{ color: "#0e7d92" }}
              className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-soft transition hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" strokeWidth={2.6} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setEditing("waterCups")}
            className="mt-2 flex items-center gap-1.5 self-start rounded-md text-right leading-none transition hover:opacity-70"
            aria-label="تحديث كمية الماء"
          >
            <span className="nums text-[1.3rem] font-extrabold text-ink-900">{ar(waterLiters)}</span>
            <span className="text-[11px] font-bold text-ink-400">
              من {ar(goals.waterLiters)} ل
            </span>
            <Pencil className="h-3 w-3 text-ink-300" strokeWidth={2.2} />
          </button>

          <div className="my-3 grid flex-1 place-items-center">
            <div className="h-[140px]">
              <WaterBottle level={waterLiters / goals.waterLiters} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: goals.waterCups }).map((_, i) => (
              <span
                key={i}
                className={"h-1.5 flex-1 rounded-full " + (i < entry.waterCups ? "bg-[#178fa3]" : "bg-white/70")}
              />
            ))}
          </div>
        </div>

        {/* Steps */}
        <RingTracker
          icon={Footprints}
          label="الخطوات"
          value={ar(entry.steps)}
          goal={ar(goals.steps)}
          ratio={pct(entry.steps, goals.steps)}
          gradient={["#e8b87a", "#c97f35"]}
          fg="#b8732b"
          soft="#f4e9d8"
          onEdit={() => setEditing("steps")}
          onDecrease={() => adjust("steps", -1)}
          onIncrease={() => adjust("steps", 1)}
          stepLabel={`± ${ar(metricEditors.steps.step)}`}
          canDecrease={entry.steps > metricEditors.steps.min}
          canIncrease={entry.steps < metricEditors.steps.max}
        />

        {/* Sleep */}
        <RingTracker
          icon={Moon}
          label="النوم"
          value={ar(entry.sleepHours)}
          unit="س"
          goal={`${ar(goals.sleepHours)} ساعات`}
          ratio={pct(entry.sleepHours, goals.sleepHours)}
          gradient={["#9aa3d6", "#5b62a8"]}
          fg="#565ea3"
          soft="#e7e8f5"
          onEdit={() => setEditing("sleepHours")}
          onDecrease={() => adjust("sleepHours", -1)}
          onIncrease={() => adjust("sleepHours", 1)}
          stepLabel={`± ${ar(metricEditors.sleepHours.step)} س`}
          canDecrease={entry.sleepHours > metricEditors.sleepHours.min}
          canIncrease={entry.sleepHours < metricEditors.sleepHours.max}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {/* Active minutes */}
        <RingTracker
          icon={Activity}
          label="دقائق النشاط"
          value={ar(entry.activeMinutes)}
          unit="د"
          goal={`${ar(goals.activeMinutes)} دقيقة`}
          ratio={pct(entry.activeMinutes, goals.activeMinutes)}
          gradient={["#7bd3a0", "#2f8a66"]}
          fg="#2f8a66"
          soft="#e1efe8"
          onEdit={() => setEditing("activeMinutes")}
          onDecrease={() => adjust("activeMinutes", -1)}
          onIncrease={() => adjust("activeMinutes", 1)}
          stepLabel={`± ${ar(metricEditors.activeMinutes.step)} د`}
          canDecrease={entry.activeMinutes > metricEditors.activeMinutes.min}
          canIncrease={entry.activeMinutes < metricEditors.activeMinutes.max}
        />

        {/* Calories */}
        <RingTracker
          icon={Flame}
          label="السعرات"
          value={ar(entry.calories)}
          unit="سعرة"
          goal={ar(goals.calories)}
          ratio={pct(entry.calories, goals.calories)}
          gradient={["#f0a08c", "#d4574a"]}
          fg="#c8503f"
          soft="#fae3dd"
          onEdit={() => setEditing("calories")}
          onDecrease={() => adjust("calories", -1)}
          onIncrease={() => adjust("calories", 1)}
          stepLabel={`± ${ar(metricEditors.calories.step)}`}
          canDecrease={entry.calories > metricEditors.calories.min}
          canIncrease={entry.calories < metricEditors.calories.max}
        />
      </div>

      {/* Mood check-in — replaces the old "mindful minutes" strip */}
      <div className="mt-3 rounded-[1.4rem] p-4 shadow-soft" style={{ background: "#f3eeff" }}>
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-[0.65rem] bg-white text-[#6354cc] shadow-soft">
            <Smile className="h-[1.05rem] w-[1.05rem]" strokeWidth={2.2} />
          </span>
          <p className="text-[14px] font-bold text-ink-900">كيف تشعر اليوم؟</p>
        </div>
        <div className="flex items-stretch justify-between gap-2">
          {moods.map((m) => {
            const selected = entry.mood === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => commit({ mood: m.id })}
                aria-pressed={selected}
                className={
                  "flex flex-1 flex-col items-center gap-1.5 rounded-[0.9rem] py-2.5 transition active:scale-95 " +
                  (selected ? "bg-white shadow-soft" : "hover:bg-white/60")
                }
              >
                <span
                  className="grid h-9 w-9 place-items-center rounded-full transition"
                  style={
                    selected
                      ? { background: m.color, color: "#fff" }
                      : { background: "rgba(255,255,255,0.65)", color: "#9aa39e" }
                  }
                >
                  <m.icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: selected ? m.color : "#9aa39e" }}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {editing &&
        createPortal(
          <MetricEditor
            metric={editing}
            initialValue={entry[editing]}
            onClose={() => setEditing(null)}
            onSave={(value) => {
              commit({ [editing]: value });
              setEditing(null);
            }}
          />,
          document.body,
        )}
    </section>
  );
}

function MetricEditor({
  metric,
  initialValue,
  onClose,
  onSave,
}: {
  metric: EditableMetric;
  initialValue: number;
  onClose: () => void;
  onSave: (value: number) => void;
}) {
  const config = metricEditors[metric];
  const [value, setValue] = useState(String(initialValue));
  const numericValue = Number(value);
  const isValid = value.trim() !== "" && Number.isFinite(numericValue);

  function nudge(direction: -1 | 1) {
    const current = isValid ? numericValue : 0;
    setValue(String(clampMetric(metric, current + config.step * direction)));
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 mx-auto flex h-dvh w-full max-w-[480px] items-end bg-ink-900/35 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="wellbeing-editor-title"
        className="w-full rounded-xl bg-surface p-5 shadow-pop"
        onSubmit={(event) => {
          event.preventDefault();
          if (isValid) onSave(clampMetric(metric, numericValue));
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="wellbeing-editor-title" className="text-lg font-extrabold text-ink-900">
              تحديث {config.label}
            </h3>
            <p className="mt-1 text-xs font-semibold text-ink-400">{config.hint}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink-50 text-ink-500 transition hover:bg-ink-100 active:scale-95"
          >
            <X className="h-4.5 w-4.5" strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2.5" dir="ltr">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label={`تقليل ${config.label}`}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink-50 text-ink-700 transition hover:bg-ink-100 active:scale-95"
          >
            <Minus className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <div className="relative min-w-0 flex-1">
            <input
              autoFocus
              type="number"
              inputMode={config.step < 1 ? "decimal" : "numeric"}
              min={config.min}
              max={config.max}
              step={config.step}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              aria-label={config.label}
              className="nums h-14 w-full rounded-md border border-ink-200 bg-canvas px-4 pb-4 pt-2 text-center text-xl font-extrabold text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <span className="pointer-events-none absolute bottom-1.5 left-0 right-0 text-center text-[10px] font-bold text-ink-400">
              {config.unit}
            </span>
          </div>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label={`زيادة ${config.label}`}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-700 transition hover:bg-brand-100 active:scale-95"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <Button type="submit" fullWidth className="mt-5" disabled={!isValid}>
          <Save className="h-4.5 w-4.5" strokeWidth={2.2} />
          حفظ التحديث
        </Button>
      </form>
    </div>
  );
}
