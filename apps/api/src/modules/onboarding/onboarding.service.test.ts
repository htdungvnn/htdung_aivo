/**
 * Onboarding Service Tests
 */
import { describe, it, expect, beforeEach } from "vitest";
import { OnboardingService } from "./onboarding.service";
import { OnboardingRepository } from "./onboarding.repository";

// Create a fresh repository for each test
let repository: OnboardingRepository;
let service: OnboardingService;

beforeEach(() => {
  repository = new OnboardingRepository();
  service = new OnboardingService(repository);
});

describe("OnboardingService", () => {
  describe("getOrCreateOnboarding", () => {
    it("creates a new profile for new user", async () => {
      const profile = await service.getOrCreateOnboarding("user-123");
      
      expect(profile).toBeDefined();
      expect(profile.userId).toBe("user-123");
      expect(profile.status).toBe("not_started");
      expect(profile.onboardingStep).toBe("welcome");
      expect(profile.revision).toBe(0);
    });

    it("returns existing profile for known user", async () => {
      const first = await service.getOrCreateOnboarding("user-123");
      const second = await service.getOrCreateOnboarding("user-123");
      
      expect(first.id).toBe(second.id);
    });
  });

  describe("saveStep - goal", () => {
    it("saves the primary goal", async () => {
      await service.getOrCreateOnboarding("user-goal");
      
      const result = await service.saveStep("user-goal", "goal", { primaryGoal: "lose_fat" }, 0);
      
      expect(result.profile.primaryGoal).toBe("lose_fat");
      expect(result.profile.revision).toBe(1);
      expect(result.profile.status).toBe("in_progress");
    });

    it("rejects invalid goal values", async () => {
      await service.getOrCreateOnboarding("user-invalid-goal");
      
      await expect(
        service.saveStep("user-invalid-goal", "goal", { primaryGoal: "invalid" }, 0)
      ).rejects.toThrow();
    });

    it("throws on revision conflict", async () => {
      await service.getOrCreateOnboarding("user-conflict");
      
      // Save first with revision 0
      await service.saveStep("user-conflict", "goal", { primaryGoal: "lose_fat" }, 0);
      
      // Try to save again with old revision
      await expect(
        service.saveStep("user-conflict", "goal", { primaryGoal: "build_muscle" }, 0)
      ).rejects.toThrow();
    });
  });

  describe("saveStep - profile", () => {
    it("converts imperial to metric units", async () => {
      await service.getOrCreateOnboarding("user-profile");
      await service.saveStep("user-profile", "goal", { primaryGoal: "lose_fat" }, 0);
      
      const result = await service.saveStep(
        "user-profile",
        "profile",
        { ageRange: "26-35", heightCm: 70, currentWeightKg: 154, unitSystem: "imperial" },
        1
      );
      
      // 70 inches * 2.54 = 177.8 cm
      expect(result.profile.heightCm).toBeCloseTo(177.8);
      // 154 lbs * 0.453592 = 69.85 kg
      expect(result.profile.currentWeightKg).toBeCloseTo(69.85);
    });

    it("validates height range", async () => {
      await service.getOrCreateOnboarding("user-height");
      await service.saveStep("user-height", "goal", { primaryGoal: "lose_fat" }, 0);
      
      await expect(
        service.saveStep(
          "user-height",
          "profile",
          { ageRange: "26-35", heightCm: 50, currentWeightKg: 70, unitSystem: "metric" },
          1
        )
      ).rejects.toThrow();
    });
  });

  describe("saveStep - activity", () => {
    it("saves activity and experience levels", async () => {
      await service.getOrCreateOnboarding("user-activity");
      await service.saveStep("user-activity", "goal", { primaryGoal: "lose_fat" }, 0);
      await service.saveStep("user-activity", "profile", {
        ageRange: "26-35", heightCm: 175, currentWeightKg: 70, unitSystem: "metric"
      }, 1);
      
      const result = await service.saveStep(
        "user-activity",
        "activity",
        { activityLevel: "moderate", experienceLevel: "beginner" },
        2
      );
      
      expect(result.profile.activityLevel).toBe("moderate");
      expect(result.profile.experienceLevel).toBe("beginner");
    });
  });

  describe("complete", () => {
    it("marks onboarding as completed when all required fields are present", async () => {
      await service.getOrCreateOnboarding("user-complete");
      
      // Save all required steps
      await service.saveStep("user-complete", "goal", { primaryGoal: "lose_fat" }, 0);
      await service.saveStep("user-complete", "profile", {
        ageRange: "26-35", heightCm: 175, currentWeightKg: 70, unitSystem: "metric"
      }, 1);
      await service.saveStep("user-complete", "activity", {
        activityLevel: "moderate", experienceLevel: "beginner"
      }, 2);
      
      const result = await service.complete("user-complete", 3);
      
      expect(result.profile.status).toBe("completed");
      expect(result.profile.completedAt).toBeDefined();
      expect(result.next).toBe("/dashboard");
    });

    it("rejects completion with incomplete profile", async () => {
      await service.getOrCreateOnboarding("user-incomplete");
      await service.saveStep("user-incomplete", "goal", { primaryGoal: "lose_fat" }, 0);
      
      await expect(
        service.complete("user-incomplete", 1)
      ).rejects.toThrow();
    });

    it("throws on already completed", async () => {
      await service.getOrCreateOnboarding("user-already");
      await service.saveStep("user-already", "goal", { primaryGoal: "lose_fat" }, 0);
      await service.saveStep("user-already", "profile", {
        ageRange: "26-35", heightCm: 175, currentWeightKg: 70, unitSystem: "metric"
      }, 1);
      await service.saveStep("user-already", "activity", {
        activityLevel: "moderate", experienceLevel: "beginner"
      }, 2);
      
      await service.complete("user-already", 3);
      
      await expect(
        service.complete("user-already", 4)
      ).rejects.toThrow();
    });
  });

  describe("step transitions", () => {
    it("advances through steps sequentially", async () => {
      await service.getOrCreateOnboarding("user-steps");
      
      const goal = await service.saveStep("user-steps", "goal", { primaryGoal: "lose_fat" }, 0);
      expect(goal.profile.onboardingStep).toBe("goal");
      
      const profile = await service.saveStep("user-steps", "profile", {
        ageRange: "26-35", heightCm: 175, currentWeightKg: 70, unitSystem: "metric"
      }, 1);
      expect(profile.profile.onboardingStep).toBe("profile");
      
      const activity = await service.saveStep("user-steps", "activity", {
        activityLevel: "moderate", experienceLevel: "beginner"
      }, 2);
      expect(activity.profile.onboardingStep).toBe("activity");
    });

    it("returns correct next step", async () => {
      await service.getOrCreateOnboarding("user-next");
      
      const goal = await service.saveStep("user-next", "goal", { primaryGoal: "lose_fat" }, 0);
      expect(goal.nextStep).toBe("profile");
      
      const profile = await service.saveStep("user-next", "profile", {
        ageRange: "26-35", heightCm: 175, currentWeightKg: 70, unitSystem: "metric"
      }, 1);
      expect(profile.nextStep).toBe("activity");
    });
  });
});
