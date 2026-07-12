import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Calendar, FastForward, Sparkles } from "lucide-react";
import { useSave } from "@/context/SaveContext";
import { useSimulation } from "@/context/SimulationContext";
import {
  buildChildhoodSummary,
  lifePathLabel,
  parseWorldSeed,
} from "@fenix/domain";

const CAPITAL_COLORS: Record<string, string> = {
  human: "bg-fenix-gold/10 text-fenix-navy border-fenix-gold/30",
  social: "bg-fenix-blue/10 text-fenix-navy border-fenix-blue/20",
  financial: "bg-fenix-emerald/10 text-fenix-navy border-fenix-emerald/30",
  legacy: "bg-fenix-navy/10 text-fenix-navy border-fenix-navy/20",
};

export default function ChildhoodSummaryScreen() {
  const navigate = useNavigate();
  const { activeSave } = useSave();
  const { world, isLoading, completeChildhoodOnboarding } = useSimulation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seed = useMemo(
    () => parseWorldSeed(activeSave?.worldSeed),
    [activeSave?.worldSeed],
  );

  const summary = useMemo(
    () =>
      buildChildhoodSummary({
        background: seed.background,
        lifePath: seed.lifePath,
        playerName: activeSave?.name ?? world?.player.displayName ?? "Citizen",
        adolescenceChoices: world?.onboarding.adolescenceChoices,
      }),
    [
      seed.background,
      seed.lifePath,
      activeSave?.name,
      world?.player.displayName,
      world?.onboarding.adolescenceChoices,
    ],
  );

  async function handleContinue(simulateFirstYear: boolean) {
    setError(null);
    setBusy(true);
    try {
      await completeChildhoodOnboarding(simulateFirstYear);
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue");
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
    if (world && !world.onboarding.adolescencePlayCompleted) {
      navigate("/childhood-play", { replace: true });
    }
  }, [world?.onboarding.adolescencePlayCompleted, navigate, world]);

  useEffect(() => {
    if (world?.onboarding.childhoodSummarySeen) {
      navigate("/home", { replace: true });
    }
  }, [world?.onboarding.childhoodSummarySeen, navigate]);

  if (!activeSave) {
    return null;
  }

  if (world?.onboarding.childhoodSummarySeen) {
    return null;
  }

  if (isLoading || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-life-atmosphere text-foreground">
        Preparing your life story…
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
            <p className="text-xs font-medium tracking-[0.16em] text-fenix-gold">YOUR FIRST CHAPTER</p>
            <h1 className="mt-2 flex items-center gap-2 font-display text-3xl text-fenix-navy">
              <Sparkles className="w-6 h-6 text-fenix-emerald" />
              Childhood Summary
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{summary.headline}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Suggested path: {lifePathLabel(seed.lifePath)} — hints only, never a lock
            </p>
          </header>
          <div className="mt-8 space-y-6">
            <p className="text-sm text-muted-foreground">
              Your early years shaped affinities and relationships. You now enter young adulthood at age 18
              with no job, no company, and no owned assets — the same rules as every other citizen.
            </p>

            <div className="space-y-4">
              {summary.beats.map((beat) => (
                <div
                  key={`${beat.ageRange}-${beat.title}`}
                  className="border-l-2 border-fenix-emerald bg-surface-1 px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground">{beat.ageRange}</p>
                      <h4 className="font-medium text-fenix-navy">{beat.title}</h4>
                    </div>
                    <Badge variant="outline" className={CAPITAL_COLORS[beat.capital] ?? ""}>
                      {beat.capital}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{beat.description}</p>
                </div>
              ))}
            </div>

            <div className="border-l-2 border-fenix-gold bg-fenix-gold/5 px-5 py-4">
              <p className="mb-2 text-xs text-muted-foreground">Background tradeoffs (not power)</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {summary.traitNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            {error ? (
              <p role="alert" className="border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row">
              <Button
                onClick={() => handleContinue(false)}
                disabled={busy}
                data-testid="enter-adulthood"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {busy ? "Continuing…" : "Enter Adulthood"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleContinue(true)}
                disabled={busy}
                className="flex-1 border-fenix-gold text-fenix-navy hover:bg-fenix-gold/10"
              >
                <FastForward className="w-4 h-4 mr-2" />
                Simulate First Year
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Simulate First Year advances 365 in-game days — a gentle intro to time controls.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
