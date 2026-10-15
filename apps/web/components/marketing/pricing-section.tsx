"use client";

import { useEffect, useRef, useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "3 workout plans per week",
      "Basic nutrition tracking",
      "Progress charts",
      "Community access",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For serious fitness goals",
    features: [
      "Unlimited workout plans",
      "Advanced nutrition tracking",
      "AI Coach access",
      "Custom meal plans",
      "Priority support",
      "Offline mode",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For fitness studios & coaches",
    features: [
      "Everything in Pro",
      "Up to 25 members",
      "Admin dashboard",
      "Client management",
      "API access",
      "Custom branding",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function PricingSection() {
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
      id="pricing"
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
            Pricing
          </p>
          <h2
            id="pricing-heading"
            className="mb-4 text-3xl font-bold text-[var(--foreground)] sm:text-4xl lg:text-5xl"
          >
            Simple, transparent{" "}
            <span className="text-[var(--primary)]">pricing</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--foreground-muted)]">
            Start free, upgrade when you&apos;re ready. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          className={`grid gap-6 lg:grid-cols-3 lg:gap-8 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-2xl p-6 lg:p-8 ${
                plan.highlighted
                  ? "border-2 border-[var(--primary)] bg-[var(--surface)] shadow-xl"
                  : "border border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-4 py-1 text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-bold text-[var(--foreground)]">
                  {plan.name}
                </h3>
                <p className="text-sm text-[var(--foreground-muted)]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--foreground)]">
                  {plan.price}
                </span>
                <span className="text-[var(--foreground-muted)]">{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span className="text-sm text-[var(--foreground-muted)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/signup"
                className={`block w-full rounded-xl py-3 text-center text-base font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                    : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-subtle)]"
                }`}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <p className="mt-8 text-center text-sm text-[var(--foreground-muted)]">
          <svg
            className="mr-1 inline-block h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          30-day money-back guarantee on all paid plans
        </p>
      </div>
    </section>
  );
}
