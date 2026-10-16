"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { SelectionCard } from "@/components/onboarding/selection-card";
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation";
import { useOnboarding } from "@/lib/onboarding/use-onboarding";

export default function NutritionPage() {
  const router = useRouter();
  const { state, saveStep, isLoading } = useOnboarding();
  const [preferences, setPreferences] = useState<string[]>(
    (state?.profile?.dietPreferenceIds as string[]) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dietOptions = [
    { id: "no_preference", icon: "✓", label: "No preference" },
    { id: "vegetarian", icon: "🥬", label: "Vegetarian" },
    { id: "vegan", icon: "🌱", label: "Vegan" },
    { id: "pescatarian", icon: "🐟", label: "Pescatarian" },
    { id: "high_protein", icon: "💪", label: "High protein" },
    { id: "low_carb", icon: "🍞", label: "Lower carbohydrate" },
    { id: "dairy_free", icon: "🥛", label: "Dairy free" },
    { id: "gluten_free", icon: "🌾", label: "Gluten free" },
  ];

  const togglePreference = (id: string) => {
    if (id === "no_preference") {
      setPreferences(["no_preference"]);
      return;
    }
    if (preferences.includes("no_preference")) {
      setPreferences([id]);
    } else if (preferences.includes(id)) {
      const newPrefs = preferences.filter((p) => p !== id);
      setPreferences(newPrefs.length === 0 ? ["no_preference"] : newPrefs);
    } else {
      setPreferences([...preferences, id]);
    }
    setError(null);
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await saveStep("nutrition", { dietPreferenceIds: preferences });
      router.push("/onboarding/review");
    } catch (err) {
      console.error("Failed to save nutrition:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => router.push("/onboarding/schedule");

  if (isLoading) {
    return (
      <OnboardingShell currentStep="nutrition">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell currentStep="nutrition">
      <div className="space-y-8">
        <div>
          <p className="text-sm text-primary font-medium mb-2">Step 7 of 8</p>
          <h1 className="text-2xl font-bold text-foreground">Nutrition preferences</h1>
          <p className="text-muted-foreground mt-2">What fits your lifestyle?</p>
        </div>

        <div className="space-y-2">
          {dietOptions.map((option) => (
            <SelectionCard
              key={option.id}
              selected={preferences.includes(option.id)}
              onClick={() => togglePreference(option.id)}
              icon={option.icon}
            >
              {option.label}
            </SelectionCard>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          AIVO provides general nutrition guidance, not medical diet advice.
        </p>

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

        <OnboardingNavigation
          onContinue={handleContinue}
          onBack={handleBack}
          continueLabel="Continue"
          isLoading={isSubmitting}
        />
      </div>
    </OnboardingShell>
  );
}
