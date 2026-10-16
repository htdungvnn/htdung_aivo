"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { SelectionCard } from "@/components/onboarding/selection-card";
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation";
import { useOnboarding } from "@/lib/onboarding/use-onboarding";

export default function EquipmentPage() {
  const router = useRouter();
  const { state, saveStep, isLoading } = useOnboarding();
  const [locations, setLocations] = useState<string[]>(
    (state?.profile?.workoutLocations as string[]) || []
  );
  const [equipment, setEquipment] = useState<string[]>(
    (state?.profile?.equipmentIds as string[]) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationOptions = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "gym", icon: "🏋️", label: "Gym" },
    { id: "both", icon: "🔄", label: "Both" },
    { id: "outdoors", icon: "🌳", label: "Outdoors" },
  ];

  const equipmentOptions = [
    { id: "no_equipment", icon: "✋", label: "No equipment" },
    { id: "dumbbells", icon: "🏋️", label: "Dumbbells" },
    { id: "resistance_bands", icon: "➰", label: "Resistance bands" },
    { id: "barbell", icon: "🔧", label: "Barbell & plates" },
    { id: "bench", icon: "🪑", label: "Bench" },
    { id: "pullup_bar", icon: "单", label: "Pull-up bar" },
    { id: "cable_machine", icon: "⚙️", label: "Cable machine" },
    { id: "full_gym", icon: "🏢", label: "Full gym access" },
  ];

  const toggleLocation = (id: string) => {
    if (locations.includes(id)) {
      setLocations(locations.filter((l) => l !== id));
    } else {
      setLocations([...locations, id]);
    }
    setError(null);
  };

  const toggleEquipment = (id: string) => {
    if (id === "no_equipment") {
      setEquipment(["no_equipment"]);
      return;
    }
    if (equipment.includes("no_equipment")) {
      setEquipment([id]);
    } else if (equipment.includes(id)) {
      setEquipment(equipment.filter((e) => e !== id));
    } else {
      setEquipment([...equipment, id]);
    }
    setError(null);
  };

  const handleContinue = async () => {
    if (locations.length === 0) {
      setError("Please select at least one workout location");
      return;
    }
    if (equipment.length === 0) {
      setError("Please select at least one equipment option");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await saveStep("equipment", { workoutLocations: locations, equipmentIds: equipment });
      router.push("/onboarding/schedule");
    } catch (err) {
      console.error("Failed to save equipment:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => router.push("/onboarding/activity");

  if (isLoading) {
    return (
      <OnboardingShell currentStep="equipment">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell currentStep="equipment">
      <div className="space-y-8">
        <div>
          <p className="text-sm text-primary font-medium mb-2">Step 5 of 8</p>
          <h1 className="text-2xl font-bold text-foreground">Equipment & Location</h1>
          <p className="text-muted-foreground mt-2">Where do you prefer to work out?</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">Preferred location</label>
          <div className="grid grid-cols-2 gap-2">
            {locationOptions.map((loc) => (
              <SelectionCard
                key={loc.id}
                selected={locations.includes(loc.id)}
                onClick={() => toggleLocation(loc.id)}
                icon={loc.icon}
              >
                {loc.label}
              </SelectionCard>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">Available equipment</label>
          <div className="space-y-2">
            {equipmentOptions.map((eq) => (
              <SelectionCard
                key={eq.id}
                selected={equipment.includes(eq.id)}
                onClick={() => toggleEquipment(eq.id)}
                icon={eq.icon}
              >
                {eq.label}
              </SelectionCard>
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
