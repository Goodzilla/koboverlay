import React, { useEffect, useState } from 'react';

export interface AlertData {
  id: string;
  type: 'sub' | 'resub' | 'subgift' | 'bits' | 'raid';
  username: string;
  tier: 'Prime' | '1000' | '2000' | '3000';
  amount?: number;
  months?: number;
  message?: string;
  durationMs?: number;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
  imageUrl?: string;
  imageSize?: number;
  soundUrl?: string;
  soundVolume?: number;
  customTextTemplate?: string;
}

interface SubAlertWidgetProps {
  alert: AlertData | null;
  onAnimationComplete?: () => void;
  muted?: boolean;
}

export const SubAlertWidget: React.FC<SubAlertWidgetProps> = ({ alert, onAnimationComplete, muted = false }) => {
  const [animState, setAnimState] = useState<'enter' | 'exit' | 'hidden'>('hidden');

  useEffect(() => {
    if (alert) {
      setAnimState('enter');

      // Play alert sound if configured and not muted
      if (alert.soundUrl && !muted) {
        try {
          const audio = new Audio(alert.soundUrl);
          audio.volume = (alert.soundVolume !== undefined ? alert.soundVolume : 80) / 100;
          audio.play().catch((err) => console.log('Audio autoplay prevented or error:', err));
        } catch (e) {
          console.error('Failed to play alert sound:', e);
        }
      }

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
  const txtColor = alert.textColor || '#ffffff';
  const fSize = alert.fontSize || 18;
  const imgSize = alert.imageSize || 80;
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
        .replace('{amount}', String(alert.amount || 1))
        .replace('{tier}', getTierLabel());
    }

    if (alert.type === 'subgift') {
      return `${alert.username} gifted ${alert.amount || 1} subs (${getTierLabel()})`;
    }
    if (alert.type === 'bits') {
      return `${alert.username} cheered ${alert.amount || 100} Bits!`;
    }
    if (alert.type === 'raid') {
      return `${alert.username} raided with ${alert.amount || 10} viewers!`;
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 18px',
        borderRadius: `${radius}px`,
        background: bgColor,
        border: bgColor === 'transparent' ? 'none' : `1px solid ${accentColor}60`,
        boxShadow: bgColor === 'transparent' ? 'none' : `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${accentColor}30`,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        color: txtColor,
        textAlign: 'center',
      }}
    >
      {/* Dynamic Uploaded / Custom Image ABOVE the text */}
      {alert.imageUrl && (
        <div
          style={{
            height: `${imgSize}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img
            src={alert.imageUrl}
            alt="Alert Media"
            style={{
              height: `${imgSize}px`,
              width: 'auto',
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />
        </div>
      )}

      {/* Alert Text Content */}
      <div style={{ width: '100%', minWidth: 0 }}>
        <div
          style={{
            fontSize: `${fSize}px`,
            fontWeight: 800,
            color: txtColor,
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}
        >
          {getFormattedMessage()}
        </div>

        {alert.message && (
          <div
            style={{
              fontSize: `${Math.max(11, fSize - 6)}px`,
              color: txtColor,
              opacity: 0.8,
              marginTop: '4px',
              wordBreak: 'break-word',
            }}
          >
            "{alert.message}"
          </div>
        )}
      </div>
    </div>
  );
};
