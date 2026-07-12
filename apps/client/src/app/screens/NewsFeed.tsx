import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  cyclePhaseLabel,
  impactChangesLabel,
  type SimEventCategory,
  type WorldImpactTag,
} from "@fenix/domain";

function toneToImpact(tone: string): "positive" | "negative" | "neutral" {
  switch (tone) {
    case "success":
      return "positive";
    case "warning":
      return "negative";
    default:
      return "neutral";
  }
}

const CATEGORIES: Array<SimEventCategory | "all"> = ["all", "news", "finance", "career", "life"];

export default function NewsFeed() {
  const navigate = useNavigate();
  const { world } = useSimulation();
  const [category, setCategory] = useState<SimEventCategory | "all">("all");
  const [impactOnly, setImpactOnly] = useState(false);

  const news = useMemo(() => {
    if (!world) return [];
    return world.events
      .filter((event) => (category === "all" ? true : event.category === category))
      .filter((event) => (impactOnly ? Boolean(event.impact && event.impact !== "none") : true))
      .map((event) => ({
        headline: event.headline,
        category: event.category,
        impact: toneToImpact(event.tone),
        worldImpact: event.impact as WorldImpactTag | undefined,
        time: event.date,
        summary:
          event.impact && event.impact !== "none"
            ? `This changes: ${impactChangesLabel(event.impact)}`
            : event.category === "news"
              ? `Market and economy update during ${cyclePhaseLabel(world.economy.cyclePhase).toLowerCase()} phase.`
              : `${event.headline} — recorded on day ${event.tickCount + 1}.`,
      }));
  }, [world, category, impactOnly]);

  const simulationGate = useSimulationGate("Loading news feed…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      <div className="bg-gradient-to-r from-[#1C2541] to-[#0B132B] text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl mb-2">News Feed</h1>
          <p className="text-gray-300">
            Economy in {cyclePhaseLabel(world.economy.cyclePhase)} phase · inflation{" "}
            {(world.economy.inflationRateAnnual * 100).toFixed(1)}%
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={category === item ? "default" : "outline"}
                className={
                  category === item
                    ? "bg-[#2EC4B6] text-white"
                    : "border-white/30 text-white hover:bg-white/10"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
            <Button
              size="sm"
              variant={impactOnly ? "default" : "outline"}
              className={
                impactOnly
                  ? "bg-[#F4B400] text-[#0B132B]"
                  : "border-white/30 text-white hover:bg-white/10"
              }
              onClick={() => setImpactOnly((value) => !value)}
            >
              World-changing only
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {news.length === 0 ? (
          <Card className="border-[#2EC4B6]/20">
            <CardContent className="p-6 text-sm text-gray-600">
              Advance time on Home to generate news about your finances, company, and the economy.
            </CardContent>
          </Card>
        ) : (
          news.map((item) => (
            <Card
              key={`${item.time}-${item.headline}`}
              className="border-[#2EC4B6]/20 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">
                    {item.impact === "positive" ? "📈" : item.impact === "negative" ? "⚠️" : "📰"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg text-[#1C2541]">{item.headline}</h3>
                      <Badge
                        variant="outline"
                        className={
                          item.impact === "positive"
                            ? "bg-[#2EC4B6]/10 text-[#2EC4B6] border-[#2EC4B6]/30"
                            : item.impact === "negative"
                              ? "bg-orange-50 text-orange-600 border-orange-200"
                              : "bg-blue-50 text-blue-600 border-blue-200"
                        }
                      >
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.summary}</p>
                    {item.worldImpact && item.worldImpact !== "none" ? (
                      <p className="text-xs text-[#1C2541] mb-2 font-medium">
                        This changes {impactChangesLabel(item.worldImpact)}
                      </p>
                    ) : null}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{item.time}</span>
                      {item.impact === "positive" && (
                        <span className="flex items-center gap-1 text-[#2EC4B6]">
                          <TrendingUp className="w-3 h-3" /> Positive
                        </span>
                      )}
                      {item.impact === "negative" && (
                        <span className="flex items-center gap-1 text-orange-600">
                          <TrendingDown className="w-3 h-3" /> Negative
                        </span>
                      )}
                      {item.impact === "neutral" && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <AlertCircle className="w-3 h-3" /> Neutral
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
