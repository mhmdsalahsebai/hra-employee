import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { haptic } from "../motion/haptics";

/** Sub-page header with a back affordance. In RTL "back" points right. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center gap-3 px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-2">
      <button
        onClick={() => {
          haptic("tap");
          navigate(-1);
        }}
        aria-label="رجوع"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-200 bg-surface text-ink-700 transition active:scale-90 active:bg-sand"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-bold text-ink-900">{title}</h1>
        {subtitle && <p className="truncate text-[0.8125rem] font-semibold text-ink-400">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
