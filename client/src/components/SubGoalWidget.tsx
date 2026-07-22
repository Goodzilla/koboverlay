import React from 'react';
import { Target } from 'lucide-react';

interface SubGoalWidgetProps {
  title?: string;
  currentSubs: number;
  targetSubs: number;
  primaryColor?: string;
}

export const SubGoalWidget: React.FC<SubGoalWidgetProps> = ({
  title = 'Sub Goal',
  currentSubs,
  targetSubs,
  primaryColor = '#6366f1',
}) => {
  const percentage = Math.min(100, Math.round((currentSubs / Math.max(1, targetSubs)) * 100));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '14px 18px',
        borderRadius: '10px',
        background: '#18181b',
        border: '1px solid #27272a',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        width: '100%',
        boxSizing: 'border-box',
        color: '#ffffff',
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={16} color={primaryColor} />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f4f4f5' }}>{title}</span>
        </div>

        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: '#ffffff' }}>{currentSubs}</span> / <span>{targetSubs}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '10px',
          borderRadius: '6px',
          background: '#09090b',
          border: '1px solid #27272a',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            borderRadius: '6px',
            background: primaryColor,
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* Subtext Percentage */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#71717a' }}>
        <span>Target Progress</span>
        <span style={{ color: '#a1a1aa', fontWeight: 600 }}>{percentage}%</span>
      </div>
    </div>
  );
};
