"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth";

interface FitnessProfile {
  id: string;
  status: string;
  primaryGoal: string | null;
  ageRange: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  unitSystem: string;
  activityLevel: string | null;
  experienceLevel: string | null;
  workoutLocations: string[];
  equipmentIds: string[];
  workoutDaysPerWeek: number | null;
  preferredSessionMinutes: number | null;
  dietPreferenceIds: string[];
  revision: number;
}

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
}

function ProfileSection({ title, children, onEdit }: ProfileSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5EAE7] overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#E5EAE7]">
        <h3 className="font-semibold text-[#101828]">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-[#087A55] hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

const GOAL_LABELS: Record<string, string> = {
  lose_fat: "Lose Fat",
  build_muscle: "Build Muscle",
  maintain: "Maintain Fitness",
  improve_fitness: "Improve Fitness",
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Sedentary",
  light: "Lightly Active",
  moderate: "Moderately Active",
  very_active: "Very Active",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/v1/profile`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json() as { profile: FitnessProfile };
        setProfile(data.profile);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-[#087A55] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#101828]">Profile</h1>
        <p className="text-[#667085]">Manage your account and fitness preferences</p>
      </div>

      {error && (
        <div className="p-4 bg-[#FEF3F2] text-[#B42318] rounded-xl">{error}</div>
      )}

      {/* Account Section */}
      <ProfileSection title="Account">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#087A55] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <p className="font-medium text-[#101828]">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-[#087A55]/10 text-[#087A55] text-xs rounded-full">
              {profile?.status === "completed" ? "Setup Complete" : "Setup Required"}
            </span>
          </div>
        </div>
      </ProfileSection>

      {/* Fitness Goal */}
      <ProfileSection
        title="Fitness Goal"
        onEdit={() => setEditingSection("goal")}
      >
        <p className="text-lg text-[#101828]">
          {profile?.primaryGoal
            ? GOAL_LABELS[profile.primaryGoal] || profile.primaryGoal
            : "Not set"}
        </p>
      </ProfileSection>

      {/* Measurements */}
      <ProfileSection
        title="Measurements"
        onEdit={() => setEditingSection("measurements")}
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-[#667085]">Age Range</p>
            <p className="font-medium text-[#101828]">{profile?.ageRange || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-[#667085]">Height</p>
            <p className="font-medium text-[#101828]">
              {profile?.heightCm ? `${Math.round(profile.heightCm)} cm` : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#667085]">Weight</p>
            <p className="font-medium text-[#101828]">
              {profile?.currentWeightKg ? `${Math.round(profile.currentWeightKg)} kg` : "-"}
            </p>
          </div>
        </div>
      </ProfileSection>

      {/* Activity Level */}
      <ProfileSection
        title="Activity & Experience"
        onEdit={() => setEditingSection("activity")}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[#667085]">Activity Level</p>
            <p className="font-medium text-[#101828]">
              {profile?.activityLevel
                ? ACTIVITY_LABELS[profile.activityLevel] || profile.activityLevel
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#667085]">Experience</p>
            <p className="font-medium text-[#101828]">
              {profile?.experienceLevel
                ? EXPERIENCE_LABELS[profile.experienceLevel] || profile.experienceLevel
                : "-"}
            </p>
          </div>
        </div>
      </ProfileSection>

      {/* Equipment */}
      <ProfileSection
        title="Equipment & Location"
        onEdit={() => setEditingSection("equipment")}
      >
        <div className="space-y-2">
          <div>
            <p className="text-sm text-[#667085]">Locations</p>
            <p className="font-medium text-[#101828]">
              {profile?.workoutLocations?.length
                ? profile.workoutLocations.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(", ")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#667085]">Equipment</p>
            <p className="font-medium text-[#101828]">
              {profile?.equipmentIds?.length
                ? profile.equipmentIds.join(", ")
                : "-"}
            </p>
          </div>
        </div>
      </ProfileSection>

      {/* Schedule */}
      <ProfileSection
        title="Schedule"
        onEdit={() => setEditingSection("schedule")}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[#667085]">Days per Week</p>
            <p className="font-medium text-[#101828]">
              {profile?.workoutDaysPerWeek ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#667085]">Session Length</p>
            <p className="font-medium text-[#101828]">
              {profile?.preferredSessionMinutes ? `${profile.preferredSessionMinutes} min` : "-"}
            </p>
          </div>
        </div>
      </ProfileSection>

      {/* Nutrition */}
      <ProfileSection
        title="Nutrition Preferences"
        onEdit={() => setEditingSection("nutrition")}
      >
        <p className="font-medium text-[#101828]">
          {profile?.dietPreferenceIds?.length
            ? profile.dietPreferenceIds.map(d => d.replace(/_/g, " ")).map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")
            : "No preference"}
        </p>
      </ProfileSection>

      {/* Sign Out */}
      <div className="bg-white rounded-xl border border-[#FEF3F2] p-6">
        <h3 className="font-semibold text-[#101828] mb-2">Sign Out</h3>
        <p className="text-sm text-[#667085] mb-4">
          Sign out of your AIVO account on this device.
        </p>
        <button
          onClick={logout}
          className="px-6 py-2.5 bg-[#FEF3F2] text-[#B42318] font-medium rounded-xl hover:bg-[#FEE4E2] transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
