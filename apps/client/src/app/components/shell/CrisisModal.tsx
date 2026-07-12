import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { fadeUp, motionDurations, preferReducedMotion } from "./motion";

interface CrisisModalProps {
  readonly open: boolean;
  readonly title: string;
  readonly message: string;
  readonly severity?: "hard" | "soft";
  readonly primaryLabel?: string;
  readonly onPrimary?: () => void;
  readonly secondaryLabel?: string;
  readonly onSecondary?: () => void;
  readonly onDismiss?: () => void;
  readonly children?: ReactNode;
  readonly className?: string;
}

/** BitLife-style blocking popup for life gates / crises. */
export function CrisisModal({
  open,
  title,
  message,
  severity = "hard",
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onDismiss,
  children,
  className,
}: CrisisModalProps) {
  const reduce = preferReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="crisis-title"
          aria-describedby="crisis-message"
        >
          <motion.div
            className="absolute inset-0 bg-fenix-navy/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : motionDurations.fast }}
            onClick={severity === "soft" ? onDismiss : undefined}
          />
          <motion.div
            className={cn(
              "relative z-10 w-full max-w-md rounded-xl border bg-surface-1 p-5 shadow-lg",
              severity === "hard"
                ? "border-status-danger/40"
                : "border-status-warn/50",
              className,
            )}
            initial={reduce ? { opacity: 0 } : fadeUp.initial}
            animate={reduce ? { opacity: 1 } : fadeUp.animate}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: reduce ? 0.01 : motionDurations.base }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={cn(
                  "w-6 h-6 shrink-0 mt-0.5",
                  severity === "hard" ? "text-destructive" : "text-accent",
                )}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <h2 id="crisis-title" className="font-display text-xl text-foreground">
                  {title}
                </h2>
                <p id="crisis-message" className="mt-2 text-sm text-muted-foreground">
                  {message}
                </p>
                {children}
                <div className="mt-5 flex flex-wrap gap-2">
                  {primaryLabel && onPrimary ? (
                    <Button
                      type="button"
                      className="bg-primary text-primary-foreground hover:opacity-90"
                      onClick={onPrimary}
                    >
                      {primaryLabel}
                    </Button>
                  ) : null}
                  {secondaryLabel && onSecondary ? (
                    <Button type="button" variant="outline" onClick={onSecondary}>
                      {secondaryLabel}
                    </Button>
                  ) : null}
                </div>
              </div>
              {onDismiss && severity === "soft" ? (
                <button
                  type="button"
                  className="rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label="Dismiss"
                  onClick={onDismiss}
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
