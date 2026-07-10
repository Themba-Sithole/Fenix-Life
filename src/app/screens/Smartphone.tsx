import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, MessageSquare, Mail, Calendar, Users, Building2, TrendingUp, Newspaper, Map, Heart, Briefcase, GraduationCap, Home as HomeIcon, Car, Settings, Trophy, ShoppingCart, X } from "lucide-react";

export default function Smartphone() {
  const navigate = useNavigate();

  const apps = [
    { name: "Messages", icon: MessageSquare, color: "bg-green-500" },
    { name: "Email", icon: Mail, color: "bg-blue-500" },
    { name: "Calendar", icon: Calendar, color: "bg-red-500" },
    { name: "Contacts", icon: Users, color: "bg-gray-600" },
    { name: "Bank", icon: Building2, color: "bg-[#2EC4B6]", action: () => navigate("/banking") },
    { name: "Stocks", icon: TrendingUp, color: "bg-[#F4B400]", action: () => navigate("/stocks") },
    { name: "News", icon: Newspaper, color: "bg-orange-500", action: () => navigate("/news") },
    { name: "Maps", icon: Map, color: "bg-blue-400", action: () => navigate("/city") },
    { name: "Family", icon: Heart, color: "bg-pink-500", action: () => navigate("/family") },
    { name: "Business", icon: Briefcase, color: "bg-[#1C2541]", action: () => navigate("/company") },
    { name: "University", icon: GraduationCap, color: "bg-purple-500", action: () => navigate("/education") },
    { name: "Properties", icon: HomeIcon, color: "bg-indigo-500", action: () => navigate("/real-estate") },
    { name: "Vehicles", icon: Car, color: "bg-gray-700", action: () => navigate("/vehicles") },
    { name: "Achievements", icon: Trophy, color: "bg-amber-500" },
    { name: "Marketplace", icon: ShoppingCart, color: "bg-emerald-500" },
    { name: "Settings", icon: Settings, color: "bg-gray-500", action: () => navigate("/settings") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] flex items-center justify-center p-6">
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-[380px] h-[780px] bg-black rounded-[3rem] shadow-2xl p-3 relative">
          {/* Screen */}
          <div className="w-full h-full bg-gradient-to-br from-[#F5F7FA] to-white rounded-[2.5rem] overflow-hidden">
            {/* Status Bar */}
            <div className="bg-gradient-to-r from-[#1C2541] to-[#0B132B] text-white px-6 py-3 flex items-center justify-between">
              <span className="text-sm">9:41 AM</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#2EC4B6]"></div>
                <div className="text-sm">100%</div>
              </div>
            </div>

            {/* Screen Content */}
            <div className="p-6 h-full overflow-y-auto">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/home")}
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <h2 className="text-2xl text-[#1C2541] mb-6 text-center">My Phone</h2>
              
              {/* App Grid */}
              <div className="grid grid-cols-4 gap-4">
                {apps.map((app) => (
                  <button
                    key={app.name}
                    onClick={app.action}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className={`${app.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg`}>
                      <app.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs text-[#1C2541] text-center">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
