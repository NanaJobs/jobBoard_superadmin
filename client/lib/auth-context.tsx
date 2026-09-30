import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, getStoredUser, setStoredUser, clearTokens, getAccessToken, authApi } from './api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await authApi.getProfile();
      if (res.data) {
        setUser(res.data);
        setStoredUser(res.data);
      }
    } catch (err) {
      console.warn("Failed to fetch current user profile", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const loggedUser = res.data?.user;
    if (loggedUser) {
      setUser(loggedUser);
      setStoredUser(loggedUser);
      return loggedUser;
    }
    throw new Error(res.message || "Login failed");
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      clearTokens();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!getAccessToken(),
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
