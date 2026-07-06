import { BookmarkCheck } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * The one-line "leave anytime" reassurance shown inside the question flows,
 * right under the progress header — next to the exit affordance, where the
 * "will I lose my answers?" worry actually happens. Answers persist as they
 * are tapped, so this is a statement of fact, not a promise.
 */
export function AutosaveNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-ink-400",
        className,
      )}
    >
      <BookmarkCheck className="h-3.5 w-3.5 shrink-0 text-good" strokeWidth={2.4} />
      إجاباتك تُحفظ تلقائيًا — يمكنك الخروج والعودة لتكمل من حيث توقفت في أي وقت
    </p>
  );
}
