"use client";

import { ButtonHTMLAttributes } from "react";

interface OnboardingNavigationProps {
  onContinue?: () => void;
  onBack?: () => void;
  continueLabel?: string;
  backLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  showBack?: boolean;
}

export function OnboardingNavigation({
  onContinue,
  onBack,
  continueLabel = "Continue",
  backLabel = "Back",
  isLoading = false,
  disabled = false,
  showBack = true,
}: OnboardingNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4 mt-8">
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          ← {backLabel}
        </button>
      )}
      <div className="flex-1" />
      {onContinue && (
        <button
          type="button"
          onClick={onContinue}
          disabled={disabled || isLoading}
          className={`
            px-6 py-3 rounded-xl font-medium transition-all
            ${disabled || isLoading
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            continueLabel
          )}
        </button>
      )}
    </div>
  );
}
