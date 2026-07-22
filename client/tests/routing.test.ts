import { describe, it, expect } from 'vitest';

describe('Routing & Token Resolution Tests', () => {
  it('should extract shared token from search parameters correctly', () => {
    const search = '?token=custom-mod-token';
    const params = new URLSearchParams(search);
    const extractedToken = params.get('token');

    expect(extractedToken).toBe('custom-mod-token');
  });

  it('should fallback to default streamer token when search params are empty', () => {
    const search = '';
    const params = new URLSearchParams(search);
    const extractedToken = params.get('token') || 'demo-streamer-token';

    expect(extractedToken).toBe('demo-streamer-token');
  });
});
