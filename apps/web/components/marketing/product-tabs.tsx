"use client";

import { useState, useEffect, useRef } from "react";
import { productTabs } from "@/lib/marketing-content";

type TabId = (typeof productTabs)[number]["id"];

export function ProductTabs() {
  const [activeTab, setActiveTab] = useState<TabId>(productTabs[0].id);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const activeContent = productTabs.find((tab) => tab.id === activeTab);

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--primary-subtle)] py-16 sm:py-20 lg:py-24"
      aria-labelledby="product-preview-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
            Product Preview
          </p>
          <h2
            id="product-preview-heading"
            className="mb-4 text-3xl font-bold text-[var(--foreground)] sm:text-4xl lg:text-5xl"
          >
            See what you&apos;ll <span className="text-[var(--primary)]">unlock</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--foreground-muted)]">
            Explore the features that make reaching your goals feel natural.
          </p>
        </div>

        {/* Tabs Container */}
        <div
          className={`mx-auto max-w-4xl transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Tab Buttons */}
          <div
            className="mb-8 flex flex-wrap justify-center gap-2 rounded-xl bg-[var(--surface)]/80 p-2"
            role="tablist"
            aria-label="Product features"
          >
            {productTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--primary-subtle)] hover:text-[var(--foreground)]"
                }`}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    const currentIndex = productTabs.findIndex(
                      (t) => t.id === activeTab
                    );
                    let newIndex: number;
                    if (e.key === "ArrowRight") {
                      newIndex =
                        (currentIndex + 1) % productTabs.length;
                    } else {
                      newIndex =
                        (currentIndex - 1 + productTabs.length) %
                        productTabs.length;
                    }
                    setActiveTab(productTabs[newIndex].id);
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          {productTabs.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={activeTab !== tab.id}
              tabIndex={0}
              className={`rounded-2xl bg-[var(--surface)] p-8 shadow-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "animate-in fade-in zoom-in-95"
                  : "hidden"
              }`}
            >
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                {/* Content */}
                <div>
                  <h3 className="mb-4 text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
                    {tab.content.title}
                  </h3>
                  <p className="text-lg text-[var(--foreground-muted)]">
                    {tab.content.description}
                  </p>
                </div>

                {/* Visual Preview */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--surface-subtle)]">
                  {/* Decorative Background */}
                  <div
                    className="absolute inset-0 opacity-50"
                    aria-hidden="true"
                  >
                    <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[var(--primary-subtle)]" />
                    <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[var(--primary-subtle)]" />
                  </div>

                  {/* Tab-specific content visualization */}
                  <div className="relative flex h-full items-center justify-center p-8">
                    {tab.id === "workout" && (
                      <WorkoutPreview />
                    )}
                    {tab.id === "nutrition" && (
                      <NutritionPreview />
                    )}
                    {tab.id === "progress" && (
                      <ProgressPreview />
                    )}
                    {tab.id === "coach" && (
                      <CoachPreview />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkoutPreview() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-xl bg-[var(--surface)] p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-[var(--foreground)]">Today&apos;s Workout</h4>
        <span className="rounded-full bg-[var(--primary-subtle)] px-2 py-1 text-xs font-medium text-[var(--primary)]">
          Week 3
        </span>
      </div>
      <div className="space-y-3">
        {[
          { name: "Bench Press", sets: "4x12", status: "complete" },
          { name: "Incline Dumbbell Press", sets: "3x10", status: "current" },
          { name: "Cable Flyes", sets: "3x12", status: "pending" },
        ].map((exercise, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center ${
                  exercise.status === "complete"
                    ? "bg-[var(--primary)] text-white"
                    : exercise.status === "current"
                    ? "bg-[var(--nutrition)] text-white"
                    : "bg-[var(--surface-subtle)]"
                }`}
              >
                {exercise.status === "complete" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : exercise.status === "current" ? (
                  <span className="text-xs">{i + 1}</span>
                ) : (
                  <span className="text-xs text-[var(--foreground-muted)]">{i + 1}</span>
                )}
              </div>
              <span className="text-sm text-[var(--foreground)]">{exercise.name}</span>
            </div>
            <span className="text-xs text-[var(--foreground-muted)]">{exercise.sets}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NutritionPreview() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-xl bg-[var(--surface)] p-6 shadow-lg">
      <h4 className="font-semibold text-[var(--foreground)]">Today&apos;s Nutrition</h4>
      <div className="flex justify-center">
        <div className="relative">
          <svg className="h-32 w-32 -rotate-90">
            <circle cx="64" cy="64" r="56" fill="none" stroke="var(--border)" strokeWidth="12" />
            <circle cx="64" cy="64" r="56" fill="none" stroke="var(--primary)" strokeWidth="12" strokeDasharray="352" strokeDashoffset="70" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[var(--foreground)]">1,847</span>
            <span className="text-xs text-[var(--foreground-muted)]">of 2,200 cal</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-sm font-bold text-[var(--nutrition)]">142g</p>
          <p className="text-xs text-[var(--foreground-muted)]">Protein</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--progress)]">215g</p>
          <p className="text-xs text-[var(--foreground-muted)]">Carbs</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--danger)]">62g</p>
          <p className="text-xs text-[var(--foreground-muted)]">Fats</p>
        </div>
      </div>
    </div>
  );
}

function ProgressPreview() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-xl bg-[var(--surface)] p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-[var(--foreground)]">Weekly Progress</h4>
        <span className="text-sm text-[var(--primary)]">+12%</span>
      </div>
      <div className="flex items-end justify-between gap-1">
        {[60, 75, 65, 80, 70, 85, 92].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t"
              style={{
                height: `${h}%`,
                backgroundColor: i === 6 ? "var(--primary)" : "var(--border)",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-[var(--foreground-muted)]">
        <span>Mon</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

function CoachPreview() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-xl bg-[var(--surface)] p-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-[var(--foreground)]">AI Coach</h4>
          <p className="text-xs text-[var(--foreground-muted)]">Online now</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="rounded-lg bg-[var(--surface-subtle)] p-3 text-sm text-[var(--foreground)]">
          Should I do cardio before or after weights?
        </div>
        <div className="rounded-lg bg-[var(--primary)] p-3 text-sm text-white">
          For your strength goals, I recommend weights first when you&apos;re fresh...
        </div>
      </div>
    </div>
  );
}
