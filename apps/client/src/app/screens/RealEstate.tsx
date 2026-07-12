import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Building2, DollarSign, MapPin } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  formatMoney,
  formatOriginLocation,
  housingMonthlyRentalIncomeCents,
  housingTotalAppreciationCents,
  housingTotalValueCents,
  ownedProperties,
} from "@fenix/domain";
import { ToolShell } from "../components/shell";

export default function RealEstate() {
  const { world, applyAction, formattedDate } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handlePurchase(propertyId: string) {
    setActionError(null);
    setBusyId(propertyId);
    try {
      await applyAction({ kind: "PURCHASE_PROPERTY", propertyId });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Purchase failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSell(propertyId: string) {
    setActionError(null);
    setBusyId(propertyId);
    try {
      await applyAction({ kind: "SELL_PROPERTY", propertyId });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Sale failed.");
    } finally {
      setBusyId(null);
    }
  }

  const simulationGate = useSimulationGate("Loading property portfolio…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  const currency = world.origin.currency;
  const properties = world.housing.properties;
  const ownedCount = ownedProperties(world.housing).length;
  const totalValue = housingTotalValueCents(world.housing);
  const rentalIncome = housingMonthlyRentalIncomeCents(world.housing);
  const appreciation = housingTotalAppreciationCents(world.housing);

  return (
    <ToolShell institution="Fenix Property Exchange" subtitle={`${world.player.displayName} · ${formatOriginLocation(world.origin)}`} lastUpdated={formattedDate ?? undefined} metrics={[{ label: "Portfolio", value: formatMoney(totalValue, currency) }, { label: "Owned", value: String(ownedCount) }, { label: "Rent / mo", value: formatMoney(rentalIncome, currency) }]}>
      <div>
        {actionError ? (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}
        <section className="mb-6 grid gap-5 border-y border-border py-5 text-sm md:grid-cols-4">
              <div>
                <div className="text-sm text-gray-300 mb-2">Total Value</div>
                <div className="text-3xl">{formatMoney(totalValue, currency)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Properties Owned</div>
                <div className="text-3xl text-accent">{ownedCount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Monthly Rental Income</div>
                <div className="text-3xl text-fenix-gold">{formatMoney(rentalIncome, currency)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Total Appreciation</div>
                <div className="text-3xl text-accent">
                  {appreciation >= 0 ? "+" : ""}
                  {formatMoney(appreciation, currency)}
                </div>
              </div>
        </section>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <section
              key={property.id}
              className={`rounded-lg border border-border bg-surface-1 p-6 ${property.owned ? "ring-2 ring-accent" : ""}`}
            >
                <div className="flex items-start justify-between mb-4">
                  <Building2 className="h-8 w-8 text-secondary" aria-hidden />
                  {property.owned ? <Badge className="bg-accent text-white">Owned</Badge> : null}
                </div>

                <h3 className="text-xl text-secondary mb-2">{property.type}</h3>

                <div className="flex items-center gap-2 mb-4 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{property.owned ? "Purchase Price" : "Price"}</span>
                    <span className="text-secondary">{formatMoney(property.priceCents, currency)}</span>
                  </div>

                  {property.owned ? (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Value</span>
                      <span className="text-accent">{formatMoney(property.valueCents, currency)}</span>
                    </div>
                  ) : null}

                  {property.monthlyRentCents > 0 ? (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Rental</span>
                      <span className="text-fenix-gold">+{formatMoney(property.monthlyRentCents, currency)}</span>
                    </div>
                  ) : null}
                </div>

                <Button
                  size="sm"
                  className="w-full bg-accent hover:bg-accent/80 text-white"
                  disabled={busyId === property.id}
                  onClick={() =>
                    property.owned ? handleSell(property.id) : handlePurchase(property.id)
                  }
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  {property.owned ? "Sell (85% value)" : "Purchase"}
                </Button>
            </section>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
