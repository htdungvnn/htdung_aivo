"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { SelectionCard } from "@/components/onboarding/selection-card";
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation";
import { useOnboarding } from "@/lib/onboarding/use-onboarding";

export default function ActivityPage() {
  const router = useRouter();
  const { state, saveStep, isLoading } = useOnboarding();
  const [activityLevel, setActivityLevel] = useState<string | null>(
    (state?.profile?.activityLevel as string) || null
  );
  const [experienceLevel, setExperienceLevel] = useState<string | null>(
    (state?.profile?.experienceLevel as string) || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activityLevels = [
    { id: "sedentary", icon: "🪑", label: "Sedentary", desc: "Mostly seated, little planned activity" },
    { id: "light", icon: "🚶", label: "Lightly active", desc: "Light activity 1-2 days per week" },
    { id: "moderate", icon: "🏃", label: "Moderately active", desc: "Active movement 3-4 days per week" },
    { id: "very_active", icon: "💪", label: "Very active", desc: "Demanding activity 5+ days per week" },
  ];

  const experienceLevels = [
    { id: "beginner", icon: "🌱", label: "Beginner", desc: "New to training" },
    { id: "intermediate", icon: "📈", label: "Intermediate", desc: "1-3 years of consistent training" },
    { id: "advanced", icon: "🏆", label: "Advanced", desc: "3+ years of structured training" },
  ];

  const handleContinue = async () => {
    if (!activityLevel || !experienceLevel) {
      setError("Please select both activity level and experience level");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await saveStep("activity", {
        activityLevel,
        experienceLevel,
      });
      router.push("/onboarding/equipment");
    } catch (err) {
      console.error("Failed to save activity:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/onboarding/profile");
  };

  if (isLoading) {
    return (
      <OnboardingShell currentStep="activity">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell currentStep="activity">
      <div className="space-y-8">
        <div>
          <p className="text-sm text-primary font-medium mb-2">Step 4 of 8</p>
          <h1 className="text-2xl font-bold text-foreground">Activity & Experience</h1>
          <p className="text-muted-foreground mt-2">
            This helps us understand your current fitness level.
          </p>
        </div>

        {/* Activity Level */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">Current activity level</label>
          <div className="space-y-2" role="radiogroup" aria-label="Activity level">
            {activityLevels.map((level) => (
              <SelectionCard
                key={level.id}
                selected={activityLevel === level.id}
                onClick={() => {
                  setActivityLevel(level.id);
                  setError(null);
                }}
                icon={level.icon}
                description={level.desc}
              >
                {level.label}
              </SelectionCard>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">Training experience</label>
          <div className="space-y-2" role="radiogroup" aria-label="Training experience">
            {experienceLevels.map((level) => (
              <SelectionCard
                key={level.id}
                selected={experienceLevel === level.id}
                onClick={() => {
                  setExperienceLevel(level.id);
                  setError(null);
                }}
                icon={level.icon}
                description={level.desc}
              >
                {level.label}
              </SelectionCard>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <OnboardingNavigation
          onContinue={handleContinue}
          onBack={handleBack}
          continueLabel="Continue"
          isLoading={isSubmitting}
          disabled={!activityLevel || !experienceLevel}
        />
      </div>
    </OnboardingShell>
  );
}
