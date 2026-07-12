import { cn } from "../ui/utils";

interface DayAdvanceFabProps {
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly busy?: boolean;
  readonly className?: string;
}

/** Floating advance-day control — wraps SimulationContext.advanceDay via parent handler. */
export function DayAdvanceFab({ onClick, disabled, busy, className }: DayAdvanceFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      data-testid="advance-day"
      aria-label={busy ? "Advancing day" : "Advance one day"}
      className={cn(
        "fixed z-50 flex h-16 w-16 flex-col items-center justify-center rounded-full",
        "border-4 border-[var(--background)] font-bold text-[10.5px] text-[var(--home-fab-ink)]",
        "shadow-[0_8px_20px_color-mix(in_srgb,var(--home-fab-from)_35%,transparent)]",
        "bottom-[calc(var(--dock-height)+0.85rem)] right-4",
        "md:bottom-6 md:right-6",
        "transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      style={{
        background: "linear-gradient(135deg, var(--home-fab-from), var(--home-fab-to))",
      }}
    >
      <span className="text-base leading-none" aria-hidden>
        +
      </span>
      <span>{busy ? "…" : "DAY"}</span>
    </button>
  );
}
