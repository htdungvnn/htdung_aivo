import { SiteHeader } from "./site-header";
import { HeroSection } from "./hero-section";
import { TrustStrip } from "./trust-strip";
import { FeatureGrid } from "./feature-grid";
import { EcosystemSection } from "./ecosystem-section";
import { HowItWorks } from "./how-it-works";
import { PricingSection } from "./pricing-section";
import { ProductTabs } from "./product-tabs";
import { FAQSection } from "./faq-section";
import { FinalCTA } from "./final-cta";
import { SiteFooter } from "./site-footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FCFDFB]">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-[#087A55] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <HeroSection />

        {/* Trust Strip */}
        <TrustStrip />

        {/* Core Features */}
        <FeatureGrid />

        {/* Product Ecosystem */}
        <EcosystemSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Pricing */}
        <PricingSection />

        {/* Interactive Product Preview */}
        <ProductTabs />

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
