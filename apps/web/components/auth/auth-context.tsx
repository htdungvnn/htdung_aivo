"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth";

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  onboardingStatus: "not_started" | "in_progress" | "completed";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

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
      setUser(null);
      // Redirect to home
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    };

    checkSession();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
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
