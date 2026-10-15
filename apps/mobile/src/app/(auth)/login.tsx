"use client";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { authClient } from "@/features/auth/services";

// AIVO Brand Colors
const COLORS = {
  primary: "#087A55",
  primaryHover: "#066847",
  background: "#FCFDFB",
  surface: "#FFFFFF",
  foreground: "#101828",
  muted: "#667085",
  border: "#E5EAE7",
  danger: "#B42318",
  mint: "#EAF7F0",
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleContinueWithEmail = useCallback(async () => {
    setError(null);

    if (!email.trim()) {
      setError("Enter a valid email address.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await authClient.requestOtp(email);
      // Navigate to OTP verification
      router.push({
        pathname: "/(auth)/verify-email",
        params: { email, challengeId: response.challengeId },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  }, [email, router]);

  const handleOAuth = async (provider: "google" | "facebook") => {
    try {
      await authClient.startOAuth(provider);
      // OAuth will handle the redirect
    } catch {
      setError("Failed to start sign-in");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>AIVO</Text>
            </View>
          </View>

          {/* Content Card */}
          <View style={styles.card}>
            <Text style={styles.eyebrow}>Welcome back</Text>
            <Text style={styles.title}>Continue your journey with AIVO</Text>
            <Text style={styles.description}>
              Sign in to access your personalized workouts, nutrition plan,
              progress, and AI Coach.
            </Text>

            {/* OAuth Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.oauthButton}
                onPress={() => handleOAuth("google")}
                disabled={loading}
              >
                <GoogleIcon />
                <Text style={styles.oauthButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.oauthButton, styles.facebookButton]}
                onPress={() => handleOAuth("facebook")}
                disabled={loading}
              >
                <FacebookIcon />
                <Text style={[styles.oauthButtonText, styles.facebookButtonText]}>
                  Continue with Facebook
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with email</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email address</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!email || loading) && styles.primaryButtonDisabled,
              ]}
              onPress={handleContinueWithEmail}
              disabled={!email || loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.surface} />
              ) : (
                <Text style={styles.primaryButtonText}>Continue with Email</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Legal Text */}
          <Text style={styles.legalText}>
            By continuing, you agree to AIVO&apos;s Terms of Service and acknowledge the Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Icon Components
function GoogleIcon() {
  return (
    <View style={iconStyles.googleContainer}>
      <Text style={iconStyles.googleText}>G</Text>
    </View>
  );
}

function FacebookIcon() {
  return (
    <View style={iconStyles.facebookContainer}>
      <Text style={iconStyles.facebookIcon}>f</Text>
    </View>
  );
}

const iconStyles = StyleSheet.create({
  googleContainer: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  googleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4285F4",
  },
  facebookContainer: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  facebookIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1877F2",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.foreground,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  oauthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  oauthButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.foreground,
  },
  facebookButton: {
    backgroundColor: "#1877F2",
    borderColor: "#1877F2",
  },
  facebookButtonText: {
    color: "#FFFFFF",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.foreground,
    marginBottom: 8,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.foreground,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
  },
  legalText: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 16,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});
