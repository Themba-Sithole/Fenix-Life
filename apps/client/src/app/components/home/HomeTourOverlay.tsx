import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { HOME_TOUR_STEPS } from "@fenix/domain";
import { useSave } from "@/context/SaveContext";
import { useSimulation } from "@/context/SimulationContext";

export function HomeTourOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeSave } = useSave();
  const { world, tickCount, dismissHomeTour } = useSimulation();
  const [stepIndex, setStepIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const advanceBaselineRef = useRef<number | null>(null);

  const visible = Boolean(
    activeSave &&
      world &&
      world.onboarding.childhoodSummarySeen &&
      !world.onboarding.homeTourCompleted,
  );

  const step = HOME_TOUR_STEPS[stepIndex];

  useEffect(() => {
    if (!visible || !step?.targetPath) {
      return;
    }
    if (location.pathname === step.targetPath) {
      setStepIndex((current) => Math.min(current + 1, HOME_TOUR_STEPS.length - 1));
    }
  }, [location.pathname, step?.targetPath, visible]);

  useEffect(() => {
    if (!visible || step?.id !== "advance-time") {
      advanceBaselineRef.current = null;
      return;
    }
    if (advanceBaselineRef.current === null) {
      advanceBaselineRef.current = tickCount;
      return;
    }
    if (tickCount > advanceBaselineRef.current) {
      setStepIndex((current) => Math.min(current + 1, HOME_TOUR_STEPS.length - 1));
      advanceBaselineRef.current = null;
    }
  }, [tickCount, step?.id, visible]);

  const progressLabel = useMemo(
    () => `${stepIndex + 1} / ${HOME_TOUR_STEPS.length}`,
    [stepIndex],
  );

  async function finishTour() {
    setBusy(true);
    try {
      await dismissHomeTour();
    } finally {
      setBusy(false);
    }
  }

  async function handleNext() {
    if (stepIndex >= HOME_TOUR_STEPS.length - 1) {
      await finishTour();
      return;
    }
    setStepIndex((current) => current + 1);
  }

  function handleOpenTarget() {
    if (!step?.targetPath) {
      return;
    }
    navigate(step.targetPath);
  }

  if (!visible || !step) {
    return null;
  }

  const onHome = location.pathname === "/home";
  const needsNavigation = Boolean(step.targetPath);
  const isAdvanceStep = step.id === "advance-time";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-4 pb-[calc(var(--dock-height)+1rem)] md:pb-4"
      data-testid="home-tour-overlay"
    >
      <Card className="pointer-events-auto mx-auto max-w-2xl border-accent/30 bg-surface-1/95 shadow-[var(--home-shadow)] backdrop-blur">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge variant="outline" className="mb-2">
                Guided tour · {progressLabel}
              </Badge>
              <h3 className="font-display text-lg font-medium text-foreground">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              <p className="mt-2 text-xs text-accent">{step.teachingMoment}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {needsNavigation && !isAdvanceStep ? (
              <Button
                className="bg-accent text-accent-foreground hover:opacity-90"
                onClick={handleOpenTarget}
                data-testid="home-tour-open-target"
              >
                Open {(step.targetPath ?? "").replace("/", "")}
              </Button>
            ) : null}
            {isAdvanceStep && !onHome ? (
              <Button variant="outline" onClick={() => navigate("/home")}>
                Back to Home
              </Button>
            ) : null}
            {!needsNavigation || isAdvanceStep ? (
              <Button
                className="bg-secondary text-secondary-foreground hover:opacity-90"
                onClick={handleNext}
                disabled={busy || (isAdvanceStep && tickCount === advanceBaselineRef.current && onHome)}
                data-testid="home-tour-next"
              >
                {stepIndex >= HOME_TOUR_STEPS.length - 1 ? "Finish tour" : "Next"}
              </Button>
            ) : null}
            <Button variant="ghost" onClick={finishTour} disabled={busy} data-testid="home-tour-skip">
              Skip tour
            </Button>
          </div>
          {isAdvanceStep && onHome ? (
            <p className="text-xs text-muted-foreground">
              Tap the gold <strong className="text-foreground">+ DAY</strong> button on Home to continue
              the tour.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
