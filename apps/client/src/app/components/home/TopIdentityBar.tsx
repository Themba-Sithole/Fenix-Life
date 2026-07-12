import { Pause, Play } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "../ui/utils";

interface TopIdentityBarProps {
  readonly initials: string;
  readonly name: string;
  readonly meta: string;
  readonly balanceValue: string;
  readonly balanceLabel?: string;
  readonly paused?: boolean;
  readonly onTogglePause?: () => void;
  readonly className?: string;
}

export function TopIdentityBar({
  initials,
  name,
  meta,
  balanceValue,
  balanceLabel = "Bank balance",
  paused,
  onTogglePause,
  className,
}: TopIdentityBarProps) {
  return (
    <header
      className={cn(
        "mb-3 flex items-center justify-between gap-2 rounded-[var(--radius-home)] border border-border bg-surface-1 px-3 py-2.5 sm:mb-3.5 sm:gap-3 sm:px-4 sm:py-3",
        "shadow-[var(--home-shadow)]",
        className,
      )}
      data-testid="home-identity-bar"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold text-[var(--home-fab-ink)] sm:h-10 sm:w-10 sm:text-base"
          style={{
            background: "linear-gradient(135deg, var(--home-avatar-from), var(--home-avatar-to))",
          }}
          aria-hidden
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-foreground sm:text-[15.5px]">
            {name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground sm:text-[11.5px]">{meta}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div className="text-right">
          <p className="font-mono text-xs font-medium tabular-nums text-foreground sm:text-[15px]">
            {balanceValue}
          </p>
          <p className="hidden text-[10.5px] text-muted-foreground min-[400px]:block">{balanceLabel}</p>
        </div>
        {onTogglePause ? (
          <button
            type="button"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-surface-2 text-foreground",
              "transition-colors hover:bg-muted",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
            aria-label={paused ? "Resume time" : "Pause time"}
            aria-pressed={paused}
            onClick={onTogglePause}
          >
            {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
          </button>
        ) : null}
        <ThemeToggle />
      </div>
    </header>
  );
}
