import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant =
  | "primary"
  | "dark"
  | "coral"
  | "secondary"
  | "outline"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex select-none items-center justify-center gap-2 rounded-pill font-semibold whitespace-nowrap transition-[transform,background-color,box-shadow,color,border-color] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:border-transparent disabled:bg-ink-100 disabled:text-ink-400 disabled:shadow-none disabled:active:scale-100";

const variants: Record<ButtonVariant, string> = {
  // Confident primary action on light surfaces.
  primary:
    "bg-brand-600 text-white shadow-[0_14px_34px_-18px_rgba(226,62,107,0.5)] hover:bg-brand-700",
  // Neutral elevated surface.
  dark: "border border-ink-200 bg-surface text-ink-900 shadow-soft hover:border-ink-300 hover:bg-sand",
  coral:
    "bg-coral-500 text-white shadow-[0_14px_34px_-18px_rgba(220,96,79,0.46)] hover:bg-coral-600",
  // Translucent accent tint.
  secondary: "bg-brand-soft text-brand-700 ring-1 ring-inset ring-brand-500/20 hover:bg-brand-100",
  outline: "border border-ink-200 bg-transparent text-ink-800 hover:border-ink-300 hover:bg-sand",
  ghost: "text-ink-600 hover:bg-sand hover:text-ink-900",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[15px]",
  lg: "h-14 px-6 text-base",
};

/** Shared class string so links can be styled identically to buttons. */
function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  fullWidth = false,
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, fullWidth, className)} {...props}>
      {children}
    </button>
  );
}
