/**
 * Profile Service
 * Handles profile section updates and impact calculation
 */
import { profileRepository } from "./profile.repository";
import { ProfileError, PROFILE_ERRORS } from "./profile.errors";
import type {
  UserFitnessProfile,
  PrimaryGoal,
  ActivityLevel,
  ExperienceLevel,
  WorkoutLocation,
  SessionDuration,
  UnitSystem,
} from "@aivo/contracts";
import {
  primaryGoalSchema,
  activityLevelSchema,
  experienceLevelSchema,
  workoutLocationSchema,
  sessionDurationSchema,
  unitSystemSchema,
} from "@aivo/contracts";
import { ZodError } from "zod";

export type ProfileSection =
  | "goal"
  | "measurements"
  | "activity"
  | "equipment"
  | "schedule"
  | "nutrition"
  | "units";

export interface ProfileUpdateResult {
  profile: UserFitnessProfile;
  impact: ProfileChangeImpact;
}

export interface ProfileChangeImpact {
  affectsTargets: boolean;
  affectsWorkouts: boolean;
  affectsSchedule: boolean;
  description: string;
}

export class ProfileService {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserFitnessProfile> {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw PROFILE_ERRORS.NOT_FOUND;
    }
    return profile;
  }

  /**
   * Update a specific profile section
   */
  async updateSection(
    userId: string,
    section: ProfileSection,
    data: Record<string, unknown>,
    expectedRevision: number
  ): Promise<ProfileUpdateResult> {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw PROFILE_ERRORS.NOT_FOUND;
    }

    if (expectedRevision !== profile.revision) {
      throw PROFILE_ERRORS.REVISION_CONFLICT;
    }

    const updatedProfile = await this.applySectionUpdate(profile, section, data);
    const savedProfile = await profileRepository.update(updatedProfile, expectedRevision);
    const impact = this.calculateImpact(profile, savedProfile, section);

    return {
      profile: savedProfile,
      impact,
    };
  }

  /**
   * Preview impact of changes without applying them
   */
  async previewImpact(
    userId: string,
    section: ProfileSection,
    data: Record<string, unknown>
  ): Promise<ProfileChangeImpact> {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw PROFILE_ERRORS.NOT_FOUND;
    }

    const updatedProfile = await this.applySectionUpdate(profile, section, data);
    return this.calculateImpact(profile, updatedProfile, section);
  }

  /**
   * Get selectable options for profile forms
   */
  getOptions(): {
    equipmentOptions: Array<{ id: string; labelKey: string }>;
    dietPreferenceOptions: Array<{ id: string; labelKey: string }>;
    ageRangeOptions: Array<{ id: string; labelKey: string }>;
  } {
    return {
      equipmentOptions: [
        { id: "no_equipment", labelKey: "onboarding.equipment.noEquipment" },
        { id: "dumbbells", labelKey: "onboarding.equipment.dumbbells" },
        { id: "resistance_bands", labelKey: "onboarding.equipment.resistanceBands" },
        { id: "barbell", labelKey: "onboarding.equipment.barbell" },
        { id: "bench", labelKey: "onboarding.equipment.bench" },
        { id: "pullup_bar", labelKey: "onboarding.equipment.pullupBar" },
        { id: "cable_machine", labelKey: "onboarding.equipment.cableMachine" },
        { id: "full_gym", labelKey: "onboarding.equipment.fullGym" },
      ],
      dietPreferenceOptions: [
        { id: "no_preference", labelKey: "onboarding.nutrition.noPreference" },
        { id: "vegetarian", labelKey: "onboarding.nutrition.vegetarian" },
        { id: "vegan", labelKey: "onboarding.nutrition.vegan" },
        { id: "pescatarian", labelKey: "onboarding.nutrition.pescatarian" },
        { id: "high_protein", labelKey: "onboarding.nutrition.highProtein" },
        { id: "low_carb", labelKey: "onboarding.nutrition.lowCarb" },
        { id: "dairy_free", labelKey: "onboarding.nutrition.dairyFree" },
        { id: "gluten_free", labelKey: "onboarding.nutrition.glutenFree" },
      ],
      ageRangeOptions: [
        { id: "18-25", labelKey: "onboarding.profile.age18_25" },
        { id: "26-35", labelKey: "onboarding.profile.age26_35" },
        { id: "36-45", labelKey: "onboarding.profile.age36_45" },
        { id: "46-55", labelKey: "onboarding.profile.age46_55" },
        { id: "56-65", labelKey: "onboarding.profile.age56_65" },
        { id: "65+", labelKey: "onboarding.profile.age65plus" },
      ],
    };
  }

  /**
   * Apply section update to profile
   */
  private async applySectionUpdate(
    profile: UserFitnessProfile,
    section: ProfileSection,
    data: Record<string, unknown>
  ): Promise<UserFitnessProfile> {
    const updated = { ...profile };

    try {
      switch (section) {
        case "goal":
          updated.primaryGoal = primaryGoalSchema.parse(data.primaryGoal);
          break;

        case "measurements":
          updated.ageRange = data.ageRange as string | null;
          if (data.heightCm !== undefined) {
            updated.heightCm = Number(data.heightCm);
          }
          if (data.currentWeightKg !== undefined) {
            updated.currentWeightKg = Number(data.currentWeightKg);
          }
          break;

        case "units":
          updated.unitSystem = unitSystemSchema.parse(data.unitSystem);
          break;

        case "activity":
          updated.activityLevel = activityLevelSchema.parse(data.activityLevel);
          updated.experienceLevel = experienceLevelSchema.parse(data.experienceLevel);
          break;

        case "equipment":
          updated.workoutLocations = workoutLocationSchema.array().parse(data.workoutLocations);
          updated.equipmentIds = (data.equipmentIds as string[]) || [];
          break;

        case "schedule":
          updated.workoutDaysPerWeek = Number(data.workoutDaysPerWeek);
          updated.preferredWeekdays = (data.preferredWeekdays as number[]) || [];
          updated.preferredSessionMinutes = sessionDurationSchema.parse(data.preferredSessionMinutes);
          break;

        case "nutrition":
          updated.dietPreferenceIds = (data.dietPreferenceIds as string[]) || [];
          break;

        default:
          throw PROFILE_ERRORS.INVALID_SECTION;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
        throw new ProfileError(`Validation failed: ${messages}`, "VALIDATION_ERROR", 400);
      }
      throw error;
    }

    return updated;
  }

  /**
   * Calculate the impact of profile changes
   */
  private calculateImpact(
    before: UserFitnessProfile,
    after: UserFitnessProfile,
    section: ProfileSection
  ): ProfileChangeImpact {
    switch (section) {
      case "goal":
        return {
          affectsTargets: true,
          affectsWorkouts: true,
          affectsSchedule: false,
          description: "Goal changed. Starting targets will be recalculated. Workout plans may be regenerated.",
        };

      case "measurements":
        return {
          affectsTargets: after.currentWeightKg !== before.currentWeightKg,
          affectsWorkouts: false,
          affectsSchedule: false,
          description: "Measurement updated. Current measurement recorded. Nutrition targets may be recalculated.",
        };

      case "activity":
        return {
          affectsTargets: true,
          affectsWorkouts: true,
          affectsSchedule: false,
          description: "Activity level changed. Workout intensity and targets will be adjusted.",
        };

      case "equipment":
        return {
          affectsTargets: false,
          affectsWorkouts: true,
          affectsSchedule: false,
          description: "Equipment updated. Future exercises may change. Completed workouts will not be affected.",
        };

      case "schedule":
        return {
          affectsTargets: false,
          affectsWorkouts: false,
          affectsSchedule: true,
          description: "Schedule updated. Future workout schedule will be rebuilt.",
        };

      case "nutrition":
        return {
          affectsTargets: true,
          affectsWorkouts: false,
          affectsSchedule: false,
          description: "Nutrition preferences updated. Future meal suggestions will reflect your preferences.",
        };

      default:
        return {
          affectsTargets: false,
          affectsWorkouts: false,
          affectsSchedule: false,
          description: "Profile updated.",
        };
    }
  }
}

export const profileService = new ProfileService();
