import React, { useState, useRef, useEffect } from 'react';
import { Move, Maximize2, RotateCcw } from 'lucide-react';

export interface WidgetLayout {
  x: number;      // Position X in PX (0 to 1920)
  y: number;      // Position Y in PX (0 to 1080)
  width: number;  // Width in PX
  height: number; // Height in PX
}

interface DraggableWidgetProps {
  id: string;
  label: string;
  layout: WidgetLayout;
  defaultWidth?: number;
  defaultHeight?: number;
  isEditable: boolean;
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
  onLayoutChange,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<WidgetLayout>(layout);

  const containerRef = useRef<HTMLDivElement>(null);
  const startDragRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
  const startResizeRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number } | null>(null);

  useEffect(() => {
    setCurrentLayout(layout);
  }, [layout]);

  // --- DRAG HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable || isResizing) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    startDragRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: currentLayout.x,
      startY: currentLayout.y,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!startDragRef.current || !containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const scaleX = 1920 / parentRect.width;
    const scaleY = 1080 / parentRect.height;

    const deltaX = (e.clientX - startDragRef.current.mouseX) * scaleX;
    const deltaY = (e.clientY - startDragRef.current.mouseY) * scaleY;

    let newX = Math.round(startDragRef.current.startX + deltaX);
    let newY = Math.round(startDragRef.current.startY + deltaY);

    newX = Math.max(0, Math.min(1920 - currentLayout.width, newX));
    newY = Math.max(0, Math.min(1080 - currentLayout.height, newY));

    setCurrentLayout((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);

    if (startDragRef.current) {
      onLayoutChange(currentLayout);
    }
  };

  // --- RESIZE HANDLERS ---
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    startResizeRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: currentLayout.width,
      startH: currentLayout.height,
    };

    window.addEventListener('mousemove', handleResizeMouseMove);
    window.addEventListener('mouseup', handleResizeMouseUp);
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!startResizeRef.current || !containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const scaleX = 1920 / parentRect.width;
    const scaleY = 1080 / parentRect.height;

    const deltaX = (e.clientX - startResizeRef.current.mouseX) * scaleX;
    const deltaY = (e.clientY - startResizeRef.current.mouseY) * scaleY;

    let newW = Math.round(startResizeRef.current.startW + deltaX);
    let newH = Math.round(startResizeRef.current.startH + deltaY);

    newW = Math.max(160, Math.min(1600, newW));
    newH = Math.max(60, Math.min(1000, newH));

    setCurrentLayout((prev) => ({ ...prev, width: newW, height: newH }));
  };

  const handleResizeMouseUp = () => {
    setIsResizing(false);
    window.removeEventListener('mousemove', handleResizeMouseMove);
    window.removeEventListener('mouseup', handleResizeMouseUp);

    if (startResizeRef.current) {
      onLayoutChange(currentLayout);
    }
  };

  const handleResetSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const resetLayout = {
      ...currentLayout,
      width: defaultWidth,
      height: defaultHeight,
    };
    setCurrentLayout(resetLayout);
    onLayoutChange(resetLayout);
  };

  // Scale calculations for stretching/shrinking content cleanly
  const scaleX = currentLayout.width / defaultWidth;
  const scaleY = currentLayout.height / defaultHeight;

  // Convert 1920x1080 PX values to percentage left/top/width/height for responsive canvas rendering
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
        transition: isDragging || isResizing ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: isDragging || isResizing ? 100 : 10,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Interactive Edit Header */}
      {isEditable && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            background: isDragging || isResizing ? '#06b6d4' : 'rgba(124, 58, 237, 0.95)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '8px 8px 0 0',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Move size={12} />
            <span>{label}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Exact Pixel Coordinates Badge */}
            <span style={{ fontSize: '0.7rem', opacity: 0.9, fontFamily: 'monospace' }}>
              X:{currentLayout.x}px Y:{currentLayout.y}px | {currentLayout.width}px × {currentLayout.height}px
            </span>

            {/* Per-Widget Reset Size Button */}
            <button
              onClick={handleResetSize}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              title="Reset Widget Size to Default PX"
            >
              <RotateCcw size={10} /> Reset Size
            </button>
          </div>
        </div>
      )}

      {/* Embedded Content Container with Dynamic Scaling */}
      <div
        style={{
          width: `${currentLayout.width}px`,
          height: `${currentLayout.height}px`,
          border: isEditable ? `2px dashed ${isDragging || isResizing ? '#06b6d4' : '#a855f7'}` : 'none',
          borderRadius: isEditable ? '0 0 12px 12px' : '0',
          background: isEditable ? 'rgba(23, 17, 44, 0.4)' : 'transparent',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Scaled Children Wrapper */}
        <div
          style={{
            width: `${defaultWidth}px`,
            height: `${defaultHeight}px`,
            transform: `scale(${scaleX}, ${scaleY})`,
            transformOrigin: 'top left',
            pointerEvents: isEditable ? 'none' : 'auto',
          }}
        >
          {children}
        </div>

        {/* Resizable Drag Handle */}
        {isEditable && (
          <div
            onMouseDown={handleResizeMouseDown}
            style={{
              position: 'absolute',
              right: '2px',
              bottom: '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#06b6d4',
              border: '2px solid #ffffff',
              cursor: 'se-resize',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.9)',
              zIndex: 120,
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
