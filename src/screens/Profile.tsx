import { useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  ChevronLeft,
  CircleHelp,
  FileText,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, Badge } from "../components/ui";
import { Spotlight } from "../components/Spotlight";
import { cn } from "../lib/cn";
import { scoreMeta } from "../lib/score";
import { useAssessment } from "../assessment/useAssessment";
import { useOnboarding } from "../onboarding/useOnboarding";
import { currentUser } from "../data/app";

interface Row {
  icon: LucideIcon;
  label: string;
  fg: string;
  soft: string;
  to?: string;
  hint?: string;
}

const rows: Row[] = [
  { icon: FileText, label: "تقييماتي السابقة", fg: "#176b91", soft: "#e6f1f6", to: "/report", hint: "3 تقييمات" },
  { icon: Bell, label: "الإشعارات والتذكيرات", fg: "#ac7a2e", soft: "#f3ecdc" },
  { icon: ShieldCheck, label: "الخصوصية والبيانات", fg: "#2f8a66", soft: "#e4efe9" },
  { icon: CircleHelp, label: "المساعدة والدعم", fg: "#486784", soft: "#e9eef3" },
];

export function Profile() {
  const navigate = useNavigate();
  const { hasResults, started, overallScore, resetAnswers } = useAssessment();
  const onboarding = useOnboarding();
  const meta = scoreMeta(overallScore);

  function logout() {
    resetAnswers();
    onboarding.reset();
    navigate("/welcome");
  }

  return (
    <div className="animate-rise">
      <header className="px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <h1 className="text-2xl font-extrabold text-ink-900">حسابي</h1>
      </header>

      {/* Identity card */}
      <section className="px-5 pt-5">
        <div className="flex flex-col items-center rounded-xl border border-ink-100 bg-surface p-7 text-center shadow-card">
          <Avatar name={currentUser.name} src={currentUser.avatar} size={84} />
          <h2 className="mt-3.5 text-lg font-bold text-ink-900">{currentUser.name}</h2>
          <p className="text-[0.8125rem] font-semibold text-ink-400">{currentUser.role}</p>
          {hasResults ? (
            <Badge className={cn("mt-3.5", meta.soft)}>
              <span className="nums">{overallScore}</span> · رفاهية {meta.label}
            </Badge>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="mt-3.5 rounded-pill bg-brand-50 px-3.5 py-1.5 text-xs font-bold text-brand-700"
            >
              {started ? "أكمل تقييمك لعرض رفاهيتك" : "ابدأ تقييمك الأول"}
            </button>
          )}
        </div>
      </section>

      {/* Organization */}
      <section className="px-5 pt-4">
        <Spotlight className="text-white">
          <div className="flex items-center gap-3.5 p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[0.85rem] bg-white/10">
              <Building2 className="h-6 w-6" strokeWidth={2} />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-brand-200">اشتراكك مفعّل عبر</p>
              <p className="text-base font-bold">{currentUser.org}</p>
            </div>
            <Badge className="bg-good/25 text-white ring-1 ring-inset ring-good/30">نشِط</Badge>
          </div>
        </Spotlight>
      </section>

      {/* Settings list */}
      <section className="px-5 pt-4">
        <div className="overflow-hidden rounded-card border border-ink-100 bg-surface shadow-soft">
          {rows.map((row, i) => (
            <button
              key={row.label}
              onClick={() => row.to && navigate(row.to)}
              className={cn(
                "flex w-full items-center gap-3.5 p-3.5 text-right transition hover:bg-sand",
                i < rows.length - 1 && "border-b border-ink-100",
              )}
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.7rem]"
                style={{ color: row.fg, background: row.soft }}
              >
                <row.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="flex-1 text-[0.8125rem] font-bold text-ink-800">{row.label}</span>
              {row.hint && <span className="text-xs font-semibold text-ink-400">{row.hint}</span>}
              <ChevronLeft className="h-5 w-5 text-ink-300" strokeWidth={2.2} />
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <section className="px-5 pt-4">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-card border border-coral-100 bg-coral-50 py-3.5 text-[0.8125rem] font-bold text-coral-600 transition hover:bg-coral-100 active:scale-[0.99]"
        >
          <LogOut className="h-5 w-5" strokeWidth={2} />
          تسجيل الخروج
        </button>
        <p className="nums pt-4 text-center text-xs font-semibold text-ink-300">cura · الإصدار 1.0</p>
      </section>
    </div>
  );
}
