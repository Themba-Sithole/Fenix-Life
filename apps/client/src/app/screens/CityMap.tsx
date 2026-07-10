import { useMemo } from "react";
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
import { buildCityDistricts, formatOriginLocation } from "@fenix/domain";

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
  const { world, isLoading } = useSimulation();

  const districts = useMemo(() => (world ? buildCityDistricts(world) : []), [world]);

  if (isLoading || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-100 text-[#1C2541]">
        Loading city map…
      </div>
    );
  }

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
            <p className="text-gray-600">{formatOriginLocation(world.origin)} · Tech index {world.economy.techSectorIndex.toFixed(1)}</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {districts.map((district) => {
            const Icon = DISTRICT_ICONS[district.id as keyof typeof DISTRICT_ICONS] ?? Building2;
            const color = DISTRICT_COLORS[district.id] ?? "bg-[#1C2541]";

            return (
              <Card key={district.id} className="border-[#2EC4B6]/20 shadow-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => district.route && navigate(district.route)}
                  className={`${color} w-full p-6 text-white text-left hover:opacity-90 transition-all`}
                >
                  <Icon className="w-10 h-10 mb-3" />
                  <div className="font-semibold">{district.name}</div>
                </button>
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm text-gray-600">{district.description}</p>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Activity</span>
                      <span>{district.activityLevel}%</span>
                    </div>
                    <Progress value={district.activityLevel} className="h-2 bg-[#2EC4B6]" />
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
