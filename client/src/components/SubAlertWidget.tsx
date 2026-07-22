import React, { useEffect, useState } from 'react';
import { Sparkles, Crown, Gift } from 'lucide-react';

export interface AlertData {
  id: string;
  type: 'sub' | 'resub' | 'subgift';
  username: string;
  tier: 'Prime' | '1000' | '2000' | '3000';
  months?: number;
  message?: string;
  durationMs?: number;
  primaryColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  imageUrl?: string;
  customTextTemplate?: string;
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

  const accentColor = alert.primaryColor || '#38bdf8';
  const bgColor = alert.backgroundColor || '#18181b';
  const radius = alert.borderRadius !== undefined ? alert.borderRadius : 12;

  const getTierLabel = () => {
    if (alert.tier === 'Prime') return 'Prime';
    if (alert.tier === '2000') return 'Tier 2';
    if (alert.tier === '3000') return 'Tier 3';
    return 'Tier 1';
  };

  const getFormattedMessage = () => {
    if (alert.customTextTemplate) {
      return alert.customTextTemplate
        .replace('{username}', alert.username)
        .replace('{months}', String(alert.months || 1))
        .replace('{tier}', getTierLabel());
    }

    if (alert.type === 'subgift') {
      return `${alert.username} gifted a sub (${getTierLabel()})`;
    }
    if (alert.type === 'resub') {
      return `${alert.username} subscribed for ${alert.months || 1} months (${getTierLabel()})`;
    }
    return `${alert.username} subscribed (${getTierLabel()})`;
  };

  return (
    <div
      className={animState === 'enter' ? 'animate-alert-enter' : 'animate-alert-exit'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 18px',
        borderRadius: `${radius}px`,
        background: bgColor,
        border: bgColor === 'transparent' ? 'none' : `1px solid ${accentColor}60`,
        boxShadow: bgColor === 'transparent' ? 'none' : `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${accentColor}30`,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        color: '#ffffff',
      }}
    >
      {/* Custom Media / Badge Icon */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: `${Math.max(4, radius - 4)}px`,
          background: `${accentColor}20`,
          border: `1px solid ${accentColor}60`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {alert.imageUrl ? (
          <img src={alert.imageUrl} alt="Alert Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : alert.type === 'subgift' ? (
          <Gift size={24} color={accentColor} />
        ) : alert.months && alert.months > 3 ? (
          <Crown size={24} color={accentColor} />
        ) : (
          <Sparkles size={24} color={accentColor} />
        )}
      </div>

      {/* Content Info */}
      <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {getFormattedMessage()}
        </div>

        {alert.message && (
          <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            "{alert.message}"
          </div>
        )}
      </div>
    </div>
  );
};
