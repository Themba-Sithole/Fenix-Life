import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
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
      <div className="min-h-screen flex items-center justify-center bg-life-atmosphere text-foreground">
        Loading your teen years…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-life-atmosphere px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" onClick={() => navigate("/")} className="mb-6" disabled={busy}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <section className="border-y border-border py-8">
          <header>
            <p className="text-xs font-medium tracking-[0.16em] text-fenix-gold">FORMATIVE YEARS</p>
            <h1 className="mt-2 flex items-center gap-2 font-display text-3xl text-fenix-navy">
              <Sparkles className="h-6 w-6 text-fenix-emerald" />
              Ages 13–17
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Four guided choices shape your adolescence before adulthood begins.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Suggested path: {lifePathLabel(seed.lifePath)} — hints only, never a lock
            </p>
          </header>
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <Badge variant="outline">
                {completedCount} / {steps.length} years decided
              </Badge>
            </div>

            {currentStep ? (
              <>
                <div className="border-l-2 border-fenix-gold bg-surface-1 px-5 py-4">
                  <p className="mb-1 text-xs text-muted-foreground">Age {currentStep.age}</p>
                  <h2 className="mb-1 font-display text-xl text-fenix-navy">{currentStep.title}</h2>
                  <p className="text-sm text-muted-foreground">{currentStep.prompt}</p>
                </div>

                <div className="grid gap-3">
                  {currentStep.choices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      disabled={busy}
                      data-testid={`adolescence-choice-${choice.id}`}
                      onClick={() => handleChoice(choice.id)}
                      className="group min-h-28 border border-border bg-surface-1 p-5 text-left transition-colors hover:border-fenix-emerald hover:bg-fenix-emerald/5 disabled:opacity-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-fenix-navy">{choice.label}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{choice.description}</p>
                          <p className="mt-3 text-xs text-fenix-emerald">{choice.effectHint}</p>
                        </div>
                        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Finishing up…</p>
            )}

            {error ? (
              <p role="alert" className="border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-border pt-2 sm:flex-row">
              <Button
                variant="outline"
                disabled={busy || completedCount > 0}
                onClick={handleSkip}
                data-testid="skip-adolescence-play"
                className="flex-1 border-fenix-gold text-fenix-navy hover:bg-fenix-gold/10"
              >
                Skip to summary (suggested path)
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Skipping applies life-path defaults — you will review outcomes on the childhood summary screen.
            </p>

            {completedCount > 0 ? (
              <div className="border-l-2 border-fenix-emerald bg-fenix-emerald/5 px-5 py-4">
                <p className="mb-2 text-xs text-muted-foreground">Decisions so far</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
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
          </div>
        </section>
      </div>
    </main>
  );
}
