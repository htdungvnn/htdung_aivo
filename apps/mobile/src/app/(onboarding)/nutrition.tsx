import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { SelectionCard } from "@/features/onboarding/components/selection-card";
import { ProgressBar } from "@/features/onboarding/components/progress-bar";
import { useOnboardingContext } from "@/features/onboarding/hooks/use-onboarding";

const TOTAL_STEPS = 8;

export default function NutritionScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { state, saveStep } = useOnboardingContext();
  const [prefs, setPrefs] = useState<string[]>((state?.profile?.dietPreferenceIds as string[]) || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = [
    { id: "no_preference", icon: "✓", label: "No preference" },
    { id: "vegetarian", icon: "🥬", label: "Vegetarian" },
    { id: "vegan", icon: "🌱", label: "Vegan" },
    { id: "pescatarian", icon: "🐟", label: "Pescatarian" },
    { id: "high_protein", icon: "💪", label: "High protein" },
    { id: "low_carb", icon: "🍞", label: "Lower carb" },
  ];

  const toggle = (id: string) => {
    if (id === "no_preference") { setPrefs(["no_preference"]); return; }
    setPrefs(prev => {
      if (prev.includes("no_preference")) return [id];
      return prev.includes(id) ? (prev.length === 1 ? ["no_preference"] : prev.filter(p => p !== id)) : [...prev, id];
    });
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    try { await saveStep("nutrition", { dietPreferenceIds: prefs }); router.push("/(onboarding)/review" as any); }
    catch (e) { console.error(e); } finally { setIsSubmitting(false); }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ProgressBar current={7} total={TOTAL_STEPS} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={[styles.backButton, { color: theme.primary }]}>← Back</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>Nutrition preferences</Text>
        <Text style={[styles.description, { color: theme.foregroundMuted }]}>What fits your lifestyle?</Text>
        <View style={styles.options}>
          {options.map(o => (
            <SelectionCard key={o.id} selected={prefs.includes(o.id)} onPress={() => toggle(o.id)} icon={o.icon} label={o.label} />
          ))}
        </View>
        <Text style={[styles.disclaimer, { color: theme.foregroundMuted }]}>General nutrition guidance, not medical advice.</Text>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleContinue} disabled={isSubmitting}>
          <Text style={styles.buttonText}>{isSubmitting ? "..." : "Continue"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, header: { paddingHorizontal: 20, paddingVertical: 12 },
  backButton: { fontSize: 16, fontWeight: "500" }, content: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 24 }, options: { gap: 8 },
  disclaimer: { fontSize: 12, marginTop: 24 },
  footer: { padding: 20, paddingBottom: 32 }, button: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
