/**
 * Settings Screen
 * Main settings hub for the app with quick theme/language toggles
 */

import { Stack, Link } from "expo-router";
import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { useLocale } from "@/localization/locale-provider";
import { spacing } from "@/constants/theme";

export default function SettingsScreen() {
  const theme = useTheme();
  const { preference, setPreference } = useThemePreference();
  const { locale, setLocale } = useLocale();

  const themeLabels = {
    system: "Hệ thống",
    light: "Sáng",
    dark: "Tối",
  };

  const localeLabels = {
    "vi-VN": "Tiếng Việt",
    en: "English",
  };

  const themeOptions = ["system", "light", "dark"] as const;
  const localeOptions = ["vi-VN", "en"] as const;

  const settingsItems = [
    {
      icon: "person.fill",
      iconColor: theme.primary,
      title: "Hồ sơ",
      subtitle: "Mục tiêu, thể chất, thiết bị",
      href: "/(tabs)/settings/profile" as any,
    },
    {
      icon: "bell.fill",
      iconColor: theme.warning,
      title: "Thông báo",
      subtitle: "Nhắc nhở buổi tập, dinh dưỡng",
      onPress: () => {},
    },
    {
      icon: "questionmark.circle.fill",
      iconColor: theme.info,
      title: "Trợ giúp",
      subtitle: "Câu hỏi thường gặp, liên hệ",
      onPress: () => {},
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cài đặt",
          headerShown: true,
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.foreground,
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Quick Theme Switcher */}
        <View style={styles.section}>
          <ThemedText type="small" themeColor="foregroundMuted" style={styles.sectionTitle}>
            Giao diện
          </ThemedText>
          <View style={[styles.quickSwitchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.quickSwitchRow}>
              <SymbolView
                name="circle.lefthalf.filled"
                size={20}
                tintColor={theme.primary}
              />
              <ThemedText type="smallBold" style={styles.quickSwitchLabel}>
                Chế độ hiện tại:
              </ThemedText>
            </View>
            <View style={styles.toggleRow}>
              {themeOptions.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.toggleButton,
                    {
                      backgroundColor: preference === option ? theme.primary : theme.surfaceSubtle,
                      borderColor: preference === option ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setPreference(option)}
                >
                  <ThemedText
                    type="small"
                    style={[
                      styles.toggleText,
                      { color: preference === option ? theme.onPrimary : theme.foregroundMuted },
                    ]}
                  >
                    {themeLabels[option]}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Quick Language Switcher */}
        <View style={styles.section}>
          <ThemedText type="small" themeColor="foregroundMuted" style={styles.sectionTitle}>
            Ngôn ngữ
          </ThemedText>
          <View style={[styles.quickSwitchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.quickSwitchRow}>
              <SymbolView
                name="globe"
                size={20}
                tintColor={theme.primary}
              />
              <ThemedText type="smallBold" style={styles.quickSwitchLabel}>
                Ngôn ngữ hiện tại:
              </ThemedText>
            </View>
            <View style={styles.toggleRow}>
              {localeOptions.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.toggleButton,
                    {
                      backgroundColor: locale === option ? theme.primary : theme.surfaceSubtle,
                      borderColor: locale === option ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setLocale(option)}
                >
                  <ThemedText
                    type="small"
                    style={[
                      styles.toggleText,
                      { color: locale === option ? theme.onPrimary : theme.foregroundMuted },
                    ]}
                  >
                    {localeLabels[option]}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Other Settings */}
        <View style={styles.section}>
          <ThemedText type="small" themeColor="foregroundMuted" style={styles.sectionTitle}>
            Khác
          </ThemedText>
          {settingsItems.map((item, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.settingItem,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={item.href ? undefined : item.onPress}
              {...(item.href ? { asChild: true } : {})}
            >
              {item.href ? (
                <Link href={item.href}>
                  <View style={[styles.settingItemInner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={[styles.iconContainer, { backgroundColor: item.iconColor + "15" }]}>
                      <SymbolView
                        name={item.icon as any}
                        size={20}
                        tintColor={item.iconColor}
                      />
                    </View>
                    <View style={styles.settingContent}>
                      <ThemedText type="smallBold">{item.title}</ThemedText>
                      <ThemedText themeColor="foregroundMuted" type="small">
                        {item.subtitle}
                      </ThemedText>
                    </View>
                    <SymbolView
                      name="chevron.right"
                      size={16}
                      tintColor={theme.foregroundMuted}
                    />
                  </View>
                </Link>
              ) : (
                <>
                  <View style={[styles.iconContainer, { backgroundColor: item.iconColor + "15" }]}>
                    <SymbolView
                      name={item.icon as any}
                      size={20}
                      tintColor={item.iconColor}
                    />
                  </View>
                  <View style={styles.settingContent}>
                    <ThemedText type="smallBold">{item.title}</ThemedText>
                    <ThemedText themeColor="foregroundMuted" type="small">
                      {item.subtitle}
                    </ThemedText>
                  </View>
                  <SymbolView
                    name="chevron.right"
                    size={16}
                    tintColor={theme.foregroundMuted}
                  />
                </>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: spacing.four,
    gap: spacing.two,
  },
  sectionTitle: {
    marginBottom: spacing.one,
  },
  quickSwitchContainer: {
    padding: spacing.four,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickSwitchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.two,
    marginBottom: spacing.three,
  },
  quickSwitchLabel: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: "row",
    gap: spacing.two,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.two,
    paddingHorizontal: spacing.three,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  toggleText: {
    fontWeight: "500",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.four,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.four,
  },
  settingItemInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.four,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
    gap: spacing.half,
  },
});
