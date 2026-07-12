import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
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
  human: "bg-[#F4B400]/10 text-[#B8860B] border-[#F4B400]/30",
  social: "bg-[#1C2541]/10 text-[#1C2541] border-[#1C2541]/20",
  financial: "bg-[#2EC4B6]/10 text-[#2EC4B6] border-[#2EC4B6]/30",
  legacy: "bg-purple-50 text-purple-700 border-purple-200",
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
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1C2541]">
        Preparing your life story…
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
              Childhood Summary
            </CardTitle>
            <p className="text-gray-300 text-sm">{summary.headline}</p>
            <p className="text-gray-400 text-xs">
              Suggested path: {lifePathLabel(seed.lifePath)} — hints only, never a lock
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <p className="text-gray-600 text-sm">
              Your early years shaped affinities and relationships. You now enter young adulthood at age 18
              with no job, no company, and no owned assets — the same rules as every other citizen.
            </p>

            <div className="space-y-4">
              {summary.beats.map((beat) => (
                <div
                  key={`${beat.ageRange}-${beat.title}`}
                  className="rounded-lg border border-[#2EC4B6]/20 p-4 bg-white"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs text-gray-500">{beat.ageRange}</p>
                      <h4 className="text-[#1C2541] font-medium">{beat.title}</h4>
                    </div>
                    <Badge variant="outline" className={CAPITAL_COLORS[beat.capital] ?? ""}>
                      {beat.capital}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{beat.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500 mb-2">Background tradeoffs (not power)</p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                {summary.traitNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            {error ? (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#2EC4B6]/20">
              <Button
                onClick={() => handleContinue(false)}
                disabled={busy}
                data-testid="enter-adulthood"
                className="flex-1 bg-gradient-to-r from-[#2EC4B6] to-[#1C9B8F] hover:from-[#1C9B8F] hover:to-[#2EC4B6] text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {busy ? "Continuing…" : "Enter Adulthood"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleContinue(true)}
                disabled={busy}
                className="flex-1 border-[#F4B400] text-[#B8860B] hover:bg-[#F4B400]/10"
              >
                <FastForward className="w-4 h-4 mr-2" />
                Simulate First Year
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Simulate First Year advances 365 in-game days — a gentle intro to time controls.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
