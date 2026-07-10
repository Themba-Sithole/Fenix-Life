import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  adminLogin,
  getAdminToken,
  getStoredAdminUser,
  isStaffUser,
  setAdminSession,
  type AdminUser,
  type StaffRole,
} from '@/lib/admin-api';

interface AdminAuthContextValue {
  user: (AdminUser & { role: StaffRole }) | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(AdminUser & { role: StaffRole }) | null>(() => {
    const stored = getStoredAdminUser();
    return isStaffUser(stored) ? stored : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    const stored = getStoredAdminUser();
    if (!token || !isStaffUser(stored)) {
      setAdminSession(null, null);
      setUser(null);
    } else {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: nextUser, token } = await adminLogin(email, password);
    setAdminSession(nextUser, token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    setAdminSession(null, null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null && getAdminToken() !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}
