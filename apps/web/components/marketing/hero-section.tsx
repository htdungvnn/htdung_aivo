"use client";

import { useState, useEffect } from "react";

function DashboardPreview() {
  return (
    <div className="relative rounded-2xl bg-[var(--surface)] p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--foreground-muted)]">Welcome back</p>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Sarah</h3>
        </div>
        <div className="h-10 w-10 rounded-full bg-[var(--primary-subtle)]" />
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-[var(--primary-subtle)] p-4">
          <p className="text-xs text-[var(--foreground-muted)]">Calories</p>
          <p className="text-xl font-bold text-[var(--primary)]">1,847</p>
          <p className="text-xs text-[var(--foreground-muted)]">of 2,200</p>
        </div>
        <div className="rounded-xl bg-[var(--nutrition-subtle)] p-4">
          <p className="text-xs text-[var(--foreground-muted)]">Protein</p>
          <p className="text-xl font-bold text-[var(--nutrition)]">142g</p>
          <p className="text-xs text-[var(--foreground-muted)]">of 160g</p>
        </div>
        <div className="rounded-xl bg-[var(--progress-subtle)] p-4">
          <p className="text-xs text-[var(--foreground-muted)]">Workouts</p>
          <p className="text-xl font-bold text-[var(--progress)]">4</p>
          <p className="text-xs text-[var(--foreground-muted)]">this week</p>
        </div>
      </div>

      {/* Today's Workout */}
      <div className="mb-4 rounded-xl border border-[var(--border)] p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          Today&apos;s Workout
        </p>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-[var(--foreground)]">Upper Body Strength</h4>
            <p className="text-sm text-[var(--foreground-muted)]">45 min • Push Day</p>
          </div>
          <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white">
            Start
          </span>
        </div>
      </div>

      {/* Nutrition Task */}
      <div className="mb-4 rounded-xl border border-[var(--border)] p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          Nutrition
        </p>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full border-4 border-[var(--primary)] border-t-transparent" />
          <div className="flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--foreground)]">Log lunch</span>
              <span className="text-[var(--foreground-muted)]">675 cal remaining</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--border)]">
              <div className="h-full w-3/5 rounded-full bg-[var(--primary)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="rounded-xl border border-[var(--border)] p-4">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          30-Day Progress
        </p>
        <div className="flex items-end justify-between gap-1">
          {[40, 65, 55, 70, 80, 60, 75, 85, 70, 90, 80, 95, 75, 88, 92].map(
            (h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-[var(--primary)]"
                style={{ height: `${h}%` }}
              />
            )
          )}
        </div>
        <div className="mt-2 flex justify-between text-xs text-[var(--foreground-muted)]">
          <span>Week 1</span>
          <span>Week 4</span>
        </div>
      </div>
    </div>
  );
}

function MobilePreview() {
  return (
    <div className="relative rounded-2xl bg-[var(--foreground)] p-4 shadow-xl">
      {/* Phone Frame */}
      <div className="rounded-xl bg-[var(--surface)] p-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">Today</p>
          <p className="text-xs font-medium text-[var(--foreground)]">October 15</p>
        </div>

        {/* Calorie Ring */}
        <div className="mb-4 flex items-center justify-center">
          <div className="relative">
            <svg className="h-32 w-32 -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="var(--border)"
                strokeWidth="12"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="12"
                strokeDasharray="352"
                strokeDashoffset="88"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[var(--foreground)]">1,847</span>
              <span className="text-xs text-[var(--foreground-muted)]">calories</span>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-[var(--nutrition-subtle)] p-2 text-center">
            <p className="text-sm font-bold text-[var(--nutrition)]">142g</p>
            <p className="text-xs text-[var(--foreground-muted)]">Protein</p>
          </div>
          <div className="rounded-lg bg-[var(--progress-subtle)] p-2 text-center">
            <p className="text-sm font-bold text-[var(--progress)]">215g</p>
            <p className="text-xs text-[var(--foreground-muted)]">Carbs</p>
          </div>
          <div className="rounded-lg bg-[var(--danger-subtle)] p-2 text-center">
            <p className="text-sm font-bold text-[var(--danger)]">62g</p>
            <p className="text-xs text-[var(--foreground-muted)]">Fats</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-2 rounded-lg bg-[var(--surface-subtle)] p-1">
          {["Today", "Nutrition", "Activity"].map((tab, i) => (
            <div
              key={tab}
              className={`flex-1 rounded-md px-2 py-1.5 text-center text-xs font-medium ${
                i === 0 ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm" : "text-[var(--foreground-muted)]"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Recent Meal */}
        <div className="rounded-lg border border-[var(--border)] p-3">
          <p className="mb-2 text-xs font-medium text-[var(--foreground-muted)]">Breakfast</p>
          <p className="font-medium text-[var(--foreground)]">Oatmeal with Berries</p>
          <p className="text-sm text-[var(--foreground-muted)]">485 calories</p>
        </div>
      </div>
    </div>
  );
}

function AICoachCard() {
  return (
    <div className="absolute -bottom-4 -left-4 rounded-xl bg-[#087A55] p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8V4H8" />
            <rect
              width="16"
              height="12"
              x="4"
              y="8"
              rx="2"
            />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-white">AI Coach</p>
          <p className="text-xs text-white/80">Guidance when you need it</p>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[var(--background)] pt-20 lg:pt-24"
      aria-labelledby="hero-heading"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[var(--primary-subtle)] opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-[var(--primary-subtle)] opacity-40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
          {/* Left Column - Content */}
          <div
            className={`flex flex-col justify-center transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Eyebrow */}
            <p className="mb-4 inline-flex items-center rounded-full bg-[var(--primary-subtle)] px-4 py-1.5 text-sm font-medium text-[var(--primary)]">
              Your Personal AI Fitness &amp; Nutrition Coach
            </p>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="mb-6 text-4xl font-bold leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl"
            >
              Smarter Workouts.
              <br />
              Healthier You.
              <br />
              <span className="text-[var(--primary)]">With AIVO.</span>
            </h1>

            {/* Description */}
            <p className="mb-8 max-w-lg text-lg text-[var(--foreground-muted)]">
              Get personalized workout plans, practical nutrition guidance,
              progress tracking, and AI-powered support in one connected
              experience.
            </p>

            {/* CTAs */}
            <div className="mb-8 flex flex-wrap gap-4">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
              >
                Start Your Journey
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-base font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-subtle)]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Product Tour
              </a>
            </div>

            {/* Assurance */}
            <div className="flex flex-wrap gap-6 text-sm text-[var(--foreground-muted)]">
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Personalized to your goals
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Built around sustainable progress
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Start without a credit card
              </div>
            </div>
          </div>

          {/* Right Column - Product Preview */}
          <div
            className={`relative transition-all duration-700 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Organic Decorative Shapes */}
            <div
              className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[var(--primary-subtle)] opacity-60"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-[var(--primary-subtle)] opacity-40"
              aria-hidden="true"
            />

            {/* Desktop Dashboard */}
            <div className="hidden lg:block">
              <DashboardPreview />
              <AICoachCard />
            </div>

            {/* Tablet Layout */}
            <div className="hidden md:flex lg:hidden gap-4">
              <div className="flex-1">
                <DashboardPreview />
              </div>
              <div className="w-44">
                <MobilePreview />
              </div>
            </div>

            {/* Mobile Layout - Just phone preview */}
            <div className="md:hidden flex justify-center">
              <div className="w-64">
                <MobilePreview />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="var(--surface-subtle)"
          />
        </svg>
      </div>
    </section>
  );
}
