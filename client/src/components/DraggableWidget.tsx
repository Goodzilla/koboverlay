import React, { useState, useRef, useEffect } from 'react';
import { Move, Scaling } from 'lucide-react';
import { WidgetBadgeOverlay } from './widgets/WidgetBadgeOverlay';

export interface WidgetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  visible?: boolean;
  muted?: boolean;
}

interface DraggableWidgetProps {
  id: string;
  label: string;
  layout: WidgetLayout;
  defaultWidth?: number;
  defaultHeight?: number;
  isEditable?: boolean;
  isSelected?: boolean;
  gridSnap?: boolean;
  hasSound?: boolean;
  onSelect?: () => void;
  onLayoutChange: (newLayout: WidgetLayout) => void;
  onScaleChange?: (scaleRatio: number) => void;
  children: React.ReactNode;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  label,
  layout,
  defaultWidth = 360,
  defaultHeight = 68,
  isEditable = false,
  isSelected = false,
  gridSnap = false,
  hasSound = false,
  onSelect,
  onLayoutChange,
  onScaleChange,
  children,
}) => {
  const [currentLayout, setCurrentLayout] = useState<WidgetLayout>(() => ({
    x: layout.x ?? 720,
    y: layout.y ?? 40,
    width: layout.width ?? defaultWidth,
    height: layout.height ?? defaultHeight,
    visible: layout.visible ?? true,
    muted: layout.muted ?? false,
  }));

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const startDragRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
  const startResizeRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number } | null>(null);
  const currentLayoutRef = useRef<WidgetLayout>(currentLayout);

  useEffect(() => {
    setCurrentLayout({
      x: layout.x ?? 720,
      y: layout.y ?? 40,
      width: layout.width ?? defaultWidth,
      height: layout.height ?? defaultHeight,
      visible: layout.visible ?? true,
      muted: layout.muted ?? false,
    });
    currentLayoutRef.current = layout;
  }, [layout, defaultWidth, defaultHeight]);

  const snapValue = (val: number, step = 20) => {
    return Math.round(val / step) * step;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable) return;
    e.stopPropagation();

    if (onSelect) onSelect();

    setIsDragging(true);
    startDragRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: currentLayout.x,
      startY: currentLayout.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!startDragRef.current) return;
      const deltaX = moveEvent.clientX - startDragRef.current.mouseX;
      const deltaY = moveEvent.clientY - startDragRef.current.mouseY;

      let rawX = startDragRef.current.startX + deltaX;
      let rawY = startDragRef.current.startY + deltaY;

      if (gridSnap) {
        rawX = snapValue(rawX, 20);
        rawY = snapValue(rawY, 20);
      }

      const updated = {
        ...currentLayoutRef.current,
        x: rawX,
        y: rawY,
      };

      setCurrentLayout(updated);
      currentLayoutRef.current = updated;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      startDragRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      onLayoutChange(currentLayoutRef.current);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!isEditable) return;
    e.stopPropagation();

    setIsResizing(true);
    startResizeRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: currentLayout.width,
      startH: currentLayout.height,
    };

    const handleResizeMouseMove = (moveEvent: MouseEvent) => {
      if (!startResizeRef.current) return;
      const deltaX = moveEvent.clientX - startResizeRef.current.mouseX;
      const deltaY = moveEvent.clientY - startResizeRef.current.mouseY;

      let rawW = startResizeRef.current.startW + deltaX;
      let rawH = startResizeRef.current.startH + deltaY;

      if (gridSnap) {
        rawW = snapValue(rawW, 20);
        rawH = snapValue(rawH, 20);
      }

      const minW = 180;
      const minH = 44;
      const clampedW = Math.max(minW, rawW);
      const clampedH = Math.max(minH, rawH);

      const updated = {
        ...currentLayoutRef.current,
        width: clampedW,
        height: clampedH,
      };

      setCurrentLayout(updated);
      currentLayoutRef.current = updated;

      const ratioW = clampedW / startResizeRef.current.startW;
      const ratioH = clampedH / startResizeRef.current.startH;
      const scaleRatio = (ratioW + ratioH) / 2;

      if (onScaleChange && Math.abs(scaleRatio - 1.0) > 0.02) {
        onScaleChange(scaleRatio);
      }
    };

    const handleResizeMouseUp = () => {
      setIsResizing(false);
      startResizeRef.current = null;
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
      onLayoutChange(currentLayoutRef.current);
    };

    window.addEventListener('mousemove', handleResizeMouseMove);
    window.addEventListener('mouseup', handleResizeMouseUp);
  };

  const leftPercent = (currentLayout.x / 1920) * 100;
  const topPercent = (currentLayout.y / 1080) * 100;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        width: `${currentLayout.width}px`,
        cursor: isEditable ? (isDragging ? 'grabbing' : 'grab') : 'default',
        transition: isDragging || isResizing ? 'none' : 'all 0.12s ease',
        zIndex: isSelected || isDragging || isResizing ? 100 : 10,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Clean Studio Edit Header Badge */}
      {isEditable && (
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            background: isDragging || isResizing ? '#06b6d4' : isSelected ? '#6366f1' : '#27272a',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '6px 6px 0 0',
            fontSize: '0.7rem',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Left: Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Move size={12} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
          </div>

          {/* Right: Coordinates */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <span style={{ fontSize: '0.68rem', opacity: 0.95, fontFamily: 'var(--font-mono)' }}>
              X:{currentLayout.x} Y:{currentLayout.y} ({currentLayout.width}×{currentLayout.height})
            </span>
          </div>
        </div>
      )}

      {/* Embedded Content Container */}
      <div
        style={{
          width: '100%',
          height: `${currentLayout.height}px`,
          outline: isEditable ? `1px ${isSelected || isDragging || isResizing ? 'solid #6366f1' : 'dashed #3f3f46'}` : 'none',
          borderRadius: isEditable ? '0 0 6px 6px' : '0',
          background: isEditable ? 'rgba(23, 17, 44, 0.4)' : 'transparent',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden',
          opacity: isEditable && currentLayout.visible === false ? 0.35 : 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        {/* Inner Content Wrapper */}
        <div
          ref={innerContentRef}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: isEditable ? 'none' : 'auto',
          }}
        >
          {children}
        </div>

        {/* State Badge Overlay — shown in edit mode when hidden or muted */}
        <WidgetBadgeOverlay isEditable={isEditable} layout={currentLayout} hasSound={hasSound} />
      </div>

      {/* Studio Resize Corner Handle — anchored to exact bottom-right of the widget box */}
      {isEditable && (isSelected || isResizing) && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: 'absolute',
            right: '-6px',
            bottom: '-6px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            border: '2px solid #ffffff',
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.8)',
            cursor: 'nwse-resize',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}
          title="Drag to resize widget box"
        >
          <Scaling size={12} />
        </div>
      )}
    </div>
  );
};
