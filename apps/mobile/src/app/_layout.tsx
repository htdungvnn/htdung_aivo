import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { authClient } from "@/features/auth/services";
import { ThemeProvider } from "@/contexts/theme-context";
import { LocaleProvider } from "@/localization/locale-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await authClient.getCurrentUser();
      } catch {
        // Session check complete
      } finally {
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    };
    init();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <LocaleProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Public routes */}
          <Stack.Screen name="(public)/welcome" />
          
          {/* Auth routes */}
          <Stack.Screen
            name="(auth)/login"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="(auth)/verify-email"
            options={{ animation: "slide_from_right" }}
          />
          
          {/* App tabs - only accessible after auth */}
          <Stack.Screen
            name="(tabs)"
            options={{ animation: "fade" }}
          />

          {/* Catch-all for unmatched routes */}
          <Stack.Screen
            name="+not-found"
            options={{ title: "Oops!" }}
          />
        </Stack>
      </ThemeProvider>
    </LocaleProvider>
  );
}
