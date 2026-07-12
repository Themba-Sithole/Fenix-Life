import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { cn } from "../ui/utils";

export interface QuickDestinationItem {
  readonly path: string;
  readonly title: string;
  readonly subtitle: string;
  readonly metric: string;
  readonly icon: LucideIcon;
}

interface QuickDestinationRowProps {
  readonly item: QuickDestinationItem;
  readonly className?: string;
}

export function QuickDestinationRow({ item, className }: QuickDestinationRowProps) {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center gap-2.5 border-b border-border px-3 py-2.5 last:border-b-0 sm:gap-3 sm:px-3.5 sm:py-3",
        "transition-colors hover:bg-surface-2",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
        className,
      )}
    >
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-surface-2 text-secondary">
        <Icon className="h-[17px] w-[17px]" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold text-foreground">{item.title}</span>
        <span className="mt-px block truncate text-[11.5px] text-muted-foreground">{item.subtitle}</span>
      </span>
      <span className="shrink-0 font-mono text-[11.5px] tabular-nums text-muted-foreground">
        {item.metric}
      </span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
    </Link>
  );
}

interface QuickDestinationListProps {
  readonly items: readonly QuickDestinationItem[];
  readonly className?: string;
}

export function QuickDestinationList({ items, className }: QuickDestinationListProps) {
  return (
    <nav
      className={cn(
        "mb-4 overflow-hidden rounded-[var(--radius-home)] border border-border bg-surface-1 shadow-[var(--home-shadow)]",
        className,
      )}
      aria-label="Quick destinations"
      data-testid="home-quick-actions"
    >
      <ul>
        {items.map((item) => (
          <li key={item.path}>
            <QuickDestinationRow item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
