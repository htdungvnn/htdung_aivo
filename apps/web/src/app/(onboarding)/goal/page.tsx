"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { SelectionCard } from "@/components/onboarding/selection-card";
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation";
import { useOnboarding } from "@/lib/onboarding/use-onboarding";

export default function GoalPage() {
  const router = useRouter();
  const { state, saveStep, isLoading } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(
    (state?.profile?.primaryGoal as string) || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goals = [
    { id: "lose_fat", icon: "🔥", label: "Lose fat", desc: "Reduce body fat percentage" },
    { id: "build_muscle", icon: "💪", label: "Build muscle", desc: "Increase muscle mass and strength" },
    { id: "maintain", icon: "⚖️", label: "Maintain fitness", desc: "Stay in shape and healthy" },
    { id: "improve_fitness", icon: "🚀", label: "Improve fitness", desc: "Boost overall health and energy" },
  ];

  const handleContinue = async () => {
    if (!selectedGoal) {
      setError("Please select a goal");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await saveStep("goal", { primaryGoal: selectedGoal });
      router.push("/onboarding/profile");
    } catch (err) {
      console.error("Failed to save goal:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/onboarding/welcome");
  };

  if (isLoading) {
    return (
      <OnboardingShell currentStep="goal">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell currentStep="goal">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-primary font-medium mb-2">Step 2 of 8</p>
          <h1 className="text-2xl font-bold text-foreground">
            What's your main goal?
          </h1>
          <p className="text-muted-foreground mt-2">
            AIVO will use this goal to create the right starting plan.
          </p>
        </div>

        <div className="space-y-3" role="radiogroup" aria-label="Primary goal">
          {goals.map((goal) => (
            <SelectionCard
              key={goal.id}
              selected={selectedGoal === goal.id}
              onClick={() => {
                setSelectedGoal(goal.id);
                setError(null);
              }}
              icon={goal.icon}
              description={goal.desc}
            >
              {goal.label}
            </SelectionCard>
          ))}
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
          disabled={!selectedGoal}
        />
      </div>
    </OnboardingShell>
  );
}
