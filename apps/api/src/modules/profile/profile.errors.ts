/**
 * Profile Module Errors
 */

export class ProfileError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400
  ) {
    super(message);
    this.name = "ProfileError";
  }
}

export const PROFILE_ERRORS = {
  NOT_FOUND: new ProfileError("Profile not found", "PROFILE_NOT_FOUND", 404),
  INVALID_SECTION: new ProfileError("Invalid profile section", "INVALID_SECTION", 400),
  REVISION_CONFLICT: new ProfileError("Profile was modified elsewhere", "REVISION_CONFLICT", 409),
  VALIDATION_ERROR: new ProfileError("Validation failed", "VALIDATION_ERROR", 400),
} as const;

export type ProfileErrorCode = keyof typeof PROFILE_ERRORS;
