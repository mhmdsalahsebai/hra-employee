import { cn } from "../../lib/cn";
import type { Accent } from "../survey";

/**
 * A single answer row: rounded, radio indicator on the left, label, and a soft
 * accent fill + pop when selected. Generous tap target, calm feedback.
 */
export function SurveyOption({
  label,
  selected,
  accent,
  onClick,
}: {
  label: string;
  selected: boolean;
  accent: Accent;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-[16px] border px-4 py-[15px] text-start transition-all duration-200 active:scale-[0.99]",
        selected ? "exp-pop shadow-[0_10px_24px_-16px_rgba(16,18,26,0.4)]" : "border-[#ececf1] bg-white hover:border-[#d4d7e0]",
      )}
      style={selected ? { borderColor: accent.ring, background: accent.soft } : undefined}
    >
      {/* radio indicator */}
      <span
        className={cn(
          "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 transition-all duration-200",
          !selected && "border-[#cdd1db]",
        )}
        style={selected ? { borderColor: accent.solid } : undefined}
      >
        <span
          className="block rounded-full transition-all duration-200"
          style={{
            width: selected ? 11 : 0,
            height: selected ? 11 : 0,
            background: accent.solid,
          }}
        />
      </span>

      <span
        className={cn(
          "flex-1 text-[15.5px] leading-snug transition-colors",
          selected ? "font-bold text-[#10121a]" : "font-semibold text-[#3b4150]",
        )}
      >
        {label}
      </span>
    </button>
  );
}
