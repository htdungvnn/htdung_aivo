"use client";

import { useRouter } from "next/navigation";
import OnboardingLayout from "../_layout";

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/onboarding/goal");
  };

  return (
    <OnboardingLayout stepTitle="Welcome">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Let AIVO understand you
          </h1>
          <p className="text-muted-foreground text-lg">
            Answer a few questions so AIVO can create a workout and nutrition plan around your goals. Takes about 2-3 minutes.
          </p>
        </div>

        {/* Value proposition */}
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💪</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Personalized Workouts</h3>
              <p className="text-sm text-muted-foreground">Exercises that match your experience and equipment</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-nutrition/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🥗</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Nutrition Targets</h3>
              <p className="text-sm text-muted-foreground">Practical calorie and macro goals based on your profile</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-workout/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI Coach</h3>
              <p className="text-sm text-muted-foreground">Guidance that adapts as you progress</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGetStarted}
          className="w-full px-6 py-4 rounded-xl bg-primary text-white font-medium text-lg hover:bg-primary/90 transition-colors active:scale-[0.98]"
        >
          Get started →
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Takes about 2-3 minutes • You can update answers later
        </p>
      </div>
    </OnboardingLayout>
  );
}
