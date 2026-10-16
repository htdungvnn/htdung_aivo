/**
 * Onboarding Service
 * Handles step transitions, data validation, and completion logic
 */
import { onboardingRepository, OnboardingRepository } from "./onboarding.repository";
import { OnboardingError, ONBOARDING_ERRORS } from "./onboarding.errors";
import {
  type UserFitnessProfile,
  type OnboardingStep,
  type PrimaryGoal,
  type ActivityLevel,
  type ExperienceLevel,
  type WorkoutLocation,
  type SessionDuration,
  type UnitSystem,
  STEP_ORDER,
  primaryGoalSchema,
  activityLevelSchema,
  experienceLevelSchema,
  workoutLocationSchema,
  sessionDurationSchema,
  unitSystemSchema,
} from "@aivo/contracts";
import { ZodError } from "zod";

export class OnboardingService {
  constructor(private repository: OnboardingRepository = onboardingRepository) {}

  /**
   * Get or create onboarding for user
   */
  async getOrCreateOnboarding(userId: string): Promise<UserFitnessProfile> {
    return this.repository.getOrCreate(userId);
  }

  /**
   * Get onboarding for user (throws if not found)
   */
  async getOnboarding(userId: string): Promise<UserFitnessProfile> {
    const profile = await this.repository.findByUserId(userId);
    if (!profile) {
      throw ONBOARDING_ERRORS.NOT_FOUND;
    }
    return profile;
  }

  /**
   * Save step data
   */
  async saveStep(
    userId: string,
    step: OnboardingStep,
    data: Record<string, unknown>,
    expectedRevision: number
  ): Promise<{ profile: UserFitnessProfile; nextStep: OnboardingStep }> {
    const profile = await this.getOnboarding(userId);

    // Check if already completed
    if (profile.status === "completed") {
      throw ONBOARDING_ERRORS.ALREADY_COMPLETED;
    }

    // Check revision for optimistic locking
    if (expectedRevision !== profile.revision) {
      throw ONBOARDING_ERRORS.REVISION_CONFLICT;
    }

    // Validate step data
    const validatedData = this.validateStepData(step, data);

    // Apply data to profile
    const updatedProfile = this.applyStepData(profile, step, validatedData);

    // Update step if advancing (not on review/completion)
    if (step !== "review") {
      updatedProfile.onboardingStep = step;
      updatedProfile.status = "in_progress";
    }

    // Save with incremented revision
    const savedProfile = await this.repository.update(updatedProfile, expectedRevision);

    return {
      profile: savedProfile,
      nextStep: this.getNextStep(savedProfile.onboardingStep),
    };
  }

  /**
   * Complete onboarding
   */
  async complete(
    userId: string,
    expectedRevision: number
  ): Promise<{ profile: UserFitnessProfile; next: string }> {
    const profile = await this.getOnboarding(userId);

    if (profile.status === "completed") {
      throw ONBOARDING_ERRORS.ALREADY_COMPLETED;
    }

    if (expectedRevision !== profile.revision) {
      throw ONBOARDING_ERRORS.REVISION_CONFLICT;
    }

    // Validate required fields are present
    if (!profile.primaryGoal || !profile.heightCm || !profile.activityLevel || !profile.experienceLevel) {
      throw ONBOARDING_ERRORS.INCOMPLETE_PROFILE;
    }

    // Mark as completed
    const completedProfile: UserFitnessProfile = {
      ...profile,
      status: "completed",
      completedAt: new Date().toISOString(),
    };

    const savedProfile = await this.repository.update(completedProfile, expectedRevision);

    // TODO: Enqueue initial plan generation job
    // await this.env.QUEUE.send({ type: "generate_initial_plan", userId, profile: savedProfile });

    return {
      profile: savedProfile,
      next: "/dashboard",
    };
  }

  /**
   * Validate step data against schema
   */
  private validateStepData(step: OnboardingStep, data: Record<string, unknown>): Record<string, unknown> {
    try {
      switch (step) {
        case "goal":
          return { primaryGoal: primaryGoalSchema.parse(data.primaryGoal) };
        case "profile":
          return this.validateProfileStep(data);
        case "activity":
          return this.validateActivityStep(data);
        case "equipment":
          return this.validateEquipmentStep(data);
        case "schedule":
          return this.validateScheduleStep(data);
        case "nutrition":
          return { dietPreferenceIds: (data.dietPreferenceIds as string[]) || [] };
        default:
          throw ONBOARDING_ERRORS.INVALID_STEP;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
        throw new OnboardingError(`Validation failed: ${messages}`, "VALIDATION_ERROR", 400);
      }
      throw error;
    }
  }

  /**
   * Validate profile step with unit conversion
   */
  private validateProfileStep(data: Record<string, unknown>): Record<string, unknown> {
    const unitSystem = unitSystemSchema.parse(data.unitSystem || "metric");
    const heightRaw = Number(data.heightCm);
    const weightRaw = Number(data.currentWeightKg);

    // Convert to canonical units if imperial
    let heightCm = heightRaw;
    let currentWeightKg = weightRaw;

    if (unitSystem === "imperial") {
      // Imperial: input is in inches and lbs
      heightCm = heightRaw * 2.54; // inches to cm
      currentWeightKg = weightRaw * 0.453592; // lbs to kg
    }

    // Validate ranges
    if (heightCm < 100 || heightCm > 250) {
      throw new OnboardingError("Height must be between 100cm and 250cm", "VALIDATION_ERROR", 400);
    }
    if (currentWeightKg < 30 || currentWeightKg > 300) {
      throw new OnboardingError("Weight must be between 30kg and 300kg", "VALIDATION_ERROR", 400);
    }

    return {
      ageRange: data.ageRange as string,
      heightCm,
      currentWeightKg,
      unitSystem,
    };
  }

  /**
   * Validate activity step
   */
  private validateActivityStep(data: Record<string, unknown>): Record<string, unknown> {
    return {
      activityLevel: activityLevelSchema.parse(data.activityLevel),
      experienceLevel: experienceLevelSchema.parse(data.experienceLevel),
    };
  }

  /**
   * Validate equipment step
   */
  private validateEquipmentStep(data: Record<string, unknown>): Record<string, unknown> {
    const locations = workoutLocationSchema.array().parse(data.workoutLocations || []);
    const equipmentIds = (data.equipmentIds as string[]) || [];

    if (locations.length === 0) {
      throw new OnboardingError("Select at least one workout location", "VALIDATION_ERROR", 400);
    }
    if (equipmentIds.length === 0) {
      throw new OnboardingError("Select at least one equipment option", "VALIDATION_ERROR", 400);
    }

    return { workoutLocations: locations, equipmentIds };
  }

  /**
   * Validate schedule step
   */
  private validateScheduleStep(data: Record<string, unknown>): Record<string, unknown> {
    const days = Number(data.workoutDaysPerWeek);
    const duration = sessionDurationSchema.parse(data.preferredSessionMinutes);

    if (days < 1 || days > 7) {
      throw new OnboardingError("Workout days must be between 1 and 7", "VALIDATION_ERROR", 400);
    }

    const weekdays = (data.preferredWeekdays as number[]) || [];

    return {
      workoutDaysPerWeek: days,
      preferredWeekdays: weekdays.filter((d) => d >= 0 && d <= 6),
      preferredSessionMinutes: duration,
    };
  }

  /**
   * Apply validated step data to profile
   */
  private applyStepData(
    profile: UserFitnessProfile,
    step: OnboardingStep,
    data: Record<string, unknown>
  ): UserFitnessProfile {
    const updated = { ...profile };

    switch (step) {
      case "goal":
        updated.primaryGoal = data.primaryGoal as PrimaryGoal;
        break;
      case "profile":
        updated.ageRange = data.ageRange as string;
        updated.heightCm = data.heightCm as number;
        updated.currentWeightKg = data.currentWeightKg as number;
        updated.unitSystem = data.unitSystem as UnitSystem;
        break;
      case "activity":
        updated.activityLevel = data.activityLevel as ActivityLevel;
        updated.experienceLevel = data.experienceLevel as ExperienceLevel;
        break;
      case "equipment":
        updated.workoutLocations = data.workoutLocations as WorkoutLocation[];
        updated.equipmentIds = data.equipmentIds as string[];
        break;
      case "schedule":
        updated.workoutDaysPerWeek = data.workoutDaysPerWeek as number;
        updated.preferredWeekdays = (data.preferredWeekdays as number[]) || [];
        updated.preferredSessionMinutes = data.preferredSessionMinutes as SessionDuration;
        break;
      case "nutrition":
        updated.dietPreferenceIds = (data.dietPreferenceIds as string[]) || [];
        break;
    }

    return updated;
  }

  /**
   * Get next step in sequence
   */
  private getNextStep(current: OnboardingStep): OnboardingStep {
    const index = STEP_ORDER.indexOf(current);
    return STEP_ORDER[Math.min(index + 1, STEP_ORDER.length - 1)];
  }
}

// Singleton instance
export const onboardingService = new OnboardingService();
