import React from 'react';
import { WidgetInstance } from '../LayerTree';
import { WidgetLayout, DraggableWidget } from '../DraggableWidget';
import { SubGoalWidget } from '../SubGoalWidget';
import { SubAlertWidget, AlertData } from '../SubAlertWidget';
import { CustomImageWidget } from '../CustomImageWidget';
import { WIDGET_DEFAULT_DIMENSIONS } from '../../constants/widgets';

interface StudioCanvasProps {
  widgets: WidgetInstance[];
  selectedWidgetId: string | null;
  gridSnap: boolean;
  alertQueue: AlertData[];
  onSelectWidget: (id: string) => void;
  onLayoutChange: (id: string, layout: WidgetLayout) => void;
  onScaleWidget: (id: string, scaleRatio: number) => void;
  onAlertComplete: () => void;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  widgets,
  selectedWidgetId,
  gridSnap,
  alertQueue,
  onSelectWidget,
  onLayoutChange,
  onScaleWidget,
  onAlertComplete,
}) => {
  const currentAlert = alertQueue.length > 0 ? alertQueue[0] : null;

  return (
    <main
      className="canvas-viewport-bg"
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className={`canvas-workspace-bg ${gridSnap ? 'canvas-grid-lines' : ''}`}
        style={{
          width: '100%',
          maxHeight: '100%',
          aspectRatio: '16 / 9',
          borderRadius: '8px',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Dynamic Widget Renderer */}
        {widgets.map((widget) => {
          const dim = WIDGET_DEFAULT_DIMENSIONS[widget.type] || { width: 360, height: 68 };

          const previewAlert: AlertData = {
            id: `preview_${widget.id}`,
            type: 'sub',
            username: 'DemoGamer',
            tier: '1000',
            durationMs: 999999,
          };

          const activeAlertData = currentAlert || previewAlert;

          return (
            <DraggableWidget
              key={widget.id}
              id={widget.id}
              label={widget.label}
              layout={widget.layout}
              defaultWidth={dim.width}
              defaultHeight={dim.height}
              isEditable={true}
              isSelected={selectedWidgetId === widget.id}
              gridSnap={gridSnap}
              hasSound={widget.type === 'subAlert'}
              onSelect={() => onSelectWidget(widget.id)}
              onLayoutChange={(newLayout) => onLayoutChange(widget.id, newLayout)}
              onScaleChange={(scaleRatio) => onScaleWidget(widget.id, scaleRatio)}
            >
              {widget.type === 'subGoal' && (
                <SubGoalWidget
                  title={widget.config.title || 'Sub Goal'}
                  currentSubs={widget.config.currentSubs || 0}
                  targetSubs={widget.config.targetSubs || 50}
                  primaryColor={widget.config.primaryColor || '#6366f1'}
                  backgroundColor={widget.config.backgroundColor || '#18181b'}
                  textColor={widget.config.textColor}
                  fontSize={widget.config.fontSize}
                  borderRadius={widget.config.borderRadius}
                  imageUrl={widget.config.imageUrl}
                  showProgressBar={widget.config.showProgressBar}
                  progressBarBgColor={widget.config.progressBarBgColor}
                  progressBarHeight={widget.config.progressBarHeight}
                  showPercentage={widget.config.showPercentage}
                />
              )}

              {widget.type === 'subAlert' && (
                <SubAlertWidget
                  alert={{
                    ...activeAlertData,
                    primaryColor: widget.config.primaryColor || activeAlertData.primaryColor || '#38bdf8',
                    backgroundColor: widget.config.backgroundColor || '#18181b',
                    textColor: widget.config.textColor,
                    fontSize: widget.config.fontSize,
                    borderRadius: widget.config.borderRadius,
                    imageUrl: widget.config.imageUrl,
                    imageSize: widget.config.imageSize,
                    soundUrl: widget.config.soundUrl,
                    soundVolume: widget.config.soundVolume,
                    customTextTemplate: widget.config.customTextTemplate,
                  }}
                  muted={widget.layout.muted === true}
                  onAnimationComplete={currentAlert ? onAlertComplete : undefined}
                />
              )}

              {widget.type === 'customImage' && (
                <CustomImageWidget
                  imageUrl={widget.config.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'}
                  imageSize={widget.config.imageSize}
                  altText={widget.label}
                  backgroundColor={widget.config.backgroundColor}
                  borderRadius={widget.config.borderRadius}
                />
              )}
            </DraggableWidget>
          );
        })}

        {/* Viewport Specs Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: '#52525b',
            fontFamily: 'var(--font-mono)',
            pointerEvents: 'none',
          }}
        >
          1920×1080 CANVAS • CTRL+Z UNDO READY
        </div>
      </div>
    </main>
  );
};
