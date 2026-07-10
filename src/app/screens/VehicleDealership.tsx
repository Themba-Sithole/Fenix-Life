import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, DollarSign, Zap, Gauge } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function VehicleDealership() {
  const navigate = useNavigate();

  const vehicles = [
    {
      name: "Tesla Model S",
      category: "Electric",
      price: 89990,
      fuel: "Electric",
      maintenance: "Low",
      topSpeed: 200,
      horsepower: 1020,
      emoji: "🚗",
      owned: false,
    },
    {
      name: "BMW M5",
      category: "Luxury",
      price: 105000,
      fuel: "15 MPG",
      maintenance: "High",
      topSpeed: 190,
      horsepower: 617,
      emoji: "🏎️",
      owned: true,
    },
    {
      name: "Toyota Camry",
      category: "Economy",
      price: 28000,
      fuel: "32 MPG",
      maintenance: "Low",
      topSpeed: 135,
      horsepower: 203,
      emoji: "🚙",
      owned: false,
    },
    {
      name: "Range Rover Sport",
      category: "SUV",
      price: 85000,
      fuel: "19 MPG",
      maintenance: "Medium",
      topSpeed: 155,
      horsepower: 518,
      emoji: "🚐",
      owned: false,
    },
    {
      name: "Porsche 911",
      category: "Sports",
      price: 125000,
      fuel: "18 MPG",
      maintenance: "High",
      topSpeed: 205,
      horsepower: 640,
      emoji: "🏁",
      owned: false,
    },
    {
      name: "Mercedes Sprinter",
      category: "Commercial",
      price: 45000,
      fuel: "17 MPG",
      maintenance: "Medium",
      topSpeed: 95,
      horsepower: 188,
      emoji: "🚚",
      owned: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      {/* Hero Header with Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXJ8ZW58MXx8fHwxNzgzNjM2MjM4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury sports car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/80 to-[#1C2541]/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/home")}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl text-white mb-2">Vehicle Dealership</h1>
                <p className="text-gray-300">Premium Cars & Motorcycles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Garage Summary */}
        <Card className="mb-6 border-[#2EC4B6]/20 shadow-lg bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-sm text-gray-300 mb-2">Vehicles Owned</div>
                <div className="text-3xl text-[#2EC4B6]">1</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Total Value</div>
                <div className="text-3xl">$105K</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Monthly Costs</div>
                <div className="text-3xl text-[#F4B400]">$580</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle.name}
              className={`border-[#2EC4B6]/20 shadow-lg hover:shadow-xl transition-all ${
                vehicle.owned ? "ring-2 ring-[#2EC4B6]" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-6xl">{vehicle.emoji}</div>
                  <div className="text-right">
                    <Badge
                      className={
                        vehicle.category === "Electric"
                          ? "bg-green-500 text-white"
                          : vehicle.category === "Luxury" || vehicle.category === "Sports"
                          ? "bg-[#F4B400] text-white"
                          : "bg-gray-500 text-white"
                      }
                    >
                      {vehicle.category}
                    </Badge>
                    {vehicle.owned && (
                      <Badge className="bg-[#2EC4B6] text-white mt-2 block">Owned</Badge>
                    )}
                  </div>
                </div>

                <h3 className="text-xl text-[#1C2541] mb-4">{vehicle.name}</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price</span>
                    <span className="text-[#1C2541]">${vehicle.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fuel Economy</span>
                    <span className="text-gray-600">{vehicle.fuel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Maintenance</span>
                    <Badge variant="outline" className="text-xs">
                      {vehicle.maintenance}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-gray-200">
                  <div className="text-center p-3 rounded-lg bg-[#2EC4B6]/10">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Gauge className="w-4 h-4 text-[#2EC4B6]" />
                    </div>
                    <div className="text-sm text-gray-600">Top Speed</div>
                    <div className="text-[#1C2541]">{vehicle.topSpeed} mph</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[#F4B400]/10">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-[#F4B400]" />
                    </div>
                    <div className="text-sm text-gray-600">HP</div>
                    <div className="text-[#1C2541]">{vehicle.horsepower}</div>
                  </div>
                </div>

                {vehicle.owned ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200">
                      Sell
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Test Drive
                    </Button>
                    <Button size="sm" className="flex-1 bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Buy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}