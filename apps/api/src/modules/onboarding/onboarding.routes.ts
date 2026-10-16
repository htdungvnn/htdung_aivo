/**
 * Onboarding Routes
 * Hono routes for onboarding API endpoints
 */
/// <reference path="../../../worker-configuration.d.ts" />
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getCookie } from "hono/cookie";
import { OnboardingService } from "./onboarding.service";
import { OnboardingError } from "./onboarding.errors";
import { saveStepRequestSchema, completeOnboardingRequestSchema } from "@aivo/contracts";
import type { OnboardingStep } from "@aivo/contracts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Bindings = any;

// Session configuration (must match auth.routes.ts)
const SESSION_COOKIE_NAME = "aivo_session";

// In-memory session store (shared with auth.routes.ts)
declare module "hono" {
  interface ContextVariableMap {
    session: {
      userId: string;
    } | null;
  }
}

const onboarding = new Hono<{ Bindings: Bindings }>();

// Auth middleware - get userId from session
onboarding.use("/*", async (c, next) => {
  const sessionId = getCookie(c, SESSION_COOKIE_NAME);
  
  if (!sessionId) {
    return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
  }
  
  // Import session store from auth module dynamically to avoid circular dependency
  const { sessionStore } = await import("../auth/auth.routes");
  const session = sessionStore.get(sessionId);
  
  if (!session || new Date() > session.expiresAt) {
    return c.json({ error: "Session expired", code: "SESSION_EXPIRED" }, 401);
  }
  
  c.set("session", session);
  await next();
});

// GET /v1/onboarding - Get current onboarding state
onboarding.get("/", async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
  }
  
  const userId = session.userId;
  const service = new OnboardingService();
  
  const profile = await service.getOrCreateOnboarding(userId);

  return c.json({
    status: profile.status,
    currentStep: profile.onboardingStep,
    revision: profile.revision,
    profile,
    optionsVersion: "2026-10-01",
  });
});

// PUT /v1/onboarding/steps/:step - Save one step
onboarding.put(
  "/steps/:step",
  zValidator("json", saveStepRequestSchema),
  async (c) => {
    const session = c.get("session");
    if (!session) {
      return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
    }
    
    const userId = session.userId;
    const step = c.req.param("step") as OnboardingStep;
    const { expectedRevision, data } = await c.req.valid("json");

    try {
      const service = new OnboardingService();
      const result = await service.saveStep(userId, step, data, expectedRevision);

      return c.json({
        revision: result.profile.revision,
        currentStep: result.profile.onboardingStep,
        savedAt: result.profile.updatedAt,
      });
    } catch (error) {
      if (error instanceof OnboardingError) {
        return c.json({ error: error.message, code: error.code }, error.status as 400 | 401 | 404 | 409 | 500);
      }
      throw error;
    }
  }
);

// POST /v1/onboarding/complete - Complete onboarding
onboarding.post(
  "/complete",
  zValidator("json", completeOnboardingRequestSchema),
  async (c) => {
    const session = c.get("session");
    if (!session) {
      return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
    }
    
    const userId = session.userId;
    const { expectedRevision } = await c.req.valid("json");

    try {
      const service = new OnboardingService();
      const result = await service.complete(userId, expectedRevision);

      return c.json({
        status: result.profile.status,
        next: result.next,
        generation: {
          status: "queued",
          jobId: crypto.randomUUID(),
        },
      });
    } catch (error) {
      if (error instanceof OnboardingError) {
        return c.json({ error: error.message, code: error.code }, error.status as 400 | 401 | 404 | 409 | 500);
      }
      throw error;
    }
  }
);

export { onboarding as onboardingRoutes };
