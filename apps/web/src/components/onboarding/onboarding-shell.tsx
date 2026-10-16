"use client";

import { ReactNode } from "react";
import { ONBOARDING_STEPS } from "@aivo/contracts";

interface OnboardingShellProps {
  currentStep: string;
  children: ReactNode;
}

export function OnboardingShell({ currentStep, children }: OnboardingShellProps) {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep as typeof ONBOARDING_STEPS[number]);
  const totalSteps = ONBOARDING_STEPS.length;

  return (
    <div className="min-h-screen flex">
      {/* Left rail */}
      <aside className="w-80 bg-gradient-to-b from-primary/5 to-primary/10 p-8 hidden lg:flex flex-col fixed h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold tracking-wider text-primary">AIVO</span>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Your plan starts<br />
            with your goals
          </h2>
          <p className="text-muted-foreground text-sm mt-4">
            Answer a few questions to get a personalized workout and nutrition plan.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-auto">
          <p className="text-sm text-muted-foreground mb-2">
            Step {currentIndex + 1} of {totalSteps}
          </p>
          <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your data is private and secure
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-80 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
