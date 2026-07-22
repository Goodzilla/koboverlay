import { Request, Response } from 'express';
import { twitchService } from '../services/twitchService';
import { alertQueueManager } from '../services/alertQueueService';

export class OverlayController {
  public static async getOverlayInfo(req: Request, res: Response) {
    const { token } = req.params;
    
    // Fallback/demo config if no DB record yet
    return res.json({
      success: true,
      token,
      config: {
        primaryColor: '#7c3aed',
        alertDuration: 5000,
        soundEnabled: true,
        soundVolume: 0.8,
        goalTitle: 'Sub Goal',
        currentSubs: 14,
        targetSubs: 50,
      },
    });
  }

  public static async triggerTestAlert(req: Request, res: Response) {
    const { token } = req.body;
    const { type, username, tier } = req.body;

    const mockEvent = twitchService.createSimulatedSubEvent(type, username, tier);
    const queued = alertQueueManager.enqueue(mockEvent);

    return res.json({
      success: true,
      alert: queued,
      message: `Test alert queued for token ${token || 'demo-token'}`,
    });
  }

  public static async handleTwitchWebhook(req: Request, res: Response) {
    const payload = req.body;
    
    if (payload?.challenge) {
      // Twitch EventSub Webhook Verification challenge
      return res.send(payload.challenge);
    }

    const alertData = twitchService.parseEventSubSubscription(payload);
    const queued = alertQueueManager.enqueue(alertData);

    return res.json({
      success: true,
      received: queued,
    });
  }
}
