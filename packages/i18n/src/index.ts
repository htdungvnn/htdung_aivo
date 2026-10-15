/**
 * AIVO i18n - Localization package
 * Exports locale types, constants, formatters, and translations
 */

import type { AppLocale } from './locale';

// Locale types and constants
export {
  supportedLocales,
  DEFAULT_LOCALE,
  localeMetadata,
  isSupportedLocale,
  type AppLocale,
} from './locale';

// Formatters
export {
  formatDate,
  formatShortDate,
  formatFullDate,
  formatNumber,
  formatRelativeTime,
  formatTime,
  getGreeting,
  formatDuration,
  formatWeight,
  formatCalories,
} from './formatters';

// Translation namespaces - Vietnamese
import commonVi from './locales/vi-VN/common.json';
import authVi from './locales/vi-VN/auth.json';
import onboardingVi from './locales/vi-VN/onboarding.json';

export const viVN = {
  common: commonVi,
  auth: authVi,
  onboarding: onboardingVi,
} as const;

// Translation namespaces - English
import commonEn from './locales/en/common.json';
import authEn from './locales/en/auth.json';
import onboardingEn from './locales/en/onboarding.json';

export const en = {
  common: commonEn,
  auth: authEn,
  onboarding: onboardingEn,
} as const;

/**
 * Get all translations for a locale
 */
export function getTranslations(locale: AppLocale) {
  return locale === 'vi-VN' ? viVN : en;
}

/**
 * Simple translation lookup function
 * Usage: t('common.actions.continue')
 */
export function createTranslator(translations: Record<string, unknown>) {
  return function t(key: string): string {
    const keys = key.split('.');
    let result: unknown = translations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        return key; // Return key if not found
      }
    }
    
    return typeof result === 'string' ? result : key;
  };
}
