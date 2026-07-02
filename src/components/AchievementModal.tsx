import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Check,
  ChevronLeft,
  MessageCircleHeart,
  ScrollText,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAssessment } from "../assessment/useAssessment";

/** Shown once, ever — the first time every dimension is complete. */
export const CELEBRATED_KEY = "cura-assessment-celebrated";

/* A scatter of sparkles that burst outward behind the celebration art — the small bit of
   delight that makes finishing feel like an achievement. */
const CONFETTI = [
  { x: -74, y: -20, c: "#e23e6b", d: 0 },
  { x: 70, y: -30, c: "#7c6ee6", d: 0.05 },
  { x: -52, y: 40, c: "#1c9bb4", d: 0.1 },
  { x: 58, y: 44, c: "#d08a1f", d: 0.15 },
  { x: 0, y: -60, c: "#13a394", d: 0.08 },
  { x: -90, y: 14, c: "#df7446", d: 0.12 },
  { x: 88, y: 8, c: "#16855f", d: 0.18 },
];

/**
 * A full-screen "achievement unlocked" moment. When the employee completes the
 * whole assessment, their report and expert consultation both unlock — this
 * turns that milestone into a genuine celebration rather than a silent state
 * change, and hands them straight into the two things they just earned.
 */
export function AchievementModal() {
  const navigate = useNavigate();
  const { hasResults } = useAssessment();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasResults) return;
    if (localStorage.getItem(CELEBRATED_KEY)) return;
    setOpen(true);
  }, [hasResults]);

  const dismiss = () => {
    localStorage.setItem(CELEBRATED_KEY, "1");
    setOpen(false);
  };

  const go = (to: string) => {
    dismiss();
    navigate(to);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <button
            aria-label="إغلاق"
            onClick={dismiss}
            className="absolute inset-0 bg-ink-900/55 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-[380px] overflow-hidden rounded-[1.75rem] bg-surface shadow-pop"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <button
              aria-label="إغلاق"
              onClick={dismiss}
              className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-ink-500 shadow-soft transition hover:bg-white active:scale-95"
            >
              <X className="h-4 w-4" strokeWidth={2.4} />
            </button>

            {/* Celebratory header — achievement art bursting with confetti */}
            <div
              className="relative flex flex-col items-center overflow-hidden px-6 pb-6 pt-9 text-center"
              style={{ background: "linear-gradient(150deg, #e3f0fd 0%, #eae9fb 55%, #e6f5fb 100%)" }}
            >
              <div className="relative grid h-24 w-24 place-items-center">
                {!reduce &&
                  CONFETTI.map((p, i) => (
                    <motion.span
                      key={i}
                      className="absolute h-2 w-2 rounded-[2px]"
                      style={{ background: p.c }}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{ x: p.x, y: p.y, scale: 1, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.1, delay: 0.15 + p.d, ease: "easeOut" }}
                    />
                  ))}
                <motion.img
                  src="/images/congrat.png"
                  alt=""
                  aria-hidden
                  className="h-24 w-24 object-contain drop-shadow-lg"
                  initial={reduce ? {} : { scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.05 }}
                />
              </div>

              <span className="mt-4 inline-flex items-center gap-1.5 rounded-pill bg-white/70 px-3 py-1 text-[11px] font-bold text-brand-700">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
                إنجاز مكتمل
              </span>
              <h2 className="mt-3 text-[1.4rem] font-extrabold leading-tight text-ink-900">
                تهانينا! أكملت تقييمك 🎉
              </h2>
              <p className="mt-1.5 text-[0.8125rem] font-semibold leading-relaxed text-ink-600">
                أجبت عن كل أبعاد رفاهيتك — وبهذا فتحت تقريرك الكامل واستشارتك المجانية مع خبير.
              </p>
            </div>

            {/* What just unlocked */}
            <div className="space-y-2.5 px-6 pt-5">
              <UnlockRow
                icon={ScrollText}
                title="تقريرك الشامل"
                desc="تحليل مفصّل لكل إجاباتك"
              />
              <UnlockRow
                icon={MessageCircleHeart}
                title="استشارة الخبير"
                desc="جلسة فورية مجانية متاحة الآن"
              />
            </div>

            {/* Actions — hand them straight into what they earned */}
            <div className="space-y-2.5 p-6 pt-5">
              <button
                onClick={() => go("/report")}
                className="flex w-full items-center justify-center gap-2 rounded-pill bg-brand-600 py-3.5 text-[15px] font-bold text-white shadow-soft transition hover:bg-brand-700 active:scale-[0.98]"
              >
                <ScrollText className="h-4 w-4" strokeWidth={2.2} />
                اعرض تقريرك
              </button>
              <button
                onClick={() => go("/consultation")}
                className="flex w-full items-center justify-center gap-2 rounded-pill border border-ink-200 bg-surface py-3.5 text-[15px] font-bold text-ink-800 transition hover:bg-sand active:scale-[0.98]"
              >
                <Video className="h-4 w-4 text-brand-600" strokeWidth={2.2} />
                ابدأ استشارة فورية الآن
              </button>
              <button
                onClick={dismiss}
                className="flex w-full items-center justify-center gap-1 py-1.5 text-[13px] font-bold text-ink-400 transition hover:text-ink-600"
              >
                تصفّح لاحقًا
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function UnlockRow({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-good/25 bg-good-soft/50 p-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.7rem] bg-white text-brand-600 shadow-soft">
        <Icon className="h-5 w-5" strokeWidth={2.1} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-ink-900">{title}</h3>
        <p className="text-[11px] font-semibold text-ink-500">{desc}</p>
      </div>
      <span className="inline-flex items-center gap-1 rounded-pill bg-good px-2 py-0.5 text-[10px] font-bold text-white">
        <Check className="h-3 w-3" strokeWidth={3} />
        مفتوح
      </span>
    </div>
  );
}
