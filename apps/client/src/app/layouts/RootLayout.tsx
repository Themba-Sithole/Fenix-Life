import { Outlet } from 'react-router';
import { AuthProvider } from '@/context/AuthContext';
import { SaveProvider } from '@/context/SaveContext';
import { SimulationProvider } from '@/context/SimulationContext';
import { HomeTourOverlay } from '../components/HomeTourOverlay';

function AppShell() {
  return (
    <>
      <Outlet />
      <HomeTourOverlay />
    </>
  );
}

export function RootLayout() {
  return (
    <AuthProvider>
      <SaveProvider>
        <SimulationProvider>
          <AppShell />
        </SimulationProvider>
      </SaveProvider>
    </AuthProvider>
  );
}
