"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const next = searchParams.get("next") || "/dashboard";
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }

    if (token) {
      // Store token in session storage (in production, use httpOnly cookies)
      sessionStorage.setItem("auth_token", token);
      setStatus("success");

      // Redirect after brief delay
      setTimeout(() => {
        router.push(next);
      }, 1500);
    } else {
      setStatus("error");
      setErrorMessage("No authentication token received");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FCFDFB]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-[#E5EAE7] p-8 sm:p-10 text-center">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <svg
              className="w-10 h-10 text-[#087A55]"
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
            <span className="text-2xl font-semibold text-[#101828]">AIVO</span>
          </Link>

          {status === "loading" && (
            <>
              {/* Loading spinner */}
              <div className="flex justify-center mb-6">
                <svg
                  className="animate-spin h-12 w-12 text-[#087A55]"
                  viewBox="0 0 24 24"
                >
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
              </div>
              <h1 className="text-xl font-semibold text-[#101828] mb-2">
                Signing you in to AIVO...
              </h1>
              <p className="text-[#667085]">Please wait while we complete the sign-in.</p>
            </>
          )}

          {status === "success" && (
            <>
              {/* Success checkmark */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#EAF7F0] rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-[#087A55]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-semibold text-[#101828] mb-2">
                Welcome back!
              </h1>
              <p className="text-[#667085]">Redirecting you to AIVO...</p>
            </>
          )}

          {status === "error" && (
            <>
              {/* Error icon */}
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
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-semibold text-[#101828] mb-2">
                We couldn&apos;t complete sign-in.
              </h1>
              <p className="text-[#667085] mb-6">
                No changes were made to your account. Try again or use another sign-in method.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auth/login"
                  className="flex-1 py-3 px-4 text-center font-medium text-white bg-[#087A55] rounded-xl hover:bg-[#066847] transition-colors"
                >
                  Try again
                </Link>
                <Link
                  href="/"
                  className="flex-1 py-3 px-4 text-center font-medium text-[#667085] border-2 border-[#E5EAE7] rounded-xl hover:border-[#CBD5DC] hover:text-[#101828] transition-colors"
                >
                  Back to AIVO
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
