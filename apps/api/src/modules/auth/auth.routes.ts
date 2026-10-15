/**
 * Auth routes - API endpoints for authentication
 */
/// <reference path="../../../worker-configuration.d.ts" />
import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { html } from "hono/html";
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

// User type alias
type AuthUser = {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  onboardingStatus: "not_started" | "in_progress" | "completed";
  createdAt: Date;
};

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
    name?: string;
    picture?: string;
    onboardingStatus: "not_started" | "in_progress" | "completed";
    createdAt: Date;
  }
>();

export const authRoutes = new Hono<{ Bindings: CloudflareBindings }>();

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

    // Get env for Cloudflare Email binding
    const env = c.env as CloudflareBindings;
    const result = await createOtpChallenge(email, metadata, env);

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
    let existingUser = findUserByEmail(challenge.email);
    let isNewUser = false;

    if (!existingUser) {
      const newUser: AuthUser = {
        id: generateSecureId(),
        email: challenge.email,
        onboardingStatus: "not_started",
        createdAt: new Date(),
      };
      userStore.set(newUser.id, newUser);
      existingUser = newUser;
      isNewUser = true;
    }

    const user = existingUser;

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
  const platform = c.req.query("platform");
  const callbackUrl = c.req.query("callbackUrl");

  // Generate OAuth state
  const state = await generateSecureId();
  const stateData = {
    returnTo: returnTo || null,
    provider,
    platform,
    callbackUrl: callbackUrl || null,
    createdAt: Date.now(),
  };

  // Store state in KV (persists across Workers instances)
  await c.env.OAUTH_STATE.put(state, JSON.stringify(stateData), { expirationTtl: 600 });

  // Server callback URL (used for ALL OAuth flows - Google/Facebook require HTTP redirect)
  const apiUrl = process.env.API_BASE_URL || "http://10.97.54.86:3001";
  const serverCallbackUri = `${apiUrl}/v1/auth/oauth/${provider}/callback`;

  // Build authorization URL based on provider
  let authUrl: string;

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const scope = encodeURIComponent("openid email profile");
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(serverCallbackUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;
  } else {
    const clientId = process.env.FACEBOOK_APP_ID;
    // Note: email scope requires App Review. For dev, use public_profile only.
    const scope = encodeURIComponent("public_profile");
    authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(serverCallbackUri)}&state=${state}&scope=${scope}`;
  }

  return c.json({ authUrl, state });
});

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

  // Get state from KV
  const stateJson = await c.env.OAUTH_STATE.get(state);
  if (!stateJson) {
    throw createAuthError.invalidState();
  }
  
  const stateData = JSON.parse(stateJson);
  
  // Check if state is expired (older than 10 minutes)
  if (Date.now() - stateData.createdAt > 10 * 60 * 1000) {
    await c.env.OAUTH_STATE.delete(state);
    throw createAuthError.invalidState();
  }

  const isMobile = stateData.platform === "mobile";
  
  // Delete state after use (one-time use)
  await c.env.OAUTH_STATE.delete(state);

  // In production, exchange code for tokens and get user profile
  // For MVP, simulate successful OAuth
  // TODO: Implement actual OAuth token exchange

  // Simulate OAuth user data (would come from OAuth provider)
  const oauthUserData = {
    email: `oauth_${provider}_user@example.com`,
    name: provider === "google" ? "Google User" : "Facebook User",
    picture: null, // Would come from OAuth provider
  };

  // Create or find user
  let existingUser = findUserByEmail(oauthUserData.email);
  let isNewUser = false;

  if (!existingUser) {
    const newUser: AuthUser = {
      id: generateSecureId(),
      email: oauthUserData.email,
      name: oauthUserData.name ?? undefined,
      picture: oauthUserData.picture ?? undefined,
      onboardingStatus: "not_started",
      createdAt: new Date(),
    };
    userStore.set(newUser.id, newUser);
    existingUser = newUser;
    isNewUser = true;
  } else {
    // Update user info from OAuth provider
    existingUser.name = oauthUserData.name ?? undefined;
    existingUser.picture = oauthUserData.picture ?? undefined;
    userStore.set(existingUser.id, existingUser);
  }

  const user = existingUser;

  // Create session
  const sessionId = generateSecureId();
  const sessionExpiry = new Date(
    Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  sessionStore.set(sessionId, {
    userId: user.id,
    expiresAt: sessionExpiry,
    platform: isMobile ? "mobile" : "web",
    createdAt: new Date(),
  });

  // Set session cookie (for web)
  setCookie(c, SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });

  // Determine redirect URL
  const returnTo = stateData.returnTo || (user.onboardingStatus === "completed" ? "/dashboard" : "/onboarding");

  // For mobile, return HTML success page
  if (isMobile) {
    return c.html(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Successful - AIVO</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 24px;
      padding: 48px 40px;
      text-align: center;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    .icon svg {
      width: 40px;
      height: 40px;
      fill: white;
    }
    h1 {
      color: #1a1a2e;
      font-size: 28px;
      margin-bottom: 12px;
      font-weight: 700;
    }
    p {
      color: #6b7280;
      font-size: 16px;
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .email {
      background: #f3f4f6;
      padding: 12px 20px;
      border-radius: 12px;
      font-family: monospace;
      font-size: 14px;
      color: #374151;
      margin-bottom: 32px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 14px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(102, 126, 234, 0.5);
    }
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #e5e7eb;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .redirecting {
      margin-top: 24px;
      font-size: 14px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    </div>
    <h1>Welcome to AIVO!</h1>
    <p>You have successfully signed in with Google</p>
    <div class="email">${user.email}</div>
    <a href="${stateData.callbackUrl || 'aivo://auth/callback'}?token=${sessionId}&userId=${user.id}" class="btn">
      Continue to App
    </a>
    <div class="redirecting">
      <div class="spinner"></div>
      <p>Opening AIVO app...</p>
    </div>
  </div>
  <script>
    // Auto-redirect to app immediately
    setTimeout(() => {
      window.location.href = "${stateData.callbackUrl || 'aivo://auth/callback'}?token=${sessionId}&userId=${user.id}";
    }, 100);
  </script>
</body>
</html>
    `);
  }

  // Web: redirect to frontend with auth success
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  return c.redirect(`${frontendUrl}/?auth=success`);
});

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
      name: user.name,
      picture: user.picture,
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

/**
 * GET /v1/auth/oauth/callback-page
 * Mobile OAuth callback page
 */
authRoutes.get("/oauth/callback-page", async (c) => {
  const success = c.req.query("success");
  const token = c.req.query("token");
  const error = c.req.query("error");
  const userId = c.req.query("userId");
  const next = c.req.query("next");
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>AIVO - Sign In</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #FCFDFB;
    }
    .container { text-align: center; padding: 40px; }
    .logo {
      width: 64px; height: 64px; border-radius: 50%;
      border: 3px solid #087A55;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px; font-size: 20px; font-weight: bold; color: #087A55;
    }
    h1 { color: #101828; margin-bottom: 8px; font-size: 24px; }
    p { color: #667085; margin-bottom: 24px; }
    .success { color: #087A55; }
    .error { color: #B42318; }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid #E5EAE7;
      border-top-color: #087A55;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container" id="content">
    <div class="logo">AIVO</div>
    <div class="spinner"></div>
    <h1>Processing...</h1>
    <p>Please wait while we complete your sign in.</p>
  </div>
  <script>
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const token = params.get('token');
    const error = params.get('error');
    const userId = params.get('userId');
    const next = params.get('next');
    
    const content = document.getElementById('content');
    
    if (success === 'true' && token) {
      // Store token for app to retrieve
      localStorage.setItem('aivo_auth_token', token || '');
      localStorage.setItem('aivo_user_id', userId || '');
      
      content.innerHTML = \`
        <div class="logo">AIVO</div>
        <h1 class="success">Success!</h1>
        <p>You have been signed in to AIVO.</p>
        <p>You can now return to the app.</p>
      \`;
      
      // Notify mobile app via custom scheme
      setTimeout(() => {
        window.location.href = 'aivo://auth/callback?success=true&token=' + (token || '') + '&userId=' + (userId || '') + '&next=' + encodeURIComponent(next || '/');
      }, 1500);
    } else if (error) {
      content.innerHTML = \`
        <div class="logo">AIVO</div>
        <h1 class="error">Sign In Failed</h1>
        <p>\${decodeURIComponent(error)}</p>
        <p>Please try again in the app.</p>
      \`;
      setTimeout(() => {
        window.location.href = 'aivo://auth/callback?error=' + encodeURIComponent(error);
      }, 2000);
    } else {
      content.innerHTML = \`
        <div class="logo">AIVO</div>
        <h1>Invalid Request</h1>
        <p>This page should be accessed from the AIVO app.</p>
      \`;
    }
  </script>
</body>
</html>`;
  
  return c.html(html);
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
