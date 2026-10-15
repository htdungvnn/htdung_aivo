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
 * Format a short date (e.g., "Oct 15" or "15 thg 10")
 */
export function formatShortDate(date: Date, locale: AppLocale): string {
  if (locale === "vi-VN") {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "short",
    }).format(date);
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format a full date with day name (e.g., "Thursday, October 15, 2026")
 */
export function formatFullDate(date: Date, locale: AppLocale): string {
  if (locale === "vi-VN") {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
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
 * Get time-of-day greeting based on locale
 */
export function getGreeting(locale: AppLocale): string {
  const hour = new Date().getHours();
  
  const greetings: Record<AppLocale, { morning: string; afternoon: string; evening: string }> = {
    "vi-VN": {
      morning: "Chào buổi sáng",
      afternoon: "Chào buổi chiều",
      evening: "Chào buổi tối",
    },
    "en": {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
  };
  
  if (hour < 12) {
    return greetings[locale].morning;
  } else if (hour < 18) {
    return greetings[locale].afternoon;
  } else {
    return greetings[locale].evening;
  }
}

/**
 * Format duration in minutes to readable string (e.g., "45 min")
 */
export function formatDuration(minutes: number, locale: AppLocale): string {
  if (locale === "vi-VN") {
    return `${minutes} phút`;
  }
  return `${minutes} min`;
}

/**
 * Format weight (kg/lb)
 */
export function formatWeight(value: number, locale: AppLocale, unit: "kg" | "lb" = "kg"): string {
  const formatted = formatNumber(value, locale);
  return `${formatted} ${unit}`;
}

/**
 * Format calories
 */
export function formatCalories(value: number, locale: AppLocale): string {
  return `${formatNumber(value, locale)} cal`;
}
