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
  ApiError,
  clearSession,
  getAuthToken,
  getStoredUser,
  loginUser,
  registerUser,
  setAuthToken,
  setStoredUser,
  type User,
} from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const stored = getStoredUser();
    if (!token || !stored) {
      clearSession();
      setUser(null);
    } else {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  const applyAuth = useCallback((nextUser: User, token: string) => {
    setAuthToken(token);
    setStoredUser(nextUser);
    setUser(nextUser);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: nextUser, token } = await loginUser({ email, password });
    applyAuth(nextUser, token);
  }, [applyAuth]);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    const { user: nextUser, token } = await registerUser({ email, password, displayName });
    applyAuth(nextUser, token);
  }, [applyAuth]);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null && getAuthToken() !== null,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export function isAuthError(error: unknown): error is ApiError {
  return error instanceof ApiError && (error.status === 401 || error.status === 403);
}
