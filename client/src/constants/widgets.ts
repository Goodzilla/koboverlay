export const WIDGET_DEFAULT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  subGoal: { width: 360, height: 68 },
  subAlert: { width: 480, height: 80 },
  customImage: { width: 240, height: 120 },
};

export const TRIGGER_EVENT_TYPES = [
  { value: 'all', label: 'All Event Types' },
  { value: 'sub', label: 'New Subscriber' },
  { value: 'resub', label: 'Resubscription' },
  { value: 'subgift', label: 'Gifted Sub' },
  { value: 'bits', label: 'Cheer / Bits' },
  { value: 'raid', label: 'Raid' },
];

export const TRIGGER_TIERS = [
  { value: 'all', label: 'All Tiers' },
  { value: 'Prime', label: 'Twitch Prime' },
  { value: '1000', label: 'Tier 1 ($4.99)' },
  { value: '2000', label: 'Tier 2 ($9.99)' },
  { value: '3000', label: 'Tier 3 ($24.99)' },
];
