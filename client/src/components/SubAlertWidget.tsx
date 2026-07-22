import React, { useEffect, useState } from 'react';
import { Sparkles, Crown, Zap, Gift } from 'lucide-react';

export interface AlertData {
  id: string;
  type: 'sub' | 'resub' | 'subgift';
  username: string;
  tier: 'Prime' | '1000' | '2000' | '3000';
  months?: number;
  message?: string;
  durationMs?: number;
  primaryColor?: string;
}

interface SubAlertWidgetProps {
  alert: AlertData | null;
  onAnimationComplete?: () => void;
}

export const SubAlertWidget: React.FC<SubAlertWidgetProps> = ({ alert, onAnimationComplete }) => {
  const [animState, setAnimState] = useState<'enter' | 'exit' | 'hidden'>('hidden');

  useEffect(() => {
    if (alert) {
      setAnimState('enter');

      const duration = alert.durationMs || 5000;
      const exitTimer = setTimeout(() => {
        setAnimState('exit');
      }, Math.max(500, duration - 400));

      const hideTimer = setTimeout(() => {
        setAnimState('hidden');
        if (onAnimationComplete) onAnimationComplete();
      }, duration);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setAnimState('hidden');
    }
  }, [alert, onAnimationComplete]);

  if (!alert || animState === 'hidden') return null;

  const accentColor = alert.primaryColor || '#6366f1';

  const getTierLabel = () => {
    if (alert.tier === 'Prime') return 'Prime Sub';
    if (alert.tier === '2000') return 'Tier 2';
    if (alert.tier === '3000') return 'Tier 3';
    return 'Tier 1';
  };

  const getSubHeader = () => {
    if (alert.type === 'subgift') return 'Gift Subscription';
    if (alert.type === 'resub') return `Re-Subscribed (${alert.months || 1} Months)`;
    return 'New Subscriber';
  };

  return (
    <div
      className={animState === 'enter' ? 'animate-alert-enter' : 'animate-alert-exit'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 20px',
        borderRadius: '12px',
        background: '#18181b',
        border: `1px solid ${accentColor}80`,
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${accentColor}30`,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        color: '#ffffff',
      }}
    >
      {/* Icon Badge */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          background: `${accentColor}20`,
          border: `1px solid ${accentColor}60`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {alert.type === 'subgift' ? (
          <Gift size={24} color={accentColor} />
        ) : alert.months && alert.months > 3 ? (
          <Crown size={24} color={accentColor} />
        ) : (
          <Sparkles size={24} color={accentColor} />
        )}
      </div>

      {/* Content Info */}
      <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {getSubHeader()}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#d4d4d8',
            }}
          >
            {getTierLabel()}
          </span>
        </div>

        <div
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#ffffff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {alert.username}
        </div>

        {alert.message && (
          <div
            style={{
              fontSize: '0.85rem',
              color: '#d4d4d8',
              marginTop: '4px',
              fontStyle: 'italic',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            "{alert.message}"
          </div>
        )}
      </div>
    </div>
  );
};
