/**
 * Locale Provider - Provides i18n context to the app
 */

import React, { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { getStoredLocale, setStoredLocale } from './locale-storage';
import { DEFAULT_LOCALE, supportedLocales, getTranslations, createTranslator, type AppLocale } from '@aivo/i18n';

export interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted locale on mount
  useEffect(() => {
    const loadLocale = async () => {
      try {
        const stored = await getStoredLocale();
        setLocaleState(stored);
      } catch (error) {
        console.warn('Failed to load locale:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLocale();
  }, []);

  // Create translator with current translations
  const translations = useMemo(() => {
    const trans = getTranslations(locale);
    return createTranslator(trans as unknown as Record<string, unknown>);
  }, [locale]);

  /**
   * Simple translation function with interpolation support
   */
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let result = translations(key);

    // Simple interpolation: {{param}} -> value
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
      });
    }

    return result;
  }, [translations]);

  /**
   * Set locale and persist
   */
  const setLocale = useCallback(async (newLocale: AppLocale) => {
    if (!supportedLocales.includes(newLocale)) {
      console.warn(`Unsupported locale: ${newLocale}`);
      return;
    }
    setLocaleState(newLocale);
    await setStoredLocale(newLocale);
  }, []);

  const value: LocaleContextValue = useMemo(() => ({
    locale,
    setLocale,
    t,
    isLoading,
  }), [locale, setLocale, t, isLoading]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}

/**
 * Hook to get only the translation function
 */
export function useTranslation() {
  const { t } = useLocale();
  return { t };
}
