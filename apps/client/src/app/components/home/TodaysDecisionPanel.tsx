import { cn } from "../ui/utils";

export interface DecisionMetric {
  readonly label: string;
  readonly value: string;
  readonly tone?: "default" | "positive" | "danger";
}

export interface DecisionAction {
  readonly label: string;
  readonly onClick: () => void;
  readonly variant?: "primary" | "ghost";
  readonly disabled?: boolean;
}

interface TodaysDecisionPanelProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly metrics?: readonly DecisionMetric[];
  readonly actions?: readonly DecisionAction[];
  readonly empty?: boolean;
  readonly emptyTitle?: string;
  readonly emptySubtitle?: string;
  readonly className?: string;
}

export function TodaysDecisionPanel({
  title,
  subtitle,
  metrics = [],
  actions = [],
  empty = false,
  emptyTitle = "Nothing urgent today",
  emptySubtitle = "Advance the day when you're ready — your life will surface the next decision.",
  className,
}: TodaysDecisionPanelProps) {
  const shownMetrics = metrics.slice(0, 3);
  const shownActions = actions.slice(0, 2);

  return (
    <section
      className={cn(
        "rounded-[var(--radius-home)] border border-border bg-surface-1 p-4 shadow-[var(--home-shadow)]",
        className,
      )}
      aria-label="Today's decision"
      data-testid="todays-decision-panel"
    >
      {empty ? (
        <>
          <h3 className="font-display text-[15px] font-semibold text-foreground">{emptyTitle}</h3>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{emptySubtitle}</p>
        </>
      ) : (
        <>
          <h3 className="font-display text-[15px] font-semibold text-foreground">{title}</h3>
          {subtitle ? (
            <p className="mt-1 mb-3 text-[11.5px] leading-relaxed text-muted-foreground">{subtitle}</p>
          ) : (
            <div className="mb-3" />
          )}
          <ul>
            {shownMetrics.map((metric, index) => (
              <li
                key={metric.label}
                className={cn(
                  "flex items-center justify-between gap-3 py-1.5 text-xs",
                  index < shownMetrics.length - 1 && "border-b border-dashed border-border",
                )}
              >
                <span className="text-muted-foreground">{metric.label}</span>
                <b
                  className={cn(
                    "font-mono font-medium tabular-nums",
                    metric.tone === "positive" && "text-[var(--status-success)]",
                    metric.tone === "danger" && "text-[var(--status-danger)]",
                    (!metric.tone || metric.tone === "default") && "text-foreground",
                  )}
                >
                  {metric.value}
                </b>
              </li>
            ))}
          </ul>
          {shownActions.length > 0 ? (
            <div className="mt-3 flex gap-2">
              {shownActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  disabled={action.disabled}
                  onClick={action.onClick}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-1.5 text-[11.5px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    action.variant === "ghost"
                      ? "border border-border bg-transparent text-foreground"
                      : "bg-accent text-accent-foreground",
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
