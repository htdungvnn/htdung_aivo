/**
 * Email Service - Cloudflare Email implementation
 * Uses Cloudflare Email Service Workers binding for sending emails
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface Env {
  CF_EMAIL: {
    send: (message: EmailMessage) => Promise<{ success: boolean }>;
  };
}

/**
 * Send email using Cloudflare Email Service binding
 */
async function sendViaCloudflare(options: SendEmailOptions, env: Env): Promise<EmailResult> {
  const fromEmail = process.env.EMAIL_FROM || "AIVO <noreply@aivo.website>";

  if (!env.CF_EMAIL) {
    console.error("[Email] CF_EMAIL binding is not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const message = new EmailMessage(
      fromEmail,
      options.to,
      options.text || options.html
    );

    // Set HTML content via headers
    message.headers.set("Content-Type", "text/html; charset=utf-8");
    message.headers.set("Subject", options.subject);

    const result = await env.CF_EMAIL.send({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (!result.success) {
      return { success: false, error: "Failed to send email" };
    }

    return { success: true };
  } catch (error) {
    console.error("[Email] Cloudflare email error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Fallback class for EmailMessage when not in Workers runtime
class EmailMessage {
  from: string;
  to: string;
  raw: string;
  headers: Map<string, string>;

  constructor(from: string, to: string, body: string) {
    this.from = from;
    this.to = to;
    this.raw = body;
    this.headers = new Map();
  }
}

/**
 * Send email - main entry point
 */
export async function sendEmail(options: SendEmailOptions, env?: Env): Promise<EmailResult> {
  // Use Cloudflare Email Service (primary)
  if (env?.CF_EMAIL) {
    return sendViaCloudflare(options, env);
  }

  // Development fallback: log to console
  console.log(`[DEV] Email would be sent to ${options.to}`);
  console.log(`[DEV] Subject: ${options.subject}`);
  console.log(`[DEV] Body: ${options.text || options.html.substring(0, 100)}...`);

  return { success: true };
}

/**
 * Generate OTP email HTML template
 */
export function generateOtpEmailHtml(otp: string, email: string): string {
  const maskedEmail = maskEmail(email);
  const expiryMinutes = 5;
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 40px 40px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-right: 12px;">
                    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="14" stroke="#087A55" stroke-width="2.5"/>
                      <path d="M10 16L14 20L22 12" stroke="#087A55" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </td>
                  <td style="font-size: 24px; font-weight: 700; color: #101828;">AIVO</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px;">
              <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #101828; text-align: center;">
                Your Verification Code
              </h1>
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #667085; text-align: center;">
                Enter this code to verify your email address:
              </p>
            </td>
          </tr>

          <!-- OTP Code Box -->
          <tr>
            <td align="center" style="padding: 0 40px 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #EAF7F0 0%, #FCFDFB 100%); border: 2px solid #087A55; border-radius: 12px; padding: 20px 40px;">
                <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #087A55; font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;">
                  ${otp}
                </span>
              </div>
            </td>
          </tr>

          <!-- Expiry Notice -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #667085; text-align: center;">
                This code expires in <strong>${expiryMinutes} minutes</strong> for your security.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #E5EAE7; margin: 0 0 32px;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #98A2B3; text-align: center;">
                If you didn't request this code, you can safely ignore this email. Your account security is protected.
              </p>
              <p style="margin: 16px 0 0; font-size: 12px; color: #98A2B3; text-align: center;">
                &copy; ${currentYear} AIVO. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Mask email for display (e.g., "us***@example.com")
 */
function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart.slice(0, 2)}***@${domain}`;
}

/**
 * Send OTP email
 */
export async function sendOtpEmail(
  to: string,
  otp: string,
  env?: Env
): Promise<EmailResult> {
  const result = await sendEmail({
    to,
    subject: "Your AIVO verification code",
    html: generateOtpEmailHtml(otp, to),
    text: `Your AIVO verification code is: ${otp}. This code expires in 5 minutes. If you didn't request this code, please ignore this email.`,
  }, env);

  // In development, also log to console
  if (process.env.NODE_ENV === "development") {
    console.log(`[DEV] OTP for ${to}: ${otp}`);
  }

  return result;
}
