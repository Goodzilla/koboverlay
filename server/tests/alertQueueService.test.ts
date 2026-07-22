import { describe, it, expect, beforeEach } from 'vitest';
import { AlertQueueService } from '../src/services/alertQueueService';

describe('AlertQueueService Unit Tests', () => {
  let queueService: AlertQueueService;

  beforeEach(() => {
    queueService = new AlertQueueService();
  });

  it('should enqueue an alert with auto-generated ID and default duration', () => {
    const alert = queueService.enqueue({
      type: 'sub',
      username: 'StreamerFan123',
      tier: '1000',
    });

    expect(alert.id).toBeDefined();
    expect(alert.username).toBe('StreamerFan123');
    expect(alert.durationMs).toBe(5000);
    expect(queueService.getQueueLength()).toBe(1);
  });

  it('should dequeue alerts in FIFO sequence', () => {
    queueService.enqueue({ type: 'sub', username: 'User1', tier: '1000' });
    queueService.enqueue({ type: 'resub', username: 'User2', tier: '2000', months: 6 });

    const first = queueService.getNextAlert();
    expect(first?.username).toBe('User1');

    const second = queueService.getNextAlert();
    expect(second?.username).toBe('User2');
    expect(second?.months).toBe(6);

    expect(queueService.getNextAlert()).toBeNull();
  });

  it('should clear queue completely', () => {
    queueService.enqueue({ type: 'sub', username: 'User1', tier: '1000' });
    queueService.enqueue({ type: 'sub', username: 'User2', tier: '1000' });
    
    queueService.clearQueue();
    expect(queueService.getQueueLength()).toBe(0);
  });
});
