import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { useLocale } from "@/localization/locale-provider";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { getGreeting, formatShortDate } from "@aivo/i18n";

export default function HomeTab() {
  const theme = useTheme();
  const { locale } = useLocale();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Get greeting based on time and locale
  const greeting = getGreeting(locale === "vi-VN" ? "vi-VN" : "en");
  const formattedDate = formatShortDate(new Date(), locale === "vi-VN" ? "vi-VN" : "en");

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={[styles.greeting, { color: theme.foreground }]}>{greeting}!</Text>
            <Text style={[styles.email, { color: theme.foregroundMuted }]}>
              {user?.email || "Guest"}
            </Text>
            <Text style={[styles.date, { color: theme.foregroundMuted }]}>{formattedDate}</Text>
          </View>
          <View style={styles.headerActions}>
            {/* Theme Toggle */}
            <Pressable
              style={[styles.iconButton, { 
                backgroundColor: theme.surface, 
                borderColor: theme.border 
              }]}
              onPress={() => router.push("/(tabs)/settings/appearance")}
            >
              <Text style={{ fontSize: 20 }}>🌙</Text>
            </Pressable>

            {/* Language Toggle */}
            <Pressable
              style={[styles.iconButton, { 
                backgroundColor: theme.surface, 
                borderColor: theme.border 
              }]}
              onPress={() => router.push("/(tabs)/settings/language")}
            >
              <Text style={{ fontSize: 20 }}>🌐</Text>
              <Text style={[styles.langText, { color: theme.foreground }]}>
                {locale === "vi-VN" ? "VI" : "EN"}
              </Text>
            </Pressable>

            {/* Avatar */}
            <Pressable
              style={[styles.avatar, { backgroundColor: theme.primarySubtle }]}
              onPress={handleLogout}
            >
              <Text style={[styles.avatarText, { color: theme.primary }]}>{getInitials()}</Text>
            </Pressable>
          </View>
        </View>

        {/* User Status Card */}
        <View style={[styles.userCard, { 
          backgroundColor: theme.surface, 
          borderColor: theme.border 
        }]}>
          <View style={styles.userCardHeader}>
            <Text style={[styles.userCardTitle, { color: theme.foreground }]}>👤 Account</Text>
            <View style={[styles.statusBadge, { 
              backgroundColor: user?.onboardingStatus === "completed" ? theme.primarySubtle : theme.warningSubtle 
            }]}>
              <Text style={[styles.statusText, { 
                color: user?.onboardingStatus === "completed" ? theme.primary : theme.warning 
              }]}>
                {user?.onboardingStatus === "completed" ? "✓ Active" : 
                 user?.onboardingStatus === "in_progress" ? "⏳ In Progress" : 
                 "🆕 New User"}
              </Text>
            </View>
          </View>
          <View style={styles.userCardBody}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.foregroundMuted }]}>User ID</Text>
              <Text style={[styles.infoValue, { color: theme.foregroundMuted }]} numberOfLines={1}>
                {user?.id ? `${user.id.slice(0, 8)}...` : "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.foregroundMuted }]}>Email</Text>
              <Text style={[styles.infoValue, { color: theme.foreground }]} numberOfLines={1}>
                {user?.email || "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.foregroundMuted }]}>Status</Text>
              <Text style={[styles.infoValue, { color: theme.foreground }]}>
                {user?.onboardingStatus === "completed" ? "Onboarding Complete" : 
                 user?.onboardingStatus === "in_progress" ? "Onboarding In Progress" : 
                 "Onboarding Not Started"}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.primarySubtle }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>1,847</Text>
            <Text style={[styles.statLabel, { color: theme.foregroundMuted }]}>Calories</Text>
            <Text style={[styles.statSubtext, { color: theme.foregroundSubtle }]}>of 2,200</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.nutritionSubtle }]}>
            <Text style={[styles.statValue, { color: theme.nutrition }]}>142g</Text>
            <Text style={[styles.statLabel, { color: theme.foregroundMuted }]}>Protein</Text>
            <Text style={[styles.statSubtext, { color: theme.foregroundSubtle }]}>of 160g</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.progressSubtle }]}>
            <Text style={[styles.statValue, { color: theme.progress }]}>4</Text>
            <Text style={[styles.statLabel, { color: theme.foregroundMuted }]}>Workouts</Text>
            <Text style={[styles.statSubtext, { color: theme.foregroundSubtle }]}>this week</Text>
          </View>
        </View>

        {/* Today's Workout */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Today&apos;s Workout</Text>
          <View style={[styles.workoutCard, { 
            backgroundColor: theme.surface, 
            borderColor: theme.border 
          }]}>
            <View style={styles.workoutInfo}>
              <Text style={[styles.workoutName, { color: theme.foreground }]}>Upper Body Strength</Text>
              <Text style={[styles.workoutMeta, { color: theme.foregroundMuted }]}>45 min • Push Day</Text>
            </View>
            <View style={[styles.startButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.startButtonText}>Start</Text>
            </View>
          </View>
        </View>

        {/* Nutrition Task */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Nutrition</Text>
          <View style={[styles.nutritionCard, { 
            backgroundColor: theme.surface, 
            borderColor: theme.border 
          }]}>
            <View style={styles.calorieRing}>
              <Text style={[styles.ringValue, { color: theme.primary }]}>1,525</Text>
              <Text style={[styles.ringLabel, { color: theme.foregroundMuted }]}>cal left</Text>
            </View>
            <View style={styles.nutritionInfo}>
              <Text style={[styles.nutritionTask, { color: theme.foreground }]}>Log lunch</Text>
              <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                <View style={[styles.progressFill, { width: "65%", backgroundColor: theme.primary }]} />
              </View>
              <Text style={[styles.progressText, { color: theme.foregroundMuted }]}>675 cal remaining</Text>
            </View>
          </View>
        </View>

        {/* Progress Chart Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>30-Day Progress</Text>
            <Text style={[styles.viewAll, { color: theme.primary }]}>View All</Text>
          </View>
          <View style={[styles.chartCard, { 
            backgroundColor: theme.surface, 
            borderColor: theme.border 
          }]}>
            <View style={styles.chartBars}>
              {[40, 65, 55, 70, 80, 60, 75].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.chartBar,
                    { 
                      height: `${h}%`, 
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.chartLabels}>
              <Text style={[styles.chartLabel, { color: theme.foregroundMuted }]}>Week 1</Text>
              <Text style={[styles.chartLabel, { color: theme.foregroundMuted }]}>Week 4</Text>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  userInfo: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  langText: {
    fontSize: 12,
    fontWeight: "600",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  date: {
    fontSize: 14,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  userCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userCardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  userCardBody: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
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
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statSubtext: {
    fontSize: 10,
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
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "500",
  },
  workoutCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
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
  nutritionCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
  },
  calorieRing: {
    alignItems: "center",
  },
  ringValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ringLabel: {
    fontSize: 11,
  },
  nutritionInfo: {
    flex: 1,
  },
  nutritionTask: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
  },
});
