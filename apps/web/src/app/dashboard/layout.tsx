"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFDFB]">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-[#087A55] mx-auto mb-4"
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
          <p className="text-[#667085]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FCFDFB]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5EAE7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
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

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[#667085] hover:text-[#101828] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/workouts"
                className="text-sm font-medium text-[#667085] hover:text-[#101828] transition-colors"
              >
                Workouts
              </Link>
              <Link
                href="/dashboard/nutrition"
                className="text-sm font-medium text-[#667085] hover:text-[#101828] transition-colors"
              >
                Nutrition
              </Link>
              <Link
                href="/dashboard/progress"
                className="text-sm font-medium text-[#667085] hover:text-[#101828] transition-colors"
              >
                Progress
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 hover:bg-[#F9FAFB] rounded-lg px-2 py-1.5 transition-colors"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || "User"}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#EAF7F0] flex items-center justify-center">
                    <span className="text-sm font-medium text-[#087A55]">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-[#101828]">
                    {user.name || user.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-[#667085]">{user.email}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
