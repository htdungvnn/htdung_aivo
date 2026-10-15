/**
 * Locale types and constants for AIVO app
 * Supports Vietnamese (vi-VN) as default and English (en)
 */

export const supportedLocales = ["vi-VN", "en"] as const;

export type AppLocale = (typeof supportedLocales)[number];

export const DEFAULT_LOCALE: AppLocale = "vi-VN";

export const localeMetadata = {
  "vi-VN": {
    label: "Tiếng Việt",
    shortLabel: "VI",
    direction: "ltr" as const,
  },
  en: {
    label: "English",
    shortLabel: "EN",
    direction: "ltr" as const,
  },
} as const;

/**
 * Check if a string is a valid supported locale
 */
export function isSupportedLocale(value: string): value is AppLocale {
  return supportedLocales.includes(value as AppLocale);
}
