// Marketing content types
export interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export interface ProductTab {
  id: string;
  label: string;
  content: {
    title: string;
    description: string;
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface EcosystemCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface CapabilityLabel {
  id: string;
  label: string;
}

// Marketing content exports with explicit types
export const featureCards: ReadonlyArray<FeatureCard> = [] as const;
export const howItWorksSteps: ReadonlyArray<HowItWorksStep> = [] as const;
export const productTabs: ReadonlyArray<ProductTab> = [] as const;
export const faqItems: ReadonlyArray<FaqItem> = [] as const;
export const ecosystemCards: ReadonlyArray<EcosystemCard> = [] as const;
export const footerLinks: {
  product: ReadonlyArray<FooterLink>;
  company: ReadonlyArray<FooterLink>;
  resources: ReadonlyArray<FooterLink>;
  legal: ReadonlyArray<FooterLink>;
} = {
  product: [] as const,
  company: [] as const,
  resources: [] as const,
  legal: [] as const,
};
export const navigationItems: ReadonlyArray<NavigationItem> = [] as const;
export const capabilityLabels: ReadonlyArray<CapabilityLabel> = [] as const;
