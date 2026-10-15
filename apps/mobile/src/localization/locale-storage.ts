/**
 * Locale persistence helper for mobile
 * Uses AsyncStorage to persist locale preference
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LOCALE, isSupportedLocale, type AppLocale } from '@aivo/i18n';

const LOCALE_STORAGE_KEY = '@aivo/locale';

/**
 * Get stored locale from AsyncStorage
 */
export async function getStoredLocale(): Promise<AppLocale> {
  try {
    const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isSupportedLocale(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to get stored locale:', error);
  }
  return DEFAULT_LOCALE;
}

/**
 * Store locale to AsyncStorage
 */
export async function setStoredLocale(locale: AppLocale): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.warn('Failed to store locale:', error);
  }
}
