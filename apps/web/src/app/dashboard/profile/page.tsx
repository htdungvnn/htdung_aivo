"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const handleSave = () => {
    // TODO: Implement API call to update profile
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#101828]">Profile</h1>
        <p className="text-[#667085]">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E5EAE7] overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#087A55] to-[#066847] px-6 py-8">
          <div className="flex items-center gap-5">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || "User"}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user?.name || "User"}
              </h2>
              <p className="text-white/80">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                {user?.onboardingStatus === "completed" ? "Active" : "Setup Required"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#E5EAE7] rounded-xl focus:border-[#087A55] focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            ) : (
              <p className="px-4 py-3 bg-[#F9FAFB] rounded-xl text-[#101828]">
                {user?.name || "Not set"}
              </p>
            )}
          </div>

          {/* Email Field (read-only) */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              Email Address
            </label>
            <p className="px-4 py-3 bg-[#F9FAFB] rounded-xl text-[#101828]">
              {user?.email || "Not available"}
            </p>
            <p className="mt-1 text-xs text-[#667085]">
              Email cannot be changed
            </p>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              Account Type
            </label>
            <p className="px-4 py-3 bg-[#F9FAFB] rounded-xl text-[#101828]">
              Free Account
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#E5EAE7]">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-[#087A55] text-white font-medium rounded-xl hover:bg-[#066847] transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || "");
                  }}
                  className="px-6 py-2.5 text-[#667085] font-medium rounded-xl hover:bg-[#F9FAFB] transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-[#087A55] text-white font-medium rounded-xl hover:bg-[#066847] transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-[#FEF3F2] overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#101828] mb-2">
            Sign Out
          </h3>
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
    </div>
  );
}
