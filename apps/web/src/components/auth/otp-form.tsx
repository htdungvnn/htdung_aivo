"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OtpFormProps {
  email: string;
  challengeId: string;
  onSuccess: (nextUrl: string) => void;
  onChangeEmail: () => void;
}

export function OtpForm({
  email,
  onSuccess,
  onChangeEmail,
}: OtpFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Implement OTP verification
      router.push("/dashboard");
    } catch {
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-[#667085]">
          Enter the verification code sent to
        </p>
        <p className="font-medium text-[#101828]">{email}</p>
      </div>

      <div>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          className="w-full text-center text-2xl tracking-[0.5em] px-4 py-4 border-2 border-[#E5EAE7] rounded-xl focus:outline-none focus:border-[#087A55]"
          maxLength={6}
        />
      </div>

      {error && (
        <p className="text-sm text-[#B42318] text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={otp.length !== 6 || loading}
        className="w-full py-4 bg-[#087A55] text-white font-semibold rounded-xl hover:bg-[#065F40] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        onClick={onChangeEmail}
        className="w-full text-sm text-[#087A55] hover:underline"
      >
        Use a different email
      </button>
    </form>
  );
}
