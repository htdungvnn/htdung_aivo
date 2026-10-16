import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { SelectionCard } from "@/features/onboarding/components/selection-card";
import { ProgressBar } from "@/features/onboarding/components/progress-bar";
import { useOnboardingContext } from "@/features/onboarding/hooks/use-onboarding";

const TOTAL_STEPS = 8;

export default function EquipmentScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { state, saveStep } = useOnboardingContext();
  const [locations, setLocations] = useState<string[]>((state?.profile?.workoutLocations as string[]) || []);
  const [equipment, setEquipment] = useState<string[]>((state?.profile?.equipmentIds as string[]) || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locations_opts = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "gym", icon: "🏋️", label: "Gym" },
    { id: "both", icon: "🔄", label: "Both" },
    { id: "outdoors", icon: "🌳", label: "Outdoors" },
  ];

  const equipment_opts = [
    { id: "no_equipment", icon: "✋", label: "No equipment" },
    { id: "dumbbells", icon: "🏋️", label: "Dumbbells" },
    { id: "resistance_bands", icon: "➰", label: "Resistance bands" },
    { id: "full_gym", icon: "🏢", label: "Full gym access" },
  ];

  const toggleLocation = (id: string) => {
    setLocations(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    setError(null);
  };

  const toggleEquipment = (id: string) => {
    if (id === "no_equipment") { setEquipment(["no_equipment"]); return; }
    setEquipment(prev => prev.includes("no_equipment") ? [id] : prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
    setError(null);
  };

  const handleContinue = async () => {
    if (!locations.length) { setError("Select location"); return; }
    if (!equipment.length) { setError("Select equipment"); return; }
    setIsSubmitting(true);
    try {
      await saveStep("equipment", { workoutLocations: locations, equipmentIds: equipment });
      router.push("/(onboarding)/schedule" as any);
    } catch { setError("Failed to save"); } finally { setIsSubmitting(false); }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ProgressBar current={5} total={TOTAL_STEPS} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={[styles.backButton, { color: theme.primary }]}>← Back</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>Equipment & Location</Text>
        <Text style={[styles.description, { color: theme.foregroundMuted }]}>Where do you work out?</Text>
        <Text style={styles.label}>Preferred location</Text>
        <View style={styles.grid}>
          {locations_opts.map(l => (
            <SelectionCard key={l.id} selected={locations.includes(l.id)} onPress={() => toggleLocation(l.id)} icon={l.icon} label={l.label} />
          ))}
        </View>
        <Text style={styles.label}>Available equipment</Text>
        <View style={styles.options}>
          {equipment_opts.map(e => (
            <SelectionCard key={e.id} selected={equipment.includes(e.id)} onPress={() => toggleEquipment(e.id)} icon={e.icon} label={e.label} />
          ))}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
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
  description: { fontSize: 16, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, options: { gap: 8 },
  error: { color: "#B42318", fontSize: 14, marginTop: 16 },
  footer: { padding: 20, paddingBottom: 32 }, button: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
