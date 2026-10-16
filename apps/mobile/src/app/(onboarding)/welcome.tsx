import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleGetStarted = () => {
    router.push("/(onboarding)/goal" as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: theme.primary }]}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={[styles.brandName, { color: theme.primary }]}>AIVO</Text>
        </View>

        {/* Content */}
        <View style={styles.mainContent}>
          <Text style={[styles.title, { color: theme.foreground }]}>
            Let AIVO understand you
          </Text>
          <Text style={[styles.description, { color: theme.foregroundMuted }]}>
            Answer a few questions so AIVO can create a workout and nutrition plan around your goals.
            Takes about 2-3 minutes.
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefits}>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: theme.primarySubtle || "#E8F5E9" }]}>
              <Text style={styles.benefitEmoji}>💪</Text>
            </View>
            <View style={styles.benefitText}>
              <Text style={[styles.benefitTitle, { color: theme.foreground }]}>Personalized Workouts</Text>
              <Text style={[styles.benefitDesc, { color: theme.foregroundMuted }]}>
                Exercises that match your experience
              </Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: "#FFF3E0" }]}>
              <Text style={styles.benefitEmoji}>🥗</Text>
            </View>
            <View style={styles.benefitText}>
              <Text style={[styles.benefitTitle, { color: theme.foreground }]}>Nutrition Targets</Text>
              <Text style={[styles.benefitDesc, { color: theme.foregroundMuted }]}>
                Calorie and macro goals
              </Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: "#E3F2FD" }]}>
              <Text style={styles.benefitEmoji}>🤖</Text>
            </View>
            <View style={styles.benefitText}>
              <Text style={[styles.benefitTitle, { color: theme.foreground }]}>AI Coach</Text>
              <Text style={[styles.benefitDesc, { color: theme.foregroundMuted }]}>
                Guidance that adapts as you progress
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: theme.primary }]}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={[styles.startButtonText, { color: "#FFFFFF" }]}>
            Get started →
          </Text>
        </TouchableOpacity>
        <Text style={[styles.footerNote, { color: theme.foregroundMuted }]}>
          Takes about 2-3 minutes • You can update answers later
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
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
  mainContent: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  benefits: {
    gap: 20,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  benefitEmoji: {
    fontSize: 24,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  benefitDesc: {
    fontSize: 14,
    marginTop: 2,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footerNote: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
});
