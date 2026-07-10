import { RouterProvider } from 'react-router';
import { AuthProvider } from '@/context/AuthContext';
import { SaveProvider } from '@/context/SaveContext';
import { SimulationProvider } from '@/context/SimulationContext';
import { router } from './routes';

function App() {
  return (
    <AuthProvider>
      <SaveProvider>
        <SimulationProvider>
          <RouterProvider router={router} />
        </SimulationProvider>
      </SaveProvider>
    </AuthProvider>
  );
}

export default App;
