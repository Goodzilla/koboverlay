export interface AlertPayload {
  id: string;
  type: 'sub' | 'resub' | 'subgift';
  username: string;
  tier: 'Prime' | '1000' | '2000' | '3000';
  months?: number;
  message?: string;
  durationMs?: number;
  primaryColor?: string;
  timestamp?: number;
}

export class AlertQueueService {
  private queue: AlertPayload[] = [];
  private isProcessing = false;

  public enqueue(alert: Omit<AlertPayload, 'id' | 'timestamp'>): AlertPayload {
    const fullAlert: AlertPayload = {
      ...alert,
      id: Math.random().toString(36).substring(2, 9),
      durationMs: alert.durationMs || 5000,
      timestamp: Date.now(),
    };
    this.queue.push(fullAlert);
    return fullAlert;
  }

  public getNextAlert(): AlertPayload | null {
    if (this.queue.length === 0) return null;
    return this.queue.shift() || null;
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public clearQueue(): void {
    this.queue = [];
  }
}

export const alertQueueManager = new AlertQueueService();
