import type { ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "../ui/button";
import { LifeDock } from "./LifeDock";
import { cn } from "../ui/utils";

interface LifeShellProps {
  readonly children: ReactNode;
  readonly playerName?: string;
  readonly ageYears?: number;
  readonly dateLabel?: string;
  readonly paused?: boolean;
  readonly statusLine?: string;
  readonly onTogglePause?: () => void;
  readonly showDock?: boolean;
  /** When false, skips the sticky identity strip (e.g. Home uses TopIdentityBar). */
  readonly showIdentity?: boolean;
  readonly className?: string;
  readonly contentClassName?: string;
}

/** Ambient life surface: identity strip + bottom dock. */
export function LifeShell({
  children,
  playerName,
  ageYears,
  dateLabel,
  paused,
  statusLine,
  onTogglePause,
  showDock = true,
  showIdentity: showIdentityProp,
  className,
  contentClassName,
}: LifeShellProps) {
  const showIdentity =
    showIdentityProp ?? Boolean(playerName || dateLabel || statusLine);

  return (
    <div className={cn("min-h-screen bg-life-atmosphere texture-grain text-foreground", className)}>
      {showIdentity ? (
        <div
          className={cn(
            "sticky top-0 z-30 border-b border-border bg-primary text-primary-foreground",
            "md:pl-16",
          )}
        >
          <div className="mx-auto flex h-[var(--identity-height)] max-w-[var(--content-max)] items-center justify-between gap-3 px-4">
            <div className="min-w-0">
              <p className="truncate font-display text-base tracking-tight">
                {playerName}
                {typeof ageYears === "number" ? (
                  <span className="font-ui text-sm opacity-80"> · Age {ageYears}</span>
                ) : null}
              </p>
              <p className="truncate text-xs opacity-75">
                {[dateLabel, statusLine, paused ? "Paused" : null].filter(Boolean).join(" · ")}
              </p>
            </div>
            {onTogglePause ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-primary-foreground hover:bg-white/10"
                aria-label={paused ? "Resume time" : "Pause time"}
                onClick={onTogglePause}
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "relative z-10 mx-auto max-w-[var(--content-max)] px-4 py-5",
          showDock && "pb-[calc(var(--dock-height)+1.5rem)] md:pb-6 md:pl-20",
          contentClassName,
        )}
      >
        {children}
      </div>

      {showDock ? <LifeDock /> : null}
    </div>
  );
}
