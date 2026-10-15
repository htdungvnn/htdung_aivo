import type { Metadata } from "next";
import "./globals.css";
import { LandingPage } from "@/components/marketing/landing-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aivo.fitness";

export const metadata: Metadata = {
  title: "AIVO - AI Fitness, Workout & Nutrition Coach",
  description:
    "Build personalized workout plans, track nutrition, monitor progress, and get intelligent fitness guidance with AIVO. Your personal AI fitness companion.",
  keywords: [
    "AI fitness coach",
    "workout planner",
    "nutrition tracker",
    "fitness app",
    "meal tracking",
    "macro calculator",
    "workout app",
    "personal trainer",
    "fitness goals",
    "health tracking",
  ],
  authors: [{ name: "AIVO Team" }],
  creator: "AIVO",
  publisher: "AIVO",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AIVO - AI Fitness, Workout & Nutrition Coach",
    description:
      "Build personalized workout plans, track nutrition, monitor progress, and get intelligent fitness guidance with AIVO.",
    url: SITE_URL,
    siteName: "AIVO",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/landing/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIVO - AI Fitness, Workout & Nutrition Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIVO - AI Fitness, Workout & Nutrition Coach",
    description:
      "Build personalized workout plans, track nutrition, monitor progress, and get intelligent fitness guidance with AIVO.",
    images: ["/images/landing/og-image.png"],
    creator: "@aivofitness",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "AIVO",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/aivofitness",
        "https://instagram.com/aivofitness",
        "https://youtube.com/@aivofitness",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "AIVO",
      publisher: { "@id": `${SITE_URL}/#organization` },
      description:
        "AI-powered fitness and nutrition platform with personalized workout plans and coaching.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "AIVO",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free to start with premium features available",
      },
      aggregateRating: undefined, // Only include if real data exists
      screenshot: `${SITE_URL}/images/landing/app-screenshot.png`,
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "AIVO - AI Fitness, Workout & Nutrition Coach",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      description:
        "Build personalized workout plans, track nutrition, monitor progress, and get intelligent fitness guidance with AIVO.",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
        ],
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
