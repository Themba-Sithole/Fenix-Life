import type { ReactElement } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { useSimulation } from "@/context/SimulationContext";
import { ErrorState, LoadingState } from "@/app/components/shell";

export function useSimulationGate(loadingMessage: string): ReactElement | null {
  const navigate = useNavigate();
  const { world, isLoading, loadError, reloadSimulation } = useSimulation();

  if (loadError) {
    return (
      <ErrorState
        message={loadError}
        onRetry={() => reloadSimulation()}
        className="min-h-screen"
        secondaryAction={
          <Button variant="outline" onClick={() => navigate("/continue")}>
            Back to Saves
          </Button>
        }
      />
    );
  }

  if (isLoading || !world) {
    return <LoadingState label={loadingMessage} className="min-h-screen" />;
  }

  return null;
}
