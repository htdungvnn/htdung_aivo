"use client";

import { useEffect, useRef, useState } from "react";
import { howItWorksSteps } from "@/lib/marketing-content";

const icons = [
  // Step 1 - Target/Goals
  <svg
    key="1"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>,
  // Step 2 - Personalized Plan
  <svg
    key="2"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>,
  // Step 3 - Train/Progress
  <svg
    key="3"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6.5 6.5 11 11" />
    <path d="m21 21-1-1" />
    <path d="m3 3 1 1" />
    <path d="m18 22 4-4" />
    <path d="m2 6 4-4" />
    <path d="m3 10 7-7" />
    <path d="m14 21 7-7" />
  </svg>,
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
            How It Works
          </p>
          <h2
            id="how-it-works-heading"
            className="mb-4 text-3xl font-bold text-[var(--foreground)] sm:text-4xl lg:text-5xl"
          >
            Start seeing results{" "}
            <span className="text-[var(--primary)]">in weeks</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--foreground-muted)]">
            Three simple steps to transform your fitness journey.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop Connector Line */}
          <div
            className="absolute left-1/2 top-24 hidden h-0.5 w-2/3 -translate-x-1/2 bg-[var(--border)] lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {howItWorksSteps.map((step, index) => (
              <article
                key={step.number}
                className={`relative flex flex-col items-center text-center transition-all duration-500 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
                }}
              >
                {/* Step Number Circle */}
                <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg">
                  <span className="text-xl font-bold">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary-subtle)] text-[var(--primary)]">
                  {icons[index]}
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-semibold text-[var(--foreground)]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="max-w-xs text-[var(--foreground-muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
