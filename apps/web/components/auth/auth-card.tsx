"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface AuthCardProps {
  children: ReactNode;
  showLogo?: boolean;
}

export function AuthCard({ children, showLogo = true }: AuthCardProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 lg:px-8">
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
        <div className="hidden sm:flex items-center gap-2 text-sm text-[#667085]">
          <span>New to AIVO?</span>
          <Link
            href="/"
            className="text-[#087A55] font-medium hover:text-[#066847] transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-[#087A55]/5 border border-[#E5EAE7] p-6 sm:p-8 lg:p-10">
            {children}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-[#667085]">
            By continuing, you agree to AIVO&apos;s{" "}
            <Link
              href="/terms"
              className="underline hover:text-[#101828] transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and acknowledge the{" "}
            <Link
              href="/privacy"
              className="underline hover:text-[#101828] transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

interface AuthHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}

export function AuthHeader({
  eyebrow,
  title,
  description,
  children,
}: AuthHeaderProps) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="text-sm font-medium text-[#667085] uppercase tracking-wider mb-2">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#101828] mb-3">
        {title}
      </h1>
      {description && (
        <p className="text-[#667085] leading-relaxed">{description}</p>
      )}
      {children}
    </div>
  );
}

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "or continue with email" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-[#E5EAE7]" />
      <span className="text-sm text-[#667085]">{text}</span>
      <div className="flex-1 h-px bg-[#E5EAE7]" />
    </div>
  );
}
