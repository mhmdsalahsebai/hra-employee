import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

/** A light, soft social sign-in row — gray rounded rectangle, icon + label. */
export function SocialLoginButton({
  icon,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: ReactNode; children: ReactNode }) {
  return (
    <button
      className={cn(
        "inline-flex h-[52px] w-full select-none items-center justify-center gap-2.5 rounded-[14px]",
        "border border-[#ececf1] bg-[#f5f6f8] text-[14.5px] font-semibold text-[#2a2e3a] transition-all duration-200",
        "hover:bg-[#eef0f3] active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      <span className="grid h-5 w-5 place-items-center">{icon}</span>
      {children}
    </button>
  );
}
