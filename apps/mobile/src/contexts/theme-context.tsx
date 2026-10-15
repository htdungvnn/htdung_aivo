/**
 * Theme Context - Provides full theme object to the app
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { spacing, radius, typography } from '@/constants/theme';
import { useThemePreference } from '@/hooks/use-theme-preference';

// Re-export types from theme
export type { ThemePreference, ResolvedTheme, ThemeColors } from '@/constants/theme';

/**
 * Theme object type - all properties are readonly
 */
export interface AivoTheme {
  mode: 'light' | 'dark';
  colors: Readonly<Record<string, string>>;
  spacing: Readonly<Record<string, number>>;
  radius: Readonly<Record<string, number>>;
  typography: Readonly<Record<string, unknown>>;
  shadows: Readonly<Record<string, unknown>>;
}

const ThemeContext = createContext<AivoTheme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useThemePreference();

  // Import colors dynamically to avoid circular deps
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { lightColors, darkColors } = require('@/constants/theme');

  const theme = {
    mode: resolvedTheme,
    colors: resolvedTheme === 'dark' ? darkColors : lightColors,
    spacing,
    radius,
    typography,
    shadows: resolvedTheme === 'dark' ? darkColors : lightColors, // simplified for now
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useAivoTheme(): AivoTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAivoTheme must be used within a ThemeProvider');
  }
  return ctx;
}
