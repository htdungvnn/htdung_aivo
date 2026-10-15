import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeProvider } from "@/contexts/theme-context";
import { LocaleProvider } from "@/localization/locale-provider";
import { AuthProvider, useAuth } from "@/features/auth/contexts/auth-context";

SplashScreen.preventAutoHideAsync();

// Inner component that handles auth routing
function RootLayoutContent() {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#087A55" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Index route - redirect based on auth state */}
      <Stack.Screen name="index" />
      
      {/* Auth routes */}
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/verify-email" />
      <Stack.Screen name="(auth)/auth/callback" />

      {/* Public routes */}
      <Stack.Screen name="(public)/welcome" />
      
      {/* App tabs - protected */}
      <Stack.Screen name="(tabs)" />

      {/* Catch-all */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCFDFB",
  },
});
