import { useNavigate } from "react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { deriveBlockingGates, type LifeGate } from "@fenix/domain";
import type { WorldInstance } from "@fenix/domain";

interface LifeGateBannerProps {
  readonly world: WorldInstance;
}

export function LifeGateBanner({ world }: LifeGateBannerProps) {
  const navigate = useNavigate();
  const gates = deriveBlockingGates(world);
  if (gates.length === 0) {
    return null;
  }

  const hard = gates.filter((gate) => gate.severity === "hard");
  const soft = gates.filter((gate) => gate.severity === "soft");
  const primary: LifeGate = hard[0] ?? soft[0]!;

  return (
    <div
      className={`rounded-xl border p-4 mb-4 ${
        hard.length > 0
          ? "border-destructive/30 bg-destructive/10 text-foreground"
          : "border-accent/30 bg-accent/10 text-foreground"
      }`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1 space-y-2">
          <p className="font-medium">
            {hard.length > 0 ? "Resolve this before time moves" : "Life pressure"}
          </p>
          <p className="text-sm">{primary.message}</p>
          {gates.length > 1 ? (
            <ul className="text-xs space-y-1 opacity-90">
              {gates.slice(1, 4).map((gate) => (
                <li key={gate.kind}>• {gate.message}</li>
              ))}
            </ul>
          ) : null}
          {primary.route ? (
            <Button
              size="sm"
              className="bg-secondary text-secondary-foreground hover:opacity-90"
              onClick={() => navigate(primary.route!)}
            >
              Resolve
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
