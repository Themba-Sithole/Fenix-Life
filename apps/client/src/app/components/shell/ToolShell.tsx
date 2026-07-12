import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { LifeDock } from "./LifeDock";
import { MetricInline } from "./DecisionPanel";
import { cn } from "../ui/utils";

interface ToolShellProps {
  readonly institution: string;
  readonly subtitle?: string;
  readonly lastUpdated?: string;
  readonly metrics?: ReadonlyArray<{
    readonly label: string;
    readonly value: string;
    readonly hint?: string;
  }>;
  readonly children: ReactNode;
  readonly backTo?: string;
  readonly backLabel?: string;
  readonly showDock?: boolean;
  readonly className?: string;
  readonly contentClassName?: string;
}

/** Diegetic pro-tool frame: bank / company / broker. */
export function ToolShell({
  institution,
  subtitle,
  lastUpdated,
  metrics,
  children,
  backTo = "/home",
  backLabel = "Back to Life",
  showDock = true,
  className,
  contentClassName,
}: ToolShellProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("min-h-screen bg-tool-atmosphere texture-grain text-foreground", className)}>
      <header
        className={cn(
          "border-b border-border bg-primary text-primary-foreground",
          showDock && "md:pl-16",
        )}
      >
        <div className="mx-auto flex max-w-[var(--content-tool-max)] flex-wrap items-end justify-between gap-3 px-4 py-4">
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-2 mb-1 text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground"
              onClick={() => navigate(backTo)}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden />
              {backLabel}
            </Button>
            <h1 className="font-display text-2xl sm:text-3xl tracking-tight">{institution}</h1>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-primary-foreground/75">{subtitle}</p>
            ) : null}
          </div>
          {lastUpdated ? (
            <p className="text-xs text-primary-foreground/60">As of {lastUpdated}</p>
          ) : null}
        </div>
      </header>

      <div
        className={cn(
          "relative z-10 mx-auto max-w-[var(--content-tool-max)] px-4 py-5",
          showDock && "pb-[calc(var(--dock-height)+1.5rem)] md:pb-6 md:pl-20",
          contentClassName,
        )}
      >
        {metrics && metrics.length > 0 ? <MetricInline metrics={metrics} /> : null}
        {children}
      </div>

      {showDock ? <LifeDock /> : null}
    </div>
  );
}
