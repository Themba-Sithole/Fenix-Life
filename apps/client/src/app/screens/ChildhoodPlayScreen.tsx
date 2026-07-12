import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { useSave } from "@/context/SaveContext";
import { useSimulation } from "@/context/SimulationContext";
import {
  getAdolescenceSteps,
  getNextAdolescenceStep,
  lifePathLabel,
  parseWorldSeed,
} from "@fenix/domain";

export default function ChildhoodPlayScreen() {
  const navigate = useNavigate();
  const { activeSave } = useSave();
  const { world, isLoading, applyAction } = useSimulation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seed = useMemo(
    () => parseWorldSeed(activeSave?.worldSeed),
    [activeSave?.worldSeed],
  );

  const steps = useMemo(
    () => (world ? getAdolescenceSteps(world.lifePath) : []),
    [world],
  );

  const currentStep = useMemo(() => {
    if (!world) return null;
    return getNextAdolescenceStep(steps, world.onboarding.adolescenceChoices);
  }, [world, steps]);

  const completedCount = world
    ? Object.keys(world.onboarding.adolescenceChoices).length
    : 0;

  async function handleSkip() {
    setError(null);
    setBusy(true);
    try {
      await applyAction({ kind: "SKIP_ADOLESCENCE_PLAY" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not skip adolescence");
    } finally {
      setBusy(false);
    }
  }

  async function handleChoice(choiceId: string) {
    if (!currentStep) return;
    setError(null);
    setBusy(true);
    try {
      await applyAction({
        kind: "APPLY_ADOLESCENCE_CHOICE",
        stepId: currentStep.id,
        choiceId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record choice");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!activeSave) {
      navigate("/continue", { replace: true });
    }
  }, [activeSave, navigate]);

  useEffect(() => {
    if (world?.onboarding.adolescencePlayCompleted) {
      navigate("/childhood-summary", { replace: true });
    }
  }, [world?.onboarding.adolescencePlayCompleted, navigate]);

  useEffect(() => {
    if (world?.onboarding.childhoodSummarySeen) {
      navigate("/home", { replace: true });
    }
  }, [world?.onboarding.childhoodSummarySeen, navigate]);

  if (!activeSave) {
    return null;
  }

  if (world?.onboarding.adolescencePlayCompleted || world?.onboarding.childhoodSummarySeen) {
    return null;
  }

  if (isLoading || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1C2541]">
        Loading your teen years…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] p-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" onClick={() => navigate("/")} className="mb-6" disabled={busy}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <Card className="border-[#2EC4B6]/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#1C2541] to-[#0B132B] text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#2EC4B6]" />
              Ages 13–17
            </CardTitle>
            <p className="text-gray-300 text-sm">
              Four guided choices shape your adolescence before adulthood begins.
            </p>
            <p className="text-gray-400 text-xs">
              Suggested path: {lifePathLabel(seed.lifePath)} — hints only, never a lock
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress</span>
              <Badge variant="outline">
                {completedCount} / {steps.length} years decided
              </Badge>
            </div>

            {currentStep ? (
              <>
                <div className="rounded-lg border border-[#2EC4B6]/20 p-4 bg-white">
                  <p className="text-xs text-gray-500 mb-1">Age {currentStep.age}</p>
                  <h3 className="text-lg text-[#1C2541] font-medium mb-1">{currentStep.title}</h3>
                  <p className="text-sm text-gray-600">{currentStep.prompt}</p>
                </div>

                <div className="grid gap-3">
                  {currentStep.choices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      disabled={busy}
                      data-testid={`adolescence-choice-${choice.id}`}
                      onClick={() => handleChoice(choice.id)}
                      className="text-left rounded-lg border border-[#2EC4B6]/20 p-4 bg-white hover:bg-[#2EC4B6]/5 hover:border-[#2EC4B6]/40 transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[#1C2541] font-medium">{choice.label}</p>
                          <p className="text-sm text-gray-600 mt-1">{choice.description}</p>
                          <p className="text-xs text-[#2EC4B6] mt-2">{choice.effectHint}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600">Finishing up…</p>
            )}

            {error ? (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#2EC4B6]/20">
              <Button
                variant="outline"
                disabled={busy || completedCount > 0}
                onClick={handleSkip}
                data-testid="skip-adolescence-play"
                className="flex-1 border-[#F4B400] text-[#B8860B] hover:bg-[#F4B400]/10"
              >
                Skip to summary (suggested path)
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Skipping applies life-path defaults — you will review outcomes on the childhood summary screen.
            </p>

            {completedCount > 0 ? (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500 mb-2">Decisions so far</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {steps
                    .filter((step) => world.onboarding.adolescenceChoices[step.id])
                    .map((step) => {
                      const choiceId = world.onboarding.adolescenceChoices[step.id]!;
                      const choice = step.choices.find((item) => item.id === choiceId);
                      return (
                        <li key={step.id}>
                          Age {step.age}: {choice?.label ?? choiceId}
                        </li>
                      );
                    })}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
