/**
 * Auth service - handles authentication orchestration
 */
import { createAuthError } from "./auth.errors";
import type {
  AuthProvider,
  Identity,
  OnboardingStatus,
  SafeReturnUrl,
  User,
} from "./auth.types";

/**
 * Generate a cryptographically secure random string
 */
export function generateSecureId(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOtpCode(): string {
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => (byte % 10).toString()).join("");
}

/**
 * Hash a value using SHA-256
 */
export async function hashValue(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify a value against a hash using timing-safe comparison
 */
export async function verifyHash(
  value: string,
  hash: string
): Promise<boolean> {
  const hashedValue = await hashValue(value);
  if (hashedValue.length !== hash.length) return false;

  // Timing-safe comparison
  let result = 0;
  for (let i = 0; i < hashedValue.length; i++) {
    result |= hashedValue.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Mask an email address for display
 * e.g., "user@example.com" -> "us***@example.com"
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
}

/**
 * Determine the next destination for a user after authentication
 */
export function determineNextDestination(
  returnTo: SafeReturnUrl | null,
  onboardingStatus: OnboardingStatus
): string {
  // If there's a valid return URL, go there
  if (returnTo) {
    return returnTo.path + (returnTo.search || "");
  }

  // If onboarding is incomplete, go to onboarding
  if (onboardingStatus !== "completed") {
    return "/onboarding";
  }

  // Default to dashboard
  return "/dashboard";
}

/**
 * Resolve identity and determine if user is new
 * Returns the user and whether it's a new account
 */
export interface IdentityResolution {
  user: User;
  identity: Identity | null;
  isNewUser: boolean;
}

/**
 * Normalize OAuth provider profile data
 */
export interface OAuthProfile {
  provider: AuthProvider;
  providerSubject: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  avatarUrl: string | null;
}
