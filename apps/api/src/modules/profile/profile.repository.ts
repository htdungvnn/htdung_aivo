/**
 * Profile Repository
 * Reuses the onboarding repository's profile store
 */
import type { UserFitnessProfile } from "@aivo/contracts";

// Re-export from onboarding repository (shares the same in-memory store)
export { onboardingRepository } from "../onboarding/onboarding.repository";

/**
 * Extended profile repository with additional methods
 */
export class ProfileRepository {
  /**
   * Get profile by user ID
   */
  async findByUserId(userId: string): Promise<UserFitnessProfile | null> {
    // Import from onboarding repository to share the same store
    const { onboardingRepository } = await import("../onboarding/onboarding.repository");
    return onboardingRepository.findByUserId(userId);
  }

  /**
   * Update profile
   */
  async update(profile: UserFitnessProfile, expectedRevision: number): Promise<UserFitnessProfile> {
    const { onboardingRepository } = await import("../onboarding/onboarding.repository");
    return onboardingRepository.update(profile, expectedRevision);
  }
}

export const profileRepository = new ProfileRepository();
