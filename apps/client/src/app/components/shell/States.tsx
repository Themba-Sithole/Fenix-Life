import type { ReactNode } from "react";
import { cn } from "../ui/utils";

interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4",
        className,
      )}
      role="status"
    >
      <p className="font-display text-lg text-foreground">{title}</p>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

interface LoadingStateProps {
  readonly label?: string;
  readonly className?: string;
}

export function LoadingState({ label = "Loading…", className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "min-h-[40vh] flex items-center justify-center bg-life-atmosphere texture-grain text-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <p className="relative z-10 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

interface ErrorStateProps {
  readonly message: string;
  readonly onRetry?: () => void;
  readonly secondaryAction?: ReactNode;
  readonly className?: string;
}

export function ErrorState({
  message,
  onRetry,
  secondaryAction,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "min-h-[40vh] flex flex-col items-center justify-center gap-4 bg-life-atmosphere px-6 text-center",
        className,
      )}
      role="alert"
    >
      <p className="max-w-md text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        {message}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            Retry
          </button>
        ) : null}
        {secondaryAction}
      </div>
    </div>
  );
}
