import { AlertPayload } from './alertQueueService.js';

export class TwitchService {
  /**
   * Generates a simulated test subscription alert
   */
  public createSimulatedSubEvent(
    type: 'sub' | 'resub' | 'subgift' = 'sub',
    username?: string,
    tier: 'Prime' | '1000' | '2000' | '3000' = '1000'
  ): Omit<AlertPayload, 'id' | 'timestamp'> {
    const mockNames = ['GamerPro99', 'PixelKnight', 'NeonStreamer', 'VortexRider', 'AuraHunter'];
    const chosenName = username || mockNames[Math.floor(Math.random() * mockNames.length)];
    const months = type === 'resub' ? Math.floor(Math.random() * 24) + 2 : 1;

    let message: string | undefined;
    if (type === 'resub') {
      const messages = [
        'Loving the streams! Keep it up 🔥',
        'Month 6 already? Time flies!',
        'Best streamer on Twitch! Hype!',
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    }

    return {
      type,
      username: chosenName,
      tier,
      months,
      message,
      durationMs: 5000,
      primaryColor: '#7c3aed',
    };
  }

  /**
   * Normalizes Twitch EventSub subscription payload into StreamPulse alert format
   */
  public parseEventSubSubscription(payload: any): Omit<AlertPayload, 'id' | 'timestamp'> {
    const event = payload?.event || {};
    const isGift = event.is_gift || false;
    const isResub = (event.cumulative_months || 0) > 1;

    let type: 'sub' | 'resub' | 'subgift' = 'sub';
    if (isGift) type = 'subgift';
    else if (isResub) type = 'resub';

    return {
      type,
      username: event.user_name || 'AnonymousSubscriber',
      tier: (event.tier as any) || '1000',
      months: event.cumulative_months || 1,
      message: event.message?.text || undefined,
      durationMs: 5000,
      primaryColor: '#7c3aed',
    };
  }
}

export const twitchService = new TwitchService();
