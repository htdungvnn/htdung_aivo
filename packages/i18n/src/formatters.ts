/**
 * Date, number, and time formatters for AIVO app
 * Uses Intl APIs for locale-aware formatting
 */

import type { AppLocale } from './locale';

/**
 * Format a date in the user's locale
 */
export function formatDate(date: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Format a short date (e.g., "Oct 15")
 */
export function formatShortDate(date: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format a number with locale-aware separators
 */
export function formatNumber(
  value: number,
  locale: AppLocale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a relative time (e.g., "5 minutes ago")
 */
export function formatRelativeTime(seconds: number, locale: AppLocale): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (Math.abs(seconds) < 60) {
    return rtf.format(-Math.round(seconds), "second");
  }
  if (Math.abs(seconds) < 3600) {
    return rtf.format(-Math.round(seconds / 60), "minute");
  }
  if (Math.abs(seconds) < 86400) {
    return rtf.format(-Math.round(seconds / 3600), "hour");
  }
  return rtf.format(-Math.round(seconds / 86400), "day");
}

/**
 * Format a time (e.g., "2:30 PM")
 */
export function formatTime(date: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Format a greeting based on time of day
 */
export function getGreeting(locale: AppLocale, name?: string): string {
  const hour = new Date().getHours();
  let timeOfDay: 'morning' | 'afternoon' | 'evening';
  
  if (hour < 12) {
    timeOfDay = 'morning';
  } else if (hour < 18) {
    timeOfDay = 'afternoon';
  } else {
    timeOfDay = 'evening';
  }
  
  return `greeting.${timeOfDay}`;
}
