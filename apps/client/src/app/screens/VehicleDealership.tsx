import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Car, DollarSign, Gauge, Zap } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import { formatMoney, ownedVehicles, transportationTotalValueCents } from "@fenix/domain";
import { ToolShell } from "../components/shell";

export default function VehicleDealership() {
  const { world, applyAction, formattedDate } = useSimulation();
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

  const simulationGate = useSimulationGate("Loading garageâ€¦");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  const currency = world.origin.currency;
  const vehicles = world.transportation.vehicles;
  const ownedCount = ownedVehicles(world.transportation).length;
  const fleetValue = transportationTotalValueCents(world.transportation);

  return (
    <ToolShell institution="Fenix Motor Exchange" subtitle={`${world.player.displayName} Â· Garage`} lastUpdated={formattedDate ?? undefined} metrics={[{ label: "Fleet value", value: formatMoney(fleetValue, currency) }, { label: "Owned", value: String(ownedCount) }, { label: "Transport / mo", value: formatMoney(world.transportation.monthlyTransportCostCents, currency) }]}>
      <div>
        {actionError ? (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}
        <section className="mb-6 grid gap-5 border-y border-border py-5 text-sm md:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Fleet Value</div>
              <div className="text-3xl">{formatMoney(fleetValue, currency)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Monthly Transport Cost</div>
              <div className="text-3xl text-fenix-gold">
                {formatMoney(world.transportation.monthlyTransportCostCents, currency)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Vehicles Owned</div>
              <div className="text-3xl text-accent">{ownedCount}</div>
            </div>
        </section>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <section key={vehicle.id} className={`rounded-lg border border-border bg-surface-1 p-6 ${vehicle.owned ? "ring-2 ring-accent" : ""}`}>
                <div className="flex items-start justify-between mb-4">
                  <Car className="h-8 w-8 text-secondary" aria-hidden />
                  {vehicle.owned ? <Badge className="bg-accent text-white">Owned</Badge> : null}
                </div>

                <h3 className="text-xl text-secondary mb-1">{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{vehicle.category}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price</span>
                    <span>{formatMoney(vehicle.priceCents, currency)}</span>
                  </div>
                  {vehicle.owned ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Value</span>
                      <span className="text-accent">{formatMoney(vehicle.valueCents, currency)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fuel</span>
                    <span>{vehicle.fuelLabel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1"><Gauge className="w-3 h-3" /> Top Speed</span>
                    <span>{vehicle.topSpeedMph} mph</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Power</span>
                    <span>{vehicle.horsepower} hp</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-accent hover:bg-accent/80 text-white"
                  disabled={busyId === vehicle.id}
                  onClick={() =>
                    vehicle.owned ? handleSell(vehicle.id) : handlePurchase(vehicle.id)
                  }
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  {vehicle.owned ? "Sell (80% value)" : "Purchase"}
                </Button>
            </section>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
