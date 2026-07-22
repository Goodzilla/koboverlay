import React, { useState, useRef, useEffect } from 'react';
import { Move } from 'lucide-react';

export interface WidgetPosition {
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
}

interface DraggableWidgetProps {
  id: string;
  label: string;
  position: WidgetPosition;
  isEditable: boolean;
  onPositionChange: (newPos: WidgetPosition) => void;
  children: React.ReactNode;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  label,
  position,
  isEditable,
  onPositionChange,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState<WidgetPosition>(position);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);

  useEffect(() => {
    setDragPos(position);
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    setIsDragging(true);

    startPosRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: dragPos.x,
      startY: dragPos.y,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!startPosRef.current || !containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const deltaX = e.clientX - startPosRef.current.mouseX;
    const deltaY = e.clientY - startPosRef.current.mouseY;

    const deltaXPercent = (deltaX / parentRect.width) * 100;
    const deltaYPercent = (deltaY / parentRect.height) * 100;

    let newX = Math.max(0, Math.min(85, startPosRef.current.startX + deltaXPercent));
    let newY = Math.max(0, Math.min(85, startPosRef.current.startY + deltaYPercent));

    newX = Math.round(newX * 10) / 10;
    newY = Math.round(newY * 10) / 10;

    setDragPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);

    if (startPosRef.current) {
      onPositionChange(dragPos);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: `${dragPos.x}%`,
        top: `${dragPos.y}%`,
        cursor: isEditable ? (isDragging ? 'grabbing' : 'grab') : 'default',
        transition: isDragging ? 'none' : 'left 0.3s ease, top 0.3s ease',
        zIndex: isDragging ? 100 : 10,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Interactive Edit Overlay Header */}
      {isEditable && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            background: 'rgba(124, 58, 237, 0.9)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '8px 8px 0 0',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Move size={12} />
            <span>{label}</span>
          </div>
          <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>
            X:{dragPos.x}% Y:{dragPos.y}%
          </span>
        </div>
      )}

      {/* Embedded Widget */}
      <div
        style={{
          border: isEditable ? `2px dashed ${isDragging ? '#06b6d4' : '#a855f7'}` : 'none',
          borderRadius: isEditable ? '0 0 12px 12px' : '0',
          padding: isEditable ? '4px' : '0',
          background: isEditable ? 'rgba(23, 17, 44, 0.4)' : 'transparent',
        }}
      >
        {children}
      </div>
    </div>
  );
};
