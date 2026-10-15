/**
 * Language Settings Screen
 * Allows user to select Vietnamese or English
 */

import { Stack } from "expo-router";
import { StyleSheet, View, Pressable } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { useLocale } from "@/localization/locale-provider";
import type { AppLocale } from "@aivo/i18n";
import { spacing } from "@/constants/theme";

export default function LanguageScreen() {
  const theme = useTheme();
  const { locale, setLocale } = useLocale();

  const languageOptions: { value: AppLocale; label: string; nativeLabel: string }[] = [
    { value: "vi-VN", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
    { value: "en", label: "English", nativeLabel: "English" },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Ngôn ngữ",
          headerShown: true,
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.foreground,
        }}
      />
      <ThemedView style={styles.container}>
        <View style={styles.section}>
          <ThemedText type="small" themeColor="foregroundMuted" style={styles.sectionTitle}>
            Chọn ngôn ngữ hiển thị cho ứng dụng
          </ThemedText>

          {languageOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionItem,
                {
                  backgroundColor: theme.surface,
                  borderColor: locale === option.value ? theme.primary : theme.border,
                  borderWidth: locale === option.value ? 2 : 1,
                },
              ]}
              onPress={() => setLocale(option.value)}
            >
              <View style={styles.optionContent}>
                <ThemedText type="bodyStrong">{option.nativeLabel}</ThemedText>
                <ThemedText type="small" themeColor="foregroundMuted">
                  {option.label}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: locale === option.value ? theme.primary : theme.border,
                  },
                ]}
              >
                {locale === option.value && (
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
