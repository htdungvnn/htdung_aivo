/**
 * Auth routes - API endpoints for authentication
 */
import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createAuthError } from "./auth.errors";
import {
  createOtpChallenge,
  getChallengeMetadata,
  verifyOtpChallenge,
} from "./otp.service";
import {
  generateSecureId,
  determineNextDestination,
} from "./auth.service";
import {
  requestOtpBodySchema,
  verifyOtpBodySchema,
  safeReturnUrlSchema,
} from "./auth.schemas";
import type { Platform } from "./auth.types";

// Session configuration
const SESSION_COOKIE_NAME = "aivo_session";
const SESSION_EXPIRY_DAYS = 30;

// In-memory session store (replace with database in production)
const sessionStore = new Map<
  string,
  {
    userId: string;
    expiresAt: Date;
    platform: Platform;
    createdAt: Date;
  }
>();

// In-memory user store (replace with database in production)
const userStore = new Map<
  string,
  {
    id: string;
    email: string;
    onboardingStatus: "not_started" | "in_progress" | "completed";
    createdAt: Date;
  }
>();

export const authRoutes = new Hono();

// ============================================
// Email OTP Flow
// ============================================

/**
 * POST /v1/auth/email/request-otp
 * Request an OTP code to be sent to email
 */
authRoutes.post("/email/request-otp", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = requestOtpBodySchema.safeParse(body);

    if (!parsed.success) {
      throw createAuthError.invalidEmail();
    }

    const { email } = parsed.data;

    // Get request metadata
    const metadata = {
      ip: c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for"),
      userAgent: c.req.header("user-agent"),
    };

    const result = await createOtpChallenge(email, metadata);

    return c.json({
      challengeId: result.challengeId,
      resendAvailableAt: result.resendAvailableAt.toISOString(),
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof createAuthError.constructor) {
      throw error;
    }
    console.error("Request OTP error:", error);
    throw createAuthError.invalidRequest();
  }
});

/**
 * POST /v1/auth/email/verify-otp
 * Verify the OTP code
 */
authRoutes.post("/email/verify-otp", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = verifyOtpBodySchema.safeParse(body);

    if (!parsed.success) {
      throw createAuthError.invalidRequest("Invalid request body");
    }

    const { challengeId, code } = parsed.data;

    const result = await verifyOtpChallenge(challengeId, code);

    if (!result.valid) {
      return c.json(
        { error: result.error?.message, code: result.error?.code },
        (result.error?.status || 400) as 400 | 401 | 403 | 429 | 500
      );
    }

    // Get challenge metadata
    const challenge = getChallengeMetadata(challengeId as string);
    if (!challenge) {
      throw createAuthError.invalidOtp();
    }

    // Find or create user based on email
    let user = findUserByEmail(challenge.email);
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = {
        id: generateSecureId(),
        email: challenge.email,
        onboardingStatus: "not_started",
        createdAt: new Date(),
      };
      userStore.set(user.id, user);
      isNewUser = true;
    }

    // Create session
    const sessionId = generateSecureId();
    const sessionExpiry = new Date(
      Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    sessionStore.set(sessionId, {
      userId: user.id,
      expiresAt: sessionExpiry,
      platform: "web",
      createdAt: new Date(),
    });

    // Set session cookie
    setCookie(c, SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    });

    const next = isNewUser ? "/onboarding" : "/dashboard";

    return c.json({
      user: {
        id: user.id,
        onboardingStatus: user.onboardingStatus,
      },
      next,
    });
  } catch (error) {
    if (error instanceof createAuthError.constructor) {
      throw error;
    }
    console.error("Verify OTP error:", error);
    throw createAuthError.invalidRequest();
  }
});

// ============================================
// OAuth Flow
// ============================================

/**
 * GET /v1/auth/oauth/:provider/start
 * Start OAuth flow (Google, Facebook)
 */
authRoutes.get("/oauth/:provider/start", async (c) => {
  const provider = c.req.param("provider") as "google" | "facebook";

  if (!["google", "facebook"].includes(provider)) {
    throw createAuthError.invalidRequest("Invalid OAuth provider");
  }

  const returnTo = safeReturnUrlSchema.parse(
    c.req.query("returnTo")
  );

  // Generate OAuth state
  const state = await generateSecureId();
  const stateData = {
    returnTo: returnTo || null,
    provider,
    createdAt: Date.now(),
  };

  // In production, store state in database with expiry
  // For now, we'll use a simple approach
  oauthStateStore.set(state, stateData);

  // Build authorization URL based on provider
  let authUrl: string;

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.API_BASE_URL}/v1/auth/oauth/google/callback`;
    const scope = encodeURIComponent("openid email profile");
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;
  } else {
    const clientId = process.env.FACEBOOK_APP_ID;
    const redirectUri = `${process.env.API_BASE_URL}/v1/auth/oauth/facebook/callback`;
    const scope = encodeURIComponent("email,public_profile");
    authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;
  }

  return c.json({ authUrl, state });
});

// Simple in-memory state store (use Redis/database in production)
const oauthStateStore = new Map<
  string,
  { returnTo: string | null; provider: string; createdAt: number }
>();

/**
 * GET /v1/auth/oauth/:provider/callback
 * Handle OAuth callback
 */
authRoutes.get("/oauth/:provider/callback", async (c) => {
  const provider = c.req.param("provider") as "google" | "facebook";
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  if (error) {
    if (error === "access_denied") {
      throw createAuthError.oauthCancelled();
    }
    throw createAuthError.oauthFailed();
  }

  if (!code || !state) {
    throw createAuthError.invalidState();
  }

  // Validate state
  const stateData = oauthStateStore.get(state);
  if (!stateData || Date.now() - stateData.createdAt > 10 * 60 * 1000) {
    oauthStateStore.delete(state);
    throw createAuthError.invalidState();
  }

  oauthStateStore.delete(state);

  // In production, exchange code for tokens and get user profile
  // For MVP, simulate successful OAuth
  // TODO: Implement actual OAuth token exchange

  // Create or find user
  const email = `oauth_${provider}_user@example.com`; // Would come from OAuth provider
  let user = findUserByEmail(email);
  let isNewUser = false;

  if (!user) {
    user = {
      id: generateSecureId(),
      email,
      onboardingStatus: "not_started",
      createdAt: new Date(),
    };
    userStore.set(user.id, user);
    isNewUser = false; // OAuth users might have verified email already
  }

  // Create session
  const sessionId = generateSecureId();
  const sessionExpiry = new Date(
    Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  sessionStore.set(sessionId, {
    userId: user.id,
    expiresAt: sessionExpiry,
    platform: "web",
    createdAt: new Date(),
  });

  // Set session cookie
  setCookie(c, SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });

  // Determine redirect URL
  const returnTo = stateData.returnTo || (user.onboardingStatus === "completed" ? "/dashboard" : "/onboarding");

  // Redirect to the frontend with session token
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return c.redirect(`${frontendUrl}/auth/callback?token=${sessionId}&next=${encodeURIComponent(returnTo)}`);
});

// ============================================
// Session Management
// ============================================

/**
 * GET /v1/auth/me
 * Get current authenticated user
 */
authRoutes.get("/me", async (c) => {
  const sessionId = getCookie(c, SESSION_COOKIE_NAME);

  if (!sessionId) {
    return c.json({ user: null }, 401);
  }

  const session = sessionStore.get(sessionId);

  if (!session || new Date() > session.expiresAt) {
    deleteCookie(c, SESSION_COOKIE_NAME);
    return c.json({ user: null }, 401);
  }

  const user = userStore.get(session.userId);

  if (!user) {
    deleteCookie(c, SESSION_COOKIE_NAME);
    return c.json({ user: null }, 401);
  }

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      onboardingStatus: user.onboardingStatus,
    },
  });
});

/**
 * POST /v1/auth/logout
 * Log out current session
 */
authRoutes.post("/logout", async (c) => {
  const sessionId = getCookie(c, SESSION_COOKIE_NAME);

  if (sessionId) {
    sessionStore.delete(sessionId);
    deleteCookie(c, SESSION_COOKIE_NAME);
  }

  return c.json({ success: true });
});

/**
 * POST /v1/auth/session/refresh
 * Refresh session (rotate tokens)
 */
authRoutes.post("/session/refresh", async (c) => {
  const sessionId = getCookie(c, SESSION_COOKIE_NAME);

  if (!sessionId) {
    throw createAuthError.sessionExpired();
  }

  const session = sessionStore.get(sessionId);

  if (!session || new Date() > session.expiresAt) {
    deleteCookie(c, SESSION_COOKIE_NAME);
    throw createAuthError.sessionExpired();
  }

  // Rotate session
  sessionStore.delete(sessionId);
  const newSessionId = generateSecureId();
  const newExpiry = new Date(
    Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  sessionStore.set(newSessionId, {
    ...session,
    expiresAt: newExpiry,
    createdAt: new Date(),
  });

  setCookie(c, SESSION_COOKIE_NAME, newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });

  return c.json({ success: true });
});

// ============================================
// Helper Functions
// ============================================

function findUserByEmail(email: string) {
  for (const user of userStore.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

// Export stores for testing
export { userStore, sessionStore };
