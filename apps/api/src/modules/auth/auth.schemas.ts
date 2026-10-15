import { z } from "zod";

/**
 * Email validation schema
 * Allows common email formats but rejects obviously invalid ones
 */
export const emailSchema = z
  .string({
    required_error: "Enter a valid email address.",
    invalid_type_error: "Enter a valid email address.",
  })
  .min(1, "Enter a valid email address.")
  .email("Enter a valid email address.")
  .max(254, "Email address is too long.")
  .transform((email) => email.toLowerCase().trim());

/**
 * OTP code schema - 6 digits
 */
export const otpCodeSchema = z
  .string()
  .transform((code) => code.replace(/\s/g, ""))
  .pipe(
    z
      .string()
      .length(6, "Enter the 6-digit code.")
      .regex(/^\d{6}$/, "Enter the 6-digit code.")
  );

/**
 * Request OTP body schema
 */
export const requestOtpBodySchema = z.object({
  email: emailSchema,
  purpose: z.enum(["sign_in"]).optional().default("sign_in"),
});

/**
 * Verify OTP body schema
 */
export const verifyOtpBodySchema = z.object({
  challengeId: z.string().min(1),
  code: otpCodeSchema,
});

/**
 * OAuth state schema
 */
export const oauthStateSchema = z.object({
  returnTo: z.string().optional(),
  provider: z.enum(["google", "facebook"]),
  createdAt: z.number(),
});

/**
 * Safe return URL validation
 */
export const safeReturnUrlSchema = z
  .string()
  .optional()
  .transform((url) => {
    if (!url) return null;

    // Only allow relative URLs
    if (url.startsWith("/") && !url.startsWith("//")) {
      // Validate it's not attempting to escape to external domain
      try {
        const urlObj = new URL(url, "http://localhost");
        if (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1") {
          return url;
        }
      } catch {
        // Invalid URL, return null
      }
    }
    return null;
  });

/**
 * OAuth start query schema
 */
export const oauthStartQuerySchema = z.object({
  returnTo: safeReturnUrlSchema.optional(),
});
