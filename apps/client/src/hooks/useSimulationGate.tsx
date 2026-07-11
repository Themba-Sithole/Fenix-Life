import type { ReactElement } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { useSimulation } from "@/context/SimulationContext";

export function useSimulationGate(loadingMessage: string, className = "bg-[#F5F7FA]"): ReactElement | null {
  const navigate = useNavigate();
  const { world, isLoading, loadError, reloadSimulation } = useSimulation();

  if (loadError) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${className} text-[#1C2541] p-6 gap-4`}>
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-center">
          {loadError}
        </p>
        <Button onClick={() => reloadSimulation()} className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white">
          Retry Loading
        </Button>
        <Button variant="outline" onClick={() => navigate("/continue")}>
          Back to Saves
        </Button>
      </div>
    );
  }

  if (isLoading || !world) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${className} text-[#1C2541]`}>
        {loadingMessage}
      </div>
    );
  }

  return null;
}
