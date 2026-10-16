/**
 * Profile Routes
 * Hono routes for profile API endpoints
 */
/// <reference path="../../../worker-configuration.d.ts" />
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getCookie } from "hono/cookie";
import { z } from "zod";
import { profileService, type ProfileSection } from "./profile.service";
import { ProfileError } from "./profile.errors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Bindings = any;

const profile = new Hono<{ Bindings: Bindings }>();

// Session configuration (must match auth.routes.ts)
const SESSION_COOKIE_NAME = "aivo_session";

// Auth middleware
profile.use("/*", async (c, next) => {
  const sessionId = getCookie(c, SESSION_COOKIE_NAME);
  
  if (!sessionId) {
    return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
  }
  
  const { sessionStore } = await import("../auth/auth.routes");
  const session = sessionStore.get(sessionId);
  
  if (!session || new Date() > session.expiresAt) {
    return c.json({ error: "Session expired", code: "SESSION_EXPIRED" }, 401);
  }
  
  c.set("session", session);
  await next();
});

// GET /v1/profile - Get user profile
profile.get("/", async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
  }
  
  const userId = session.userId;
  
  try {
    const userProfile = await profileService.getProfile(userId);
    return c.json({ profile: userProfile });
  } catch (error) {
    if (error instanceof ProfileError) {
      return c.json({ error: error.message, code: error.code }, error.status as 400 | 401 | 404 | 409 | 500);
    }
    throw error;
  }
});

// PATCH /v1/profile/:section - Update a profile section
profile.patch(
  "/:section",
  zValidator("json", z.object({
    expectedRevision: z.number().int().min(0),
    data: z.record(z.unknown()),
  })),
  async (c) => {
    const session = c.get("session");
    if (!session) {
      return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
    }
    
    const userId = session.userId;
    const section = c.req.param("section") as ProfileSection;
    const { expectedRevision, data } = await c.req.valid("json");

    try {
      const result = await profileService.updateSection(userId, section, data, expectedRevision);
      return c.json({
        profile: result.profile,
        impact: result.impact,
      });
    } catch (error) {
      if (error instanceof ProfileError) {
        return c.json({ error: error.message, code: error.code }, error.status as 400 | 401 | 404 | 409 | 500);
      }
      throw error;
    }
  }
);

// GET /v1/profile/options - Get selectable options
profile.get("/options", async (c) => {
  const options = profileService.getOptions();
  return c.json({
    ...options,
    optionsVersion: "2026-10-01",
  });
});

// POST /v1/profile/change-impact - Preview impact of changes
profile.post(
  "/change-impact",
  zValidator("json", z.object({
    section: z.string(),
    data: z.record(z.unknown()),
  })),
  async (c) => {
    const session = c.get("session");
    if (!session) {
      return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
    }
    
    const userId = session.userId;
    const { section, data } = await c.req.valid("json");

    try {
      const impact = await profileService.previewImpact(userId, section as ProfileSection, data);
      return c.json({ impact });
    } catch (error) {
      if (error instanceof ProfileError) {
        return c.json({ error: error.message, code: error.code }, error.status as 400 | 401 | 404 | 409 | 500);
      }
      throw error;
    }
  }
);

export { profile as profileRoutes };
