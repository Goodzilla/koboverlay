import React from 'react';

interface InspectorSectionProps {
  title: string;
  icon: React.ReactNode;
  titleColor?: string;
  children: React.ReactNode;
}

export const InspectorSection: React.FC<InspectorSectionProps> = ({
  title,
  icon,
  titleColor = '#ffffff',
  children,
}) => {
  return (
    <div
      style={{
        background: '#16161a',
        border: '1px solid #27272a',
        borderRadius: '10px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: titleColor,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderBottom: '1px solid #27272a',
          paddingBottom: '8px',
        }}
      >
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
};
