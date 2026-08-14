import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  fetchMe,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  PublicUser,
} from './authApi';

type AuthStatus = 'loading' | 'authenticated' | 'guest';

interface AuthContextValue {
  status: AuthStatus;
  user: PublicUser | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<PublicUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      const { user } = await fetchMe();
      setUser(user);
      setStatus('authenticated');
    } catch {
      setUser(null);
      setStatus('guest');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const result = await apiLogin({ email, password });
    setUser(result.user);
    setStatus('authenticated');
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);
      const result = await apiRegister({ name, email, password });
      setUser(result.user);
      setStatus('authenticated');
    },
    []
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setStatus('guest');
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      status,
      user,
      error,
      login,
      register,
      logout,
      refresh,
      clearError,
    }),
    [status, user, error, login, register, logout, refresh, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
