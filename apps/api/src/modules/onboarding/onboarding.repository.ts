/**
 * Onboarding Repository
 * In-memory storage (will be replaced with D1 in production)
 */
import type { UserFitnessProfile, OnboardingStep } from "@aivo/contracts";

/**
 * In-memory profile store
 * Key: userId
 */
const profileStore = new Map<string, UserFitnessProfile>();

/**
 * Generate a cryptographically secure UUID
 */
function generateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

/**
 * Create a new empty profile for a user
 */
function createEmptyProfile(userId: string): UserFitnessProfile {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    userId,
    status: "not_started",
    primaryGoal: null,
    ageRange: null,
    heightCm: null,
    currentWeightKg: null,
    unitSystem: "metric",
    activityLevel: null,
    experienceLevel: null,
    workoutLocations: [],
    equipmentIds: [],
    workoutDaysPerWeek: null,
    preferredWeekdays: [],
    preferredSessionMinutes: null,
    dietPreferenceIds: [],
    onboardingStep: "welcome",
    onboardingVersion: 1,
    revision: 0,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export class OnboardingRepository {
  /**
   * Find profile by user ID
   */
  async findByUserId(userId: string): Promise<UserFitnessProfile | null> {
    return profileStore.get(userId) || null;
  }

  /**
   * Create a new profile for user
   */
  async create(userId: string): Promise<UserFitnessProfile> {
    const profile = createEmptyProfile(userId);
    profileStore.set(userId, profile);
    return profile;
  }

  /**
   * Update an existing profile
   * Returns updated profile with incremented revision
   * Throws if revision doesn't match (optimistic locking)
   */
  async update(profile: UserFitnessProfile, expectedRevision: number): Promise<UserFitnessProfile> {
    const existing = profileStore.get(profile.userId);
    
    if (!existing) {
      throw new Error("Profile not found");
    }

    if (existing.revision !== expectedRevision) {
      throw new Error("REVISION_CONFLICT");
    }

    const now = new Date().toISOString();
    const updated: UserFitnessProfile = {
      ...profile,
      revision: profile.revision + 1,
      updatedAt: now,
    };

    profileStore.set(profile.userId, updated);
    return updated;
  }

  /**
   * Get or create profile for user
   */
  async getOrCreate(userId: string): Promise<UserFitnessProfile> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      return existing;
    }
    return this.create(userId);
  }
}

// Singleton instance
export const onboardingRepository = new OnboardingRepository();
