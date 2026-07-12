import { cn } from "../ui/utils";

interface FenixLogoProps {
  readonly className?: string;
  readonly variant?: "mark" | "wordmark" | "stacked";
  readonly tone?: "light" | "dark";
}

export function FenixLogo({
  className,
  variant = "stacked",
  tone = "dark",
}: FenixLogoProps) {
  const ink = tone === "light" ? "text-white" : "text-fenix-navy";
  const muted = tone === "light" ? "text-white/70" : "text-muted-foreground";

  if (variant === "mark") {
    return (
      <img
        src="/fenix-mark.svg"
        alt="Fenix Life"
        className={cn("h-10 w-10", className)}
        width={40}
        height={40}
      />
    );
  }

  if (variant === "wordmark") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <img src="/fenix-mark.svg" alt="" className="h-9 w-9" width={36} height={36} />
        <span className={cn("font-display text-2xl tracking-[0.08em] font-semibold", ink)}>
          FENIX LIFE
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center text-center gap-3", className)}>
      <img src="/fenix-mark.svg" alt="" className="h-14 w-14" width={56} height={56} />
      <div>
        <p className={cn("font-display text-4xl sm:text-5xl tracking-[0.1em] font-semibold", ink)}>
          FENIX LIFE
        </p>
        <p className={cn("mt-1 text-sm tracking-wide", muted)}>Live your legacy</p>
      </div>
    </div>
  );
}
