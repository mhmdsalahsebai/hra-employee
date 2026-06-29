import { ChevronLeft } from "lucide-react";

/** Row with a section title and an optional "view all" action.
 *  Note: in RTL the forward chevron points left. */
export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3.5 flex items-end justify-between">
      <h2 className="text-[1.0625rem] font-bold text-ink-900">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="group flex items-center gap-0.5 text-[0.8125rem] font-bold text-ink-500 transition hover:text-brand-700"
        >
          {action}
          <ChevronLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={2.4}
          />
        </button>
      )}
    </div>
  );
}
