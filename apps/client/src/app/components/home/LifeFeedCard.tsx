import type { ReactNode } from "react";
import { cn } from "../ui/utils";

export type FeedCapitalTag = "human" | "social" | "financial" | "business" | "legacy";

export interface LifeFeedAction {
  readonly label: string;
  readonly onClick: () => void;
  readonly variant?: "primary" | "ghost";
}

interface LifeFeedCardProps {
  readonly headline: string;
  readonly detail: string;
  readonly whenLabel: string;
  readonly icon: ReactNode;
  readonly capitalTag?: FeedCapitalTag;
  readonly crisis?: boolean;
  readonly actions?: readonly LifeFeedAction[];
  readonly className?: string;
}

const TAG_LABEL: Record<FeedCapitalTag, string> = {
  human: "HUMAN",
  social: "SOCIAL",
  financial: "FINANCIAL",
  business: "BUSINESS",
  legacy: "LEGACY",
};

export function LifeFeedCard({
  headline,
  detail,
  whenLabel,
  icon,
  capitalTag,
  crisis = false,
  actions = [],
  className,
}: LifeFeedCardProps) {
  const shownActions = actions.slice(0, 1);

  return (
    <article
      className={cn(
        "flex gap-2.5 rounded-[var(--radius-home)] border border-border bg-surface-1 p-3.5 shadow-[var(--home-shadow)]",
        crisis && "border-destructive/40",
        className,
      )}
    >
      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-surface-2 text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-[13.5px] font-semibold text-foreground">{headline}</h3>
          <time className="shrink-0 font-mono text-[10px] uppercase text-muted-foreground">
            {whenLabel}
          </time>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{detail}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          {capitalTag ? (
            <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9.5px] tracking-wide text-muted-foreground">
              {TAG_LABEL[capitalTag]}
            </span>
          ) : (
            <span />
          )}
          {shownActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[11.5px] font-semibold transition-opacity hover:opacity-90",
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
      </div>
    </article>
  );
}
