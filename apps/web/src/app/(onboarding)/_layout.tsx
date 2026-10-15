"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface OnboardingLayoutProps {
  children: ReactNode;
  stepTitle?: string;
}

export default function OnboardingLayout({ children, stepTitle }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left rail - hidden on mobile */}
      <aside className="w-80 bg-gradient-to-b from-primary/5 to-primary/10 p-8 hidden lg:flex flex-col fixed h-screen">
        <Link href="/" className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold tracking-wider text-primary">AIVO</span>
        </Link>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Your plan starts<br />
            with your goals
          </h2>
          <p className="text-muted-foreground text-sm mt-4">
            Answer a few questions to get a personalized workout and nutrition plan.
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your data is private and secure</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-80 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-primary">AIVO</span>
          </div>
          {stepTitle && (
            <span className="text-sm text-muted-foreground">{stepTitle}</span>
          )}
        </header>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
