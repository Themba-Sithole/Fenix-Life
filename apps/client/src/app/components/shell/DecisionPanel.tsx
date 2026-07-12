import type { ReactNode } from "react";
import { cn } from "../ui/utils";

interface DecisionPanelProps {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/** Primary action area — use instead of decorative card walls. */
export function DecisionPanel({ title, description, children, className }: DecisionPanelProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-home)] border border-border bg-surface-1 p-4 shadow-[var(--home-shadow)] sm:p-5",
        className,
      )}
    >
      <h2 className="font-display text-lg text-foreground">{title}</h2>
      {description ? (
        <p className="mt-1 mb-4 text-sm text-muted-foreground">{description}</p>
      ) : (
        <div className="mb-4" />
      )}
      {children}
    </section>
  );
}

interface MetricInlineProps {
  readonly metrics: ReadonlyArray<{
    readonly label: string;
    readonly value: string;
    readonly hint?: string;
  }>;
  readonly className?: string;
}

/** 1–3 numbers in a row without card chrome — tools only. */
export function MetricInline({ metrics, className }: MetricInlineProps) {
  const shown = metrics.slice(0, 3);
  return (
    <div
      className={cn(
        "flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-4 mb-6",
        className,
      )}
    >
      {shown.map((metric) => (
        <div key={metric.label} className="min-w-[7rem]">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
          <p className="mt-0.5 font-display text-xl text-foreground tabular-nums">{metric.value}</p>
          {metric.hint ? (
            <p className="text-xs text-muted-foreground mt-0.5">{metric.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
