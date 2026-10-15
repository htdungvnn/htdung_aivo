"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-[#101828] mb-2">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
        </h1>
        <p className="text-[#667085]">
          Ready to crush your fitness goals today?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Workouts This Week"
          value="0"
          subtitle="Keep it up!"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          }
        />
        <StatCard
          title="Streak"
          value="0 days"
          subtitle="Start your streak!"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          }
        />
        <StatCard
          title="Calories Burned"
          value="0"
          subtitle="This week"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <StatCard
          title="Active Minutes"
          value="0"
          subtitle="This week"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Onboarding Banner (if not completed) */}
      {user?.onboardingStatus !== "completed" && (
        <div className="bg-gradient-to-r from-[#087A55] to-[#066847] rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Complete Your Profile</h2>
              <p className="text-white/80">
                Set up your fitness goals to get personalized workout and nutrition plans.
              </p>
            </div>
            <Link
              href="/dashboard/onboarding"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#087A55] font-medium rounded-xl hover:bg-white/90 transition-colors"
            >
              Get Started
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="Start Workout"
          description="Begin a new workout session"
          href="/dashboard/workouts/start"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <QuickActionCard
          title="Log Meal"
          description="Track your nutrition intake"
          href="/dashboard/nutrition/log"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        />
        <QuickActionCard
          title="View Progress"
          description="Check your fitness journey"
          href="/dashboard/progress"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-2xl border border-[#E5EAE7] p-6">
        <h2 className="text-lg font-semibold text-[#101828] mb-4">Recent Activity</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EAF7F0] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#087A55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-[#667085] mb-2">No recent activity</p>
          <p className="text-sm text-[#667085]/70">
            Start a workout or log a meal to see your activity here.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5EAE7] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#087A55]">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-[#101828]">{value}</p>
      <p className="text-sm font-medium text-[#101828]">{title}</p>
      <p className="text-xs text-[#667085]">{subtitle}</p>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl border border-[#E5EAE7] p-5 hover:border-[#087A55] hover:shadow-lg transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#087A55] mb-4 group-hover:bg-[#087A55] group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-[#101828] mb-1">{title}</h3>
      <p className="text-sm text-[#667085]">{description}</p>
    </Link>
  );
}
