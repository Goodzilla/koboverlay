import { Request, Response } from 'express';
import { twitchService } from '../services/twitchService';
import { alertQueueManager } from '../services/alertQueueService';
import { prisma } from '../prisma';

export class OverlayController {
  public static async getOverlayInfo(req: Request, res: Response) {
    const { token } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { overlayToken: token },
        include: { config: true },
      });

      if (!user || !user.config) {
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
          widgets: null,
        });
      }

      let parsedWidgets = null;
      if (user.config.layoutConfig) {
        try {
          parsedWidgets = JSON.parse(user.config.layoutConfig);
        } catch (e) {
          console.error('Failed to parse user layoutConfig JSON:', e);
        }
      }

      return res.json({
        success: true,
        token,
        config: user.config,
        widgets: parsedWidgets,
      });
    } catch (err: any) {
      console.error('Error fetching overlay info:', err);
      return res.status(500).json({ error: 'Failed to retrieve overlay configuration' });
    }
  }

  public static async updateOverlayConfig(req: Request, res: Response) {
    const { token, widgets, config } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Overlay token is required.' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { overlayToken: token },
      });

      if (!user) {
        // If demo token or user not in DB yet, still return success for transient demo mode
        return res.json({ success: true, note: 'Demo mode state transiently acknowledged' });
      }

      const layoutConfigStr = widgets ? JSON.stringify(widgets) : undefined;

      const updatedConfig = await prisma.overlayConfig.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          primaryColor: config?.primaryColor ?? '#7c3aed',
          alertDuration: config?.alertDuration ?? 5000,
          soundEnabled: config?.soundEnabled ?? true,
          soundVolume: config?.soundVolume ?? 0.8,
          goalTitle: config?.goalTitle ?? 'Sub Goal',
          currentSubs: config?.currentSubs ?? 14,
          targetSubs: config?.targetSubs ?? 50,
          layoutConfig: layoutConfigStr ?? '[]',
        },
        update: {
          ...(config?.primaryColor && { primaryColor: config.primaryColor }),
          ...(config?.alertDuration !== undefined && { alertDuration: config.alertDuration }),
          ...(config?.soundEnabled !== undefined && { soundEnabled: config.soundEnabled }),
          ...(config?.soundVolume !== undefined && { soundVolume: config.soundVolume }),
          ...(config?.goalTitle && { goalTitle: config.goalTitle }),
          ...(config?.currentSubs !== undefined && { currentSubs: config.currentSubs }),
          ...(config?.targetSubs !== undefined && { targetSubs: config.targetSubs }),
          ...(layoutConfigStr && { layoutConfig: layoutConfigStr }),
        },
      });

      return res.json({
        success: true,
        config: updatedConfig,
      });
    } catch (err: any) {
      console.error('Error saving overlay config:', err);
      return res.status(500).json({ error: 'Failed to save configuration.' });
    }
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

