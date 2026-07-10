import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";

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

export default function NewsFeed() {
  const navigate = useNavigate();
  const { world, isLoading } = useSimulation();

  if (isLoading || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1C2541]">
        Loading news feed…
      </div>
    );
  }

  const news = world.events.map((event) => ({
    headline: event.headline,
    category: event.category,
    impact: toneToImpact(event.tone),
    time: event.date,
    summary: `Simulated on day ${event.tickCount + 1} of your life.`,
  }));

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
          <p className="text-gray-300">Headlines generated from your simulation</p>
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
            <Card key={`${item.time}-${item.headline}`} className="border-[#2EC4B6]/20 shadow-md hover:shadow-lg transition-shadow">
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
