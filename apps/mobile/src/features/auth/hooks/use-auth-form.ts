import { useState, useCallback } from "react";
import { router } from "expo-router";
import { authClient } from "../services";
import type { AuthScreenState } from "../types";

interface UseAuthState {
  email: string;
  challengeId: string;
  screenState: AuthScreenState;
  error: string | null;
  resendCooldown: number;
  maskedEmail: string;
}

export function useAuthForm() {
  const [state, setState] = useState<UseAuthState>({
    email: "",
    challengeId: "",
    screenState: "idle",
    error: null,
    resendCooldown: 0,
    maskedEmail: "",
  });

  const maskEmail = useCallback((email: string): string => {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
  }, []);

  const requestOtp = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, screenState: "loading", error: null }));

    try {
      const response = await authClient.requestOtp(email);
      setState((prev) => ({
        ...prev,
        email,
        challengeId: response.challengeId,
        maskedEmail: maskEmail(email),
        screenState: "idle",
        resendCooldown: 60,
      }));
      return response;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        screenState: "error",
        error: err instanceof Error ? err.message : "Failed to send code",
      }));
      throw err;
    }
  }, [maskEmail]);

  const verifyOtp = useCallback(async (code: string) => {
    setState((prev) => ({ ...prev, screenState: "loading", error: null }));

    try {
      const response = await authClient.verifyOtp(state.challengeId, code);

      // Navigate based on onboarding status
      const nextUrl = response.next || "/onboarding";
      router.replace(nextUrl as any);

      return response;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        screenState: "error",
        error: err instanceof Error ? err.message : "Invalid code",
      }));
      throw err;
    }
  }, [state.challengeId]);

  const startOAuth = useCallback(async (provider: "google" | "facebook") => {
    setState((prev) => ({ ...prev, screenState: "loading", error: null }));

    try {
      const authUrl = await authClient.startOAuth(provider);
      // In production, use expo-web-browser or auth-session
      // For now, we'll redirect to the URL
      return authUrl;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        screenState: "error",
        error: err instanceof Error ? err.message : "OAuth failed",
      }));
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const resetForm = useCallback(() => {
    setState({
      email: "",
      challengeId: "",
      screenState: "idle",
      error: null,
      resendCooldown: 0,
      maskedEmail: "",
    });
  }, []);

  return {
    ...state,
    requestOtp,
    verifyOtp,
    startOAuth,
    clearError,
    resetForm,
  };
}
