import { capabilityLabels } from "@/lib/marketing-content";

export function TrustStrip() {
  return (
    <section className="bg-[#F5F7F5] py-8" aria-label="AIVO capabilities">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12">
          {capabilityLabels.map((label) => (
            <div key={label} className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#087A55"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="text-sm font-medium text-[#667085]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
