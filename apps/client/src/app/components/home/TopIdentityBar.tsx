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
        "mb-3.5 flex items-center justify-between gap-3 rounded-[var(--radius-home)] border border-border bg-surface-1 px-4 py-3",
        "shadow-[var(--home-shadow)]",
        className,
      )}
      data-testid="home-identity-bar"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold text-[var(--home-fab-ink)]"
          style={{
            background: "linear-gradient(135deg, var(--home-avatar-from), var(--home-avatar-to))",
          }}
          aria-hidden
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-[15.5px] font-semibold text-foreground">{name}</p>
          <p className="truncate text-[11.5px] text-muted-foreground">{meta}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right min-[360px]:block">
          <p className="font-mono text-[15px] font-medium tabular-nums text-foreground">{balanceValue}</p>
          <p className="text-[10.5px] text-muted-foreground">{balanceLabel}</p>
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
