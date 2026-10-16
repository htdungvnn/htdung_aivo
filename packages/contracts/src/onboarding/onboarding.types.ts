/**
 * AIVO Onboarding Domain Types
 * Shared across Web, Mobile, and API
 */

// Onboarding Status
export type OnboardingStatus = "not_started" | "in_progress" | "completed" | "needs_review";

// Primary Goal
export type PrimaryGoal = "lose_fat" | "build_muscle" | "maintain" | "improve_fitness";

// Activity Level
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very_active";

// Training Experience Level
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

// Workout Location
export type WorkoutLocation = "home" | "gym" | "both" | "outdoors";

// Session Duration (minutes)
export type SessionDuration = 15 | 30 | 45 | 60 | 75;

// Unit System
export type UnitSystem = "metric" | "imperial";

// Onboarding Steps
export type OnboardingStep = 
  | "welcome" 
  | "goal" 
  | "profile" 
  | "activity" 
  | "equipment" 
  | "schedule" 
  | "nutrition" 
  | "review";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  "welcome",
  "goal",
  "profile",
  "activity",
  "equipment",
  "schedule",
  "nutrition",
  "review",
];

export const STEP_ORDER: OnboardingStep[] = ONBOARDING_STEPS;

/**
 * User Fitness Profile
 * Canonical profile data stored after onboarding completion
 */
export interface UserFitnessProfile {
  id: string;
  userId: string;
  status: OnboardingStatus;
  primaryGoal: PrimaryGoal | null;
  ageRange: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  unitSystem: UnitSystem;
  activityLevel: ActivityLevel | null;
  experienceLevel: ExperienceLevel | null;
  workoutLocations: WorkoutLocation[];
  equipmentIds: string[];
  workoutDaysPerWeek: number | null;
  preferredWeekdays: number[];
  preferredSessionMinutes: SessionDuration | null;
  dietPreferenceIds: string[];
  onboardingStep: OnboardingStep;
  onboardingVersion: number;
  revision: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Onboarding State Response
 */
export interface OnboardingStateResponse {
  status: OnboardingStatus;
  currentStep: OnboardingStep;
  revision: number;
  profile: Partial<UserFitnessProfile>;
  optionsVersion: string;
}

/**
 * Save Step Request
 */
export interface SaveStepRequest {
  expectedRevision: number;
  data: Record<string, unknown>;
}

/**
 * Save Step Response
 */
export interface SaveStepResponse {
  revision: number;
  currentStep: OnboardingStep;
  savedAt: string;
}

/**
 * Complete Onboarding Request
 */
export interface CompleteOnboardingRequest {
  expectedRevision: number;
  onboardingVersion?: number;
}

/**
 * Complete Onboarding Response
 */
export interface CompleteOnboardingResponse {
  status: OnboardingStatus;
  next: string;
  generation: {
    status: "queued" | "completed" | "failed";
    jobId?: string;
  };
}
