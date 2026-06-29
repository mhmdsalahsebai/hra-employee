import type { CSSProperties, HTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Tighter padding variant for dense lists. */
  compact?: boolean;
  /** Lift the card with a stronger border + hover. */
  interactive?: boolean;
}

/** The base surface: a crisp white panel with a hairline edge and quiet depth. */
export function Card({ compact, interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-ink-100 bg-surface shadow-soft",
        compact ? "p-4" : "p-5",
        interactive &&
          "cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:border-ink-300 active:translate-y-0 active:scale-[0.98]",
        className,
      )}
      {...props}
    />
  );
}

type IconTileSize = "sm" | "md" | "lg";

const tileSize: Record<IconTileSize, string> = {
  sm: "h-9 w-9 rounded-[0.55rem]",
  md: "h-11 w-11 rounded-[0.7rem]",
  lg: "h-14 w-14 rounded-[0.85rem]",
};

const tileIcon: Record<IconTileSize, string> = {
  sm: "h-[1.05rem] w-[1.05rem]",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

/** Rounded, tinted icon container — the recurring motif marking a dimension or
 *  feature. Pass colour via `className` (token utilities) or `style` (dimension
 *  accent: readable fg over a quiet tint). */
export function IconTile({
  icon: Icon,
  size = "md",
  className,
  style,
  strokeWidth = 2,
}: {
  icon: LucideIcon;
  size?: IconTileSize;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
}) {
  return (
    <span className={cn("grid shrink-0 place-items-center", tileSize[size], className)} style={style}>
      <Icon className={tileIcon[size]} strokeWidth={strokeWidth} />
    </span>
  );
}
