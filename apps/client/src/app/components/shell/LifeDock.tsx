import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  Briefcase,
  Building2,
  Car,
  GraduationCap,
  Heart,
  Home,
  Map,
  MoreHorizontal,
  Newspaper,
  Settings,
  Smartphone,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { cn } from "../ui/utils";

const DOCK_ITEMS = [
  { label: "Home", icon: Home, path: "/home" },
  { label: "City", icon: Map, path: "/city" },
  { label: "Career", icon: Briefcase, path: "/career" },
  { label: "Phone", icon: Smartphone, path: "/phone" },
] as const;

const MORE_ITEMS = [
  { label: "Banking", icon: Building2, path: "/banking" },
  { label: "Company", icon: Briefcase, path: "/company" },
  { label: "Employees", icon: Users, path: "/employees" },
  { label: "Stocks", icon: TrendingUp, path: "/stocks" },
  { label: "Real Estate", icon: Home, path: "/real-estate" },
  { label: "Vehicles", icon: Car, path: "/vehicles" },
  { label: "Education", icon: GraduationCap, path: "/education" },
  { label: "Family", icon: Heart, path: "/family" },
  { label: "News", icon: Newspaper, path: "/news" },
  { label: "Timeline", icon: Trophy, path: "/timeline" },
  { label: "Settings", icon: Settings, path: "/settings" },
] as const;

const MORE_PATHS: ReadonlySet<string> = new Set(MORE_ITEMS.map((item) => item.path));

interface LifeDockProps {
  readonly className?: string;
}

export function LifeDock({ className }: LifeDockProps) {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MORE_PATHS.has(location.pathname);

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 inset-x-0 z-40 border-t border-border bg-surface-1/95 backdrop-blur-md",
          "pb-[env(safe-area-inset-bottom)]",
          "md:left-0 md:right-auto md:top-0 md:bottom-0 md:w-16 md:border-t-0 md:border-r md:pb-0",
          className,
        )}
        aria-label="Life destinations"
      >
        <ul className="flex h-[var(--dock-height)] items-stretch justify-around px-1 md:h-full md:flex-col md:justify-start md:gap-1 md:py-4 md:px-2">
          {DOCK_ITEMS.map((item) => (
            <li key={item.path} className="flex-1 md:flex-none">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex h-full flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[10px] font-medium transition-colors",
                    "md:h-12 md:w-full",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                    isActive
                      ? "text-secondary"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                <item.icon className="h-5 w-5" aria-hidden />
                <span className="md:sr-only">{item.label}</span>
                <span className="hidden md:sr-only">{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li className="flex-1 md:flex-none md:mt-auto">
            <button
              type="button"
              aria-label="More destinations"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(true)}
              className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[10px] font-medium transition-colors",
                "md:h-12",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                moreActive || moreOpen
                  ? "text-secondary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden />
              <span className="md:sr-only">More</span>
            </button>
          </li>
        </ul>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl md:side-left max-h-[70vh]">
          <SheetHeader>
            <SheetTitle className="font-display text-foreground">More</SheetTitle>
          </SheetHeader>
          <ul className="mt-4 grid gap-1 pb-6">
            {MORE_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                      active
                        ? "bg-secondary/15 text-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <item.icon
                      className={cn("h-4 w-4", active ? "text-secondary" : "text-muted-foreground")}
                      aria-hidden
                    />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
}

export { MORE_ITEMS };
