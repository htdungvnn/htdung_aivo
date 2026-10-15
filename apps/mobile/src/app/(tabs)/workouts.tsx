import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#087A55",
  background: "#FCFDFB",
  surface: "#FFFFFF",
  foreground: "#101828",
  muted: "#667085",
  border: "#E5EAE7",
  mint: "#EAF7F0",
};

export default function WorkoutsTab() {
  const workouts = [
    { name: "Upper Body Strength", duration: "45 min", type: "Push Day" },
    { name: "Lower Body Power", duration: "50 min", type: "Leg Day" },
    { name: "Core & Cardio", duration: "30 min", type: "HIIT" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Workouts</Text>
        <Text style={styles.subtitle}>This week: 4 of 5 completed</Text>

        {workouts.map((workout, index) => (
          <View key={index} style={styles.workoutCard}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutMeta}>
                {workout.duration} • {workout.type}
              </Text>
            </View>
            <View style={styles.startButton}>
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.foreground,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 24,
  },
  workoutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  workoutInfo: {},
  workoutName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.foreground,
  },
  workoutMeta: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: COLORS.primary,
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
