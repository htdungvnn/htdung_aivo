"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [referenceId, setReferenceId] = useState("");

  useEffect(() => {
    // Generate a reference ID for support
    setReferenceId(
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FCFDFB]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-[#E5EAE7] p-8 sm:p-10">
          {/* Logo */}
          <Link href="/" className="flex justify-center mb-8">
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
          </Link>

          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#FEF3F2] rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#B42318]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-[#101828] text-center mb-3">
            We couldn&apos;t complete sign-in
          </h1>
          <p className="text-[#667085] text-center mb-6">
            No changes were made to your account. Try again or use another sign-in method.
          </p>

          {/* Reference ID */}
          {referenceId && (
            <div className="bg-[#F5F7F5] rounded-xl p-4 mb-6">
              <p className="text-xs text-[#667085] mb-1">Reference ID</p>
              <p className="text-sm font-mono text-[#101828]">{referenceId}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 w-full py-4 px-4 text-base font-medium text-white bg-[#087A55] rounded-xl hover:bg-[#066847] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Try again
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 text-sm font-medium text-[#667085] border-2 border-[#E5EAE7] rounded-xl hover:border-[#CBD5DC] hover:text-[#101828] transition-colors"
            >
              Use another sign-in method
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 text-sm font-medium text-[#667085] hover:text-[#101828] transition-colors"
            >
              Back to AIVO
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
