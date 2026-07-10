import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  User, Heart, Zap, Brain, TrendingUp, DollarSign, Building2, 
  Smartphone, Map, Users, Briefcase, Car, Home, Calendar,
  Bell, Cloud, Sun, Menu, GraduationCap, ShoppingBag
} from "lucide-react";
import { formatSaveDate, useSave } from "@/context/SaveContext";
import { useSimulation } from "@/context/SimulationContext";
import { formatUsd, totalNetWorthCents, type TimeScale } from "@fenix/domain";
import { Pause, Play, SkipForward } from "lucide-react";

const TIME_SCALES: TimeScale[] = [1, 2, 5];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { activeSave, isLoading } = useSave();
  const {
    world,
    formattedDate,
    isPaused,
    timeScale,
    isSaving,
    isLoading: simLoading,
    advanceDay,
    setPaused,
    setTimeScale,
    tickCount,
  } = useSimulation();
  const [notifications] = useState(3);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    if (!isLoading && !activeSave) {
      navigate('/continue', { replace: true });
    }
  }, [activeSave, isLoading, navigate]);

  if (isLoading || !activeSave || simLoading || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1C2541]">
        Loading your life…
      </div>
    );
  }

  const displayDate = formattedDate ?? formatSaveDate(activeSave.lastPlayedAt);
  const traits = world.player.traits;
  const netWorth = totalNetWorthCents(world.banking);
  const checking = world.banking.accounts.find((a) => a.id === 'checking');
  const savings = world.banking.accounts.find((a) => a.id === 'savings');
  const recentEvents = world.events.slice(0, 4);

  async function handleAdvanceDay() {
    setAdvancing(true);
    try {
      await advanceDay();
    } finally {
      setAdvancing(false);
    }
  }

  async function handleTimeScale(scale: TimeScale) {
    if (isPaused) {
      await setPaused(false);
    }
    await setTimeScale(scale);
  }

  const stats = [
    { label: "Happiness", value: traits.happiness, icon: Heart, color: "text-[#2EC4B6]", bgColor: "bg-[#2EC4B6]" },
    { label: "Health", value: traits.health, icon: Heart, color: "text-red-400", bgColor: "bg-red-400" },
    { label: "Energy", value: traits.energy, icon: Zap, color: "text-[#F4B400]", bgColor: "bg-[#F4B400]" },
    { label: "Stress", value: traits.stress, icon: Brain, color: "text-orange-400", bgColor: "bg-orange-400" },
  ];

  const quickActions = [
    { label: "Phone", icon: Smartphone, path: "/phone", color: "bg-[#2EC4B6]" },
    { label: "City", icon: Map, path: "/city", color: "bg-[#1C2541]" },
    { label: "Family", icon: Users, path: "/family", color: "bg-[#F4B400]" },
    { label: "Company", icon: Briefcase, path: "/company", color: "bg-[#2EC4B6]" },
    { label: "Vehicle", icon: Car, path: "/vehicles", color: "bg-[#1C2541]" },
    { label: "Property", icon: Home, path: "/real-estate", color: "bg-[#F4B400]" },
    { label: "Education", icon: GraduationCap, path: "/education", color: "bg-[#2EC4B6]" },
    { label: "Shopping", icon: ShoppingBag, path: "/city", color: "bg-[#1C2541]" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      <div className="bg-gradient-to-r from-[#1C2541] to-[#0B132B] text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl">{world.player.displayName}</h1>
              <p className="text-sm text-gray-300">
                Day {tickCount + 1} · {isPaused ? 'Paused' : `${timeScale}x`}
                {isSaving ? ' · Saving…' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2EC4B6]" />
              <span className="text-sm">{displayDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#F4B400]" />
              <span className="text-sm">Tech index {world.economy.techSectorIndex.toFixed(1)}</span>
            </div>
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#2EC4B6] text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-4">
        <Card className="border-[#2EC4B6]/20 shadow-sm">
          <CardContent className="p-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-[#1C2541] font-medium">Time Controls</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaused(!isPaused)}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
            {TIME_SCALES.map((scale) => (
              <Button
                key={scale}
                variant={timeScale === scale && !isPaused ? 'default' : 'outline'}
                size="sm"
                className={timeScale === scale && !isPaused ? 'bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white' : ''}
                onClick={() => handleTimeScale(scale)}
              >
                {scale}x
              </Button>
            ))}
            <Button
              size="sm"
              className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
              onClick={handleAdvanceDay}
              disabled={isPaused || advancing || isSaving}
            >
              <SkipForward className="w-4 h-4 mr-2" />
              {advancing ? 'Advancing…' : 'Advance 1 Day'}
            </Button>
            <span className="text-sm text-gray-500 ml-auto">
              Inflation {(world.economy.inflationRateAnnual * 100).toFixed(1)}% · {displayDate}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-[#2EC4B6]/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-[#2EC4B6] to-[#1C9B8F] flex items-center justify-center border-4 border-[#2EC4B6] shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl text-[#1C2541] mb-1">{world.player.displayName}</h2>
                  <Badge className="mb-4 bg-[#F4B400] text-white">Age {world.player.ageYears}</Badge>
                  
                  <div className="w-full space-y-3 mb-4">
                    {stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-sm text-gray-600">{stat.label}</span>
                          </div>
                          <span className="text-sm text-[#1C2541]">{stat.value}%</span>
                        </div>
                        <Progress value={stat.value} className={`h-2 ${stat.bgColor}`} />
                      </div>
                    ))}
                  </div>

                  <div className="w-full pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Openness (CDPS)</span>
                      <TrendingUp className="w-4 h-4 text-[#2EC4B6]" />
                    </div>
                    <Progress value={traits.openness} className="h-2 bg-[#2EC4B6]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#F4B400]/20 shadow-lg bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#F4B400]" />
                  Financial Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-300 mb-1">Net Worth</div>
                    <div className="text-3xl text-[#2EC4B6]">{formatUsd(netWorth)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Checking</div>
                      <div className="text-lg">{formatUsd(checking?.balanceCents ?? 0)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Savings</div>
                      <div className="text-lg">{formatUsd(savings?.balanceCents ?? 0)}</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-xs text-gray-400 mb-1">Monthly Expenses</div>
                    <div className="text-lg text-orange-300">-{formatUsd(world.banking.monthlyExpensesCents)}</div>
                  </div>
                  <Button 
                    onClick={() => navigate("/banking")}
                    className="w-full bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                  >
                    View Banking
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2EC4B6]/20 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 flex items-center gap-2 text-[#1C2541]">
                  <Building2 className="w-5 h-5 text-[#2EC4B6]" />
                  Economy Snapshot
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tech Sector Index</span>
                    <span className="text-[#2EC4B6]">{world.economy.techSectorIndex.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Salary</span>
                    <span className="text-[#2EC4B6]">{formatUsd(world.banking.monthlySalaryCents)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days Simulated</span>
                    <span className="text-[#1C2541]">{tickCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-[#2EC4B6]/20 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl text-[#1C2541] mb-4">Quick Actions</h3>
                <div className="grid grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className={`${action.color} h-24 flex flex-col items-center justify-center gap-2 text-white hover:opacity-90 transition-opacity`}
                    >
                      <action.icon className="w-6 h-6" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2EC4B6]/20 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl text-[#1C2541] mb-4">News & Activity</h3>
                <div className="space-y-3">
                  {recentEvents.length === 0 ? (
                    <p className="text-sm text-gray-500">Advance time to generate headlines.</p>
                  ) : (
                    recentEvents.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="text-xs text-gray-500 min-w-[80px]">{activity.date}</div>
                        <div className="flex-1 text-sm text-gray-700">{activity.headline}</div>
                        <Badge
                          variant="outline"
                          className={
                            activity.tone === "success"
                              ? "bg-[#2EC4B6]/10 text-[#2EC4B6] border-[#2EC4B6]/30"
                              : activity.tone === "warning"
                              ? "bg-orange-50 text-orange-600 border-orange-200"
                              : "bg-blue-50 text-blue-600 border-blue-200"
                          }
                        >
                          {activity.category}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
