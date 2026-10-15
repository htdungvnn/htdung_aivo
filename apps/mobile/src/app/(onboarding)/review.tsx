import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { ProgressBar } from "@/features/onboarding/components/progress-bar";
import { useOnboardingContext } from "@/features/onboarding/hooks/use-onboarding";

const TOTAL_STEPS = 8;

const LABELS = {
  goals: { lose_fat: "Lose fat", build_muscle: "Build muscle", maintain: "Maintain", improve_fitness: "Improve fitness" },
  activity: { sedentary: "Sedentary", light: "Lightly active", moderate: "Moderate", very_active: "Very active" },
  experience: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
};

interface SectionProps { title: string; children: React.ReactNode; onEdit: () => void; theme: any; }
function Section({ title, children, onEdit, theme }: SectionProps) {
  return (
    <View style={[styles.section, { borderColor: theme.border }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.foregroundMuted }]}>{title}</Text>
        <TouchableOpacity onPress={onEdit}><Text style={[styles.editBtn, { color: theme.primary }]}>Edit</Text></TouchableOpacity>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

export default function ReviewScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { state, complete } = useOnboardingContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const p: any = state?.profile || {};

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await complete();
      router.replace("/(tabs)" as any);
    } catch (e) {
      setError("Failed to complete");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goalLabel = LABELS.goals[p.primaryGoal as keyof typeof LABELS.goals] || "-";
  const activityLabel = LABELS.activity[p.activityLevel as keyof typeof LABELS.activity] || "-";
  const expLabel = LABELS.experience[p.experienceLevel as keyof typeof LABELS.experience] || "-";
  const locLabel = Array.isArray(p.workoutLocations) ? p.workoutLocations.join(", ") : "-";
  const dietLabel = Array.isArray(p.dietPreferenceIds) ? p.dietPreferenceIds.map((d: string) => d.replace(/_/g, " ")).join(", ") : "-";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ProgressBar current={8} total={TOTAL_STEPS} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={[styles.backButton, { color: theme.primary }]}>← Back</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>Review your profile</Text>
        <Text style={[styles.description, { color: theme.foregroundMuted }]}>You can change these anytime.</Text>

        <Section title="GOAL" onEdit={() => router.push("/(onboarding)/goal" as any)} theme={theme}>
          <Text style={[styles.value, { color: theme.foreground }]}>{goalLabel}</Text>
        </Section>

        <Section title="PROFILE" onEdit={() => router.push("/(onboarding)/profile" as any)} theme={theme}>
          <Text style={styles.value}>Age: {p.ageRange || "-"}</Text>
          <Text style={styles.value}>Height: {p.heightCm ? `${Math.round(p.heightCm)} cm` : "-"}</Text>
          <Text style={styles.value}>Weight: {p.currentWeightKg ? `${Math.round(p.currentWeightKg)} kg` : "-"}</Text>
        </Section>

        <Section title="ACTIVITY" onEdit={() => router.push("/(onboarding)/activity" as any)} theme={theme}>
          <Text style={styles.value}>{activityLabel}</Text>
          <Text style={styles.value}>{expLabel}</Text>
        </Section>

        <Section title="EQUIPMENT" onEdit={() => router.push("/(onboarding)/equipment" as any)} theme={theme}>
          <Text style={styles.value}>{locLabel}</Text>
        </Section>

        <Section title="SCHEDULE" onEdit={() => router.push("/(onboarding)/schedule" as any)} theme={theme}>
          <Text style={styles.value}>{p.workoutDaysPerWeek || "-"} days/week, {p.preferredSessionMinutes || "-"} min</Text>
        </Section>

        <Section title="NUTRITION" onEdit={() => router.push("/(onboarding)/nutrition" as any)} theme={theme}>
          <Text style={styles.value}>{dietLabel}</Text>
        </Section>

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleComplete} disabled={isSubmitting}>
          <Text style={styles.buttonText}>{isSubmitting ? "Preparing..." : "Build My Plan →"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, header: { paddingHorizontal: 20, paddingVertical: 12 },
  backButton: { fontSize: 16, fontWeight: "500" }, content: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 24 },
  section: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  sectionTitle: { fontSize: 12, fontWeight: "600", letterSpacing: 0.5 },
  editBtn: { fontSize: 14 },
  sectionContent: { gap: 4 },
  value: { fontSize: 14 },
  error: { color: "#B42318", fontSize: 14, textAlign: "center", marginTop: 16 },
  footer: { padding: 20, paddingBottom: 32 }, button: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
