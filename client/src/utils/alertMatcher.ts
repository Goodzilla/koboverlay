import { WidgetInstance } from '../components/LayerTree';

export const matchAlertToWidget = (
  widgets: WidgetInstance[],
  type: 'sub' | 'resub' | 'subgift' | 'bits' | 'raid',
  tier: 'Prime' | '1000' | '2000' | '3000',
  amount: number = 1,
  months: number = 1
): WidgetInstance | null => {
  const alertWidgets = widgets.filter((w) => w.type === 'subAlert' && w.layout.visible !== false);
  if (alertWidgets.length === 0) return null;

  let bestMatch: WidgetInstance = alertWidgets[0];
  let maxScore = -1;

  for (const widget of alertWidgets) {
    const cfg = widget.config;
    let score = 0;

    // Event Type Matching
    const evtMatch = !cfg.triggerEventType || cfg.triggerEventType === 'all' || cfg.triggerEventType === type;
    if (!evtMatch) continue;
    if (cfg.triggerEventType === type) score += 10;

    // Tier Matching
    const tierMatch = !cfg.triggerTier || cfg.triggerTier === 'all' || cfg.triggerTier === tier;
    if (!tierMatch) continue;
    if (cfg.triggerTier === tier) score += 5;

    // Amount / Quantity Threshold
    if (cfg.triggerMinAmount && cfg.triggerMinAmount > 0) {
      if (amount < cfg.triggerMinAmount) continue;
      score += Math.min(20, cfg.triggerMinAmount);
    }

    // Month Threshold
    if (cfg.triggerMinMonths && cfg.triggerMinMonths > 0) {
      if (months < cfg.triggerMinMonths) continue;
      score += Math.min(20, cfg.triggerMinMonths);
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = widget;
    }
  }

  return bestMatch;
};
