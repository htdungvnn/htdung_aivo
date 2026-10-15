"use client";

import { useState, useEffect, useRef } from "react";
import { faqItems } from "@/lib/marketing-content";

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
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

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#087A55]">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mb-4 text-3xl font-bold text-[#101828] sm:text-4xl lg:text-5xl"
          >
            Frequently asked{" "}
            <span className="text-[#087A55]">questions</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#667085]">
            Find answers to common questions about AIVO.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div
          className={`mx-auto max-w-3xl space-y-4 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {faqItems.map((item, index) => {
            const isOpen = openItems.has(item.id);
            return (
              <article key={item.id}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.id}`}
                    id={`faq-btn-${item.id}`}
                    onClick={() => toggleItem(item.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-[#E5EAE7] bg-white p-5 text-left transition-all hover:border-[#087A55]/30 hover:shadow-sm"
                  >
                    <span className="pr-4 text-base font-medium text-[#101828] sm:text-lg">
                      {item.question}
                    </span>
                    <span
                      className={`ml-4 flex-shrink-0 rounded-full bg-[#F5F7F5] p-2 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#667085"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${item.id}`}
                  hidden={!isOpen}
                  className="overflow-hidden"
                >
                  <div className="rounded-b-xl border-x border-b border-[#E5EAE7] bg-white px-5 pb-5 pt-2">
                    <p className="text-[#667085]">{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-sm text-[#667085]">
            AIVO provides general fitness and wellness support. It is not a
            substitute for qualified medical advice, diagnosis, or treatment.
            Always consult with healthcare professionals for medical concerns.
          </p>
        </div>
      </div>
    </section>
  );
}
