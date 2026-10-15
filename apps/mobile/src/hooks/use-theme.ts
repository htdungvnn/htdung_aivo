/**
 * useTheme hook - provides theme colors based on preference
 * Uses semantic tokens from theme constants
 */

import { lightColors, darkColors } from '@/constants/theme';
import { useThemePreference } from './use-theme-preference';

/**
 * Get the current theme colors
 * Automatically follows system preference when set to 'system'
 */
export function useTheme() {
  const { resolvedTheme } = useThemePreference();
  const colors = resolvedTheme === 'dark' ? darkColors : lightColors;
  return colors;
}
