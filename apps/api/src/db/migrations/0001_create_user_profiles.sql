-- Migration: 0001_create_user_profiles
-- Description: Create user_profiles table for onboarding and fitness profile data
-- Created: 2026-10-15

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  -- Primary key and foreign key
  id TEXT PRIMARY KEY,                    -- UUID v4
  user_id TEXT NOT NULL,                  -- Auth provider user ID
  
  -- Onboarding state
  status TEXT NOT NULL DEFAULT 'in_progress',  -- 'in_progress' | 'completed'
  current_step TEXT NOT NULL DEFAULT 'welcome',  -- Current step in onboarding
  
  -- Step 2: Goal
  primary_goal TEXT,                      -- 'lose_fat' | 'build_muscle' | 'maintain' | 'improve_fitness'
  
  -- Step 3: Profile
  age_range TEXT,                         -- '18-29' | '30-39' | '40-49' | '50-59' | '60+'
  height_cm REAL,                         -- Canonical: always stored in cm
  current_weight_kg REAL,                -- Canonical: always stored in kg
  
  -- Step 4: Activity
  activity_level TEXT,                    -- 'sedentary' | 'light' | 'moderate' | 'very_active'
  experience_level TEXT,                  -- 'beginner' | 'intermediate' | 'advanced'
  
  -- Step 5: Equipment
  workout_locations TEXT,                  -- JSON array: ['gym', 'home', 'outdoor']
  equipment_ids TEXT,                     -- JSON array: equipment identifiers
  
  -- Step 6: Schedule
  workout_days_per_week INTEGER,          -- 1-7
  preferred_session_minutes INTEGER,      -- 15, 30, 45, 60, 90
  
  -- Step 7: Nutrition
  diet_preference_ids TEXT,               -- JSON array: diet preference identifiers
  
  -- Unit preferences
  unit_system TEXT NOT NULL DEFAULT 'metric',  -- 'metric' | 'imperial'
  
  -- Timestamps
  created_at INTEGER NOT NULL,            -- Unix timestamp (ms)
  updated_at INTEGER NOT NULL,            -- Unix timestamp (ms)
  
  -- Optimistic concurrency control
  revision INTEGER NOT NULL DEFAULT 1,
  
  -- Unique constraint on user_id
  CONSTRAINT unique_user UNIQUE (user_id)
);

-- Index for user lookups (primary query pattern)
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Index for status filtering (dashboard queries)
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

-- Index for filtering by primary goal
CREATE INDEX IF NOT EXISTS idx_user_profiles_goal ON user_profiles(primary_goal);

-- Index for filtering by activity level
CREATE INDEX IF NOT EXISTS idx_user_profiles_activity ON user_profiles(activity_level);

-- =====================================================
-- Migration 0002: Add profile summary views (optional)
-- =====================================================
-- Note: This would be a separate migration file in production
-- CREATE VIEW IF NOT EXISTS profile_summary AS
-- SELECT 
--   user_id,
--   status,
--   primary_goal,
--   unit_system,
--   CASE 
--     WHEN status = 'completed' THEN 'Active'
--     ELSE 'Setup Required'
--   END as account_status
-- FROM user_profiles;
