import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  ArrowLeft,
  Building2,
  Coffee,
  Factory,
  GraduationCap,
  Home,
  Hospital,
  Plane,
  ShoppingBag,
} from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import { buildCityDistricts, cyclePhaseLabel, formatOriginLocation } from "@fenix/domain";

const DISTRICT_ICONS = {
  downtown: Building2,
  university: GraduationCap,
  hospital: Hospital,
  mall: ShoppingBag,
  airport: Plane,
  cafe: Coffee,
  tech: Factory,
  residential: Home,
} as const;

const DISTRICT_COLORS: Record<string, string> = {
  downtown: "bg-[#1C2541]",
  university: "bg-[#2EC4B6]",
  hospital: "bg-red-400",
  mall: "bg-[#F4B400]",
  airport: "bg-blue-400",
  cafe: "bg-amber-600",
  tech: "bg-[#2EC4B6]",
  residential: "bg-green-500",
};

export default function CityMap() {
  const navigate = useNavigate();
  const { world, isLoading, applyAction } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyDistrict, setBusyDistrict] = useState<string | null>(null);

  const districts = useMemo(() => (world ? buildCityDistricts(world) : []), [world]);

  async function handleVisit(districtId: string) {
    setActionError(null);
    setBusyDistrict(districtId);
    try {
      await applyAction({ kind: "VISIT_DISTRICT", districtId });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Visit failed.");
    } finally {
      setBusyDistrict(null);
    }
  }

  const simulationGate = useSimulationGate("Loading city map…", "bg-sky-100");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-emerald-100 to-blue-200 p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="outline" onClick={() => navigate("/home")} className="mb-6 bg-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back Home
        </Button>

        <Card className="border-[#2EC4B6]/20 shadow-xl mb-6">
          <CardContent className="p-6">
            <h1 className="text-3xl text-[#1C2541] mb-2">Fenix City</h1>
            <p className="text-gray-600">
              {formatOriginLocation(world.origin)} · {cyclePhaseLabel(world.economy.cyclePhase)} · Tech {world.economy.techSectorIndex.toFixed(1)}
            </p>
          </CardContent>
        </Card>

        {actionError ? (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {districts.map((district) => {
            const Icon = DISTRICT_ICONS[district.id as keyof typeof DISTRICT_ICONS] ?? Building2;
            const color = DISTRICT_COLORS[district.id] ?? "bg-[#1C2541]";

            return (
              <Card key={district.id} className="border-[#2EC4B6]/20 shadow-lg overflow-hidden">
                {district.route ? (
                  <button
                    type="button"
                    onClick={() => navigate(district.route!)}
                    className={`${color} w-full p-6 text-white text-left hover:opacity-90 transition-all`}
                  >
                    <Icon className="w-10 h-10 mb-3" />
                    <div className="font-semibold">{district.name}</div>
                  </button>
                ) : (
                  <div className={`${color} w-full p-6 text-white text-left`}>
                    <Icon className="w-10 h-10 mb-3" />
                    <div className="font-semibold">{district.name}</div>
                  </div>
                )}
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm text-gray-600">{district.description}</p>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Activity</span>
                      <span>{district.activityLevel}%</span>
                    </div>
                    <Progress value={district.activityLevel} className="h-2 bg-[#2EC4B6]" />
                  </div>
                  <div className="flex gap-2">
                    {district.route ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(district.route!)}
                      >
                        Open
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      className="flex-1 bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                      onClick={() => handleVisit(district.id)}
                      disabled={busyDistrict === district.id}
                    >
                      {busyDistrict === district.id ? "Visiting…" : "Visit"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
