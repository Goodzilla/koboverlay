import { describe, it, expect } from 'vitest';

describe('Auth & Shared Mod Tokens Logic Tests', () => {
  it('should calculate 1-year expiration date for shared mod tokens', () => {
    const now = new Date('2026-07-22T14:00:00Z');
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    expect(oneYearLater.getUTCFullYear()).toBe(2027);
    expect(oneYearLater.getUTCMonth()).toBe(6); // Month 6 = July
    expect(oneYearLater.getUTCDate()).toBe(22);
  });

  it('should verify direct bypass for valid mod tokens', () => {
    const sharedToken = {
      token: 'mod_123456789',
      revoked: false,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };

    const isBypassAllowed = !sharedToken.revoked && new Date() < sharedToken.expiresAt;
    expect(isBypassAllowed).toBe(true);
  });

  it('should block direct bypass if token is revoked', () => {
    const sharedToken = {
      token: 'mod_revoked',
      revoked: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };

    const isBypassAllowed = !sharedToken.revoked && new Date() < sharedToken.expiresAt;
    expect(isBypassAllowed).toBe(false);
  });

  it('should block direct bypass if token is expired', () => {
    const sharedToken = {
      token: 'mod_expired',
      revoked: false,
      expiresAt: new Date(Date.now() - 1000), // Expired
    };

    const isBypassAllowed = !sharedToken.revoked && new Date() < sharedToken.expiresAt;
    expect(isBypassAllowed).toBe(false);
  });
});
