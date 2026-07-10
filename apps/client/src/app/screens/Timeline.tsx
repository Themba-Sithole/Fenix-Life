import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Award, Building2, DollarSign, GraduationCap, Heart, TrendingUp, Users } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { buildLifeTimeline, computeLegacySnapshot, formatMoney, type TimelineCategory } from "@fenix/domain";

const CATEGORY_ICONS: Record<TimelineCategory, typeof Users> = {
  life: Users,
  finance: DollarSign,
  career: Building2,
  family: Heart,
  news: TrendingUp,
};

const CATEGORY_COLORS: Record<TimelineCategory, string> = {
  life: "bg-pink-500",
  finance: "bg-[#F4B400]",
  career: "bg-[#2EC4B6]",
  family: "bg-red-500",
  news: "bg-blue-500",
};

export default function Timeline() {
  const navigate = useNavigate();
  const { world, isLoading } = useSimulation();

  const { timeline, legacy } = useMemo(() => {
    if (!world) {
      return { timeline: [], legacy: null };
    }
    return {
      timeline: buildLifeTimeline(world),
      legacy: computeLegacySnapshot(world),
    };
  }, [world]);

  if (isLoading || !world || !legacy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1C2541]">
        Loading life timeline…
      </div>
    );
  }

  const currency = world.origin.currency;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl text-[#1C2541]">Life Timeline</h1>
            <p className="text-gray-600">{world.player.displayName}&apos;s journey</p>
          </div>
        </div>

        <Card className="mb-8 border-[#2EC4B6]/20 shadow-xl bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
          <CardContent className="p-8 text-center">
            <div className="text-sm text-gray-300 mb-2">Legacy Score</div>
            <div className="text-6xl mb-4">{legacy.score}</div>
            <Badge className="bg-[#F4B400] text-white text-lg px-6 py-2">{legacy.label}</Badge>
            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl text-[#2EC4B6]">{legacy.achievementCount}</div>
                <div className="text-sm text-gray-400">Recorded Events</div>
              </div>
              <div>
                <div className="text-2xl text-[#F4B400]">{formatMoney(legacy.netWorthCents, currency)}</div>
                <div className="text-sm text-gray-400">Total Net Worth</div>
              </div>
              <div>
                <div className="text-2xl text-white">{legacy.ageYears}</div>
                <div className="text-sm text-gray-400">Years Old</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2EC4B6]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1C2541] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F4B400]" />
              Life Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2EC4B6] to-[#1C2541]" />
              <div className="space-y-8">
                {timeline.map((event) => {
                  const Icon = CATEGORY_ICONS[event.category] ?? GraduationCap;
                  return (
                    <div key={event.id} className="relative flex items-start gap-6">
                      <div
                        className={`${CATEGORY_COLORS[event.category]} w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg z-10 flex-shrink-0`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <Card className="flex-1 border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg text-[#1C2541]">{event.title}</h3>
                            <Badge variant="outline">{event.calendarYear}</Badge>
                          </div>
                          <p className="text-gray-600 text-sm">{event.description}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Age {event.ageYears} · {event.gameDate}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
