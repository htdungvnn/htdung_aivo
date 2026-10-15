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
import { useState, useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { authClient } from "@/features/auth/services";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/localization/locale-provider";

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  // Handle OAuth callback from deep link
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      console.log("Deep link received:", url);
      
      const parsed = Linking.parse(url);
      
      if (parsed.queryParams?.token && parsed.queryParams?.userId) {
        const token = parsed.queryParams.token as string;
        const userId = parsed.queryParams.userId as string;
        
        console.log("OAuth success - storing token");
        
        // Store token and userId
        await authClient.setToken(token);
        await authClient.setUserId(userId);
        
        // Refresh user and navigate
        await refreshUser();
        router.replace("/(tabs)/home");
      }
    };

    // Check if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url && url.includes("aivo://auth/callback")) {
        handleDeepLink(url);
      }
    });

    // Listen for deep links while on this screen
    const subscription = Linking.addEventListener("url", (event) => {
      if (event.url.includes("aivo://auth/callback")) {
        handleDeepLink(event.url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router, refreshUser]);

  const handleContinueWithEmail = useCallback(async () => {
    setError(null);

    if (!email.trim()) {
      setError(t("validation.email.required"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("validation.email.invalid"));
      return;
    }

    setEmailLoading(true);

    try {
      const response = await authClient.requestOtp(email);
      router.push({
        pathname: "/(auth)/verify-email",
        params: { email, challengeId: response.challengeId },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.network"));
    } finally {
      setEmailLoading(false);
    }
  }, [email, router, t]);

  const handleOAuth = useCallback(async (provider: "google" | "facebook") => {
    setError(null);
    setOauthLoading(true);
    try {
      const authUrl = await authClient.startOAuth(provider);
      const result = await WebBrowser.openAuthSessionAsync(authUrl);
      
      // Check if result has url (success case)
      if (typeof result === "object" && "url" in result && (result as { url?: string }).url) {
        console.log("OAuth result URL:", (result as { url: string }).url);
        const parsed = Linking.parse((result as { url: string }).url);
        
        if (parsed.queryParams?.token && parsed.queryParams?.userId) {
          const token = parsed.queryParams.token as string;
          const userId = parsed.queryParams.userId as string;
          
          // Store token
          await authClient.setToken(token);
          await authClient.setUserId(userId);
          
          // Refresh user and navigate
          await refreshUser();
          router.replace("/(tabs)/home");
          return;
        }
      }
      
      console.log("No callback URL returned, waiting for deep link...");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.oauth"));
    } finally {
      setOauthLoading(false);
    }
  }, [router, refreshUser, t]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
            <View style={[styles.logo, { borderColor: theme.primary }]}>
              <Text style={[styles.logoText, { color: theme.primary }]}>AIVO</Text>
            </View>
          </View>

          {/* Content Card */}
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={styles.eyebrow}>{t("auth.login.eyebrow")}</Text>
            <Text style={[styles.title, { color: theme.foreground }]}>
              {t("auth.login.title")}
            </Text>
            <Text style={[styles.description, { color: theme.foregroundMuted }]}>
              {t("auth.login.description")}
            </Text>

            {/* OAuth Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.oauthButton,
                  { 
                    borderColor: theme.borderStrong,
                    backgroundColor: theme.surface,
                  },
                  oauthLoading && styles.oauthButtonDisabled,
                ]}
                onPress={() => handleOAuth("google")}
                disabled={oauthLoading}
              >
                {oauthLoading ? (
                  <ActivityIndicator size="small" color={theme.foreground} />
                ) : (
                  <GoogleIcon />
                )}
                <Text style={[styles.oauthButtonText, { color: theme.foreground }]}>
                  {t("auth.login.continueWithGoogle")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.oauthButton,
                  styles.facebookButton,
                  oauthLoading && styles.oauthButtonDisabled,
                ]}
                onPress={() => handleOAuth("facebook")}
                disabled={oauthLoading}
              >
                {oauthLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <FacebookIcon />
                )}
                <Text style={[styles.oauthButtonText, styles.facebookButtonText]}>
                  {t("auth.login.continueWithFacebook")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.foregroundMuted }]}>
                {t("auth.login.orContinueWithEmail")}
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.foreground }]}>
                {t("auth.login.emailLabel")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: error ? theme.danger : theme.borderStrong,
                    color: theme.foreground,
                    backgroundColor: theme.surface,
                  },
                ]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
                placeholder={t("auth.login.emailPlaceholder")}
                placeholderTextColor={theme.foregroundSubtle}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
              {error && (
                <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
              )}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: theme.primary },
                (!email || emailLoading) && styles.primaryButtonDisabled,
              ]}
              onPress={handleContinueWithEmail}
              disabled={!email || emailLoading}
            >
              {emailLoading ? (
                <ActivityIndicator color={theme.onPrimary} />
              ) : (
                <Text style={[styles.primaryButtonText, { color: theme.onPrimary }]}>
                  {t("auth.login.continueWithEmail")}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Legal Text */}
          <Text style={[styles.legalText, { color: theme.foregroundMuted }]}>
            {t("auth.login.legalText")}
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
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    opacity: 0.7,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
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
  },
  oauthButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  oauthButtonDisabled: {
    opacity: 0.5,
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
  },
  dividerText: {
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
  },
  primaryButton: {
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
  },
  legalText: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 16,
  },
  link: {
    textDecorationLine: "underline",
  },
});
