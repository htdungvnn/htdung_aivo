"use client";

import { useState, FormEvent } from "react";
import { ProviderButton } from "./provider-button";
import { AuthCard, AuthHeader, AuthDivider } from "./auth-card";
import { authClient } from "@/lib/auth";

interface EmailFormProps {
  onEmailSubmit: (email: string, challengeId: string) => void;
}

export function EmailForm({ onEmailSubmit }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter a valid email address.");
      return;
    }

    if (!validateEmail(email)) {
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

  const handleOAuth = async (provider: "google" | "facebook") => {
    await authClient.startOAuth(provider);
  };

  return (
    <AuthCard>
      <AuthHeader
        eyebrow="Welcome back"
        title="Continue your journey with AIVO"
        description="Sign in to access your personalized workouts, nutrition plan, progress, and AI Coach."
      />

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <ProviderButton onClick={() => handleOAuth("google")} disabled={loading}>
          Continue with Google
        </ProviderButton>
        <ProviderButton onClick={() => handleOAuth("facebook")} disabled={loading}>
          Continue with Facebook
        </ProviderButton>
      </div>

      <AuthDivider />

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#101828] mb-1.5"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            className={`
              w-full px-4 py-3.5
              text-[#101828] placeholder-[#667085]
              bg-white border-2 rounded-xl
              transition-colors duration-200
              focus:outline-none focus:border-[#087A55]
              ${
                error
                  ? "border-[#B42318] focus:border-[#B42318]"
                  : "border-[#E5EAE7] hover:border-[#CBD5DC]"
              }
            `}
          />
          {error && (
            <p className="mt-2 text-sm text-[#B42318]" role="alert">
              {error}
            </p>
          )}
        </div>

        <ProviderButton type="submit" onClick={() => {}} loading={loading}>
          Continue with Email
        </ProviderButton>
      </form>
    </AuthCard>
  );
}
