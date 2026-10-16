import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { SelectionCard } from "@/features/onboarding/components/selection-card";
import { ProgressBar } from "@/features/onboarding/components/progress-bar";
import { useOnboardingContext } from "@/features/onboarding/hooks/use-onboarding";

const TOTAL_STEPS = 8;

export default function ActivityScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { state, saveStep } = useOnboardingContext();
  const [activityLevel, setActivityLevel] = useState<string | null>((state?.profile?.activityLevel as string) || null);
  const [experienceLevel, setExperienceLevel] = useState<string | null>((state?.profile?.experienceLevel as string) || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activities = [
    { id: "sedentary", icon: "🪑", label: "Sedentary", desc: "Mostly seated" },
    { id: "light", icon: "🚶", label: "Lightly active", desc: "1-2 days/week" },
    { id: "moderate", icon: "🏃", label: "Moderately active", desc: "3-4 days/week" },
    { id: "very_active", icon: "💪", label: "Very active", desc: "5+ days/week" },
  ];

  const experiences = [
    { id: "beginner", icon: "🌱", label: "Beginner", desc: "New to training" },
    { id: "intermediate", icon: "📈", label: "Intermediate", desc: "1-3 years" },
    { id: "advanced", icon: "🏆", label: "Advanced", desc: "3+ years" },
  ];

  const handleContinue = async () => {
    if (!activityLevel || !experienceLevel) { setError("Select both levels"); return; }
    setIsSubmitting(true);
    try {
      await saveStep("activity", { activityLevel, experienceLevel });
      router.push("/(onboarding)/equipment" as any);
    } catch { setError("Failed to save"); } finally { setIsSubmitting(false); }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ProgressBar current={4} total={TOTAL_STEPS} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={[styles.backButton, { color: theme.primary }]}>← Back</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>Activity & Experience</Text>
        <Text style={[styles.description, { color: theme.foregroundMuted }]}>Help us understand your fitness level.</Text>
        <Text style={[styles.label, { color: theme.foreground }]}>Activity level</Text>
        <View style={styles.options}>
          {activities.map((a) => (
            <SelectionCard key={a.id} selected={activityLevel === a.id} onPress={() => { setActivityLevel(a.id); setError(null); }} icon={a.icon} label={a.label} description={a.desc} />
          ))}
        </View>
        <Text style={[styles.label, { color: theme.foreground }]}>Training experience</Text>
        <View style={styles.options}>
          {experiences.map((e) => (
            <SelectionCard key={e.id} selected={experienceLevel === e.id} onPress={() => { setExperienceLevel(e.id); setError(null); }} icon={e.icon} label={e.label} description={e.desc} />
          ))}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.continueButton, { backgroundColor: activityLevel && experienceLevel ? theme.primary : theme.border }]} onPress={handleContinue} disabled={!activityLevel || !experienceLevel || isSubmitting}>
          <Text style={styles.continueText}>{isSubmitting ? "..." : "Continue"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, header: { paddingHorizontal: 20, paddingVertical: 12 },
  backButton: { fontSize: 16, fontWeight: "500" }, content: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  options: { gap: 8 }, error: { color: "#B42318", fontSize: 14, marginTop: 16 },
  footer: { padding: 20, paddingBottom: 32 }, continueButton: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  continueText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
