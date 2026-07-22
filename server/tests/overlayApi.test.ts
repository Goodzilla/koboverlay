import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

describe('Overlay REST API Endpoints', () => {
  const app = createApp();

  it('GET /health - should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/overlay/info/:token - should return overlay config', async () => {
    const res = await request(app).get('/api/overlay/info/test-token-123');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBe('test-token-123');
    expect(res.body.config).toBeDefined();
    expect(res.body.config.primaryColor).toBe('#7c3aed');
  });

  it('POST /api/overlay/test-alert - should trigger simulated test sub alert', async () => {
    const res = await request(app)
      .post('/api/overlay/test-alert')
      .send({ token: 'test-token-123', type: 'sub', username: 'TestGamer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.alert).toBeDefined();
    expect(res.body.alert.username).toBe('TestGamer');
  });
});
