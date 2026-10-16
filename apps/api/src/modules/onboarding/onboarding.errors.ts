/**
 * Onboarding Module Errors
 */

export class OnboardingError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400
  ) {
    super(message);
    this.name = "OnboardingError";
  }
}

export const ONBOARDING_ERRORS = {
  NOT_FOUND: new OnboardingError("Onboarding not found", "ONBOARDING_NOT_FOUND", 404),
  INVALID_STEP: new OnboardingError("Invalid onboarding step", "INVALID_STEP", 400),
  INVALID_TRANSITION: new OnboardingError("Invalid step transition", "INVALID_TRANSITION", 400),
  REVISION_CONFLICT: new OnboardingError("Profile was modified elsewhere", "REVISION_CONFLICT", 409),
  ALREADY_COMPLETED: new OnboardingError("Onboarding already completed", "ALREADY_COMPLETED", 400),
  INCOMPLETE_PROFILE: new OnboardingError("Profile is incomplete", "INCOMPLETE_PROFILE", 400),
  VALIDATION_ERROR: new OnboardingError("Validation failed", "VALIDATION_ERROR", 400),
} as const;

export type OnboardingErrorCode = keyof typeof ONBOARDING_ERRORS;
