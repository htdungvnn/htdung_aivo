/**
 * Theme preference management with persistence
 * Handles System/Light/Dark preference and resolves to actual theme
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import type { ThemePreference, ResolvedTheme } from '@/constants/theme';

const THEME_PREFERENCE_KEY = '@aivo/theme_preference';

/**
 * Hook to manage theme preference with persistence
 * Default is 'system' which follows OS preference
 */
export function useThemePreference() {
  const systemColorScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (stored && (stored === 'system' || stored === 'light' || stored === 'dark')) {
          setPreferenceState(stored as ThemePreference);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadPreference();
  }, []);

  /**
   * Set theme preference and persist to storage
   */
  const setPreference = useCallback(async (value: ThemePreference) => {
    setPreferenceState(value);
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, value);
    } catch (error) {
      console.warn('Failed to persist theme preference:', error);
    }
  }, []);

  /**
   * Resolve the actual theme based on preference and system setting
   */
  const resolvedTheme: ResolvedTheme = 
    preference === 'system'
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : preference;

  /**
   * Get CSS class name for the resolved theme
   */
  const themeClass = resolvedTheme;

  return {
    preference,
    setPreference,
    resolvedTheme,
    themeClass,
    isLoaded,
  };
}
