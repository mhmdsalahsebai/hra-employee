import { cn } from "../../lib/cn";

function initials(name: string): string {
  // Skip honorifics like "د." / "أ." so the initials are the actual name.
  const parts = name
    .trim()
    .replace(/[.]/g, "")
    .split(/\s+/)
    .filter((p) => p.length > 1);
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

/** Circular avatar with a quiet brand tint + initials fallback. */
export function Avatar({
  name,
  src,
  size = 44,
  className,
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full bg-brand-100 font-bold text-brand-800 ring-1 ring-inset ring-brand-900/10",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="pt-px">{initials(name)}</span>
      )}
    </div>
  );
}
