import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { ProgressBar } from "@/features/onboarding/components/progress-bar";
import { useOnboardingContext } from "@/features/onboarding/hooks/use-onboarding";

const TOTAL_STEPS = 8;
const AGE_RANGES = ["18-25", "26-35", "36-45", "46-55", "56-65", "65+"];

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { state, saveStep } = useOnboardingContext();
  const [ageRange, setAgeRange] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (state?.profile) {
      const p = state.profile;
      if (p.ageRange) setAgeRange(p.ageRange as string);
      if (p.heightCm) setHeight(String(Math.round(p.heightCm as number)));
      if (p.currentWeightKg) setWeight(String(Math.round(p.currentWeightKg as number)));
      if (p.unitSystem) setUnitSystem(p.unitSystem as "metric" | "imperial");
    }
  }, [state?.profile]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!ageRange) newErrors.ageRange = "Select age range";
    const h = parseFloat(height);
    if (!height || isNaN(h)) newErrors.height = "Enter height";
    const w = parseFloat(weight);
    if (!weight || isNaN(w)) newErrors.weight = "Enter weight";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const h = parseFloat(height);
      const w = parseFloat(weight);
      await saveStep("profile", {
        ageRange,
        heightCm: h,
        currentWeightKg: w,
        unitSystem,
      });
      router.push("/(onboarding)/activity" as any);
    } catch (e) {
      setErrors({ submit: "Failed to save" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ProgressBar current={3} total={TOTAL_STEPS} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>Tell us about yourself</Text>
        <Text style={[styles.description, { color: theme.foregroundMuted }]}>
          This helps establish a useful starting point.
        </Text>

        <Text style={[styles.label, { color: theme.foreground }]}>Age range</Text>
        <View style={styles.ageGrid}>
          {AGE_RANGES.map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => { setAgeRange(range); setErrors({}); }}
              style={[styles.ageButton, { borderColor: ageRange === range ? theme.primary : theme.border, backgroundColor: ageRange === range ? theme.primarySubtle || "#E8F5E9" : "transparent" }]}
            >
              <Text style={{ color: theme.foreground }}>{range}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.ageRange && <Text style={styles.error}>{errors.ageRange}</Text>}

        <Text style={[styles.label, { color: theme.foreground }]}>Unit system</Text>
        <View style={styles.unitRow}>
          <TouchableOpacity onPress={() => { setUnitSystem("metric"); setHeight(""); setWeight(""); }} style={[styles.unitButton, { borderColor: unitSystem === "metric" ? theme.primary : theme.border }]}><Text>Metric</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { setUnitSystem("imperial"); setHeight(""); setWeight(""); }} style={[styles.unitButton, { borderColor: unitSystem === "imperial" ? theme.primary : theme.border }]}><Text>Imperial</Text></TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: theme.foreground }]}>Height ({unitSystem === "metric" ? "cm" : "in"})</Text>
        <TextInput style={[styles.input, { borderColor: errors.height ? "#B42318" : theme.border, color: theme.foreground }]} value={height} onChangeText={(t) => { setHeight(t); setErrors({}); }} keyboardType="numeric" placeholder={unitSystem === "metric" ? "175" : "69"} placeholderTextColor={theme.foregroundMuted} />
        {errors.height && <Text style={styles.error}>{errors.height}</Text>}

        <Text style={[styles.label, { color: theme.foreground }]}>Weight ({unitSystem === "metric" ? "kg" : "lbs"})</Text>
        <TextInput style={[styles.input, { borderColor: errors.weight ? "#B42318" : theme.border, color: theme.foreground }]} value={weight} onChangeText={(t) => { setWeight(t); setErrors({}); }} keyboardType="numeric" placeholder={unitSystem === "metric" ? "70" : "154"} placeholderTextColor={theme.foregroundMuted} />
        {errors.weight && <Text style={styles.error}>{errors.weight}</Text>}
        {errors.submit && <Text style={styles.error}>{errors.submit}</Text>}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.continueButton, { backgroundColor: theme.primary }]} onPress={handleContinue} disabled={isSubmitting}>
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
  ageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  ageButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 2 },
  unitRow: { flexDirection: "row", gap: 8 },
  unitButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 2, alignItems: "center" },
  input: { borderWidth: 2, borderRadius: 8, padding: 12, fontSize: 16 },
  error: { color: "#B42318", fontSize: 12, marginTop: 4 },
  footer: { padding: 20, paddingBottom: 32 }, continueButton: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  continueText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
