import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Building2, GraduationCap, Hospital, ShoppingBag, Plane, Coffee, Factory, Home } from "lucide-react";

export default function CityMap() {
  const navigate = useNavigate();

  const locations = [
    { name: "Downtown", icon: Building2, color: "bg-[#1C2541]" },
    { name: "University", icon: GraduationCap, color: "bg-[#2EC4B6]", action: () => navigate("/education") },
    { name: "Hospital", icon: Hospital, color: "bg-red-400" },
    { name: "Shopping Mall", icon: ShoppingBag, color: "bg-[#F4B400]" },
    { name: "Airport", icon: Plane, color: "bg-blue-400" },
    { name: "Café District", icon: Coffee, color: "bg-amber-600" },
    { name: "Tech District", icon: Factory, color: "bg-[#2EC4B6]" },
    { name: "Residential", icon: Home, color: "bg-green-500", action: () => navigate("/real-estate") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-emerald-100 to-blue-200 p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="outline" onClick={() => navigate("/home")} className="mb-6 bg-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back Home
        </Button>

        <Card className="border-[#2EC4B6]/20 shadow-xl mb-6">
          <CardContent className="p-6 text-center">
            <h1 className="text-3xl text-[#1C2541] mb-2">Fenix City</h1>
            <p className="text-gray-600">Explore the city and visit different locations</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4">
          {locations.map((location) => (
            <Button
              key={location.name}
              onClick={location.action}
              className={`${location.color} h-32 flex flex-col items-center justify-center gap-3 text-white hover:opacity-90 transition-all shadow-lg hover:scale-105`}
            >
              <location.icon className="w-10 h-10" />
              <span>{location.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
