"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProviderButton } from "@/components/auth/provider-button";
import { AuthCard, AuthHeader, AuthDivider } from "@/components/auth/auth-card";
import { authClient } from "@/lib/auth";
import { OtpForm } from "@/components/auth/otp-form";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || undefined;

  const [authState, setAuthState] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [challengeId, setChallengeId] = useState("");

  const handleEmailSubmit = (submittedEmail: string, submittedChallengeId: string) => {
    setEmail(submittedEmail);
    setChallengeId(submittedChallengeId);
    setAuthState("otp");
  };

  const handleOtpSuccess = (nextUrl: string) => {
    // In production, use router.push with the nextUrl
    window.location.href = nextUrl;
  };

  const handleChangeEmail = () => {
    setAuthState("login");
    setEmail("");
    setChallengeId("");
  };

  const handleOAuth = async (provider: "google" | "facebook") => {
    await authClient.startOAuth(provider, returnTo);
  };

  return (
    <>
      {/* Desktop: Split Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left: Auth Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-[#FCFDFB]">
          {authState === "login" ? (
            <AuthCard>
              <AuthHeader
                eyebrow="Welcome back"
                title="Continue your journey with AIVO"
                description="Sign in to access your personalized workouts, nutrition plan, progress, and AI Coach."
              />

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <ProviderButton onClick={() => handleOAuth("google")}>
                  Continue with Google
                </ProviderButton>
                <ProviderButton onClick={() => handleOAuth("facebook")}>
                  Continue with Facebook
                </ProviderButton>
              </div>

              <AuthDivider />

              {/* Email Form */}
              <EmailFormInner onEmailSubmit={handleEmailSubmit} />
            </AuthCard>
          ) : (
            <OtpForm
              email={email}
              challengeId={challengeId}
              onSuccess={handleOtpSuccess}
              onChangeEmail={handleChangeEmail}
            />
          )}
        </div>

        {/* Right: Brand Panel */}
        <div className="flex-1 bg-gradient-to-br from-[#EAF7F0] to-[#FCFDFB] p-12 xl:p-16 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#087A55]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#087A55]/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 mb-12">
              <svg
                className="w-12 h-12 text-[#087A55]"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
                <path
                  d="M10 16L14 20L22 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-3xl font-bold text-[#101828]">AIVO</span>
            </Link>

            {/* Value Props */}
            <h2 className="text-4xl xl:text-5xl font-bold text-[#101828] mb-8 leading-tight">
              Your personal AI fitness coach
            </h2>

            <div className="space-y-6">
              <ValueProp
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Personalized Workouts"
                description="AI-generated plans tailored to your goals, fitness level, and available equipment"
              />
              <ValueProp
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
                title="Smarter Nutrition"
                description="Meal plans and macro tracking powered by AI to fuel your fitness journey"
              />
              <ValueProp
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                title="Track Real Progress"
                description="Visualize your gains with detailed analytics and progress photos"
              />
              <ValueProp
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
                title="AI Coach"
                description="Get answers, form tips, and motivation from your intelligent fitness companion"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Single Column */}
      <div className="lg:hidden min-h-screen bg-[#FCFDFB]">
        {authState === "login" ? (
          <div className="flex flex-col min-h-screen">
            {/* Mobile Header */}
            <header className="flex items-center justify-between px-5 py-4">
              <Link href="/" className="flex items-center gap-2">
                <svg
                  className="w-8 h-8 text-[#087A55]"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
                  <path
                    d="M10 16L14 20L22 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xl font-semibold text-[#101828]">AIVO</span>
              </Link>
              <Link
                href="/"
                className="text-sm text-[#087A55] font-medium"
              >
                Get started
              </Link>
            </header>

            {/* Auth Card */}
            <div className="flex-1 flex items-center justify-center px-5 pb-8">
              <div className="w-full max-w-sm">
                <div className="bg-white rounded-3xl shadow-xl border border-[#E5EAE7] p-6">
                  <AuthHeader
                    eyebrow="Welcome back"
                    title="Continue your journey with AIVO"
                    description="Sign in to access your personalized workouts, nutrition plan, progress, and AI Coach."
                  />

                  {/* OAuth Buttons */}
                  <div className="space-y-3">
                    <ProviderButton onClick={() => handleOAuth("google")}>
                      Continue with Google
                    </ProviderButton>
                    <ProviderButton onClick={() => handleOAuth("facebook")}>
                      Continue with Facebook
                    </ProviderButton>
                  </div>

                  <AuthDivider />

                  <EmailFormInner onEmailSubmit={handleEmailSubmit} />
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-[#667085]">
                  By continuing, you agree to AIVO&apos;s{" "}
                  <Link href="/terms" className="underline hover:text-[#101828]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-[#101828]">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        ) : (
          <OtpForm
            email={email}
            challengeId={challengeId}
            onSuccess={handleOtpSuccess}
            onChangeEmail={handleChangeEmail}
          />
        )}
      </div>
    </>
  );
}

// Inline email form for reuse
function EmailFormInner({ onEmailSubmit }: { onEmailSubmit: (email: string, challengeId: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await authClient.requestOtp(email);
      onEmailSubmit(email, response.challengeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="mobile-email" className="block text-sm font-medium text-[#101828] mb-1.5">
          Email address
        </label>
        <input
          type="email"
          id="mobile-email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="you@example.com"
          autoComplete="email"
          className={`
            w-full px-4 py-3.5
            text-[#101828] placeholder-[#667085]
            bg-white border-2 rounded-xl
            transition-colors duration-200
            focus:outline-none focus:border-[#087A55]
            ${error ? "border-[#B42318]" : "border-[#E5EAE7] hover:border-[#CBD5DC]"}
          `}
        />
        {error && (
          <p className="mt-2 text-sm text-[#B42318]">{error}</p>
        )}
      </div>

      <ProviderButton type="submit" onClick={() => {}} loading={loading}>
        Continue with Email
      </ProviderButton>
    </form>
  );
}

function ValueProp({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#087A55] shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#101828] mb-1">{title}</h3>
        <p className="text-[#667085] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
