import React from 'react';
import { Target, Trophy } from 'lucide-react';

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
  primaryColor = '#7c3aed',
}) => {
  const percentage = Math.min(100, Math.round((currentSubs / Math.max(1, targetSubs)) * 100));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '14px 20px',
        borderRadius: '16px',
        background: 'rgba(23, 17, 44, 0.88)',
        border: `1px solid ${primaryColor}60`,
        backdropFilter: 'blur(16px)',
        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.4)`,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={18} color="#06b6d4" />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.95rem',
              color: '#ffffff',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: '#f8fafc',
          }}
        >
          <span style={{ color: '#06b6d4' }}>{currentSubs}</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span>{targetSubs}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height: '14px',
          borderRadius: '10px',
          background: 'rgba(15, 11, 30, 0.8)',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Animated Fill Bar */}
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            borderRadius: '10px',
            background: `linear-gradient(90deg, ${primaryColor} 0%, #06b6d4 100%)`,
            transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: `0 0 12px ${primaryColor}`,
            position: 'relative',
          }}
        >
          {/* Shimmer Effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
              animation: 'shimmer 2.5s infinite',
            }}
          />
        </div>
      </div>

      {/* Footer Percentage Tag */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#94a3b8',
        }}
      >
        <span>Progress</span>
        <span style={{ color: '#06b6d4', fontWeight: 700 }}>{percentage}% Achieved</span>
      </div>
    </div>
  );
};
