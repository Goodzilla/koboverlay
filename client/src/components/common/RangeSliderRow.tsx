import React from 'react';

interface RangeSliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  accentColor?: string;
  onChange: (val: number) => void;
}

export const RangeSliderRow: React.FC<RangeSliderRowProps> = ({
  label,
  value,
  min,
  max,
  unit = 'px',
  accentColor = '#6366f1',
  onChange,
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa' }}>{label}</label>
        <span style={{ fontSize: '0.7rem', color: accentColor, fontFamily: 'var(--font-mono)' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor, cursor: 'pointer' }}
      />
    </div>
  );
};
