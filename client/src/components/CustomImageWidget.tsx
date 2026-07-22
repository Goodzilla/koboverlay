import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface CustomImageWidgetProps {
  imageUrl?: string;
  altText?: string;
  backgroundColor?: string;
  borderRadius?: number;
}

export const CustomImageWidget: React.FC<CustomImageWidgetProps> = ({
  imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
  altText = 'Sponsor Logo',
  backgroundColor = 'transparent',
  borderRadius = 8,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        boxSizing: 'border-box',
      }}
    >
      {imageUrl && !hasError ? (
        <img
          src={imageUrl}
          alt={altText}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            borderRadius: `${borderRadius}px`,
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: backgroundColor === 'transparent' ? '#18181b' : backgroundColor,
            border: '1px dashed #3f3f46',
            borderRadius: `${borderRadius}px`,
            color: '#a1a1aa',
            gap: '6px',
            padding: '12px',
          }}
        >
          <ImageIcon size={24} color="#6366f1" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{altText || 'Custom Image'}</span>
        </div>
      )}
    </div>
  );
};
