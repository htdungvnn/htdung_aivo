import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { SelectionCard } from "@/features/onboarding/components/selection-card";
import { ProgressBar } from "@/features/onboarding/components/progress-bar";
import { useOnboardingContext } from "@/features/onboarding/hooks/use-onboarding";

const TOTAL_STEPS = 8;

export default function GoalScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { state, saveStep } = useOnboardingContext();
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
      router.push("/(onboarding)/profile" as any);
    } catch (err) {
      console.error("Failed to save goal:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ProgressBar current={2} total={TOTAL_STEPS} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>
          What's your main goal?
        </Text>
        <Text style={[styles.description, { color: theme.foregroundMuted }]}>
          AIVO will use this goal to create the right starting plan.
        </Text>

        <View style={styles.options}>
          {goals.map((goal) => (
            <SelectionCard
              key={goal.id}
              selected={selectedGoal === goal.id}
              onPress={() => {
                setSelectedGoal(goal.id);
                setError(null);
              }}
              icon={goal.icon}
              label={goal.label}
              description={goal.desc}
            />
          ))}
        </View>

        {error && (
          <Text style={[styles.error, { color: "#B42318" }]}>{error}</Text>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: selectedGoal ? theme.primary : theme.border },
          ]}
          onPress={handleContinue}
          disabled={!selectedGoal || isSubmitting}
        >
          <Text style={styles.continueText}>
            {isSubmitting ? "..." : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 12 },
  backButton: { fontSize: 16, fontWeight: "500" },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 32 },
  options: { gap: 12 },
  error: { fontSize: 14, marginTop: 16 },
  footer: { padding: 20, paddingBottom: 32 },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  continueText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
