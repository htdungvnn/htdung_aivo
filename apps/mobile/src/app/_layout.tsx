import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { authClient } from '@/features/auth/services';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check session on app start
    const checkSession = async () => {
      try {
        const user = await authClient.getCurrentUser();
        if (user) {
          // User has valid session, show app tabs
          await SplashScreen.hideAsync();
        } else {
          // No session, redirect to welcome
          await SplashScreen.hideAsync();
        }
      } catch {
        // Error checking session, go to welcome
        await SplashScreen.hideAsync();
      } finally {
        setIsReady(true);
      }
    };

    checkSession();
  }, []);

  // Don't render tabs until session is checked
  // The router will handle redirecting based on auth state
  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
