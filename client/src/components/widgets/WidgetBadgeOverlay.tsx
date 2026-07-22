import React from 'react';
import { EyeOff, VolumeX } from 'lucide-react';
import { WidgetLayout } from '../DraggableWidget';

interface WidgetBadgeOverlayProps {
  isEditable: boolean;
  layout: WidgetLayout;
  hasSound?: boolean;
}

export const WidgetBadgeOverlay: React.FC<WidgetBadgeOverlayProps> = ({
  isEditable,
  layout,
  hasSound = false,
}) => {
  const isHidden = layout.visible === false;
  const isMuted = hasSound && layout.muted === true;

  if (!isEditable || (!isHidden && !isMuted)) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '6px',
        right: '6px',
        display: 'flex',
        gap: '4px',
        pointerEvents: 'none',
      }}
    >
      {isHidden && (
        <div
          style={{
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            borderRadius: '4px',
            padding: '3px 5px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.6rem',
            fontWeight: 700,
            color: '#a1a1aa',
            border: '1px solid rgba(161,161,170,0.3)',
          }}
        >
          <EyeOff size={9} />
          <span>HIDDEN</span>
        </div>
      )}

      {isMuted && (
        <div
          style={{
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            borderRadius: '4px',
            padding: '3px 5px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.6rem',
            fontWeight: 700,
            color: '#f59e0b',
            border: '1px solid rgba(245,158,11,0.35)',
          }}
        >
          <VolumeX size={9} />
          <span>MUTED</span>
        </div>
      )}
    </div>
  );
};
