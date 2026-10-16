"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation";
import { useOnboarding } from "@/lib/onboarding/use-onboarding";

interface ProfileData {
  primaryGoal: string | null;
  ageRange: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  activityLevel: string | null;
  experienceLevel: string | null;
  workoutLocations: string[];
  equipmentIds: string[];
  workoutDaysPerWeek: number | null;
  preferredSessionMinutes: number | null;
  dietPreferenceIds: string[];
}

const GOAL_LABELS: Record<string, string> = {
  lose_fat: "Lose fat",
  build_muscle: "Build muscle",
  maintain: "Maintain fitness",
  improve_fitness: "Improve fitness",
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Sedentary",
  light: "Lightly active",
  moderate: "Moderately active",
  very_active: "Very active",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function ReviewPage() {
  const router = useRouter();
  const { state, complete, isLoading } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profile: ProfileData = (state?.profile as unknown as ProfileData) || {
    primaryGoal: null,
    ageRange: null,
    heightCm: null,
    currentWeightKg: null,
    activityLevel: null,
    experienceLevel: null,
    workoutLocations: [],
    equipmentIds: [],
    workoutDaysPerWeek: null,
    preferredSessionMinutes: null,
    dietPreferenceIds: [],
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await complete();
      // Redirect to dashboard
      window.location.href = result.next;
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      setError("Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => router.push("/onboarding/nutrition");

  const editSection = (step: string) => {
    router.push(`/onboarding/${step}`);
  };

  if (isLoading) {
    return (
      <OnboardingShell currentStep="review">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell currentStep="review">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-primary font-medium mb-2">Step 8 of 8</p>
          <h1 className="text-2xl font-bold text-foreground">Review your profile</h1>
          <p className="text-muted-foreground mt-2">
            Here's what we've set up for you. You can change these anytime.
          </p>
        </div>

        <div className="space-y-4">
          {/* Goal */}
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Goal</p>
                <p className="font-medium text-foreground mt-1">
                  {GOAL_LABELS[profile.primaryGoal as string] || "-"}
                </p>
              </div>
              <button
                onClick={() => editSection("goal")}
                className="text-sm text-primary hover:underline"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Profile */}
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Profile</p>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-foreground">
                    Age: {profile.ageRange || "-"}
                  </p>
                  <p className="text-sm text-foreground">
                    Height: {profile.heightCm ? `${Math.round(profile.heightCm)} cm` : "-"}
                  </p>
                  <p className="text-sm text-foreground">
                    Weight: {profile.currentWeightKg ? `${Math.round(profile.currentWeightKg)} kg` : "-"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => editSection("profile")}
                className="text-sm text-primary hover:underline"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Activity */}
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Activity</p>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-foreground">
                    Level: {ACTIVITY_LABELS[profile.activityLevel as string] || "-"}
                  </p>
                  <p className="text-sm text-foreground">
                    Experience: {EXPERIENCE_LABELS[profile.experienceLevel as string] || "-"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => editSection("activity")}
                className="text-sm text-primary hover:underline"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Equipment */}
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Equipment</p>
                <div className="mt-1">
                  {Array.isArray(profile.workoutLocations) && profile.workoutLocations.length > 0 ? (
                    <p className="text-sm text-foreground">
                      {profile.workoutLocations.join(", ")}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">-</p>
                  )}
                  {Array.isArray(profile.equipmentIds) && profile.equipmentIds.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {profile.equipmentIds.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => editSection("equipment")}
                className="text-sm text-primary hover:underline"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Schedule */}
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Schedule</p>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-foreground">
                    {profile.workoutDaysPerWeek || "-"} days per week
                  </p>
                  <p className="text-sm text-foreground">
                    {profile.preferredSessionMinutes || "-"} min sessions
                  </p>
                </div>
              </div>
              <button
                onClick={() => editSection("schedule")}
                className="text-sm text-primary hover:underline"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Nutrition */}
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Nutrition</p>
                <p className="text-sm text-foreground mt-1">
                  {Array.isArray(profile.dietPreferenceIds) && profile.dietPreferenceIds.length > 0
                    ? profile.dietPreferenceIds.map((p: string) => p.replace(/_/g, " ")).join(", ")
                    : "No preference"}
                </p>
              </div>
              <button
                onClick={() => editSection("nutrition")}
                className="text-sm text-primary hover:underline"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="pt-4">
          <button
            onClick={handleComplete}
            disabled={isSubmitting}
            className={`
              w-full px-6 py-4 rounded-xl font-medium text-lg transition-all
              ${isSubmitting
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Preparing your plan...
              </span>
            ) : (
              "Build My Plan →"
            )}
          </button>
        </div>

        <OnboardingNavigation
          onBack={handleBack}
          showBack={true}
        />
      </div>
    </OnboardingShell>
  );
}
