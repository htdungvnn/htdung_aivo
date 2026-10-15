/**
 * OTP service - handles email OTP generation and verification
 */
import {
  createAuthError,
  type AuthError,
} from "./auth.errors";
import {
  generateOtpCode,
  generateSecureId,
  hashValue,
  verifyHash,
} from "./auth.service";
import type { Platform, RequestMetadata, VerificationChallenge } from "./auth.types";

// Configuration constants
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 3;
const RESEND_COOLDOWN_SECONDS = 60;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

/**
 * In-memory challenge store (replace with database in production)
 */
const challengeStore = new Map<string, VerificationChallenge>();
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Create a new OTP challenge
 */
export async function createOtpChallenge(
  email: string,
  metadata: RequestMetadata = {}
): Promise<{
  challengeId: string;
  expiresAt: Date;
  resendAvailableAt: Date;
}> {
  // Check rate limit
  const rateLimit = checkRateLimit(email);
  if (rateLimit.blocked) {
    throw createAuthError.rateLimited();
  }

  // Generate secure code
  const code = generateOtpCode();
  const challengeId = generateSecureId();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
  const resendAvailableAt = new Date(now.getTime() + RESEND_COOLDOWN_SECONDS * 1000);

  // Hash the code for storage
  const codeHash = await hashValue(code);

  // Invalidate any existing challenges for this email
  for (const [existingId, existing] of challengeStore.entries()) {
    if (
      existing.emailNormalized === email &&
      !existing.consumedAt &&
      !existing.supersededAt
    ) {
      existing.supersededAt = now;
    }
  }

  // Store the challenge
  const challenge: VerificationChallenge = {
    id: challengeId,
    purpose: "sign_in",
    emailNormalized: email,
    codeHash,
    attemptCount: 0,
    maxAttempts: MAX_ATTEMPTS,
    createdAt: now,
    expiresAt,
    consumedAt: null,
    supersededAt: null,
    requestMetadata: metadata,
  };

  challengeStore.set(challengeId, challenge);

  // Update rate limit
  updateRateLimit(email);

  // Log for development (in production, never log the code)
  if (process.env.NODE_ENV === "development") {
    console.log(`[DEV] OTP for ${email}: ${code}`);
  }

  return {
    challengeId,
    expiresAt,
    resendAvailableAt,
  };
}

/**
 * Verify an OTP code
 */
export async function verifyOtpChallenge(
  challengeId: string,
  code: string
): Promise<{ valid: boolean; error?: AuthError }> {
  const challenge = challengeStore.get(challengeId);

  if (!challenge) {
    return { valid: false, error: createAuthError.invalidOtp() };
  }

  // Check if expired
  if (new Date() > challenge.expiresAt) {
    return { valid: false, error: createAuthError.otpExpired() };
  }

  // Check if already used
  if (challenge.consumedAt) {
    return { valid: false, error: createAuthError.otpExpired() };
  }

  // Check if superseded
  if (challenge.supersededAt) {
    return { valid: false, error: createAuthError.otpExpired() };
  }

  // Increment attempt count
  challenge.attemptCount += 1;

  // Check attempt limit
  if (challenge.attemptCount > challenge.maxAttempts) {
    return { valid: false, error: createAuthError.otpAttemptsExceeded() };
  }

  // Verify the code
  const isValid = await verifyHash(code, challenge.codeHash);

  if (!isValid) {
    if (challenge.attemptCount >= challenge.maxAttempts) {
      return { valid: false, error: createAuthError.otpAttemptsExceeded() };
    }
    return { valid: false, error: createAuthError.invalidOtp() };
  }

  // Mark as consumed
  challenge.consumedAt = new Date();

  return { valid: true };
}

/**
 * Check if resend is available for a challenge
 */
export function getResendAvailability(
  challengeId: string
): { available: boolean; resendAvailableAt: Date } {
  const challenge = challengeStore.get(challengeId);
  if (!challenge) {
    return { available: false, resendAvailableAt: new Date() };
  }

  // Check cooldown
  const now = new Date();
  const resendAvailableAt = new Date(
    challenge.createdAt.getTime() + RESEND_COOLDOWN_SECONDS * 1000
  );

  return {
    available: now >= resendAvailableAt,
    resendAvailableAt,
  };
}

/**
 * Get challenge metadata (for resend cooldown display)
 */
export function getChallengeMetadata(challengeId: string): {
  email: string;
  expiresAt: Date;
  maskedEmail: string;
} | null {
  const challenge = challengeStore.get(challengeId);
  if (!challenge) return null;

  return {
    email: challenge.emailNormalized,
    expiresAt: challenge.expiresAt,
    maskedEmail: maskEmailDev(challenge.emailNormalized),
  };
}

/**
 * Mask email for development display
 */
function maskEmailDev(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart.slice(0, 2)}***@${domain}`;
}

/**
 * Check rate limit for an email
 */
function checkRateLimit(email: string): { blocked: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(email);

  if (!record || now >= record.resetAt) {
    return { blocked: false, remaining: RATE_LIMIT_MAX_REQUESTS };
  }

  return {
    blocked: record.count >= RATE_LIMIT_MAX_REQUESTS,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - record.count),
  };
}

/**
 * Update rate limit counter
 */
function updateRateLimit(email: string): void {
  const now = Date.now();
  const record = rateLimitStore.get(email);

  if (!record || now >= record.resetAt) {
    rateLimitStore.set(email, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
  } else {
    record.count += 1;
  }
}
