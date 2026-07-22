import React from 'react';

interface ColorPickerRowProps {
  label: string;
  value: string;
  defaultColor?: string;
  onChange: (val: string) => void;
}

export const ColorPickerRow: React.FC<ColorPickerRowProps> = ({
  label,
  value,
  defaultColor = '#6366f1',
  onChange,
}) => {
  const currentColor = value || defaultColor;
  const pickerColor = currentColor.startsWith('#') ? currentColor : defaultColor;

  return (
    <div>
      <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="color"
          value={pickerColor}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '32px', height: '28px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
        />
        <input
          type="text"
          value={currentColor}
          onChange={(e) => onChange(e.target.value)}
          className="studio-input"
          style={{ fontSize: '0.75rem', flex: 1 }}
        />
      </div>
    </div>
  );
};
