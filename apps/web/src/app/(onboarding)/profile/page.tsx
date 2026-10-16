"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation";
import { useOnboarding } from "@/lib/onboarding/use-onboarding";

const AGE_RANGES = ["18-25", "26-35", "36-45", "46-55", "56-65", "65+"];

export default function ProfilePage() {
  const router = useRouter();
  const { state, saveStep, isLoading } = useOnboarding();
  const [ageRange, setAgeRange] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (state?.profile) {
      const profile = state.profile;
      if (profile.ageRange) setAgeRange(profile.ageRange as string);
      if (profile.heightCm) {
        const h = profile.heightCm as number;
        setHeight(unitSystem === "imperial" ? String(Math.round(h / 2.54)) : String(Math.round(h)));
      }
      if (profile.currentWeightKg) {
        const w = profile.currentWeightKg as number;
        setWeight(unitSystem === "imperial" ? String(Math.round(w * 2.205)) : String(Math.round(w)));
      }
      if (profile.unitSystem) setUnitSystem(profile.unitSystem as "metric" | "imperial");
    }
  }, [state?.profile]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!ageRange) newErrors.ageRange = "Please select an age range";
    
    const heightNum = parseFloat(height);
    if (!height || isNaN(heightNum)) {
      newErrors.height = "Please enter your height";
    } else if (unitSystem === "metric" && (heightNum < 100 || heightNum > 250)) {
      newErrors.height = "Height must be between 100-250 cm";
    } else if (unitSystem === "imperial" && (heightNum < 40 || heightNum > 100)) {
      newErrors.height = "Height must be between 40-100 inches";
    }

    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum)) {
      newErrors.weight = "Please enter your weight";
    } else if (unitSystem === "metric" && (weightNum < 30 || weightNum > 300)) {
      newErrors.weight = "Weight must be between 30-300 kg";
    } else if (unitSystem === "imperial" && (weightNum < 66 || weightNum > 660)) {
      newErrors.weight = "Weight must be between 66-660 lbs";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const heightNum = parseFloat(height);
      const weightNum = parseFloat(weight);

      // Convert to canonical units (metric)
      const heightCm = unitSystem === "imperial" ? heightNum * 2.54 : heightNum;
      const weightKg = unitSystem === "imperial" ? weightNum * 0.453592 : weightNum;

      await saveStep("profile", {
        ageRange,
        heightCm,
        currentWeightKg: weightKg,
        unitSystem,
      });
      router.push("/onboarding/activity");
    } catch (err) {
      console.error("Failed to save profile:", err);
      setErrors({ submit: "Failed to save. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/onboarding/goal");
  };

  if (isLoading) {
    return (
      <OnboardingShell currentStep="profile">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell currentStep="profile">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-primary font-medium mb-2">Step 3 of 8</p>
          <h1 className="text-2xl font-bold text-foreground">
            Tell us about yourself
          </h1>
          <p className="text-muted-foreground mt-2">
            This helps establish a useful starting point for your plan.
          </p>
        </div>

        {/* Age Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Age range</label>
          <div className="grid grid-cols-3 gap-2">
            {AGE_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => {
                  setAgeRange(range);
                  setErrors((prev) => ({ ...prev, ageRange: "" }));
                }}
                className={`
                  p-3 rounded-lg border-2 text-sm font-medium transition-all
                  ${ageRange === range
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                {range}
              </button>
            ))}
          </div>
          {errors.ageRange && <p className="text-sm text-destructive">{errors.ageRange}</p>}
        </div>

        {/* Unit System */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Unit system</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setUnitSystem("metric");
                setHeight("");
                setWeight("");
              }}
              className={`
                flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all
                ${unitSystem === "metric"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
                }
              `}
            >
              Metric (kg, cm)
            </button>
            <button
              type="button"
              onClick={() => {
                setUnitSystem("imperial");
                setHeight("");
                setWeight("");
              }}
              className={`
                flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all
                ${unitSystem === "imperial"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
                }
              `}
            >
              Imperial (lb, in)
            </button>
          </div>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Height ({unitSystem === "metric" ? "cm" : "inches"})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              setErrors((prev) => ({ ...prev, height: "" }));
            }}
            placeholder={unitSystem === "metric" ? "e.g. 175" : "e.g. 69"}
            className={`
              w-full p-3 rounded-lg border-2 bg-background text-foreground
              focus:outline-none focus:border-primary
              ${errors.height ? "border-destructive" : "border-border"}
            `}
          />
          {errors.height && <p className="text-sm text-destructive">{errors.height}</p>}
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Current weight ({unitSystem === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setErrors((prev) => ({ ...prev, weight: "" }));
            }}
            placeholder={unitSystem === "metric" ? "e.g. 70" : "e.g. 154"}
            className={`
              w-full p-3 rounded-lg border-2 bg-background text-foreground
              focus:outline-none focus:border-primary
              ${errors.weight ? "border-destructive" : "border-border"}
            `}
          />
          {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
        </div>

        <p className="text-sm text-muted-foreground">
          These measurements help calculate your starting targets.
        </p>

        {errors.submit && (
          <p className="text-sm text-destructive" role="alert">
            {errors.submit}
          </p>
        )}

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
