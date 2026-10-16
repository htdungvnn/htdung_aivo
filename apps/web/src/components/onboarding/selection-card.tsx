"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

interface SelectionCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: string;
  description?: string;
}

export const SelectionCard = forwardRef<HTMLButtonElement, SelectionCardProps>(
  ({ selected, icon, description, children, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        className={`
          w-full p-4 rounded-xl border-2 text-left transition-all
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          ${selected
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-border hover:border-primary/50 bg-background"
          }
          ${className}
        `}
        {...props}
      >
        <div className="flex items-start gap-4">
          {icon && (
            <span className="text-2xl" role="img" aria-hidden="true">
              {icon}
            </span>
          )}
          <div className="flex-1">
            <div className="font-medium text-foreground">{children}</div>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {selected && (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </button>
    );
  }
);

SelectionCard.displayName = "SelectionCard";
