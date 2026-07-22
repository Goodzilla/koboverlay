import React, { useState, useRef, useEffect } from 'react';
import { Move, Maximize2, RotateCcw } from 'lucide-react';

export interface WidgetLayout {
  x: number;      // Position X in PX (0 to 1920)
  y: number;      // Position Y in PX (0 to 1080)
  width: number;  // Width in PX
  height: number; // Height in PX
  visible?: boolean;
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

  // Always auto-wrap dragbox around content natural size with zero dead space
  useEffect(() => {
    if (!innerContentRef.current) return;

    const updateNaturalBounds = () => {
      if (!innerContentRef.current) return;
      const scrollH = innerContentRef.current.scrollHeight;
      const scrollW = innerContentRef.current.scrollWidth;

      if (scrollH > 0 && scrollW > 0) {
        const newW = Math.max(100, Math.ceil(scrollW));
        const newH = Math.max(30, Math.ceil(scrollH));

        if (newW !== currentLayoutRef.current.width || newH !== currentLayoutRef.current.height) {
          const updated = {
            ...currentLayoutRef.current,
            width: newW,
            height: newH,
          };
          setCurrentLayout(updated);
          currentLayoutRef.current = updated;
          onLayoutChange(updated);
        }
      }
    };

    updateNaturalBounds();

    const observer = new ResizeObserver(() => {
      updateNaturalBounds();
    });

    observer.observe(innerContentRef.current);

    return () => {
      observer.disconnect();
    };
  }, [children, onLayoutChange]);

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

      const clampedX = Math.max(0, Math.min(1920 - currentLayoutRef.current.width, rawX));
      const clampedY = Math.max(0, Math.min(1080 - currentLayoutRef.current.height, rawY));

      const updated = {
        ...currentLayoutRef.current,
        x: clampedX,
        y: clampedY,
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

      const ratioW = rawW / startResizeRef.current.startW;
      const ratioH = rawH / startResizeRef.current.startH;
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
            minWidth: '200px',
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

      {/* Embedded Content Container - ALWAYS Auto-Wraps Content Bounds */}
      <div
        style={{
          width: `${currentLayout.width}px`,
          height: `${currentLayout.height}px`,
          outline: isEditable ? `1px ${isSelected || isDragging || isResizing ? 'solid #6366f1' : 'dashed #3f3f46'}` : 'none',
          borderRadius: isEditable ? '0 0 6px 6px' : '0',
          background: isEditable ? 'rgba(23, 17, 44, 0.4)' : 'transparent',
          position: 'relative',
          boxSizing: 'border-box',
          display: 'inline-block',
        }}
      >
        {/* Inner Content Wrapper */}
        <div
          ref={innerContentRef}
          style={{
            width: 'max-content',
            height: 'max-content',
            minWidth: '100%',
            pointerEvents: isEditable ? 'none' : 'auto',
          }}
        >
          {children}
        </div>

        {/* Studio Resize Corner Handle */}
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
            title="Click and drag to scale widget (fonts & media)"
          >
            <Maximize2 size={10} color="#ffffff" style={{ transform: 'rotate(90deg)' }} />
          </div>
        )}
      </div>
    </div>
  );
};
