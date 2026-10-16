import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { ProgressBar } from "@/features/onboarding/components/progress-bar";
import { useOnboardingContext } from "@/features/onboarding/hooks/use-onboarding";

const TOTAL_STEPS = 8;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DURATIONS = [15, 30, 45, 60, 75];

export default function ScheduleScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { state, saveStep } = useOnboardingContext();
  const [daysPerWeek, setDaysPerWeek] = useState<number>((state?.profile?.workoutDaysPerWeek as number) || 3);
  const [duration, setDuration] = useState<number>((state?.profile?.preferredSessionMinutes as number) || 45);
  const [preferredDays, setPreferredDays] = useState<number[]>((state?.profile?.preferredWeekdays as number[]) || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDay = (i: number) => setPreferredDays(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i]);

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      await saveStep("schedule", { workoutDaysPerWeek: daysPerWeek, preferredSessionMinutes: duration, preferredWeekdays: preferredDays });
      router.push("/(onboarding)/nutrition" as any);
    } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ProgressBar current={6} total={TOTAL_STEPS} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={[styles.backButton, { color: theme.primary }]}>← Back</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>Your schedule</Text>
        <Text style={[styles.description, { color: theme.foregroundMuted }]}>How often can you work out?</Text>
        <Text style={[styles.label, { color: theme.foreground }]}>Days per week: {daysPerWeek}</Text>
        <View style={styles.sliderContainer}>
          <Text style={{ color: theme.foregroundMuted }}>1</Text>
          <View style={[styles.slider, { backgroundColor: theme.border }]}>
            <View style={[styles.sliderFill, { width: `${(daysPerWeek / 7) * 100}%`, backgroundColor: theme.primary }]} />
          </View>
          <Text style={{ color: theme.foregroundMuted }}>7</Text>
        </View>
        <View style={styles.daysRow}>
          {[1,2,3,4,5,6,7].map(n => (
            <TouchableOpacity key={n} onPress={() => setDaysPerWeek(n)} style={[styles.dayButton, { backgroundColor: daysPerWeek >= n ? theme.primary : theme.border }]}>
              <Text style={{ color: daysPerWeek >= n ? "#FFF" : theme.foreground }}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.label, { color: theme.foreground }]}>Session length</Text>
        <View style={styles.durationRow}>
          {DURATIONS.map(d => (
            <TouchableOpacity key={d} onPress={() => setDuration(d)} style={[styles.durationButton, { borderColor: duration === d ? theme.primary : theme.border, backgroundColor: duration === d ? theme.primarySubtle || "#E8F5E9" : "transparent" }]}>
              <Text style={{ color: duration === d ? theme.primary : theme.foreground }}>{d}m</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.label, { color: theme.foreground }]}>Preferred days (optional)</Text>
        <View style={styles.weekRow}>
          {DAYS.map((d, i) => (
            <TouchableOpacity key={d} onPress={() => toggleDay(i)} style={[styles.weekButton, { borderColor: preferredDays.includes(i) ? theme.primary : theme.border, backgroundColor: preferredDays.includes(i) ? theme.primarySubtle || "#E8F5E9" : "transparent" }]}>
              <Text style={{ color: preferredDays.includes(i) ? theme.primary : theme.foreground, fontSize: 12 }}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  sliderContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  slider: { flex: 1, height: 4, borderRadius: 2 },
  sliderFill: { height: "100%", borderRadius: 2 },
  daysRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  dayButton: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  durationRow: { flexDirection: "row", gap: 8 },
  durationButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 2, alignItems: "center" },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  weekButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  footer: { padding: 20, paddingBottom: 32 }, button: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
