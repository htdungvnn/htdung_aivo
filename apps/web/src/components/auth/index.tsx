import { ReactNode } from "react";

// Auth types
export interface User {
  name?: string;
  email?: string;
  picture?: string;
  onboardingStatus?: string;
}

// Auth components and hooks
export { ProviderButton } from "./provider-button";
export { AuthCard, AuthHeader, AuthDivider } from "./auth-card";
export { OtpForm } from "./otp-form";

// Auth hooks
export function useAuth(): {
  user: User | null;
  isLoading: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
} {
  return {
    user: null,
    isLoading: false,
    loading: false,
    logout: async () => {},
    signIn: async () => {},
    signOut: async () => {},
  };
}

// Auth provider
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
