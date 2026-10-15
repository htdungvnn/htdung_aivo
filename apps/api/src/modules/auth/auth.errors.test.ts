/**
 * Tests for auth errors
 */
import { describe, it, expect } from 'vitest';
import { AuthError, AuthErrorCodes, createAuthError } from './auth.errors';

describe('AuthError', () => {
  it('should create error with message, code, and status', () => {
    const error = new AuthError('Test message', 'TEST_CODE', 400);
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('TEST_CODE');
    expect(error.status).toBe(400);
  });

  it('should default status to 400', () => {
    const error = new AuthError('Test', 'TEST');
    expect(error.status).toBe(400);
  });

  it('should serialize to JSON correctly', () => {
    const error = new AuthError('Test', 'TEST', 400);
    const json = error.toJSON();
    expect(json).toEqual({
      error: 'Test',
      code: 'TEST',
    });
  });

  it('should have correct name', () => {
    const error = new AuthError('Test', 'TEST');
    expect(error.name).toBe('AuthError');
  });
});

describe('AuthErrorCodes', () => {
  it('should have all expected error codes', () => {
    expect(AuthErrorCodes.INVALID_EMAIL).toBe('INVALID_EMAIL');
    expect(AuthErrorCodes.INVALID_OTP).toBe('INVALID_OTP');
    expect(AuthErrorCodes.OTP_EXPIRED).toBe('OTP_EXPIRED');
    expect(AuthErrorCodes.OTP_ATTEMPTS_EXCEEDED).toBe('OTP_ATTEMPTS_EXCEEDED');
    expect(AuthErrorCodes.RATE_LIMITED).toBe('RATE_LIMITED');
    expect(AuthErrorCodes.OAUTH_FAILED).toBe('OAUTH_FAILED');
    expect(AuthErrorCodes.OAUTH_CANCELLED).toBe('OAUTH_CANCELLED');
    expect(AuthErrorCodes.INVALID_STATE).toBe('INVALID_STATE');
    expect(AuthErrorCodes.SESSION_EXPIRED).toBe('SESSION_EXPIRED');
    expect(AuthErrorCodes.SESSION_REVOKED).toBe('SESSION_REVOKED');
    expect(AuthErrorCodes.ACCOUNT_DISABLED).toBe('ACCOUNT_DISABLED');
    expect(AuthErrorCodes.INVALID_REQUEST).toBe('INVALID_REQUEST');
  });
});

describe('createAuthError', () => {
  describe('invalidEmail', () => {
    it('should create error with INVALID_EMAIL code', () => {
      const error = createAuthError.invalidEmail();
      expect(error.code).toBe('INVALID_EMAIL');
      expect(error.status).toBe(400);
    });
  });

  describe('invalidOtp', () => {
    it('should create error with INVALID_OTP code', () => {
      const error = createAuthError.invalidOtp();
      expect(error.code).toBe('INVALID_OTP');
      expect(error.status).toBe(400);
    });
  });

  describe('otpExpired', () => {
    it('should create error with OTP_EXPIRED code', () => {
      const error = createAuthError.otpExpired();
      expect(error.code).toBe('OTP_EXPIRED');
      expect(error.status).toBe(400);
    });
  });

  describe('otpAttemptsExceeded', () => {
    it('should create error with OTP_ATTEMPTS_EXCEEDED code and 429 status', () => {
      const error = createAuthError.otpAttemptsExceeded();
      expect(error.code).toBe('OTP_ATTEMPTS_EXCEEDED');
      expect(error.status).toBe(429);
    });
  });

  describe('rateLimited', () => {
    it('should create error with RATE_LIMITED code and 429 status', () => {
      const error = createAuthError.rateLimited();
      expect(error.code).toBe('RATE_LIMITED');
      expect(error.status).toBe(429);
    });
  });

  describe('oauthFailed', () => {
    it('should create error with OAUTH_FAILED code', () => {
      const error = createAuthError.oauthFailed();
      expect(error.code).toBe('OAUTH_FAILED');
      expect(error.status).toBe(400);
    });
  });

  describe('oauthCancelled', () => {
    it('should create error with OAUTH_CANCELLED code', () => {
      const error = createAuthError.oauthCancelled();
      expect(error.code).toBe('OAUTH_CANCELLED');
      expect(error.status).toBe(400);
    });
  });

  describe('invalidState', () => {
    it('should create error with INVALID_STATE code', () => {
      const error = createAuthError.invalidState();
      expect(error.code).toBe('INVALID_STATE');
      expect(error.status).toBe(400);
    });
  });

  describe('sessionExpired', () => {
    it('should create error with SESSION_EXPIRED code and 401 status', () => {
      const error = createAuthError.sessionExpired();
      expect(error.code).toBe('SESSION_EXPIRED');
      expect(error.status).toBe(401);
    });
  });

  describe('sessionRevoked', () => {
    it('should create error with SESSION_REVOKED code and 401 status', () => {
      const error = createAuthError.sessionRevoked();
      expect(error.code).toBe('SESSION_REVOKED');
      expect(error.status).toBe(401);
    });
  });

  describe('accountDisabled', () => {
    it('should create error with ACCOUNT_DISABLED code and 403 status', () => {
      const error = createAuthError.accountDisabled();
      expect(error.code).toBe('ACCOUNT_DISABLED');
      expect(error.status).toBe(403);
    });
  });

  describe('invalidRequest', () => {
    it('should create error with INVALID_REQUEST code', () => {
      const error = createAuthError.invalidRequest();
      expect(error.code).toBe('INVALID_REQUEST');
      expect(error.status).toBe(400);
    });

    it('should include custom details if provided', () => {
      const error = createAuthError.invalidRequest('Custom error');
      expect(error.message).toBe('Custom error');
    });
  });
});
