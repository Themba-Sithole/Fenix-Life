import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Car,
  GraduationCap,
  Heart,
  Home as HomeIcon,
  Mail,
  Map,
  MessageSquare,
  Newspaper,
  Settings,
  ShoppingCart,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { formatGameDate } from "@/context/SimulationContext";
import { formatMoney, totalNetWorthCents } from "@fenix/domain";

export default function Smartphone() {
  const navigate = useNavigate();
  const { world, formattedDate, tickCount, isLoading } = useSimulation();

  const stats = useMemo(() => {
    if (!world) {
      return null;
    }

    const netWorth = totalNetWorthCents(world.banking);
    const unreadNews = world.events.filter((event) => event.category === 'news').length;

    return {
      netWorth,
      currency: world.origin.currency,
      unreadNews,
      company: world.company.name,
    };
  }, [world]);

  const apps = [
    { name: "Messages", icon: MessageSquare, color: "bg-green-500" },
    { name: "Email", icon: Mail, color: "bg-blue-500" },
    { name: "Calendar", icon: Calendar, color: "bg-red-500", badge: formattedDate ?? undefined },
    { name: "Contacts", icon: Users, color: "bg-gray-600", badge: stats ? `${world?.family.members.length ?? 0}` : undefined },
    { name: "Bank", icon: Building2, color: "bg-[#2EC4B6]", action: () => navigate("/banking"), badge: stats ? formatMoney(stats.netWorth, stats.currency) : undefined },
    { name: "Stocks", icon: TrendingUp, color: "bg-[#F4B400]", action: () => navigate("/stocks") },
    { name: "News", icon: Newspaper, color: "bg-orange-500", action: () => navigate("/news"), badge: stats && stats.unreadNews > 0 ? `${stats.unreadNews}` : undefined },
    { name: "Maps", icon: Map, color: "bg-blue-400", action: () => navigate("/city") },
    { name: "Family", icon: Heart, color: "bg-pink-500", action: () => navigate("/family") },
    { name: "Business", icon: Building2, color: "bg-[#1C2541]", action: () => navigate("/company"), badge: stats?.company.slice(0, 8) },
    { name: "University", icon: GraduationCap, color: "bg-purple-500", action: () => navigate("/education") },
    { name: "Properties", icon: HomeIcon, color: "bg-indigo-500", action: () => navigate("/real-estate") },
    { name: "Vehicles", icon: Car, color: "bg-gray-700", action: () => navigate("/vehicles") },
    { name: "Achievements", icon: Trophy, color: "bg-amber-500", action: () => navigate("/timeline") },
    { name: "Marketplace", icon: ShoppingCart, color: "bg-emerald-500" },
    { name: "Settings", icon: Settings, color: "bg-gray-500", action: () => navigate("/settings") },
  ];

  if (isLoading || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B132B] text-white">
        Loading phone…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] flex items-center justify-center p-6">
      <div className="relative">
        <div className="w-[380px] h-[780px] bg-black rounded-[3rem] shadow-2xl p-3 relative">
          <div className="w-full h-full bg-gradient-to-br from-[#F5F7FA] to-white rounded-[2.5rem] overflow-hidden">
            <div className="bg-gradient-to-r from-[#1C2541] to-[#0B132B] text-white px-6 py-3 flex items-center justify-between">
              <span className="text-sm">{formattedDate ?? formatGameDate(world.currentDate)}</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#2EC4B6]" />
                <div className="text-sm">Day {tickCount + 1}</div>
              </div>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              <div className="flex justify-end mb-4">
                <Button size="sm" variant="outline" onClick={() => navigate("/home")} className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <h2 className="text-2xl text-[#1C2541] mb-2 text-center">{world.player.displayName}</h2>
              <p className="text-xs text-center text-gray-500 mb-6">{world.career.jobTitle}</p>

              <div className="grid grid-cols-4 gap-4">
                {apps.map((app) => (
                  <button
                    key={app.name}
                    onClick={app.action}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors relative"
                  >
                    <div className={`${app.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg`}>
                      <app.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs text-[#1C2541] text-center">{app.name}</span>
                    {app.badge ? (
                      <Badge className="absolute -top-1 -right-1 text-[10px] px-1 py-0 bg-[#1C2541]">
                        {app.badge}
                      </Badge>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full" />
        </div>

        <Button variant="ghost" className="absolute -left-16 top-4 text-white" onClick={() => navigate("/home")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>
    </div>
  );
}
