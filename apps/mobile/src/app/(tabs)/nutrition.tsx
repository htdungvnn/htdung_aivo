import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/localization/locale-provider";

export default function NutritionTab() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [mealSearch, setMealSearch] = useState("");

  const macros = [
    { name: "Protein", value: 142, target: 160, unit: "g", color: theme.nutrition },
    { name: "Carbs", value: 215, target: 250, unit: "g", color: theme.progress },
    { name: "Fats", value: 62, target: 70, unit: "g", color: theme.danger },
  ];

  const meals = [
    { name: "Oatmeal with Berries", calories: 485, time: "Breakfast" },
    { name: "Grilled Chicken Salad", calories: 680, time: "Lunch" },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.foreground }]}>{t("tabs.nutrition")}</Text>

        {/* Calories Summary */}
        <View style={[styles.caloriesCard, { 
          backgroundColor: theme.surface, 
          borderColor: theme.border 
        }]}>
          <View style={styles.calorieRing}>
            <View style={[styles.ringOuter, { backgroundColor: theme.primarySubtle }]}>
              <View style={[styles.ringInner, { backgroundColor: theme.surface }]}>
                <Text style={[styles.ringValue, { color: theme.primary }]}>1,847</Text>
                <Text style={[styles.ringLabel, { color: theme.foregroundMuted }]}>of 2,200 cal</Text>
              </View>
            </View>
          </View>
          <View style={styles.macrosList}>
            {macros.map((macro) => (
              <View key={macro.name} style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={[styles.macroName, { color: theme.foreground }]}>{macro.name}</Text>
                  <Text style={[styles.macroValue, { color: theme.foregroundMuted }]}>
                    {macro.value}/{macro.target}{macro.unit}
                  </Text>
                </View>
                <View style={[styles.macroBar, { backgroundColor: theme.border }]}>
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
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Log a Meal</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: theme.surface,
                  color: theme.foreground,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Search foods..."
              placeholderTextColor={theme.foregroundMuted}
              value={mealSearch}
              onChangeText={setMealSearch}
            />
            <View style={[styles.scanButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.scanButtonText}>📷</Text>
            </View>
          </View>
        </View>

        {/* Today's Meals */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Today&apos;s Meals</Text>
          {meals.map((meal, index) => (
            <View 
              key={index} 
              style={[
                styles.mealCard, 
                { 
                  backgroundColor: theme.surface, 
                  borderColor: theme.border 
                }
              ]}
            >
              <View>
                <Text style={[styles.mealTime, { color: theme.foregroundMuted }]}>{meal.time}</Text>
                <Text style={[styles.mealName, { color: theme.foreground }]}>{meal.name}</Text>
              </View>
              <Text style={[styles.mealCalories, { color: theme.primary }]}>{meal.calories} cal</Text>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  caloriesCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  calorieRing: {
    alignItems: "center",
    marginBottom: 20,
  },
  ringOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  ringInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  ringValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  ringLabel: {
    fontSize: 12,
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
  },
  macroValue: {
    fontSize: 14,
  },
  macroBar: {
    height: 8,
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
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  scanButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonText: {
    fontSize: 20,
  },
  mealCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
  },
  mealTime: {
    fontSize: 12,
    marginBottom: 4,
  },
  mealName: {
    fontSize: 14,
    fontWeight: "500",
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: "600",
  },
});
