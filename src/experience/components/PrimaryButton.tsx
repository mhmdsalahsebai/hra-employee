import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

/**
 * The experience's primary action — strong blue, fully rounded, bold white
 * label, full width by default. Presses down softly and can show an inline
 * loading spinner while a transition is in flight.
 */
export function PrimaryButton({
  children,
  loading = false,
  fullWidth = true,
  className,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      className={cn(
        "relative inline-flex h-[56px] select-none items-center justify-center gap-2 rounded-[16px] px-6 text-[16px] font-bold transition-all duration-200",
        fullWidth && "w-full",
        isDisabled
          ? "cursor-not-allowed bg-[#e6e8ef] text-[#9aa0ae] shadow-none"
          : "bg-[#0057ff] text-white shadow-[0_16px_40px_-12px_rgba(0,87,255,0.6)] hover:bg-[#0049db] active:scale-[0.97]",
        className,
      )}
      {...props}
    >
      {loading && (
        <span
          className="exp-spin h-[18px] w-[18px] rounded-full border-[2.5px] border-white/35 border-t-white"
          aria-hidden="true"
        />
      )}
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-90")}>{children}</span>
    </button>
  );
}
