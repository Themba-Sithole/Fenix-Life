import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

interface ScreenHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly backTo?: string;
  readonly backLabel?: string;
  readonly status?: ReactNode;
  readonly className?: string;
  readonly onBack?: () => void;
}

export function ScreenHeader({
  title,
  subtitle,
  backTo = "/home",
  backLabel = "Back",
  status,
  className,
  onBack,
}: ScreenHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={cn("flex flex-wrap items-start justify-between gap-3 mb-6", className)}>
      <div className="min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 mb-1 text-muted-foreground hover:text-foreground"
          onClick={() => (onBack ? onBack() : navigate(backTo))}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden />
          {backLabel}
        </Button>
        <h1 className="font-display text-2xl sm:text-3xl text-foreground tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {status ? <div className="text-sm text-muted-foreground shrink-0">{status}</div> : null}
    </header>
  );
}
