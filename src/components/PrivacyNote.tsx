import { Check, ShieldCheck, X } from "lucide-react";
import { cn } from "../lib/cn";

/** The data-sharing promise, shown at the start of every assessment: the
 *  employer only ever receives aggregated, anonymous statistics — individual
 *  answers stay private and can never be traced back to a person. */
export function PrivacyNote({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-ink-100 bg-surface p-4 text-right shadow-soft",
        className,
      )}
    >
      <p className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-ink-900">
        <ShieldCheck className="h-4 w-4 text-good" strokeWidth={2.2} />
        ماذا يصل جهة عملك من إجاباتك؟
      </p>
      <div className="mt-2.5 space-y-2">
        <div className="flex items-start gap-2">
          <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-good-soft text-good">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <p className="text-xs font-semibold leading-relaxed text-ink-600">
            مؤشرات مجمّعة ومجهولة فقط — مثل متوسط رفاهية الموظفين ككل
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-coral-soft text-coral-600">
            <X className="h-3 w-3" strokeWidth={3} />
          </span>
          <p className="text-xs font-semibold leading-relaxed text-ink-600">
            إجاباتك ونتائجك الفردية لا تصلها أبدًا، ولا يمكن تتبّع أي بيانات وربطها بك شخصيًا
          </p>
        </div>
      </div>
    </div>
  );
}
