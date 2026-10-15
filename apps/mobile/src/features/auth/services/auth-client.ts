/**
 * Auth API client for mobile
 */

import type {
  RequestOtpResponse,
  VerifyOtpResponse,
  User,
  ApiError,
} from "../types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

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
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Failed to send verification code");
    }

    return response.json();
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
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Invalid verification code");
    }

    return response.json();
  }

  /**
   * Start OAuth flow
   */
  async startOAuth(provider: "google" | "facebook"): Promise<string> {
    const response = await fetch(
      `${API_BASE_URL}/v1/auth/oauth/${provider}/start`
    );

    if (!response.ok) {
      throw new Error("Failed to start OAuth flow");
    }

    const { authUrl } = await response.json();
    return authUrl;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/me`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  }

  /**
   * Log out current session
   */
  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/v1/auth/logout`, {
      method: "POST",
    });
  }
}

export const authClient = new AuthClient();
