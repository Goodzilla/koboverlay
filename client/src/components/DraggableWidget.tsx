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

  // Auto-expand drag bounding box to encapsulate content natural height/width if content grows
  useEffect(() => {
    if (innerContentRef.current) {
      const naturalHeight = innerContentRef.current.scrollHeight;
      const naturalWidth = innerContentRef.current.scrollWidth;

      let needsUpdate = false;
      let newW = currentLayout.width;
      let newH = currentLayout.height;

      if (naturalHeight > currentLayout.height) {
        newH = Math.ceil(naturalHeight);
        needsUpdate = true;
      }

      if (needsUpdate) {
        const updated = { ...currentLayout, width: newW, height: newH };
        setCurrentLayout(updated);
        currentLayoutRef.current = updated;
        onLayoutChange(updated);
      }
    }
  }, [children, layout.width, layout.height, onLayoutChange]);

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

      const minW = 120;
      const minH = 40;
      const clampedW = Math.max(minW, Math.min(1920 - currentLayoutRef.current.x, rawW));
      const clampedH = Math.max(minH, Math.min(1080 - currentLayoutRef.current.y, rawH));

      const updated = {
        ...currentLayoutRef.current,
        width: clampedW,
        height: clampedH,
      };

      setCurrentLayout(updated);
      currentLayoutRef.current = updated;
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

  const handleResetSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    let resetH = defaultHeight;
    if (innerContentRef.current) {
      resetH = Math.max(defaultHeight, innerContentRef.current.scrollHeight);
    }
    const updated = {
      ...currentLayout,
      width: defaultWidth,
      height: resetH,
    };
    setCurrentLayout(updated);
    currentLayoutRef.current = updated;
    onLayoutChange(updated);
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
        transition: isDragging || isResizing ? 'none' : 'all 0.15s ease',
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
            minWidth: '220px',
          }}
        >
          {/* Left: Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Move size={12} />
            <span>{label}</span>
          </div>

          {/* Right: Coordinates + Icon-only Reset Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.7rem', opacity: 0.95, fontFamily: 'var(--font-mono)' }}>
              X:{currentLayout.x}px Y:{currentLayout.y}px ({currentLayout.width}×{currentLayout.height}px)
            </span>

            <button
              className="reset-size-btn"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleResetSize}
              title="Reset Widget Size to Default PX"
            >
              <RotateCcw size={13} />
            </button>
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
          overflow: 'visible',
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

        {/* Studio Resize Corner Handle */}
        {isEditable && (isSelected || isResizing) && (
          <div
            onMouseDown={handleResizeMouseDown}
            style={{
              position: 'absolute',
              right: '4px',
              bottom: '4px',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              border: '2px solid #ffffff',
              cursor: 'se-resize',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(6, 182, 212, 1)',
              zIndex: 150,
            }}
            title="Click and drag to resize width & height (in PX)"
          >
            <Maximize2 size={11} color="#ffffff" style={{ transform: 'rotate(90deg)' }} />
          </div>
        )}
      </div>
    </div>
  );
};
