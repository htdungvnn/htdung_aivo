/**
 * Authentication types for AIVO
 */

export interface User {
  id: string;
  status: "active" | "disabled" | "deleted";
  primaryEmail: string | null;
  emailVerifiedAt: Date | null;
  onboardingStatus: OnboardingStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export type OnboardingStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export interface Identity {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerSubject: string;
  providerEmail: string | null;
  providerEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt: Date;
}

export type AuthProvider = "google" | "facebook" | "email_otp";

export interface Session {
  id: string;
  userId: string;
  deviceId: string | null;
  refreshTokenHash: string;
  sessionFamilyId: string;
  platform: Platform;
  userAgent: string | null;
  ipMetadata: string | null;
  createdAt: Date;
  lastUsedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  revokeReason: string | null;
}

export type Platform = "web" | "ios" | "android";

export interface VerificationChallenge {
  id: string;
  purpose: "sign_in" | "email_verification";
  emailNormalized: string;
  codeHash: string;
  attemptCount: number;
  maxAttempts: number;
  createdAt: Date;
  expiresAt: Date;
  consumedAt: Date | null;
  supersededAt: Date | null;
  requestMetadata: RequestMetadata;
}

export interface RequestMetadata {
  ip?: string;
  userAgent?: string;
  platform?: Platform;
}

export interface AuthAuditEvent {
  id: string;
  userId: string | null;
  sessionId: string | null;
  eventType: AuditEventType;
  provider: AuthProvider | null;
  result: AuditResult;
  referenceId: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export type AuditEventType =
  | "otp_requested"
  | "otp_verified"
  | "otp_failed"
  | "otp_resent"
  | "oauth_started"
  | "oauth_completed"
  | "oauth_failed"
  | "login_completed"
  | "signup_completed"
  | "logout"
  | "session_refreshed"
  | "session_revoked"
  | "account_disabled";

export type AuditResult = "success" | "failure" | "cancelled";

// API Request/Response types
export interface RequestOtpBody {
  email: string;
  purpose?: "sign_in";
}

export interface RequestOtpResponse {
  challengeId: string;
  resendAvailableAt: string;
  expiresAt: string;
}

export interface VerifyOtpBody {
  challengeId: string;
  code: string;
}

export interface VerifyOtpResponse {
  user: {
    id: string;
    onboardingStatus: OnboardingStatus;
  };
  next: string;
}

export interface OAuthStartQuery {
  returnTo?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    onboardingStatus: OnboardingStatus;
  };
  next: string;
}

// Context types for route handlers
export interface AuthContext {
  user: User | null;
  session: Session | null;
}

// Safe return URL validation
export interface SafeReturnUrl {
  path: string;
  search: string;
}

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/workouts",
  "/nutrition",
  "/progress",
  "/coach",
  "/profile",
  "/settings",
] as const;

export const ONBOARDING_ROUTES = [
  "/onboarding",
  "/onboarding/goals",
  "/onboarding/profile",
  "/onboarding/activity",
  "/onboarding/nutrition",
  "/onboarding/review",
] as const;

export const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/email",
  "/auth/verify-email",
  "/auth/callback",
  "/auth/error",
  "/privacy",
  "/terms",
] as const;
