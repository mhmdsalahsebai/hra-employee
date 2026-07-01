import { cn } from "../../lib/cn";
import type { DimensionAccent } from "../../data/dimensions";

/** Brand blue, used when a caller doesn't theme the option to a dimension. */
const BRAND_ACCENT: DimensionAccent = {
  fg: "#1c5599",
  soft: "rgba(46,128,210,0.12)",
  solid: "#2e80d2",
};

/**
 * A single answer row: a calm, always-readable choice.
 *
 * A leading radio (on the right in RTL) fills in to the dimension accent on
 * select, and the whole row tints to the accent's soft wash — the same quiet,
 * friendly feedback as the onboarding survey, kept on the light canvas.
 */
export function OptionCard({
  label,
  selected,
  onClick,
  accent = BRAND_ACCENT,
  compact = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  /** Dimension accent so the option reads as part of that dimension. */
  accent?: DimensionAccent;
  /** Denser tile treatment for long answer sets that need a wrapping grid. */
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex h-full w-full items-center border text-right transition-all duration-200 active:scale-[0.99]",
        compact
          ? "min-h-12 gap-2 rounded-[14px] px-3 py-2.5"
          : "gap-3.5 rounded-[16px] px-4 py-[15px]",
        selected
          ? "shadow-soft"
          : "border-ink-200 bg-surface hover:-translate-y-px hover:border-ink-300 hover:shadow-soft",
      )}
      style={selected ? { borderColor: accent.solid, background: accent.soft } : undefined}
    >
      {/* Radio indicator (leading / right in RTL) */}
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full border-2 transition-all duration-200",
          compact ? "h-[18px] w-[18px]" : "h-[22px] w-[22px]",
          !selected && "border-ink-300",
        )}
        style={selected ? { borderColor: accent.solid } : undefined}
      >
        <span
          className="block rounded-full transition-all duration-200"
          style={{
            width: selected ? (compact ? 8 : 11) : 0,
            height: selected ? (compact ? 8 : 11) : 0,
            background: accent.solid,
          }}
        />
      </span>

      <span
        className={cn(
          "flex-1 leading-snug transition-colors",
          compact ? "text-[13.5px]" : "text-[15.5px]",
          selected ? "font-bold text-ink-900" : "font-semibold text-ink-700",
        )}
      >
        {label}
      </span>
    </button>
  );
}
