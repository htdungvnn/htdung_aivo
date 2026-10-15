/**
 * Auth client for web - handles authentication API calls
 */

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || "http://localhost:8787";

export interface AuthUser {
  id: string;
  email?: string;
  onboardingStatus: "not_started" | "in_progress" | "completed";
}

export interface AuthResponse {
  user: AuthUser;
  next: string;
}

export interface RequestOtpResponse {
  challengeId: string;
  resendAvailableAt: string;
  expiresAt: string;
}

export interface VerifyOtpResponse {
  user: {
    id: string;
    onboardingStatus: "not_started" | "in_progress" | "completed";
  };
  next: string;
}

export interface ApiError {
  error: string;
  code: string;
}

class AuthClient {
  /**
   * Request an OTP code to be sent to email
   */
  async requestOtp(email: string): Promise<RequestOtpResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/email/request-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, purpose: "sign_in" }),
      credentials: "include",
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Failed to send verification code");
    }

    return response.json() as Promise<RequestOtpResponse>;
  }

  /**
   * Verify the OTP code
   */
  async verifyOtp(challengeId: string, code: string): Promise<VerifyOtpResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/email/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ challengeId, code }),
      credentials: "include",
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Invalid verification code");
    }

    return response.json() as Promise<VerifyOtpResponse>;
  }

  /**
   * Start OAuth flow
   */
  async startOAuth(provider: "google" | "facebook", returnTo?: string): Promise<void> {
    const params = new URLSearchParams();
    if (returnTo) {
      params.set("returnTo", returnTo);
    }

    const response = await fetch(
      `${API_BASE_URL}/v1/auth/oauth/${provider}/start?${params}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to start OAuth flow");
    }

    const data = await response.json() as { authUrl: string };
    window.location.href = data.authUrl;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as { user: AuthUser };
    return data.user;
  }

  /**
   * Log out current session
   */
  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/session/refresh`, {
      method: "POST",
      credentials: "include",
    });

    return response.ok;
  }
}

export const authClient = new AuthClient();
