/**
 * Appearance Settings Screen
 * Allows user to select System/Light/Dark theme
 */

import { Stack } from "expo-router";
import { StyleSheet, View, Pressable } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { spacing } from "@/constants/theme";
import type { ThemePreference } from "@/constants/theme";

export default function AppearanceScreen() {
  const theme = useTheme();
  const { preference, setPreference, resolvedTheme } = useThemePreference();

  const themeOptions: { value: ThemePreference; label: string; description: string }[] = [
    { value: "system", label: "Hệ thống", description: "Theo cài đặt thiết bị" },
    { value: "light", label: "Sáng", description: "Chế độ sáng" },
    { value: "dark", label: "Tối", description: "Chế độ tối" },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Giao diện",
          headerShown: true,
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.foreground,
        }}
      />
      <ThemedView style={styles.container}>
        <View style={styles.section}>
          <ThemedText type="small" themeColor="foregroundMuted" style={styles.sectionTitle}>
            Chọn giao diện hiển thị cho ứng dụng
          </ThemedText>

          {themeOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionItem,
                {
                  backgroundColor: theme.surface,
                  borderColor: preference === option.value ? theme.primary : theme.border,
                  borderWidth: preference === option.value ? 2 : 1,
                },
              ]}
              onPress={() => setPreference(option.value)}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <ThemedText type="bodyStrong">{option.label}</ThemedText>
                  {option.value === "system" && (
                    <ThemedText type="caption" themeColor="foregroundMuted">
                      (Hiện tại: {resolvedTheme === "light" ? "Sáng" : "Tối"})
                    </ThemedText>
                  )}
                </View>
                <ThemedText type="small" themeColor="foregroundMuted">
                  {option.description}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: preference === option.value ? theme.primary : theme.border,
                  },
                ]}
              >
                {preference === option.value && (
                  <View
                    style={[
                      styles.radioInner,
                      { backgroundColor: theme.primary },
                    ]}
                  />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: spacing.four,
    gap: spacing.three,
  },
  sectionTitle: {
    marginBottom: spacing.two,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.four,
    borderRadius: 12,
    gap: spacing.four,
  },
  optionContent: {
    flex: 1,
    gap: spacing.half,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.two,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
