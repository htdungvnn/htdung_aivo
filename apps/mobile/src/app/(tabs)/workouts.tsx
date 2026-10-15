import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/localization/locale-provider";

export default function WorkoutsTab() {
  const theme = useTheme();
  const { t } = useTranslation();

  const workouts = [
    { name: "Upper Body Strength", duration: "45 min", type: "Push Day" },
    { name: "Lower Body Power", duration: "50 min", type: "Leg Day" },
    { name: "Core & Cardio", duration: "30 min", type: "HIIT" },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.foreground }]}>{t("tabs.workouts")}</Text>
        <Text style={[styles.subtitle, { color: theme.foregroundMuted }]}>This week: 4 of 5 completed</Text>

        {workouts.map((workout, index) => (
          <View 
            key={index} 
            style={[
              styles.workoutCard, 
              { 
                backgroundColor: theme.surface, 
                borderColor: theme.border 
              }
            ]}
          >
            <View style={styles.workoutInfo}>
              <Text style={[styles.workoutName, { color: theme.foreground }]}>{workout.name}</Text>
              <Text style={[styles.workoutMeta, { color: theme.foregroundMuted }]}>
                {workout.duration} • {workout.type}
              </Text>
            </View>
            <View style={[styles.startButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.startButtonText}>Start</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  workoutCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 12,
  },
  workoutInfo: {},
  workoutName: {
    fontSize: 16,
    fontWeight: "600",
  },
  workoutMeta: {
    fontSize: 14,
    marginTop: 4,
  },
  startButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
