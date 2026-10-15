import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const COLORS = {
  primary: "#087A55",
  background: "#FCFDFB",
  surface: "#FFFFFF",
  foreground: "#101828",
  muted: "#667085",
  border: "#E5EAE7",
  mint: "#EAF7F0",
  orange: "#F97316",
};

export default function NutritionTab() {
  const [mealSearch, setMealSearch] = useState("");

  const macros = [
    { name: "Protein", value: 142, target: 160, unit: "g", color: COLORS.orange },
    { name: "Carbs", value: 215, target: 250, unit: "g", color: "#2563EB" },
    { name: "Fats", value: 62, target: 70, unit: "g", color: "#DC2626" },
  ];

  const meals = [
    { name: "Oatmeal with Berries", calories: 485, time: "Breakfast" },
    { name: "Grilled Chicken Salad", calories: 680, time: "Lunch" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Nutrition</Text>

        {/* Calories Summary */}
        <View style={styles.caloriesCard}>
          <View style={styles.calorieRing}>
            <View style={styles.ringOuter}>
              <View style={styles.ringInner}>
                <Text style={styles.ringValue}>1,847</Text>
                <Text style={styles.ringLabel}>of 2,200 cal</Text>
              </View>
            </View>
          </View>
          <View style={styles.macrosList}>
            {macros.map((macro) => (
              <View key={macro.name} style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroName}>{macro.name}</Text>
                  <Text style={styles.macroValue}>
                    {macro.value}/{macro.target}
                    {macro.unit}
                  </Text>
                </View>
                <View style={styles.macroBar}>
                  <View
                    style={[
                      styles.macroFill,
                      {
                        width: `${(macro.value / macro.target) * 100}%`,
                        backgroundColor: macro.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Log Meal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log a Meal</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search foods..."
              placeholderTextColor={COLORS.muted}
              value={mealSearch}
              onChangeText={setMealSearch}
            />
            <View style={styles.scanButton}>
              <Text style={styles.scanButtonText}>📷</Text>
            </View>
          </View>
        </View>

        {/* Today's Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Meals</Text>
          {meals.map((meal, index) => (
            <View key={index} style={styles.mealCard}>
              <View>
                <Text style={styles.mealTime}>{meal.time}</Text>
                <Text style={styles.mealName}>{meal.name}</Text>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} cal</Text>
            </View>
          ))}
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.foreground,
    marginBottom: 24,
  },
  caloriesCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  calorieRing: {
    alignItems: "center",
    marginBottom: 20,
  },
  ringOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.mint,
    justifyContent: "center",
    alignItems: "center",
  },
  ringInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  ringValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  ringLabel: {
    fontSize: 12,
    color: COLORS.muted,
  },
  macrosList: {
    gap: 16,
  },
  macroItem: {},
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  macroName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.foreground,
  },
  macroValue: {
    fontSize: 14,
    color: COLORS.muted,
  },
  macroBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  macroFill: {
    height: "100%",
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.foreground,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.foreground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scanButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonText: {
    fontSize: 20,
  },
  mealCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mealTime: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 4,
  },
  mealName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.foreground,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
