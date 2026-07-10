import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Home, Building2, DollarSign, TrendingUp, MapPin } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function RealEstate() {
  const navigate = useNavigate();

  const properties = [
    {
      type: "Luxury Mansion",
      price: 2500000,
      value: 2650000,
      rental: 8500,
      location: "Beverly Heights",
      rating: 5,
      emoji: "🏛️",
      owned: true,
    },
    {
      type: "Downtown Penthouse",
      price: 1200000,
      value: 1285000,
      rental: 0,
      location: "Financial District",
      rating: 5,
      emoji: "🏢",
      owned: true,
    },
    {
      type: "Family Home",
      price: 650000,
      value: 680000,
      rental: 3200,
      location: "Suburban Area",
      rating: 4,
      emoji: "🏡",
      owned: false,
    },
    {
      type: "Commercial Office",
      price: 1800000,
      value: 1950000,
      rental: 12000,
      location: "Tech District",
      rating: 4,
      emoji: "🏬",
      owned: false,
    },
    {
      type: "Beachfront Condo",
      price: 950000,
      value: 0,
      rental: 0,
      location: "Oceanview",
      rating: 5,
      emoji: "🏖️",
      owned: false,
    },
    {
      type: "Warehouse",
      price: 550000,
      value: 0,
      rental: 0,
      location: "Industrial Zone",
      rating: 3,
      emoji: "🏭",
      owned: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      {/* Hero Header with Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1505843513577-22bb7d21e455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwbWFuc2lvbnxlbnwxfHx8fDE3ODM3MDY3ODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury real estate"
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
                <h1 className="text-4xl text-white mb-2">Real Estate Portfolio</h1>
                <p className="text-gray-300">Property Management</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Total Property Value</p>
                <p className="text-3xl text-[#2EC4B6]">$4,935,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Portfolio Summary */}
        <Card className="mb-6 border-[#2EC4B6]/20 shadow-lg bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-sm text-gray-300 mb-2">Total Value</div>
                <div className="text-3xl">$3.9M</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Properties Owned</div>
                <div className="text-3xl text-[#2EC4B6]">2</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Monthly Rental Income</div>
                <div className="text-3xl text-[#F4B400]">$8,500</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Total Appreciation</div>
                <div className="text-3xl text-[#2EC4B6]">+$185K</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card
              key={property.type}
              className={`border-[#2EC4B6]/20 shadow-lg hover:shadow-xl transition-all ${
                property.owned ? "ring-2 ring-[#2EC4B6]" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{property.emoji}</div>
                  {property.owned && (
                    <Badge className="bg-[#2EC4B6] text-white">Owned</Badge>
                  )}
                </div>

                <h3 className="text-xl text-[#1C2541] mb-2">{property.type}</h3>
                
                <div className="flex items-center gap-2 mb-4 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {property.owned ? "Purchase Price" : "Price"}
                    </span>
                    <span className="text-[#1C2541]">${(property.price / 1000).toFixed(0)}K</span>
                  </div>
                  
                  {property.owned && property.value > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Value</span>
                      <span className="text-[#2EC4B6]">${(property.value / 1000).toFixed(0)}K</span>
                    </div>
                  )}

                  {property.rental > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Rental</span>
                      <span className="text-[#F4B400]">+${property.rental}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Location Rating</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < property.rating ? "bg-[#F4B400]" : "bg-gray-300"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {property.owned ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Manage
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200">
                      Sell
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" className="w-full bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Purchase
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}