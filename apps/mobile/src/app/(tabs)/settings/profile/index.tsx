/**
 * Profile Settings Screen
 * View and manage fitness profile sections
 */

import { Stack, useRouter } from "expo-router";
import { StyleSheet, View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SymbolView } from "expo-symbols";
import { useState, useEffect } from "react";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { spacing } from "@/constants/theme";

interface FitnessProfile {
  id: string;
  status: string;
  primaryGoal: string | null;
  ageRange: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  unitSystem: string;
  activityLevel: string | null;
  experienceLevel: string | null;
  workoutLocations: string[];
  equipmentIds: string[];
  workoutDaysPerWeek: number | null;
  preferredSessionMinutes: number | null;
  dietPreferenceIds: string[];
  revision: number;
}

function ProfileItem({
  icon,
  iconColor,
  title,
  value,
  onPress,
  theme,
}: {
  icon: string;
  iconColor: string;
  title: string;
  value: string;
  onPress?: () => void;
  theme: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.profileItem,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed && onPress ? 0.7 : 1,
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + "15" }]}>
        <SymbolView name={icon as any} size={20} tintColor={iconColor} />
      </View>
      <View style={styles.itemContent}>
        <ThemedText type="small" themeColor="foregroundMuted">
          {title}
        </ThemedText>
        <ThemedText type="smallBold">{value}</ThemedText>
      </View>
      {onPress && (
        <SymbolView name="chevron.right" size={16} tintColor={theme.foregroundMuted} />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/v1/profile`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      } else {
        setError("Không thể tải hồ sơ");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getLabel = (value: string | null): string => {
    if (!value) return "-";
    return value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Hồ sơ",
          headerShown: true,
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.foreground,
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText themeColor="danger">{error}</ThemedText>
          </View>
        ) : (
          <View style={styles.sections}>
            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: theme.primary + "15" }]}>
              <SymbolView name="checkmark.circle.fill" size={20} tintColor={theme.primary} />
              <ThemedText type="small" themeColor="primary" style={styles.statusText}>
                {profile?.status === "completed" ? "Đã hoàn thành thiết lập" : "Cần hoàn thành thiết lập"}
              </ThemedText>
            </View>

            {/* Fitness Goal */}
            <View style={styles.section}>
              <ThemedText type="small" themeColor="foregroundMuted" style={styles.sectionTitle}>
                Mục tiêu
              </ThemedText>
              <ProfileItem
                icon="target"
                iconColor={theme.primary}
                title="Mục tiêu chính"
                value={getLabel(profile?.primaryGoal ?? null)}
                onPress={() => router.push("/(onboarding)/goal" as any)}
                theme={theme}
              />
            </View>

            {/* Measurements */}
            <View style={styles.section}>
              <ThemedText type="small" themeColor="foregroundMuted" style={styles.sectionTitle}>
                Thể chất
              </ThemedText>
              <View style={[styles.measurementsGrid, { borderColor: theme.border }]}>
                <View style={styles.measurementItem}>
                  <ThemedText type="small" themeColor="foregroundMuted">Tuổi</ThemedText>
                  <ThemedText type="subtitle">
                    {profile?.ageRange ?? "-"}
                  </ThemedText>
                </View>
                <View style={styles.measurementItem}>
                  <ThemedText type="small" themeColor="foregroundMuted">Chiều cao</ThemedText>
                  <ThemedText type="subtitle">
                    {profile?.heightCm ? `${Math.round(profile.heightCm)} cm` : "-"}
                  </ThemedText>
                </View>
                <View style={styles.measurementItem}>
                  <ThemedText type="small" themeColor="foregroundMuted">Cân nặng</ThemedText>
                  <ThemedText type="subtitle">
                    {profile?.currentWeightKg ? `${Math.round(profile.currentWeightKg)} kg` : "-"}
                  </ThemedText>
                </View>
              </View>
              <Pressable
                onPress={() => router.push("/(onboarding)/profile" as any)}
                style={({ pressed }) => [
                  styles.editAllButton,
                  { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <ThemedText type="small" style={styles.editAllText}>
                  Chỉnh sửa
                </ThemedText>
              </Pressable>
            </View>

            {/* Activity */}
            <View style={styles.section}>
              <ThemedText type="small" themeColor="foregroundMuted" style={styles.sectionTitle}>
                Hoạt động
              </ThemedText>
              <ProfileItem
                icon="figure.walk"
                iconColor={theme.info}
                title="Mức độ hoạt động"
                value={getLabel(profile?.activityLevel ?? null)}
                onPress={() => router.push("/(onboarding)/activity" as any)}
                theme={theme}
              />
              <ProfileItem
                icon="chart.bar.fill"
                iconColor={theme.warning}
                title="Kinh nghiệm tập luyện"
                value={getLabel(profile?.experienceLevel ?? null)}
                onPress={() => router.push("/(onboarding)/activity" as any)}
                theme={theme}
              />
            </View>

            {/* Equipment & Schedule */}
            <View style={styles.section}>
              <ThemedText type="small" themeColor="foregroundMuted" style={styles.sectionTitle}>
                Thiết bị & Lịch tập
              </ThemedText>
              <ProfileItem
                icon="dumbbell.fill"
                iconColor={theme.warning}
                title="Địa điểm"
                value={profile?.workoutLocations?.length 
                  ? profile.workoutLocations.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(", ")
                  : "-"}
                onPress={() => router.push("/(onboarding)/equipment" as any)}
                theme={theme}
              />
              <ProfileItem
                icon="calendar"
                iconColor={theme.primary}
                title="Tần suất"
                value={profile?.workoutDaysPerWeek ? `${profile.workoutDaysPerWeek} ngày/tuần` : "-"}
                onPress={() => router.push("/(onboarding)/schedule" as any)}
                theme={theme}
              />
              <ProfileItem
                icon="clock"
                iconColor={theme.info}
                title="Thời lượng buổi tập"
                value={profile?.preferredSessionMinutes ? `${profile.preferredSessionMinutes} phút` : "-"}
                onPress={() => router.push("/(onboarding)/schedule" as any)}
                theme={theme}
              />
            </View>

            {/* Nutrition */}
            <View style={styles.section}>
              <ThemedText type="small" themeColor="foregroundMuted" style={styles.sectionTitle}>
                Dinh dưỡng
              </ThemedText>
              <ProfileItem
                icon="fork.knife"
                iconColor={theme.warning}
                title="Chế độ ăn"
                value={profile?.dietPreferenceIds?.length
                  ? profile.dietPreferenceIds.map(d => d.replace(/_/g, " ")).map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")
                  : "Không có"}
                onPress={() => router.push("/(onboarding)/nutrition" as any)}
                theme={theme}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.four,
  },
  errorContainer: {
    padding: spacing.four,
    alignItems: "center",
  },
  sections: {
    padding: spacing.four,
    gap: spacing.four,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.three,
    borderRadius: 12,
    gap: spacing.two,
  },
  statusText: {
    fontWeight: "600",
  },
  section: {
    gap: spacing.two,
  },
  sectionTitle: {
    marginBottom: spacing.half,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.four,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.three,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
    gap: spacing.half,
  },
  measurementsGrid: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  measurementItem: {
    flex: 1,
    padding: spacing.three,
    alignItems: "center",
    gap: spacing.half,
  },
  editAllButton: {
    padding: spacing.three,
    borderRadius: 10,
    alignItems: "center",
    marginTop: spacing.two,
  },
  editAllText: {
    color: "white",
    fontWeight: "600",
  },
});
