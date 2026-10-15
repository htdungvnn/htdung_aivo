/**
 * AIVO Design System - Semantic Tokens
 * Based on docs/theme/AIVO_LIGHT_DARK_THEME.md
 * Light-first with full Dark mode support
 */

import '@/global.css';
import { Platform } from 'react-native';

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const lightColors = {
  // Backgrounds & Surfaces
  background: "#FCFDFB",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  surfaceSubtle: "#F5F7F5",

  // Foregrounds
  foreground: "#101828",
  foregroundMuted: "#667085",
  foregroundSubtle: "#98A2B3",
  foregroundDisabled: "#B8C0CC",
  onPrimary: "#FFFFFF",

  // Borders & Dividers
  border: "#E5EAE7",
  borderStrong: "#CDD6D1",
  divider: "#EDF1EF",

  // Primary
  primary: "#087A55",
  primaryHover: "#076E4D",
  primaryPressed: "#066847",
  primarySubtle: "#EAF7F0",
  primarySubtleStrong: "#D4EFDF",

  // Status Colors
  success: "#12805C",
  successSubtle: "#EAF8F2",
  warning: "#B54708",
  warningSubtle: "#FFF4E5",
  danger: "#B42318",
  dangerSubtle: "#FEF3F2",
  info: "#175CD3",
  infoSubtle: "#EFF8FF",

  // Feature Accents
  nutrition: "#F97316",
  nutritionSubtle: "#FFF1E8",
  workout: "#087A55",
  workoutSubtle: "#EAF7F0",
  progress: "#2563EB",
  progressSubtle: "#EFF6FF",
  aiCoach: "#6941C6",
  aiCoachSubtle: "#F4F3FF",

  // Utilities
  focusRing: "#12B76A",
  overlay: "rgba(16, 24, 40, 0.48)",
  skeleton: "#E9EEEB",
  chartGrid: "#E7ECE9",
} as const;

export const darkColors = {
  // Backgrounds & Surfaces
  background: "#09120F",
  surface: "#101C18",
  surfaceElevated: "#172620",
  surfaceSubtle: "#13211C",

  // Foregrounds
  foreground: "#F3F7F5",
  foregroundMuted: "#A8B8B1",
  foregroundSubtle: "#7F948B",
  foregroundDisabled: "#65776F",
  onPrimary: "#062A1D",

  // Borders & Dividers
  border: "#253A32",
  borderStrong: "#365046",
  divider: "#1D3029",

  // Primary
  primary: "#39C891",
  primaryHover: "#45D69F",
  primaryPressed: "#2BAE7B",
  primarySubtle: "#163B2E",
  primarySubtleStrong: "#1E4B3A",

  // Status Colors
  success: "#5AD6A7",
  successSubtle: "#123A2C",
  warning: "#FDB022",
  warningSubtle: "#3B2A12",
  danger: "#FDA29B",
  dangerSubtle: "#3A1C1B",
  info: "#84ADFF",
  infoSubtle: "#172A4D",

  // Feature Accents
  nutrition: "#FB923C",
  nutritionSubtle: "#3B2415",
  workout: "#39C891",
  workoutSubtle: "#163B2E",
  progress: "#7CA7FF",
  progressSubtle: "#172A4D",
  aiCoach: "#B7A3FF",
  aiCoachSubtle: "#28213F",

  // Utilities
  focusRing: "#6CE9B8",
  overlay: "rgba(0, 0, 0, 0.68)",
  skeleton: "#1D3029",
  chartGrid: "#24372F",
} as const;

// ============================================================================
// THEME TYPES
// ============================================================================

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";
export type ThemeColors = typeof lightColors;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  display: {
    fontSize: 44,
    lineHeight: 48,
    fontWeight: "700" as const,
  },
  heading1: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700" as const,
  },
  heading2: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700" as const,
  },
  heading3: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  // Backward-compatible aliases for existing code
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
} as const;

// ============================================================================
// RADIUS
// ============================================================================

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

// ============================================================================
// CONTROL SIZES
// ============================================================================

export const controlSize = {
  compact: 40,
  default: 48,
  large: 52,
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const lightShadow = {
  card: {
    shadowColor: "#101828",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  modal: {
    shadowColor: "#101828",
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
} as const;

export const darkShadow = {
  card: {
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  modal: {
    shadowColor: "#000000",
    shadowOpacity: 0.38,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;

// ============================================================================
// FONTS (Legacy export for compatibility)
// ============================================================================

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

// Legacy export for backwards compatibility
export const Colors = {
  light: {
    text: lightColors.foreground,
    background: lightColors.background,
    backgroundElement: lightColors.surfaceSubtle,
    backgroundSelected: lightColors.primarySubtle,
    textSecondary: lightColors.foregroundMuted,
  },
  dark: {
    text: darkColors.foreground,
    background: darkColors.background,
    backgroundElement: darkColors.surfaceSubtle,
    backgroundSelected: darkColors.primarySubtle,
    textSecondary: darkColors.foregroundMuted,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Legacy exports
export const Spacing = spacing;
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
