"use client";

import { useEffect, useRef, useState } from "react";

export function FinalCTA() {
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
      className="bg-[var(--primary)] py-16 sm:py-20 lg:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Headline */}
          <h2
            id="cta-heading"
            className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            Ready to Build Better Habits?
          </h2>

          {/* Description */}
          <p className="mb-8 text-lg text-white/90">
            Create your AIVO profile and turn your goals into a practical workout
            and nutrition plan.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[var(--primary)] transition-all hover:bg-[var(--primary-subtle)] hover:shadow-lg"
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
              href="/#features"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-transparent px-6 py-3 text-base font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10"
            >
              Explore Features
            </a>
          </div>

          {/* Decorative Elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
