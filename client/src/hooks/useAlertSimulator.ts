import { useState, useCallback } from 'react';
import { WidgetInstance } from '../components/LayerTree';
import { AlertData } from '../components/SubAlertWidget';
import { matchAlertToWidget } from '../utils/alertMatcher';

export function useAlertSimulator(widgets: WidgetInstance[]) {
  const [alertQueue, setAlertQueue] = useState<AlertData[]>([]);

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
      id: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
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
  }, [widgets]);

  const handleAlertComplete = useCallback(() => {
    setAlertQueue((prev) => prev.slice(1));
  }, []);

  const handleSkipAlert = useCallback(() => {
    setAlertQueue((prev) => prev.slice(1));
  }, []);

  const handleClearQueue = useCallback(() => {
    setAlertQueue([]);
  }, []);

  return {
    alertQueue,
    setAlertQueue,
    triggerTestAlert,
    handleAlertComplete,
    handleSkipAlert,
    handleClearQueue,
  };
}
