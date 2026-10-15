/**
 * Auth Context - Global authentication state
 */
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authClient } from "@/features/auth/services";
import type { User } from "@/features/auth/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authClient.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authClient.logout();
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    const init = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    init();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
