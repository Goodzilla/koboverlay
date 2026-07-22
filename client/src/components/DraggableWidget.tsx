import React, { useState, useRef, useEffect } from 'react';
import { Move, Maximize2, EyeOff, VolumeX } from 'lucide-react';

export interface WidgetLayout {
  x: number;      // Position X in PX (0 to 1920)
  y: number;      // Position Y in PX (0 to 1080)
  width: number;  // Width in PX
  height: number; // Height in PX
  visible?: boolean;
  muted?: boolean;
}

interface DraggableWidgetProps {
  id: string;
  label: string;
  layout: WidgetLayout;
  defaultWidth?: number;
  defaultHeight?: number;
  isEditable: boolean;
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
  defaultWidth = 380,
  defaultHeight = 100,
  isEditable,
  isSelected = false,
  gridSnap = false,
  hasSound = false,
  onSelect,
  onLayoutChange,
  onScaleChange,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<WidgetLayout>(layout);

  const containerRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const currentLayoutRef = useRef<WidgetLayout>(layout);
  const startDragRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
  const startResizeRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number } | null>(null);

  // Synchronize layout prop changes only when not actively dragging or resizing
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setCurrentLayout(layout);
      currentLayoutRef.current = layout;
    }
  }, [layout, isDragging, isResizing]);

  // Adjust container height to content natural height when children or properties update
  useEffect(() => {
    if (isResizing || isDragging || !innerContentRef.current) return;

    const scrollH = innerContentRef.current.scrollHeight;
    if (scrollH > 0 && scrollH !== currentLayoutRef.current.height) {
      const updated = {
        ...currentLayoutRef.current,
        height: Math.ceil(scrollH),
      };
      setCurrentLayout(updated);
      currentLayoutRef.current = updated;
      onLayoutChange(updated);
    }
  }, [children, isResizing, isDragging, onLayoutChange]);

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

      // Allow free position movement without rigid boundary blocking
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

      // Allow free width & height expansion/shrinking without rigid canvas edge blocking
      const minW = 60;
      const minH = 20;
      const clampedW = Math.max(minW, rawW);
      const clampedH = Math.max(minH, rawH);

      const updated = {
        ...currentLayoutRef.current,
        width: clampedW,
        height: clampedH,
      };

      setCurrentLayout(updated);
      currentLayoutRef.current = updated;

      // Scale font and media properties if callback provided
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '6px',
            background: isDragging || isResizing ? '#06b6d4' : isSelected ? '#6366f1' : '#27272a',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '6px 6px 0 0',
            fontSize: '0.7rem',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
            minWidth: '180px',
          }}
        >
          {/* Left: Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Move size={12} />
            <span>{label}</span>
          </div>

          {/* Right: Coordinates */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.7rem', opacity: 0.95, fontFamily: 'var(--font-mono)' }}>
              X:{currentLayout.x}px Y:{currentLayout.y}px ({currentLayout.width}×{currentLayout.height}px)
            </span>
          </div>
        </div>
      )}

      {/* Embedded Content Container */}
      <div
        style={{
          width: `${currentLayout.width}px`,
          height: `${currentLayout.height}px`,
          outline: isEditable ? `1px ${isSelected || isDragging || isResizing ? 'solid #6366f1' : 'dashed #3f3f46'}` : 'none',
          borderRadius: isEditable ? '0 0 6px 6px' : '0',
          background: isEditable ? 'rgba(23, 17, 44, 0.4)' : 'transparent',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden',
          // Subtle dimming when hidden or muted in edit mode
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

        {/* State Badge Overlay — shown in edit mode when hidden or muted (for widgets with sound) */}
        {isEditable && (currentLayout.visible === false || (hasSound && currentLayout.muted === true)) && (
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
            {currentLayout.visible === false && (
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
            {hasSound && currentLayout.muted === true && (
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
        )}
      </div>

      {/* Studio Resize Corner Handle — must be outside the overflow:hidden container */}
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
            cursor: 'se-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(6, 182, 212, 1)',
            zIndex: 150,
          }}
          title="Click and drag to resize width & height freely"
        >
          <Maximize2 size={10} color="#ffffff" style={{ transform: 'rotate(90deg)' }} />
        </div>
      )}
    </div>
  );
};
