/**
 * Auth feature types
 */

export type AuthProvider = "google" | "facebook" | "email_otp";

export type OnboardingStatus = "not_started" | "in_progress" | "completed";

export interface User {
  id: string;
  email?: string;
  onboardingStatus: OnboardingStatus;
}

export interface AuthResponse {
  user: User;
  next: string;
}

export interface RequestOtpResponse {
  challengeId: string;
  resendAvailableAt: string;
  expiresAt: string;
}

export interface VerifyOtpResponse {
  user: User;
  next: string;
}

export interface ApiError {
  error: string;
  code: string;
}

export type AuthScreenState = "idle" | "loading" | "error";

export interface AuthError {
  message: string;
  code: string;
}
