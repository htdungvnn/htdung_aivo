/**
 * Onboarding client for web - handles onboarding API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface OnboardingState {
  status: "not_started" | "in_progress" | "completed" | "needs_review";
  currentStep: string;
  revision: number;
  profile: Record<string, unknown>;
  optionsVersion: string;
}

export interface SaveStepResponse {
  revision: number;
  currentStep: string;
  savedAt: string;
}

export interface CompleteResponse {
  status: string;
  next: string;
  generation: {
    status: "queued" | "completed" | "failed";
    jobId?: string;
  };
}

export interface ApiError {
  error: string;
  code: string;
}

class OnboardingClient {
  /**
   * Get current onboarding state
   */
  async getState(): Promise<OnboardingState> {
    const response = await fetch(`${API_BASE_URL}/v1/onboarding`, {
      credentials: "include",
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Failed to get onboarding state");
    }

    return response.json() as Promise<OnboardingState>;
  }

  /**
   * Save a step
   */
  async saveStep(step: string, data: Record<string, unknown>, expectedRevision: number): Promise<SaveStepResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/onboarding/steps/${step}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expectedRevision, data }),
      credentials: "include",
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Failed to save step");
    }

    return response.json() as Promise<SaveStepResponse>;
  }

  /**
   * Complete onboarding
   */
  async complete(expectedRevision: number): Promise<CompleteResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/onboarding/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expectedRevision, onboardingVersion: 1 }),
      credentials: "include",
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Failed to complete onboarding");
    }

    return response.json() as Promise<CompleteResponse>;
  }
}

export const onboardingClient = new OnboardingClient();
