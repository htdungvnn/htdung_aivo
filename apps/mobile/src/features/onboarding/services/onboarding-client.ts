/**
 * Onboarding client for mobile - handles onboarding API calls
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";
const TOKEN_KEY = "aivo_auth_token";

interface OnboardingState {
  status: "not_started" | "in_progress" | "completed" | "needs_review";
  currentStep: string;
  revision: number;
  profile: Record<string, unknown>;
  optionsVersion: string;
}

interface SaveStepResponse {
  revision: number;
  currentStep: string;
  savedAt: string;
}

interface CompleteResponse {
  status: string;
  next: string;
  generation: {
    status: "queued" | "completed" | "failed";
    jobId?: string;
  };
}

interface ApiError {
  error: string;
  code: string;
}

class OnboardingClient {
  /**
   * Get auth token
   */
  private async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get current onboarding state
   */
  async getState(): Promise<OnboardingState> {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/v1/onboarding`, {
      headers: token ? {
        Authorization: `Bearer ${token}`,
      } : {},
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Failed to get onboarding state");
    }

    return response.json();
  }

  /**
   * Save a step
   */
  async saveStep(step: string, data: Record<string, unknown>, expectedRevision: number): Promise<SaveStepResponse> {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/v1/onboarding/steps/${step}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ expectedRevision, data }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Failed to save step");
    }

    return response.json();
  }

  /**
   * Complete onboarding
   */
  async complete(expectedRevision: number): Promise<CompleteResponse> {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/v1/onboarding/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ expectedRevision, onboardingVersion: 1 }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Failed to complete onboarding");
    }

    return response.json();
  }
}

export const onboardingClient = new OnboardingClient();
