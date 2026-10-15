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
  orange: "#F97316",
  blue: "#2563EB",
};

export default function HomeTab() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.date}>October 15, 2026</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: COLORS.mint }]}>
            <Text style={styles.statValue}>1,847</Text>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statSubtext}>of 2,200</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#FFF7ED" }]}>
            <Text style={[styles.statValue, { color: COLORS.orange }]}>142g</Text>
            <Text style={styles.statLabel}>Protein</Text>
            <Text style={styles.statSubtext}>of 160g</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#F0F4FF" }]}>
            <Text style={[styles.statValue, { color: COLORS.blue }]}>4</Text>
            <Text style={styles.statLabel}>Workouts</Text>
            <Text style={styles.statSubtext}>this week</Text>
          </View>
        </View>

        {/* Today's Workout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Workout</Text>
          <View style={styles.workoutCard}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>Upper Body Strength</Text>
              <Text style={styles.workoutMeta}>45 min • Push Day</Text>
            </View>
            <View style={styles.startButton}>
              <Text style={styles.startButtonText}>Start</Text>
            </View>
          </View>
        </View>

        {/* Nutrition Task */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition</Text>
          <View style={styles.nutritionCard}>
            <View style={styles.calorieRing}>
              <Text style={styles.ringValue}>1,525</Text>
              <Text style={styles.ringLabel}>cal left</Text>
            </View>
            <View style={styles.nutritionInfo}>
              <Text style={styles.nutritionTask}>Log lunch</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "65%" }]} />
              </View>
              <Text style={styles.progressText}>675 cal remaining</Text>
            </View>
          </View>
        </View>

        {/* Progress Chart Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>30-Day Progress</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>
          <View style={styles.chartCard}>
            <View style={styles.chartBars}>
              {[40, 65, 55, 70, 80, 60, 75].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.chartBar,
                    { height: `${h}%`, backgroundColor: COLORS.primary },
                  ]}
                />
              ))}
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>Week 1</Text>
              <Text style={styles.chartLabel}>Week 4</Text>
            </View>
          </View>
        </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.foreground,
  },
  date: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.mint,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  statSubtext: {
    fontSize: 10,
    color: COLORS.muted,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.foreground,
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
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
  nutritionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  calorieRing: {
    alignItems: "center",
  },
  ringValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  ringLabel: {
    fontSize: 11,
    color: COLORS.muted,
  },
  nutritionInfo: {
    flex: 1,
  },
  nutritionTask: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.foreground,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginVertical: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    borderRadius: 4,
    minHeight: 8,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 11,
    color: COLORS.muted,
  },
});
