/**
 * Tests for auth service utility functions
 */
import { describe, it, expect } from 'vitest';
import {
  generateSecureId,
  generateOtpCode,
  maskEmail,
  determineNextDestination,
} from './auth.service';

describe('generateSecureId', () => {
  it('should generate string of specified length', () => {
    const id = generateSecureId(32);
    expect(id).toHaveLength(32);
  });

  it('should generate unique IDs', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateSecureId());
    }
    expect(ids.size).toBe(100);
  });

  it('should only contain alphanumeric characters', () => {
    const id = generateSecureId(100);
    expect(id).toMatch(/^[A-Za-z0-9]+$/);
  });
});

describe('generateOtpCode', () => {
  it('should generate 6-digit code', () => {
    const code = generateOtpCode();
    expect(code).toHaveLength(6);
  });

  it('should only contain digits', () => {
    const code = generateOtpCode();
    expect(code).toMatch(/^\d{6}$/);
  });

  it('should generate unique codes', () => {
    const codes = new Set();
    for (let i = 0; i < 100; i++) {
      codes.add(generateOtpCode());
    }
    expect(codes.size).toBe(100);
  });
});

describe('hashValue', () => {
  it('should produce consistent hash for same input', async () => {
    const { hashValue } = await import('./auth.service');
    const hash1 = await hashValue('test');
    const hash2 = await hashValue('test');
    expect(hash1).toBe(hash2);
  });

  it('should produce different hash for different input', async () => {
    const { hashValue } = await import('./auth.service');
    const hash1 = await hashValue('test1');
    const hash2 = await hashValue('test2');
    expect(hash1).not.toBe(hash2);
  });

  it('should produce 64-char hex string (SHA-256)', async () => {
    const { hashValue } = await import('./auth.service');
    const hash = await hashValue('test');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });
});

describe('verifyHash', () => {
  it('should return true for matching value', async () => {
    const { hashValue, verifyHash } = await import('./auth.service');
    const hash = await hashValue('test');
    const result = await verifyHash('test', hash);
    expect(result).toBe(true);
  });

  it('should return false for non-matching value', async () => {
    const { hashValue, verifyHash } = await import('./auth.service');
    const hash = await hashValue('test');
    const result = await verifyHash('different', hash);
    expect(result).toBe(false);
  });
});

describe('maskEmail', () => {
  it('should mask email correctly', () => {
    expect(maskEmail('user@example.com')).toBe('us***@example.com');
  });

  it('should handle short local part', () => {
    expect(maskEmail('ab@example.com')).toBe('a***@example.com');
  });

  it('should handle email without @', () => {
    expect(maskEmail('invalid')).toBe('invalid');
  });

  it('should handle very short local part', () => {
    expect(maskEmail('a@example.com')).toBe('a***@example.com');
  });
});

describe('determineNextDestination', () => {
  it('should return returnTo if provided', () => {
    const result = determineNextDestination({ path: '/custom', search: '' }, 'completed');
    expect(result).toBe('/custom');
  });

  it('should return /onboarding for not_started status', () => {
    const result = determineNextDestination(null, 'not_started');
    expect(result).toBe('/onboarding');
  });

  it('should return /onboarding for in_progress status', () => {
    const result = determineNextDestination(null, 'in_progress');
    expect(result).toBe('/onboarding');
  });

  it('should return /dashboard for completed status', () => {
    const result = determineNextDestination(null, 'completed');
    expect(result).toBe('/dashboard');
  });

  it('should preserve search params', () => {
    const result = determineNextDestination({ path: '/custom', search: '?foo=bar' }, 'completed');
    expect(result).toBe('/custom?foo=bar');
  });
});
