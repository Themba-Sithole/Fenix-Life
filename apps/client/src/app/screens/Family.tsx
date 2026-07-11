import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, Calendar, Gift, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import { averageFamilyHappiness, familyDisplayName, formatMoney } from "@fenix/domain";

export default function Family() {
  const navigate = useNavigate();
  const { world, isLoading, applyAction } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function handleFamilyAction(
    kind: "FAMILY_PLAN_EVENT" | "FAMILY_SEND_GIFT" | "FAMILY_SCHEDULE_VISIT",
    memberId?: string,
  ) {
    setActionError(null);
    setBusyKey(memberId ? `${kind}:${memberId}` : kind);
    try {
      if (kind === "FAMILY_PLAN_EVENT") {
        await applyAction({ kind });
      } else if (memberId) {
        await applyAction({ kind, memberId });
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusyKey(null);
    }
  }

  const simulationGate = useSimulationGate("Loading family data…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  const currency = world.origin.currency;
  const family = world.family;
  const happiness = averageFamilyHappiness(family);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1603367563698-67012943fd67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3ODM3MDY3ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Happy family"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/80 to-[#1C2541]/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <Button variant="ghost" onClick={() => navigate("/home")} className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl text-white mb-2">Family</h1>
              <p className="text-gray-300">{familyDisplayName(world.player.displayName)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {actionError ? (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}
        <Card className="mb-6 border-[#2EC4B6]/20 shadow-lg bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
          <CardContent className="p-8 grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm text-gray-300 mb-2">Family Members</div>
              <div className="text-4xl text-[#2EC4B6]">{family.members.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-300 mb-2">Family Happiness</div>
              <div className="text-4xl text-[#F4B400]">{happiness}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-300 mb-2">Household Expenses</div>
              <div className="text-4xl">{formatMoney(family.householdExpensesCents, currency)}</div>
              <div className="text-sm text-gray-400">/month</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {family.members.map((member) => (
            <Card key={member.id} className="border-[#2EC4B6]/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-[#2EC4B6]">
                    <AvatarFallback className="bg-gradient-to-br from-[#2EC4B6] to-[#1C2541] text-white text-xl">
                      {member.name
                        .split(/\s+/)
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl text-[#1C2541]">{member.name}</h3>
                    <Badge className="mt-1 bg-[#2EC4B6]/20 text-[#2EC4B6] border-[#2EC4B6]/30">
                      {member.relationship}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-2">Age {member.ageYears}</p>
                  </div>
                  <div className="text-3xl">{member.emoji}</div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Happiness</span>
                    <span>{member.happiness}%</span>
                  </div>
                  <Progress value={member.happiness} className="h-2 bg-[#F4B400]" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyKey !== null}
                    onClick={() => handleFamilyAction("FAMILY_SEND_GIFT", member.id)}
                  >
                    <Gift className="w-4 h-4 mr-1" />
                    Gift
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyKey !== null}
                    onClick={() => handleFamilyAction("FAMILY_SCHEDULE_VISIT", member.id)}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Visit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-14"
            disabled={busyKey !== null}
            onClick={() => handleFamilyAction("FAMILY_PLAN_EVENT")}
          >
            <Heart className="w-4 h-4 mr-2" />
            Plan Family Event ($200)
          </Button>
        </div>
      </div>
    </div>
  );
}
