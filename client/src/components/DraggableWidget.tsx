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
      startX: currentLayoutRef.current.x,
      startY: currentLayoutRef.current.y,
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

    newX = Math.max(0, Math.min(1920 - Math.min(currentLayoutRef.current.width, 200), newX));
    newY = Math.max(0, Math.min(1080 - Math.min(currentLayoutRef.current.height, 60), newY));

    const updated = { ...currentLayoutRef.current, x: newX, y: newY };
    currentLayoutRef.current = updated;
    setCurrentLayout(updated);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);

    if (startDragRef.current) {
      startDragRef.current = null;
      onLayoutChange(currentLayoutRef.current);
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
      startW: currentLayoutRef.current.width,
      startH: currentLayoutRef.current.height,
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

    newW = Math.max(160, Math.min(1920 - currentLayoutRef.current.x, newW));
    newH = Math.max(60, Math.min(1080 - currentLayoutRef.current.y, newH));

    const updated = { ...currentLayoutRef.current, width: newW, height: newH };
    currentLayoutRef.current = updated;
    setCurrentLayout(updated);
  };

  const handleResizeMouseUp = () => {
    setIsResizing(false);
    window.removeEventListener('mousemove', handleResizeMouseMove);
    window.removeEventListener('mouseup', handleResizeMouseUp);

    if (startResizeRef.current) {
      startResizeRef.current = null;
      onLayoutChange(currentLayoutRef.current);
    }
  };

  const handleResetSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const resetLayout = {
      ...currentLayoutRef.current,
      width: defaultWidth,
      height: defaultHeight,
    };
    currentLayoutRef.current = resetLayout;
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
          {/* Label + Reset Button Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Move size={12} />
            <span>{label}</span>
            <button
              onClick={handleResetSize}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              title="Reset Size to Default PX"
            >
              <RotateCcw size={10} /> Reset Size
            </button>
          </div>

          {/* Coordinates Badge */}
          <div style={{ fontSize: '0.7rem', opacity: 0.95, fontFamily: 'var(--font-mono)' }}>
            X:{currentLayout.x}px Y:{currentLayout.y}px ({currentLayout.width}×{currentLayout.height}px)
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
