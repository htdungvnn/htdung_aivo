import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/use-theme";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const theme = useTheme();
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.bar, { backgroundColor: theme.border }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: theme.primary,
              width: `${progress}%`,
            },
          ]}
        />
      </View>
      <Text style={[styles.text, { color: theme.foregroundMuted }]}>
        Step {current} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
  text: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
});
