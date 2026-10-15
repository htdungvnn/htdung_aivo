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

// AIVO Brand Colors
const COLORS = {
  primary: "#087A55",
  primaryHover: "#066847",
  background: "#FCFDFB",
  surface: "#FFFFFF",
  foreground: "#101828",
  muted: "#667085",
  border: "#E5EAE7",
  mint: "#EAF7F0",
};

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.brandName}>AIVO</Text>
        </View>

        {/* Hero Visual */}
        <View style={styles.heroVisual}>
          <View style={styles.heroCard}>
            <View style={styles.heroCardInner}>
              {/* Dashboard Preview Mock */}
              <View style={styles.previewHeader}>
                <Text style={styles.previewGreeting}>Good morning!</Text>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={[styles.statBox, { backgroundColor: COLORS.mint }]}>
                  <Text style={[styles.statValue, { color: COLORS.primary }]}>
                    1,847
                  </Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: "#FFF7ED" }]}>
                  <Text style={[styles.statValue, { color: "#F97316" }]}>142g</Text>
                  <Text style={styles.statLabel}>Protein</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: "#F0F4FF" }]}>
                  <Text style={[styles.statValue, { color: "#2563EB" }]}>4</Text>
                  <Text style={styles.statLabel}>Workouts</Text>
                </View>
              </View>

              {/* Workout Preview */}
              <View style={styles.workoutPreview}>
                <Text style={styles.workoutLabel}>Today&apos;s Workout</Text>
                <View style={styles.workoutRow}>
                  <View>
                    <Text style={styles.workoutTitle}>Upper Body</Text>
                    <Text style={styles.workoutSubtitle}>45 min</Text>
                  </View>
                  <View style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.heading}>A Healthier, Happier You</Text>
          <Text style={styles.description}>
            Personalized workouts, practical nutrition tracking, and AI guidance
            in one simple experience.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresPreview}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.mint }]}>
              <Text style={styles.featureEmoji}>💪</Text>
            </View>
            <Text style={styles.featureText}>Personalized Workouts</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: "#FFF7ED" }]}>
              <Text style={styles.featureEmoji}>🥗</Text>
            </View>
            <Text style={styles.featureText}>Nutrition Tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: "#F0F4FF" }]}>
              <Text style={styles.featureEmoji}>🤖</Text>
            </View>
            <Text style={styles.featureText}>AI Coach</Text>
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
    backgroundColor: COLORS.primary,
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
    color: COLORS.primary,
    letterSpacing: 2,
  },
  heroVisual: {
    position: "relative",
    marginBottom: 32,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: COLORS.primary,
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
    color: COLORS.muted,
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
    color: COLORS.muted,
    marginTop: 2,
  },
  workoutPreview: {
    backgroundColor: COLORS.mint,
    padding: 16,
    borderRadius: 12,
  },
  workoutLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.muted,
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
    color: COLORS.foreground,
  },
  workoutSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
  },
  startButton: {
    backgroundColor: COLORS.primary,
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
    backgroundColor: COLORS.mint,
    opacity: 0.5,
  },
  decorCircle2: {
    position: "absolute",
    bottom: -15,
    left: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.mint,
    opacity: 0.3,
  },
  content: {
    textAlign: "center",
    marginBottom: 32,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.foreground,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.foreground,
  },
  featuresPreview: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
    color: COLORS.muted,
    textAlign: "center",
  },
});
