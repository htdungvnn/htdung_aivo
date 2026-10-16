"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ProviderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  onClick?: () => void;
  provider?: "google" | "facebook" | "email";
}

export function ProviderButton({
  children,
  loading = false,
  onClick,
  ...props
}: ProviderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-[#E5EAE7] rounded-xl bg-white hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-[#667085] border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
