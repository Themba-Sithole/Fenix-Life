import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, DollarSign, MapPin } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSimulation } from "@/context/SimulationContext";
import {
  formatMoney,
  formatOriginLocation,
  housingMonthlyRentalIncomeCents,
  housingTotalAppreciationCents,
  housingTotalValueCents,
  ownedProperties,
} from "@fenix/domain";

export default function RealEstate() {
  const navigate = useNavigate();
  const { world, isLoading } = useSimulation();

  if (isLoading || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1C2541]">
        Loading property portfolio…
      </div>
    );
  }

  const currency = world.origin.currency;
  const properties = world.housing.properties;
  const ownedCount = ownedProperties(world.housing).length;
  const totalValue = housingTotalValueCents(world.housing);
  const rentalIncome = housingMonthlyRentalIncomeCents(world.housing);
  const appreciation = housingTotalAppreciationCents(world.housing);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1505843513577-22bb7d21e455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwbWFuc2lvbnxlbnwxfHx8fDE3ODM3MDY3ODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury real estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/80 to-[#1C2541]/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <Button variant="ghost" onClick={() => navigate("/home")} className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl text-white mb-2">Real Estate Portfolio</h1>
                <p className="text-gray-300">{formatOriginLocation(world.origin)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Total Property Value</p>
                <p className="text-3xl text-[#2EC4B6]">{formatMoney(totalValue, currency)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Card className="mb-6 border-[#2EC4B6]/20 shadow-lg bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-sm text-gray-300 mb-2">Total Value</div>
                <div className="text-3xl">{formatMoney(totalValue, currency)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Properties Owned</div>
                <div className="text-3xl text-[#2EC4B6]">{ownedCount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Monthly Rental Income</div>
                <div className="text-3xl text-[#F4B400]">{formatMoney(rentalIncome, currency)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Total Appreciation</div>
                <div className="text-3xl text-[#2EC4B6]">
                  {appreciation >= 0 ? "+" : ""}
                  {formatMoney(appreciation, currency)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              className={`border-[#2EC4B6]/20 shadow-lg ${property.owned ? "ring-2 ring-[#2EC4B6]" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{property.emoji}</div>
                  {property.owned ? <Badge className="bg-[#2EC4B6] text-white">Owned</Badge> : null}
                </div>

                <h3 className="text-xl text-[#1C2541] mb-2">{property.type}</h3>

                <div className="flex items-center gap-2 mb-4 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{property.owned ? "Purchase Price" : "Price"}</span>
                    <span className="text-[#1C2541]">{formatMoney(property.priceCents, currency)}</span>
                  </div>

                  {property.owned ? (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Value</span>
                      <span className="text-[#2EC4B6]">{formatMoney(property.valueCents, currency)}</span>
                    </div>
                  ) : null}

                  {property.monthlyRentCents > 0 ? (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Rental</span>
                      <span className="text-[#F4B400]">+{formatMoney(property.monthlyRentCents, currency)}</span>
                    </div>
                  ) : null}
                </div>

                <Button size="sm" className="w-full bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white" disabled>
                  <DollarSign className="w-4 h-4 mr-1" />
                  {property.owned ? "Manage" : "Purchase"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
