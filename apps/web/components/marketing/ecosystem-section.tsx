"use client";

import { useEffect, useRef, useState } from "react";
import { ecosystemCards } from "@/lib/marketing-content";

const icons: Record<string, React.ReactNode> = {
  "trending-up": (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  salad: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 21h10" />
      <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
      <path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1" />
      <path d="m13 12 4-4" />
      <path d="M10.9 7.25A2.4 2.4 0 0 0 9.72 6a2.4 2.4 0 0 0-3.4.4 2.4 2.4 0 0 0-2.65 2.65 2.4 2.4 0 0 0 1.2 2.1" />
    </svg>
  ),
  target: (
    <svg
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
    </svg>
  ),
};

export function EcosystemSection() {
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
      id="ecosystem"
      className="bg-[var(--surface-subtle)] py-16 sm:py-20 lg:py-24"
      aria-labelledby="ecosystem-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
            Product Ecosystem
          </p>
          <h2
            id="ecosystem-heading"
            className="mb-4 text-3xl font-bold text-[var(--foreground)] sm:text-4xl lg:text-5xl"
          >
            Build a Healthier, More{" "}
            <span className="text-[var(--primary)]">Consistent Life</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--foreground-muted)]">
            Workout planning, nutrition tracking, progress insights, and AI
            guidance designed to work together.
          </p>
        </div>

        {/* Ecosystem Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {ecosystemCards.map((card, index) => (
            <article
              key={card.id}
              className={`group relative overflow-hidden rounded-2xl bg-[var(--surface)] p-8 shadow-sm transition-all duration-500 hover:shadow-xl ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
              }}
            >
              {/* Decorative Element */}
              <div
                className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[var(--primary-subtle)] opacity-60 transition-transform duration-500 group-hover:scale-110"
                aria-hidden="true"
              />

              {/* Icon */}
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
                {icons[card.icon]}
              </div>

              {/* Title */}
              <h3 className="relative mb-3 text-2xl font-bold text-[var(--foreground)]">
                {card.title}
              </h3>

              {/* Description */}
              <p className="relative text-[var(--foreground-muted)]">{card.description}</p>

              {/* Arrow Link */}
              <div className="relative mt-6">
                <a
                  href={`#${card.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] transition-colors hover:gap-3"
                >
                  Learn more
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
