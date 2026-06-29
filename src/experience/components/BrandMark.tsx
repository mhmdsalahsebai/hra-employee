import { cn } from "../../lib/cn";

/** Small cura wordmark for the dark stage. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <img src="/cura.svg" alt="" className="h-[26px] w-auto" aria-hidden="true" />
      <span className="text-[19px] font-extrabold tracking-tight text-white">cura</span>
    </div>
  );
}
