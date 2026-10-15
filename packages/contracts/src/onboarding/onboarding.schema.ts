/**
 * AIVO Onboarding Zod Schemas
 * Runtime validation for API and forms
 */
import { z } from "zod";

// Enums
export const unitSystemSchema = z.enum(["metric", "imperial"]);
export const primaryGoalSchema = z.enum(["lose_fat", "build_muscle", "maintain", "improve_fitness"]);
export const activityLevelSchema = z.enum(["sedentary", "light", "moderate", "very_active"]);
export const experienceLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
export const workoutLocationSchema = z.enum(["home", "gym", "both", "outdoors"]);
export const sessionDurationSchema = z.union([
  z.literal(15),
  z.literal(30),
  z.literal(45),
  z.literal(60),
  z.literal(75),
]);

// Age range options: "18-25", "26-35", "36-45", "46-55", "56-65", "65+"
export const ageRangeSchema = z.string().regex(/^\d+-\d+$|^\d+\+$/, "Invalid age range format");

// Step schemas for validation
export const goalStepSchema = z.object({
  primaryGoal: primaryGoalSchema,
});

export const profileStepSchema = z.object({
  ageRange: ageRangeSchema,
  heightCm: z.number().min(100, "Height must be at least 100cm").max(250, "Height must be at most 250cm"),
  currentWeightKg: z.number().min(30, "Weight must be at least 30kg").max(300, "Weight must be at most 300kg"),
  unitSystem: unitSystemSchema.default("metric"),
});

export const activityStepSchema = z.object({
  activityLevel: activityLevelSchema,
  experienceLevel: experienceLevelSchema,
});

export const equipmentStepSchema = z.object({
  workoutLocations: z.array(workoutLocationSchema).min(1, "Select at least one location"),
  equipmentIds: z.array(z.string()).min(1, "Select at least one equipment option"),
});

export const scheduleStepSchema = z.object({
  workoutDaysPerWeek: z.number().int().min(1, "At least 1 day").max(7, "At most 7 days"),
  preferredWeekdays: z.array(z.number().int().min(0).max(6)).optional(),
  preferredSessionMinutes: sessionDurationSchema,
});

export const nutritionStepSchema = z.object({
  dietPreferenceIds: z.array(z.string()),
});

// Save step request
export const saveStepRequestSchema = z.object({
  expectedRevision: z.number().int().min(0),
  data: z.record(z.unknown()),
});

// Complete onboarding request
export const completeOnboardingRequestSchema = z.object({
  expectedRevision: z.number().int().min(0),
  onboardingVersion: z.number().int().default(1),
});

// Type exports
export type UnitSystemInput = z.infer<typeof unitSystemSchema>;
export type PrimaryGoalInput = z.infer<typeof primaryGoalSchema>;
export type ActivityLevelInput = z.infer<typeof activityLevelSchema>;
export type ExperienceLevelInput = z.infer<typeof experienceLevelSchema>;
export type WorkoutLocationInput = z.infer<typeof workoutLocationSchema>;
export type SessionDurationInput = z.infer<typeof sessionDurationSchema>;
