import React from 'react';

interface SubGoalWidgetProps {
  title?: string;
  currentSubs: number;
  targetSubs: number;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
  imageUrl?: string;
}

export const SubGoalWidget: React.FC<SubGoalWidgetProps> = ({
  title = 'Sub Goal',
  currentSubs,
  targetSubs,
  primaryColor = '#6366f1',
  backgroundColor = '#18181b',
  textColor = '#ffffff',
  fontSize = 14,
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
        color: textColor,
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {imageUrl && (
            <img src={imageUrl} alt="Icon" style={{ width: `${fontSize + 4}px`, height: `${fontSize + 4}px`, objectFit: 'contain' }} />
          )}
          <span style={{ fontWeight: 700, fontSize: `${fontSize}px`, color: textColor }}>{title}</span>
        </div>

        <div style={{ fontSize: `${Math.max(11, fontSize - 2)}px`, fontWeight: 700, color: textColor, opacity: 0.9, fontFamily: 'var(--font-mono)' }}>
          <span>{currentSubs}</span> / <span>{targetSubs}</span> ({percentage}%)
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
