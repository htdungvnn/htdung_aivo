/// <reference path="../worker-configuration.d.ts" />
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";

import { authRoutes } from "./modules/auth/auth.routes";
import { AuthError } from "./modules/auth/auth.errors";
import type { AuthContext } from "./modules/auth/auth.types";

// Type used by Hono - CloudflareBindings comes from worker-configuration.d.ts
const app = new Hono<{ Bindings: CloudflareBindings; Variables: AuthContext }>();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://10.97.54.86:3000",
      "http://10.97.54.86:19000",
      "exp://10.97.54.86:19000",
    ],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Mount auth routes
app.route("/v1/auth", authRoutes);

// Swagger UI
app.get("/docs", swaggerUI({ url: "/openapi" }));

// OpenAPI JSON endpoint
app.get("/openapi", (c) => {
  return c.json({
    openapi: "3.1.0",
    info: {
      title: "AIVO API",
      version: "1.0.0",
      description: "Authentication API for AIVO fitness application",
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:8787",
        description: "Development server",
      },
    ],
    paths: {
      "/health": {
        get: {
          summary: "Health check",
          responses: {
            "200": {
              description: "Service is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/auth/email/request-otp": {
        post: {
          summary: "Request OTP code",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      description: "Email address to send OTP to",
                      example: "user@example.com",
                    },
                    purpose: {
                      type: "string",
                      enum: ["sign_in"],
                      default: "sign_in",
                      description: "Purpose of the OTP",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "OTP sent successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      challengeId: { type: "string", description: "Opaque challenge ID for verification" },
                      resendAvailableAt: { type: "string", format: "date-time" },
                      expiresAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid email or validation error",
            },
            "429": {
              description: "Rate limited - too many requests",
            },
          },
        },
      },
      "/v1/auth/email/verify-otp": {
        post: {
          summary: "Verify OTP code",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["challengeId", "code"],
                  properties: {
                    challengeId: {
                      type: "string",
                      description: "Challenge ID from request-otp response",
                    },
                    code: {
                      type: "string",
                      pattern: "^\\d{6}$",
                      description: "6-digit OTP code",
                      example: "123456",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "OTP verified successfully, session created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          onboardingStatus: {
                            type: "string",
                            enum: ["not_started", "in_progress", "completed"],
                          },
                        },
                      },
                      next: { type: "string", description: "Redirect URL after login" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid or expired OTP",
            },
            "429": {
              description: "Too many attempts - blocked",
            },
          },
        },
      },
      "/v1/auth/oauth/google/start": {
        get: {
          summary: "Start Google OAuth flow",
          tags: ["OAuth"],
          parameters: [
            {
              name: "returnTo",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "URL to redirect to after successful OAuth",
            },
          ],
          responses: {
            "200": {
              description: "OAuth authorization URL",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      authUrl: { type: "string", format: "uri" },
                      state: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/auth/oauth/facebook/start": {
        get: {
          summary: "Start Facebook OAuth flow",
          tags: ["OAuth"],
          parameters: [
            {
              name: "returnTo",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "URL to redirect to after successful OAuth",
            },
          ],
          responses: {
            "200": {
              description: "OAuth authorization URL",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      authUrl: { type: "string", format: "uri" },
                      state: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/auth/me": {
        get: {
          summary: "Get current authenticated user",
          tags: ["Session"],
          security: [{ CookieAuth: [] }],
          responses: {
            "200": {
              description: "Current user data",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: {
                        type: "object",
                        nullable: true,
                        properties: {
                          id: { type: "string" },
                          email: { type: "string" },
                          onboardingStatus: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Not authenticated",
            },
          },
        },
      },
      "/v1/auth/logout": {
        post: {
          summary: "Log out current session",
          tags: ["Session"],
          security: [{ CookieAuth: [] }],
          responses: {
            "200": {
              description: "Successfully logged out",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/auth/session/refresh": {
        post: {
          summary: "Refresh session (rotate tokens)",
          tags: ["Session"],
          security: [{ CookieAuth: [] }],
          responses: {
            "200": {
              description: "Session refreshed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Session expired or invalid",
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        CookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "aivo_session",
          description: "Session cookie set after successful authentication",
        },
      },
    },
  });
});

// Error handling
app.onError((err, c) => {
  if (err instanceof AuthError) {
    return c.json(
      {
        error: err.message,
        code: err.code,
      },
      err.status as 400 | 401 | 403 | 404 | 429 | 500
    );
  }

  // Log unexpected errors
  console.error("Unhandled error:", err);

  return c.json(
    {
      error: "An unexpected error occurred",
      code: "INTERNAL_ERROR",
    },
    500
  );
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: "Not found",
      code: "NOT_FOUND",
    },
    404
  );
});

export default app;
