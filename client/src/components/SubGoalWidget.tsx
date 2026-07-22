import React from 'react';
import { Target } from 'lucide-react';

interface SubGoalWidgetProps {
  title?: string;
  currentSubs: number;
  targetSubs: number;
  primaryColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  imageUrl?: string;
}

export const SubGoalWidget: React.FC<SubGoalWidgetProps> = ({
  title = 'Sub Goal',
  currentSubs,
  targetSubs,
  primaryColor = '#6366f1',
  backgroundColor = '#18181b',
  borderRadius = 10,
  imageUrl,
}) => {
  const percentage = Math.min(100, Math.round((currentSubs / Math.max(1, targetSubs)) * 100));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px 14px',
        borderRadius: `${borderRadius}px`,
        background: backgroundColor,
        border: backgroundColor === 'transparent' ? 'none' : '1px solid #27272a',
        boxShadow: backgroundColor === 'transparent' ? 'none' : '0 8px 24px rgba(0, 0, 0, 0.4)',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        color: '#ffffff',
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {imageUrl ? (
            <img src={imageUrl} alt="Icon" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
          ) : (
            <Target size={16} color={primaryColor} />
          )}
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f4f4f5' }}>{title}</span>
        </div>

        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: '#ffffff' }}>{currentSubs}</span> / <span>{targetSubs}</span> ({percentage}%)
        </div>
      </div>

      {/* Progress Bar Track */}
      <div
        style={{
          width: '100%',
          height: '10px',
          borderRadius: `${Math.max(2, borderRadius - 4)}px`,
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            borderRadius: `${Math.max(2, borderRadius - 4)}px`,
            background: primaryColor,
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  );
};
