/**
 * Auth API client for mobile
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  RequestOtpResponse,
  VerifyOtpResponse,
  User,
  ApiError,
} from "../types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";
const TOKEN_KEY = "aivo_auth_token";
const USER_ID_KEY = "aivo_user_id";

class AuthClient {
  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  }

  /**
   * Store token
   */
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Store user ID
   */
  async setUserId(userId: string): Promise<void> {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  }

  /**
   * Get user ID
   */
  async getUserId(): Promise<string | null> {
    return AsyncStorage.getItem(USER_ID_KEY);
  }

  /**
   * Clear auth data
   */
  async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_ID_KEY]);
  }

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
  async startOAuth(provider: "google" | "facebook", returnTo?: string): Promise<string> {
    const params = new URLSearchParams();
    params.set("platform", "mobile");
    
    if (returnTo) {
      params.set("returnTo", returnTo);
    }
    
    // For mobile, use expo callback scheme
    const callbackUrl = "aivo://auth/callback";
    params.set("callbackUrl", callbackUrl);

    const response = await fetch(
      `${API_BASE_URL}/v1/auth/oauth/${provider}/start?${params}`
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
    const token = await this.getToken();
    
    const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
      headers: token ? {
        Authorization: `Bearer ${token}`,
      } : {},
    });

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
    try {
      await fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await this.getToken()}`,
        },
      });
    } finally {
      await this.clearAuth();
    }
  }
}

export const authClient = new AuthClient();
