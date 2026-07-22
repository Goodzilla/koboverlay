import { useState, useCallback } from 'react';
import { WidgetInstance } from '../components/LayerTree';
import { AlertData } from '../components/SubAlertWidget';
import { matchAlertToWidget } from '../utils/alertMatcher';

export function useAlertFeed(widgets: WidgetInstance[], onEmitAlert?: (alert: AlertData) => void) {
  const [alertQueue, setAlertQueue] = useState<AlertData[]>([]);
  const [alertHistory, setAlertHistory] = useState<AlertData[]>([]);

  const pushToHistory = useCallback((alert: AlertData) => {
    setAlertHistory((prev) => {
      const filtered = prev.filter((a) => a.id !== alert.id);
      return [alert, ...filtered].slice(0, 50); // Keep last 50 historical alerts
    });
  }, []);

  const triggerTestAlert = useCallback((
    type: 'sub' | 'resub' | 'subgift' | 'bits' | 'raid',
    tier: 'Prime' | '1000' | '2000' | '3000' = '1000',
    amount: number = 1,
    months: number = 1
  ) => {
    const matchedWidget = matchAlertToWidget(widgets, type, tier, amount, months);

    const usernames = ['PixelNinja', 'CyberKnight', 'NeonStreamer', 'VortexPro', 'AuraGamer', 'HyperDrive'];
    const randomUser = usernames[Math.floor(Math.random() * usernames.length)];

    let message = 'New Subscriber!';
    if (type === 'resub') message = `Resubscribed for ${months} months!`;
    if (type === 'subgift') message = `Gifted ${amount} subscriptions!`;
    if (type === 'bits') message = `Cheered ${amount} Bits!`;
    if (type === 'raid') message = `Raided with ${amount} viewers!`;

    const simAlert: AlertData = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      username: randomUser,
      type,
      tier,
      amount,
      months,
      message,
      soundUrl: matchedWidget?.config.soundUrl,
      soundVolume: matchedWidget?.config.soundVolume,
    };

    setAlertQueue((prev) => [...prev, simAlert]);
    if (onEmitAlert) onEmitAlert(simAlert);
  }, [widgets, onEmitAlert]);

  const handleAlertComplete = useCallback(() => {
    setAlertQueue((prev) => {
      if (prev.length > 0) {
        pushToHistory(prev[0]);
      }
      return prev.slice(1);
    });
  }, [pushToHistory]);

  const handleSkipAlert = useCallback(() => {
    setAlertQueue((prev) => {
      if (prev.length > 0) {
        pushToHistory(prev[0]);
      }
      return prev.slice(1);
    });
  }, [pushToHistory]);

  const handleClearQueue = useCallback(() => {
    setAlertQueue([]);
  }, []);

  const handleReplayAlert = useCallback((alert: AlertData) => {
    const freshAlert: AlertData = {
      ...alert,
      id: `replay_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    };
    setAlertQueue((prev) => [...prev, freshAlert]);
    if (onEmitAlert) onEmitAlert(freshAlert);
  }, [onEmitAlert]);

  const handleClearHistory = useCallback(() => {
    setAlertHistory([]);
  }, []);

  return {
    alertQueue,
    setAlertQueue,
    alertHistory,
    triggerTestAlert,
    handleAlertComplete,
    handleSkipAlert,
    handleClearQueue,
    handleReplayAlert,
    handleClearHistory,
  };
}
