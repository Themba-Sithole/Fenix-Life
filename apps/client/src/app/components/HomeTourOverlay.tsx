import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
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
      className="fixed inset-x-0 bottom-0 z-50 p-4 pointer-events-none"
      data-testid="home-tour-overlay"
    >
      <Card className="max-w-2xl mx-auto border-[#2EC4B6]/30 shadow-2xl pointer-events-auto bg-white/95 backdrop-blur">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge variant="outline" className="mb-2">
                Guided tour · {progressLabel}
              </Badge>
              <h3 className="text-lg text-[#1C2541] font-medium">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              <p className="text-xs text-[#2EC4B6] mt-2">{step.teachingMoment}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {needsNavigation && !isAdvanceStep ? (
              <Button
                className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                onClick={handleOpenTarget}
                data-testid="home-tour-open-target"
              >
                Open {step.targetPath.replace("/", "")}
              </Button>
            ) : null}
            {isAdvanceStep && !onHome ? (
              <Button variant="outline" onClick={() => navigate("/home")}>
                Back to Home
              </Button>
            ) : null}
            {!needsNavigation || isAdvanceStep ? (
              <Button
                className="bg-[#1C2541] hover:bg-[#0B132B] text-white"
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
            <p className="text-xs text-gray-500">
              Tap <strong>Advance 1 Day</strong> on Home to continue the tour.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
