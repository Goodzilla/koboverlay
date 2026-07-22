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
  const startDragRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
  const startResizeRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number } | null>(null);

  useEffect(() => {
    setCurrentLayout(layout);
  }, [layout]);

  if (layout.visible === false) {
    return null;
  }

  const snapToGrid = (val: number, gridSize = 10) => {
    return gridSnap ? Math.round(val / gridSize) * gridSize : val;
  };

  // --- DRAG HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (onSelect) onSelect();
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

    let newX = snapToGrid(Math.round(startDragRef.current.startX + deltaX));
    let newY = snapToGrid(Math.round(startDragRef.current.startY + deltaY));

    newX = Math.max(0, Math.min(1920 - Math.min(currentLayout.width, 200), newX));
    newY = Math.max(0, Math.min(1080 - Math.min(currentLayout.height, 60), newY));

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

    let newW = snapToGrid(Math.round(startResizeRef.current.startW + deltaX));
    let newH = snapToGrid(Math.round(startResizeRef.current.startH + deltaY));

    newW = Math.max(160, Math.min(1920 - currentLayout.x, newW));
    newH = Math.max(60, Math.min(1080 - currentLayout.y, newH));

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

  const scaleX = currentLayout.width / defaultWidth;
  const scaleY = currentLayout.height / defaultHeight;

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
            gap: '8px',
            background: isSelected ? '#6366f1' : '#27272a',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '6px 6px 0 0',
            fontSize: '0.7rem',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Move size={11} />
            <span>{label}</span>
            <button
              onClick={handleResetSize}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '1px 5px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.65rem',
                cursor: 'pointer',
              }}
              title="Reset Size"
            >
              <RotateCcw size={9} /> Reset
            </button>
          </div>

          <span style={{ fontSize: '0.65rem', opacity: 0.85, fontFamily: 'var(--font-mono)' }}>
            {currentLayout.x},{currentLayout.y} ({currentLayout.width}×{currentLayout.height})
          </span>
        </div>
      )}

      {/* Content Container */}
      <div
        style={{
          width: `${currentLayout.width}px`,
          height: `${currentLayout.height}px`,
          outline: isEditable ? `1px ${isSelected ? 'solid #6366f1' : 'dashed #3f3f46'}` : 'none',
          borderRadius: isEditable ? '0 0 6px 6px' : '0',
          position: 'relative',
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

        {/* Studio Resize Corner Handle */}
        {isEditable && isSelected && (
          <div
            onMouseDown={handleResizeMouseDown}
            style={{
              position: 'absolute',
              right: '-4px',
              bottom: '-4px',
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              background: '#6366f1',
              border: '1px solid #ffffff',
              cursor: 'se-resize',
              zIndex: 150,
            }}
            title="Drag to resize"
          />
        )}
      </div>
    </div>
  );
};
