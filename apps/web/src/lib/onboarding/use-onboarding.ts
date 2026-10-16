"use client";

import { useState, useCallback, useEffect } from "react";
import { onboardingClient, type OnboardingState } from "@/lib/onboarding/client";

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadState = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await onboardingClient.getState();
      setState(data);
    } catch (err) {
      console.error("Failed to load onboarding state:", err);
      setError(err instanceof Error ? err.message : "Failed to load onboarding state");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveStep = useCallback(
    async (step: string, data: Record<string, unknown>) => {
      if (!state) {
        throw new Error("No onboarding state");
      }

      const result = await onboardingClient.saveStep(step, data, state.revision);
      setState((prev) =>
        prev
          ? {
              ...prev,
              revision: result.revision,
              currentStep: result.currentStep,
              profile: {
                ...prev.profile,
                ...data,
              },
            }
          : null
      );
      return result;
    },
    [state]
  );

  const complete = useCallback(async () => {
    if (!state) {
      throw new Error("No onboarding state");
    }

    const result = await onboardingClient.complete(state.revision);
    setState((prev) =>
      prev
        ? {
            ...prev,
            status: "completed" as const,
          }
        : null
    );
    return result;
  }, [state]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  return {
    state,
    isLoading,
    error,
    loadState,
    saveStep,
    complete,
  };
}
