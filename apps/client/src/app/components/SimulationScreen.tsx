import type { ReactNode } from "react";
import { useSimulationGate } from "@/hooks/useSimulationGate";

interface SimulationScreenProps {
  loadingMessage?: string;
  className?: string;
  children: ReactNode;
}

/** Wraps sim screens with shared load-error and loading gates. */
export function SimulationScreen({
  loadingMessage = "Loading…",
  className,
  children,
}: SimulationScreenProps) {
  const gate = useSimulationGate(loadingMessage, className);
  if (gate) {
    return gate;
  }
  return <>{children}</>;
}
