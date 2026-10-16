import { useState, useCallback, useEffect, createContext, useContext, ReactNode } from "react";
import { onboardingClient } from "../services/onboarding-client";

interface OnboardingState {
  status: "not_started" | "in_progress" | "completed" | "needs_review";
  currentStep: string;
  revision: number;
  profile: Record<string, unknown>;
  optionsVersion: string;
}

interface OnboardingContextType {
  state: OnboardingState | null;
  isLoading: boolean;
  error: string | null;
  loadState: () => Promise<void>;
  saveStep: (step: string, data: Record<string, unknown>) => Promise<void>;
  complete: () => Promise<{ next: string }>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
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

  return (
    <OnboardingContext.Provider value={{ state, isLoading, error, loadState, saveStep, complete }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboardingContext must be used within an OnboardingProvider");
  }
  return context;
}
