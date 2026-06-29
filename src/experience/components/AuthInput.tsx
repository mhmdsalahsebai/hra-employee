import { type InputHTMLAttributes, type ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * A clean, soft-bordered auth field with a label and optional leading icon.
 * When `type="password"` it grows its own show/hide eye toggle.
 */
export function AuthInput({
  label,
  icon,
  type = "text",
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  icon?: ReactNode;
  type?: string;
}) {
  const isPassword = type === "password";
  const [reveal, setReveal] = useState(false);
  const resolvedType = isPassword ? (reveal ? "text" : "password") : type;

  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-[#5b6170]">{label}</span>
      <span className="relative block">
        {icon && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#aab0be]">
            {icon}
          </span>
        )}
        <input
          type={resolvedType}
          className={cn(
            "h-[54px] w-full rounded-[14px] border border-[#e6e8ef] bg-[#fafafa] text-[15px] font-medium text-[#10121a] outline-none transition",
            "placeholder:text-[#aab0be] focus:border-[#0057ff] focus:bg-white focus:ring-4 focus:ring-[#0057ff]/10",
            icon ? "pr-12" : "pr-4",
            isPassword ? "pl-12" : "pl-4",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-[#8b91a0] transition hover:bg-[#f0f1f5] hover:text-[#5b6170]"
          >
            {reveal ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        )}
      </span>
    </label>
  );
}
