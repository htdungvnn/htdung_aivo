/**
 * Web Locale Client
 * Handles locale persistence using localStorage
 */

import { DEFAULT_LOCALE, isSupportedLocale, type AppLocale } from '@aivo/i18n';

const LOCALE_STORAGE_KEY = 'aivo_locale';

/**
 * Get stored locale from localStorage
 */
export function getStoredLocale(): AppLocale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isSupportedLocale(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to get stored locale:', error);
  }
  return DEFAULT_LOCALE;
}

/**
 * Store locale to localStorage
 */
export function setStoredLocale(locale: AppLocale): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.warn('Failed to store locale:', error);
  }
}
