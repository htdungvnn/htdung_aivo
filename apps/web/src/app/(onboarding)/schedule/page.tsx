"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation";
import { useOnboarding } from "@/lib/onboarding/use-onboarding";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DURATIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 75, label: "75+ min" },
];

export default function SchedulePage() {
  const router = useRouter();
  const { state, saveStep, isLoading } = useOnboarding();
  const [daysPerWeek, setDaysPerWeek] = useState<number>(
    (state?.profile?.workoutDaysPerWeek as number) || 3
  );
  const [sessionDuration, setSessionDuration] = useState<number>(
    (state?.profile?.preferredSessionMinutes as number) || 45
  );
  const [preferredDays, setPreferredDays] = useState<number[]>(
    (state?.profile?.preferredWeekdays as number[]) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDay = (day: number) => {
    if (preferredDays.includes(day)) {
      setPreferredDays(preferredDays.filter((d) => d !== day));
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await saveStep("schedule", {
        workoutDaysPerWeek: daysPerWeek,
        preferredSessionMinutes: sessionDuration,
        preferredWeekdays: preferredDays,
      });
      router.push("/onboarding/nutrition");
    } catch (err) {
      console.error("Failed to save schedule:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => router.push("/onboarding/equipment");

  if (isLoading) {
    return (
      <OnboardingShell currentStep="schedule">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell currentStep="schedule">
      <div className="space-y-8">
        <div>
          <p className="text-sm text-primary font-medium mb-2">Step 6 of 8</p>
          <h1 className="text-2xl font-bold text-foreground">Your schedule</h1>
          <p className="text-muted-foreground mt-2">How often can you work out?</p>
        </div>

        {/* Days per week */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Workout days per week: <span className="text-primary font-bold">{daysPerWeek}</span>
          </label>
          <input
            type="range"
            min={1}
            max={7}
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 day</span>
            <span>7 days</span>
          </div>
        </div>

        {/* Session duration */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">Preferred session length</label>
          <div className="grid grid-cols-5 gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setSessionDuration(d.value)}
                className={`
                  p-3 rounded-lg border-2 text-sm font-medium transition-all
                  ${sessionDuration === d.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred days (optional) */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Preferred days <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <div className="flex gap-2 justify-between">
            {DAYS.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(index)}
                className={`
                  w-12 h-12 rounded-full border-2 text-sm font-medium transition-all
                  ${preferredDays.includes(index)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

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
