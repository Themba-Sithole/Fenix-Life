import { RouterProvider } from 'react-router';
import { AuthProvider } from '@/context/AuthContext';
import { SaveProvider } from '@/context/SaveContext';
import { router } from './routes';

function App() {
  return (
    <AuthProvider>
      <SaveProvider>
        <RouterProvider router={router} />
      </SaveProvider>
    </AuthProvider>
  );
}

export default App;
