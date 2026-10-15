/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400
  ) {
    super(message);
    this.name = "AuthError";
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
    };
  }
}

/**
 * Error codes for authentication
 */
export const AuthErrorCodes = {
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_OTP: "INVALID_OTP",
  OTP_EXPIRED: "OTP_EXPIRED",
  OTP_ATTEMPTS_EXCEEDED: "OTP_ATTEMPTS_EXCEEDED",
  RATE_LIMITED: "RATE_LIMITED",
  OAUTH_FAILED: "OAUTH_FAILED",
  OAUTH_CANCELLED: "OAUTH_CANCELLED",
  INVALID_STATE: "INVALID_STATE",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  SESSION_REVOKED: "SESSION_REVOKED",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  INVALID_REQUEST: "INVALID_REQUEST",
} as const;

/**
 * Create common auth errors
 */
export const createAuthError = {
  invalidEmail: () =>
    new AuthError(
      "Enter a valid email address.",
      AuthErrorCodes.INVALID_EMAIL
    ),

  invalidOtp: () =>
    new AuthError(
      "That code is invalid or has expired. Request a new code and try again.",
      AuthErrorCodes.INVALID_OTP,
      400
    ),

  otpExpired: () =>
    new AuthError(
      "That code is invalid or has expired. Request a new code and try again.",
      AuthErrorCodes.OTP_EXPIRED,
      400
    ),

  otpAttemptsExceeded: () =>
    new AuthError(
      "Too many attempts. Wait a moment before trying again.",
      AuthErrorCodes.OTP_ATTEMPTS_EXCEEDED,
      429
    ),

  rateLimited: () =>
    new AuthError(
      "Too many attempts. Wait a moment before trying again.",
      AuthErrorCodes.RATE_LIMITED,
      429
    ),

  oauthFailed: () =>
    new AuthError(
      "AIVO couldn't complete sign-in with this provider. Try again or choose another method.",
      AuthErrorCodes.OAUTH_FAILED,
      400
    ),

  oauthCancelled: () =>
    new AuthError(
      "Sign-in was cancelled. No changes were made.",
      AuthErrorCodes.OAUTH_CANCELLED,
      400
    ),

  invalidState: () =>
    new AuthError(
      "AIVO couldn't complete sign-in with this provider. Try again or choose another method.",
      AuthErrorCodes.INVALID_STATE,
      400
    ),

  sessionExpired: () =>
    new AuthError(
      "Your session has expired. Please sign in again.",
      AuthErrorCodes.SESSION_EXPIRED,
      401
    ),

  sessionRevoked: () =>
    new AuthError(
      "Your session has been revoked. Please sign in again.",
      AuthErrorCodes.SESSION_REVOKED,
      401
    ),

  accountDisabled: () =>
    new AuthError(
      "This account cannot sign in right now. Contact AIVO support and include the reference shown below.",
      AuthErrorCodes.ACCOUNT_DISABLED,
      403
    ),

  invalidRequest: (details?: string) =>
    new AuthError(
      details || "Invalid request. Please check your input.",
      AuthErrorCodes.INVALID_REQUEST,
      400
    ),
};
