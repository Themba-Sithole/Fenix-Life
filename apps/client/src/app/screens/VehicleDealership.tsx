import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, DollarSign, Gauge, Zap } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import { formatMoney, ownedVehicles, transportationTotalValueCents } from "@fenix/domain";

export default function VehicleDealership() {
  const navigate = useNavigate();
  const { world, isLoading, applyAction } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handlePurchase(vehicleId: string) {
    setActionError(null);
    setBusyId(vehicleId);
    try {
      await applyAction({ kind: "PURCHASE_VEHICLE", vehicleId });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Purchase failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSell(vehicleId: string) {
    setActionError(null);
    setBusyId(vehicleId);
    try {
      await applyAction({ kind: "SELL_VEHICLE", vehicleId });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Sale failed.");
    } finally {
      setBusyId(null);
    }
  }

  const simulationGate = useSimulationGate("Loading garage…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  const currency = world.origin.currency;
  const vehicles = world.transportation.vehicles;
  const ownedCount = ownedVehicles(world.transportation).length;
  const fleetValue = transportationTotalValueCents(world.transportation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBkZWFsZXJzaGlwJTIwc2hvd3Jvb218ZW58MHx8fHwxNzgzNzA2NzgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Vehicle dealership"
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
                <h1 className="text-4xl text-white mb-2">Vehicle Garage</h1>
                <p className="text-gray-300">Fleet value {formatMoney(fleetValue, currency)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Owned Vehicles</p>
                <p className="text-3xl text-[#2EC4B6]">{ownedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {actionError ? (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}
        <Card className="mb-6 border-[#2EC4B6]/20 shadow-lg bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
          <CardContent className="p-8 grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm text-gray-300 mb-2">Fleet Value</div>
              <div className="text-3xl">{formatMoney(fleetValue, currency)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-300 mb-2">Monthly Transport Cost</div>
              <div className="text-3xl text-[#F4B400]">
                {formatMoney(world.transportation.monthlyTransportCostCents, currency)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-300 mb-2">Vehicles Owned</div>
              <div className="text-3xl text-[#2EC4B6]">{ownedCount}</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className={`border-[#2EC4B6]/20 shadow-lg ${vehicle.owned ? "ring-2 ring-[#2EC4B6]" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{vehicle.emoji}</div>
                  {vehicle.owned ? <Badge className="bg-[#2EC4B6] text-white">Owned</Badge> : null}
                </div>

                <h3 className="text-xl text-[#1C2541] mb-1">{vehicle.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{vehicle.category}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price</span>
                    <span>{formatMoney(vehicle.priceCents, currency)}</span>
                  </div>
                  {vehicle.owned ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Value</span>
                      <span className="text-[#2EC4B6]">{formatMoney(vehicle.valueCents, currency)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fuel</span>
                    <span>{vehicle.fuelLabel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1"><Gauge className="w-3 h-3" /> Top Speed</span>
                    <span>{vehicle.topSpeedMph} mph</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1"><Zap className="w-3 h-3" /> Power</span>
                    <span>{vehicle.horsepower} hp</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                  disabled={busyId === vehicle.id}
                  onClick={() =>
                    vehicle.owned ? handleSell(vehicle.id) : handlePurchase(vehicle.id)
                  }
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  {vehicle.owned ? "Sell (80% value)" : "Purchase"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
