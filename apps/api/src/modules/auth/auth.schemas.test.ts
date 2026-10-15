/**
 * Tests for auth schemas
 */
import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  otpCodeSchema,
  requestOtpBodySchema,
  verifyOtpBodySchema,
  safeReturnUrlSchema,
} from './auth.schemas';

describe('emailSchema', () => {
  it('should validate correct email', () => {
    const result = emailSchema.safeParse('user@example.com');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('user@example.com');
    }
  });

  it('should normalize email to lowercase', () => {
    const result = emailSchema.safeParse('User@EXAMPLE.COM');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('user@example.com');
    }
  });

  it('should trim whitespace', () => {
    const result = emailSchema.safeParse('  user@example.com  ');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('user@example.com');
    }
  });

  it('should reject invalid email', () => {
    const result = emailSchema.safeParse('notanemail');
    expect(result.success).toBe(false);
  });

  it('should reject empty email', () => {
    const result = emailSchema.safeParse('');
    expect(result.success).toBe(false);
  });
});

describe('otpCodeSchema', () => {
  it('should validate correct 6-digit code', () => {
    const result = otpCodeSchema.safeParse('123456');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('123456');
    }
  });

  it('should remove spaces from code', () => {
    const result = otpCodeSchema.safeParse('123 456');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('123456');
    }
  });

  it('should reject code with wrong length', () => {
    const result = otpCodeSchema.safeParse('12345');
    expect(result.success).toBe(false);
  });

  it('should reject code with letters', () => {
    const result = otpCodeSchema.safeParse('12345a');
    expect(result.success).toBe(false);
  });
});

describe('requestOtpBodySchema', () => {
  it('should validate correct request body', () => {
    const result = requestOtpBodySchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
      expect(result.data.purpose).toBe('sign_in');
    }
  });

  it('should allow explicit purpose', () => {
    const result = requestOtpBodySchema.safeParse({ email: 'user@example.com', purpose: 'sign_in' });
    expect(result.success).toBe(true);
  });

  it('should reject missing email', () => {
    const result = requestOtpBodySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('verifyOtpBodySchema', () => {
  it('should validate correct verify body', () => {
    const result = verifyOtpBodySchema.safeParse({
      challengeId: 'abc123',
      code: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing challengeId', () => {
    const result = verifyOtpBodySchema.safeParse({ code: '123456' });
    expect(result.success).toBe(false);
  });

  it('should reject missing code', () => {
    const result = verifyOtpBodySchema.safeParse({ challengeId: 'abc123' });
    expect(result.success).toBe(false);
  });
});

describe('safeReturnUrlSchema', () => {
  it('should allow relative paths', () => {
    const result = safeReturnUrlSchema.safeParse('/dashboard');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('/dashboard');
    }
  });

  it('should allow paths with query strings', () => {
    const result = safeReturnUrlSchema.safeParse('/dashboard?tab=workouts');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('/dashboard?tab=workouts');
    }
  });

  it('should reject absolute URLs', () => {
    const result = safeReturnUrlSchema.safeParse('https://evil.com');
    expect(result.success).toBe(true); // Transform returns null
    if (result.success) {
      expect(result.data).toBe(null);
    }
  });

  it('should allow undefined', () => {
    const result = safeReturnUrlSchema.safeParse(undefined);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(null);
    }
  });
});
