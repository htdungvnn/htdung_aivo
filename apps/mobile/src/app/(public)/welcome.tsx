"use client";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/localization/locale-provider";

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: theme.primary }]}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={[styles.brandName, { color: theme.primary }]}>
            {t("welcome.brand")}
          </Text>
        </View>

        {/* Hero Visual */}
        <View style={styles.heroVisual}>
          <View style={[styles.heroCard, { 
            backgroundColor: theme.surface,
          }]}>
            <View style={styles.heroCardInner}>
              {/* Dashboard Preview Mock */}
              <View style={styles.previewHeader}>
                <Text style={[styles.previewGreeting, { color: theme.foregroundMuted }]}>
                  {t("welcome.hero.greeting.morning")}
                </Text>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={[styles.statBox, { backgroundColor: theme.nutritionSubtle }]}>
                  <Text style={[styles.statValue, { color: theme.nutrition }]}>
                    1,847
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.foregroundMuted }]}>
                    {t("welcome.hero.stats.calories")}
                  </Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: theme.primarySubtle }]}>
                  <Text style={[styles.statValue, { color: theme.primary }]}>142g</Text>
                  <Text style={[styles.statLabel, { color: theme.foregroundMuted }]}>
                    {t("welcome.hero.stats.protein")}
                  </Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: theme.progressSubtle }]}>
                  <Text style={[styles.statValue, { color: theme.progress }]}>4</Text>
                  <Text style={[styles.statLabel, { color: theme.foregroundMuted }]}>
                    {t("welcome.hero.stats.workouts")}
                  </Text>
                </View>
              </View>

              {/* Workout Preview */}
              <View style={[styles.workoutPreview, { backgroundColor: theme.workoutSubtle }]}>
                <Text style={[styles.workoutLabel, { color: theme.foregroundMuted }]}>
                  {t("welcome.hero.todayWorkout")}
                </Text>
                <View style={styles.workoutRow}>
                  <View>
                    <Text style={[styles.workoutTitle, { color: theme.foreground }]}>Upper Body</Text>
                    <Text style={[styles.workoutSubtitle, { color: theme.foregroundMuted }]}>45 min</Text>
                  </View>
                  <View style={[styles.startButton, { backgroundColor: theme.workout }]}>
                    <Text style={styles.startButtonText}>{t("welcome.hero.startButton")}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Decorative Elements */}
          <View style={[styles.decorCircle1, { backgroundColor: theme.primarySubtle }]} />
          <View style={[styles.decorCircle2, { backgroundColor: theme.primarySubtle }]} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.heading, { color: theme.foreground }]}>
            {t("welcome.content.heading")}
          </Text>
          <Text style={[styles.description, { color: theme.foregroundMuted }]}>
            {t("welcome.content.description")}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/login")}
            activeOpacity={0.8}
          >
            <Text style={[styles.primaryButtonText, { color: theme.onPrimary }]}>
              {t("welcome.actions.getStarted")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                borderColor: theme.border,
              },
            ]}
            onPress={() => router.push("/login")}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.foreground }]}>
              {t("welcome.actions.alreadyHaveAccount")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features Preview */}
        <View style={[styles.featuresPreview, { borderTopColor: theme.border }]}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: theme.workoutSubtle }]}>
              <Text style={styles.featureEmoji}>💪</Text>
            </View>
            <Text style={[styles.featureText, { color: theme.foregroundMuted }]}>
              {t("welcome.features.personalizedWorkouts")}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: theme.nutritionSubtle }]}>
              <Text style={styles.featureEmoji}>🥗</Text>
            </View>
            <Text style={[styles.featureText, { color: theme.foregroundMuted }]}>
              {t("welcome.features.nutritionTracking")}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: theme.aiCoachSubtle }]}>
              <Text style={styles.featureEmoji}>🤖</Text>
            </View>
            <Text style={[styles.featureText, { color: theme.foregroundMuted }]}>
              {t("welcome.features.aiCoach")}
            </Text>
          </View>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  brandName: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  heroVisual: {
    position: "relative",
    marginBottom: 32,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    zIndex: 1,
  },
  heroCardInner: {},
  previewHeader: {
    marginBottom: 16,
  },
  previewGreeting: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  workoutPreview: {
    padding: 16,
    borderRadius: 12,
  },
  workoutLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  workoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workoutTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  workoutSubtitle: {
    fontSize: 12,
  },
  startButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  decorCircle1: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.5,
  },
  decorCircle2: {
    position: "absolute",
    bottom: -15,
    left: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.3,
  },
  content: {
    textAlign: "center",
    marginBottom: 32,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  featuresPreview: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 24,
    borderTopWidth: 1,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 11,
    textAlign: "center",
  },
});
