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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useRef, useEffect } from "react";
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

export default function VerifyEmailScreen() {
  const { email, challengeId } = useLocalSearchParams<{
    email: string;
    challengeId: string;
  }>();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const maskedEmail = email
    ? (() => {
        const [local, domain] = email.split("@");
        if (!local || !domain) return email;
        if (local.length <= 2) return `${local[0]}***@${domain}`;
        return `${local.slice(0, 2)}***@${domain}`;
      })()
    : "";

  // Countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d) && newCode.join("").length === 6) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify || code.join("");
    if (verificationCode.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authClient.verifyOtp(
        challengeId || "",
        verificationCode
      );
      router.replace(response.next as any);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid verification code"
      );
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;

    setLoading(true);
    setError(null);

    try {
      await authClient.requestOtp(email);
      setResendCooldown(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleChangeEmail}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>AIVO</Text>
            </View>
          </View>

          {/* Header */}
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.description}>
            Enter the verification code sent to{" "}
            <Text style={styles.emailText}>{maskedEmail}</Text>
          </Text>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.otpInput, error && styles.otpInputError]}
                value={digit}
                onChangeText={(value) => handleChange(index, value)}
                onKeyPress={(e) => handleKeyPress(index, e)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoComplete="one-time-code"
              />
            ))}
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (code.some((d) => !d) || loading) && styles.primaryButtonDisabled,
            ]}
            onPress={() => handleVerify()}
            disabled={code.some((d) => !d) || loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <Text style={styles.primaryButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

          {/* Resend & Change Email */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleResend}
              disabled={resendCooldown > 0 || loading}
            >
              <Text
                style={[
                  styles.actionText,
                  resendCooldown > 0 && styles.actionTextDisabled,
                ]}
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : "Resend code"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.actionSeparator}>|</Text>

            <TouchableOpacity onPress={handleChangeEmail}>
              <Text style={styles.actionText}>Use another email</Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <Text style={styles.infoText}>
            The code expires shortly for your security.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
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
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  emailText: {
    fontWeight: "500",
    color: COLORS.foreground,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.foreground,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
  },
  otpInputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.danger,
    textAlign: "center",
    marginBottom: 16,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 16,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  actionTextDisabled: {
    color: COLORS.muted,
  },
  actionSeparator: {
    color: COLORS.border,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 32,
  },
});
