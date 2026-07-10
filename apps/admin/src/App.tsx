import { RouterProvider } from 'react-router';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { router } from './routes';

export default function App() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
    </AdminAuthProvider>
  );
}
