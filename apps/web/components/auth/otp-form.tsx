"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { AuthCard, AuthHeader } from "./auth-card";
import { authClient } from "@/lib/auth";

interface OtpFormProps {
  email: string;
  challengeId: string;
  onSuccess: (nextUrl: string) => void;
  onChangeEmail: () => void;
}

export function OtpForm({ email, challengeId, onSuccess, onChangeEmail }: OtpFormProps) {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mask email for display
  const maskEmail = (emailAddress: string): string => {
    const [local, domain] = emailAddress.split("@");
    if (!local || !domain) return emailAddress;
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
  };

  const maskedEmail = maskEmail(email);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Set initial cooldown
  useEffect(() => {
    setResendCooldown(60);
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newCode.every((d: string) => d) && newCode.join("").length === 6) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (pastedData.length > 0) {
      const newCode: string[] = Array(6).fill("");
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);
      setError("");

      // Focus last filled or first empty
      const lastFilledIndex = pastedData.length - 1;
      inputRefs.current[Math.min(lastFilledIndex, 5)]?.focus();

      // Auto-submit when complete
      if (pastedData.length === 6) {
        handleVerify(pastedData);
      }
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify || code.join("");
    if (verificationCode.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authClient.verifyOtp(challengeId, verificationCode);
      onSuccess(response.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid verification code");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError("");

    try {
      await authClient.requestOtp(email);
      // Reset cooldown and code
      setResendCooldown(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Check your email"
        description={
          <span>
            Enter the verification code sent to{" "}
            <span className="font-medium text-[#101828]">{maskedEmail}</span>
          </span>
        }
      />

      <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleVerify(); }} className="space-y-6">
        {/* OTP Input */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {code.map((digit: string, index: number) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              autoComplete="one-time-code"
              className={`
                w-12 h-14 sm:w-14 sm:h-16
                text-center text-xl sm:text-2xl font-semibold
                bg-white border-2 rounded-xl
                transition-colors duration-200
                focus:outline-none focus:border-[#087A55]
                ${error ? "border-[#B42318]" : "border-[#E5EAE7] hover:border-[#CBD5DC]"}
              `}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-[#B42318]" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.some((d: string) => !d)}
          className={`
            w-full py-4
            text-base font-medium text-white
            bg-[#087A55] rounded-xl
            transition-all duration-200
            hover:bg-[#066847]
            focus:outline-none focus:ring-2 focus:ring-[#087A55] focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify"
          )}
        </button>
      </form>

      {/* Resend & Change Email */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || loading}
          className="text-[#087A55] font-medium hover:text-[#066847] disabled:text-[#667085] disabled:cursor-not-allowed transition-colors"
        >
          {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
        </button>
        <span className="hidden sm:inline text-[#E5EAE7]">|</span>
        <button
          type="button"
          onClick={onChangeEmail}
          className="text-[#667085] hover:text-[#101828] transition-colors"
        >
          Use another email
        </button>
      </div>

      {/* Info text */}
      <p className="mt-6 text-center text-xs text-[#667085]">
        The code expires shortly for your security.
      </p>
    </AuthCard>
  );
}
