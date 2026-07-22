import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
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

      // Trigger colorful confetti burst on overlay
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.3 },
          colors: ['#7c3aed', '#a855f7', '#06b6d4', '#ec4899', '#f59e0b'],
        });
      } catch (err) {
        // Ignore fallback if canvas context missing in tests
      }

      const duration = alert.durationMs || 5000;
      const exitTimer = setTimeout(() => {
        setAnimState('exit');
      }, duration - 500);

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

  const primaryColor = alert.primaryColor || '#7c3aed';
  const getTierLabel = () => {
    if (alert.tier === 'Prime') return 'Twitch Prime Sub';
    if (alert.tier === '2000') return 'Tier 2 Sub';
    if (alert.tier === '3000') return 'Tier 3 Sub';
    return 'Tier 1 Sub';
  };

  const getSubHeader = () => {
    if (alert.type === 'subgift') return 'GIFT SUBSCRIBER!';
    if (alert.type === 'resub') return `RE-SUBSCRIBED FOR ${alert.months || 1} MONTHS!`;
    return 'NEW SUBSCRIBER!';
  };

  return (
    <div
      className={`alert-container ${
        animState === 'enter' ? 'animate-alert-enter' : 'animate-alert-exit'
      }`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 36px',
        borderRadius: '24px',
        background: `linear-gradient(135deg, rgba(23, 17, 44, 0.92) 0%, rgba(15, 11, 30, 0.96) 100%)`,
        border: `2px solid ${primaryColor}`,
        boxShadow: `0 0 40px ${primaryColor}80, 0 10px 30px rgba(0,0,0,0.5)`,
        maxWidth: '520px',
        textAlign: 'center',
        margin: '0 auto',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top Badge Icon */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${primaryColor} 0%, #06b6d4 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
          boxShadow: `0 0 20px ${primaryColor}`,
        }}
      >
        {alert.type === 'subgift' ? (
          <Gift size={32} color="#ffffff" />
        ) : alert.months && alert.months > 3 ? (
          <Crown size={32} color="#ffffff" />
        ) : (
          <Sparkles size={32} color="#ffffff" />
        )}
      </div>

      {/* Sub Header Type */}
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.85rem',
          fontWeight: 800,
          letterSpacing: '2px',
          color: '#06b6d4',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}
      >
        {getSubHeader()}
      </div>

      {/* Subscriber Name */}
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: 900,
          color: '#ffffff',
          textShadow: `0 0 16px ${primaryColor}`,
          lineHeight: 1.1,
          marginBottom: '8px',
        }}
      >
        {alert.username}
      </div>

      {/* Tier & Month Tag */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 14px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#e2e8f0',
          marginBottom: alert.message ? '12px' : '0',
        }}
      >
        <Zap size={14} color="#f59e0b" />
        {getTierLabel()}
      </div>

      {/* Optional Subscriber Message */}
      {alert.message && (
        <div
          style={{
            fontStyle: 'italic',
            color: '#cbd5e1',
            fontSize: '0.95rem',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '10px 16px',
            borderRadius: '12px',
            borderLeft: `3px solid ${primaryColor}`,
            marginTop: '8px',
            width: '100%',
          }}
        >
          "{alert.message}"
        </div>
      )}
    </div>
  );
};
