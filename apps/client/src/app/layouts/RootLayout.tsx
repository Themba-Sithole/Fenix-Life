import { Outlet } from 'react-router';
import { AuthProvider } from '@/context/AuthContext';
import { SaveProvider } from '@/context/SaveContext';
import { SimulationProvider } from '@/context/SimulationContext';

export function RootLayout() {
  return (
    <AuthProvider>
      <SaveProvider>
        <SimulationProvider>
          <Outlet />
        </SimulationProvider>
      </SaveProvider>
    </AuthProvider>
  );
}
