import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, readStoredTheme, toggleTheme, type FenixTheme } from "@/lib/theme";
import { cn } from "../ui/utils";

interface ThemeToggleProps {
  readonly className?: string;
}

/** Light/dark switch. Persists to `fenix-theme` and toggles `.dark` on `<html>`. Reusable for Settings. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<FenixTheme>(() =>
    typeof document === "undefined" ? "dark" : readStoredTheme(),
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-border bg-surface-2 text-foreground",
        "transition-colors hover:bg-muted",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle light / dark"
      onClick={() => setTheme((current) => toggleTheme(current))}
      data-testid="theme-toggle"
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4" aria-hidden />
      ) : (
        <Sun className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
