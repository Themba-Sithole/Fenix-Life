import { Navigate, useLocation } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "./shell";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState label="Checking session…" className="min-h-screen bg-brand-atmosphere text-secondary" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
