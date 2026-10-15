// Marketing content for AIVO Landing Page

export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Programs", href: "/#ecosystem" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
] as const;

export const featureCards = [
  {
    id: "workouts",
    title: "Personalized Workouts",
    description: "Adaptive plans based on your goals, experience, available equipment, and weekly schedule.",
    icon: "dumbbell",
  },
  {
    id: "nutrition",
    title: "Nutrition Made Simple",
    description: "Track meals, calories, and macros without turning food logging into a full-time task.",
    icon: "utensils",
  },
  {
    id: "progress",
    title: "Track Real Progress",
    description: "See workout consistency, nutrition trends, measurements, and meaningful progress over time.",
    icon: "chart",
  },
  {
    id: "coach",
    title: "AI Coach",
    description: "Ask questions, review your plan, and get contextual guidance based on your activity.",
    icon: "message",
  },
] as const;

export const ecosystemCards = [
  {
    id: "stronger",
    title: "Stronger Every Week",
    description: "Progressive overload and smart recovery to build lasting strength.",
    icon: "trending-up",
  },
  {
    id: "nutrition-habits",
    title: "Better Nutrition Habits",
    description: "Practical guidance that fits your lifestyle, not the other way around.",
    icon: "salad",
  },
  {
    id: "visible-progress",
    title: "Progress You Can See",
    description: "Visualize your journey with charts, measurements, and achievements.",
    icon: "target",
  },
] as const;

export const howItWorksSteps = [
  {
    number: 1,
    title: "Tell AIVO about your goals",
    description: "Share your fitness level, equipment, time availability, and what you want to achieve.",
  },
  {
    number: 2,
    title: "Receive a personalized plan",
    description: "Get workouts and nutrition guidance tailored to your schedule and preferences.",
  },
  {
    number: 3,
    title: "Train, track, and adapt",
    description: "Log your progress, see trends, and let AIVO adjust your plan as you improve.",
  },
] as const;

export const productTabs = [
  {
    id: "workout",
    label: "Workout",
    content: {
      title: "Smart Workout Planning",
      description: "Get adaptive workout plans that evolve with your progress. Each session is designed for your goals, equipment, and schedule.",
    },
  },
  {
    id: "nutrition",
    label: "Nutrition",
    content: {
      title: "Effortless Nutrition Tracking",
      description: "Log meals quickly, hit your macros, and build sustainable eating habits without the mental load.",
    },
  },
  {
    id: "progress",
    label: "Progress",
    content: {
      title: "See Your Growth",
      description: "Track workouts, measurements, and trends over time. Celebrate wins and stay motivated with clear insights.",
    },
  },
  {
    id: "coach",
    label: "AI Coach",
    content: {
      title: "Your AI Fitness Partner",
      description: "Get instant answers to your fitness questions and personalized guidance based on your activity and goals.",
    },
  },
] as const;

export const faqItems = [
  {
    id: "what-is-aivo",
    question: "What is AIVO?",
    answer: "AIVO is an AI-powered fitness and nutrition platform that provides personalized workout plans, nutrition tracking, progress analytics, and intelligent coaching to help you achieve your health and fitness goals.",
  },
  {
    id: "personalize-workouts",
    question: "How does AIVO personalize workouts?",
    answer: "AIVO creates personalized workout plans based on your fitness level, available equipment, time constraints, and specific goals. The AI continuously adapts your plan based on your progress and feedback.",
  },
  {
    id: "track-meals",
    question: "Can AIVO help track meals and macros?",
    answer: "Yes! AIVO includes a comprehensive nutrition tracking system where you can log meals, track calories and macros, and get insights to help you reach your nutrition goals.",
  },
  {
    id: "equipment-needed",
    question: "Do I need gym equipment?",
    answer: "No, AIVO offers workout plans for all scenarios. You can choose programs that require no equipment, minimal home gym equipment, or full gym access. Every workout can be adapted to your available resources.",
  },
  {
    id: "mobile-available",
    question: "Is AIVO available on mobile?",
    answer: "Yes, AIVO is available on both web and mobile platforms. Your progress syncs seamlessly across all devices, so you can track workouts at the gym or log meals on the go.",
  },
  {
    id: "medical-replacement",
    question: "Is AIVO a replacement for a medical professional?",
    answer: "No, AIVO provides general fitness and wellness support but is not a substitute for qualified medical advice, diagnosis, or treatment. Always consult with healthcare professionals for medical concerns.",
  },
] as const;

export const footerLinks = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
    { label: "Fitness Tips", href: "/tips" },
    { label: "API Docs", href: "/docs" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Settings", href: "/cookies" },
  ],
} as const;

export const capabilityLabels = [
  "Personalized Planning",
  "Nutrition Tracking",
  "Progress Insights",
  "AI Guidance",
  "Web & Mobile",
] as const;
