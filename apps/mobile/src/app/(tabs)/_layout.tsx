import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/localization/locale-provider";

// Tab icons
function TabIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    home: "🏠",
    workouts: "💪",
    nutrition: "🥗",
    coach: "🤖",
    settings: "⚙️",
  };

  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>{icons[name] || "📱"}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.foregroundMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.home"),
          tabBarIcon: () => <TabIcon name="home" />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: t("tabs.workouts"),
          tabBarIcon: () => <TabIcon name="workouts" />,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: t("tabs.nutrition"),
          tabBarIcon: () => <TabIcon name="nutrition" />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: t("tabs.coach"),
          tabBarIcon: () => <TabIcon name="coach" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: () => <TabIcon name="settings" />,
        }}
      />
    </Tabs>
  );
}
