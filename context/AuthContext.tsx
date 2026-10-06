"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { apiFetch } from "@/lib/api/client";
import { authManager } from "@/lib/auth/AuthManager";

import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUserState] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const setUser = (user: User | null) => {
    setUserState(user);

    if (user) {
      authManager.setUser(user);
    }
  };

  useEffect(() => {
    async function initializeAuth() {
      try {
        const response = await apiFetch(
          "/v1/users/me/"
        );

        if (!response.ok) {
          authManager.clear();
          setUserState(null);
          return;
        }

        const currentUser: User =
          await response.json();

        authManager.setUser(currentUser);
        setUserState(currentUser);
      } catch {
        authManager.clear();
        setUserState(null);
      } finally {
        setIsLoading(false);
      }
    }

    initializeAuth();
  }, []);

  const logout = async () => {
    await authManager.logout();
    setUserState(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}