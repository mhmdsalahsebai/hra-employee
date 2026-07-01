import { NavLink } from "react-router-dom";
import { BookOpen, House, Route as RouteIcon, ScrollText, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/cn";
import { haptic } from "../motion/haptics";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const items: NavItem[] = [
  { to: "/", label: "الرئيسية", icon: House },
  { to: "/report", label: "تقريري", icon: ScrollText },
  { to: "/plan", label: "خطتي", icon: RouteIcon },
  { to: "/content", label: "المحتوى", icon: BookOpen },
  { to: "/profile", label: "حسابي", icon: User },
];

/** Native-app tab bar: the active "pill" glides between tabs with a shared
 *  layout animation, and each tap springs down for a tactile press. */
export function BottomNav() {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      {/* Fade the content out behind the floating bar. */}
      <div className="h-8 bg-gradient-to-t from-canvas to-transparent" />
      <div className="mx-auto max-w-[480px] px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto flex items-center justify-between rounded-[1.5rem] border border-ink-100 bg-surface/85 px-2.5 py-2 shadow-card backdrop-blur-xl">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => haptic("select")}
              className="flex flex-1 flex-col items-center gap-1 py-0.5"
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    whileTap={{ scale: 0.86 }}
                    transition={{ type: "spring", stiffness: 600, damping: 28 }}
                    className="relative grid h-9 w-9 place-items-center rounded-[0.85rem]"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navActivePill"
                        transition={{ type: "spring", stiffness: 520, damping: 40 }}
                        className="absolute inset-0 rounded-[0.85rem] bg-brand-600 shadow-soft"
                      />
                    )}
                    <Icon
                      className={cn(
                        "relative h-[1.2rem] w-[1.2rem] transition-colors duration-200",
                        isActive ? "text-white" : "text-ink-400",
                      )}
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                  </motion.span>
                  <span
                    className={cn(
                      "text-[10px] transition-colors",
                      isActive ? "font-bold text-ink-900" : "font-semibold text-ink-400",
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
