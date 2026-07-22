import { WidgetInstance } from '../components/LayerTree';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/studio';

export const clampLayoutPosition = (x: number, y: number, width: number, height: number) => {
  const clampedX = Math.max(0, Math.min(CANVAS_WIDTH - width, x));
  const clampedY = Math.max(0, Math.min(CANVAS_HEIGHT - height, y));
  return { x: clampedX, y: clampedY };
};

export const centerWidgetInCanvas = (widget: WidgetInstance): { x: number; y: number } => {
  const centerX = Math.max(0, Math.round((CANVAS_WIDTH - widget.layout.width) / 2));
  const centerY = Math.max(0, Math.round((CANVAS_HEIGHT - widget.layout.height) / 2));
  return { x: centerX, y: centerY };
};

export const scaleWidgetConfig = (
  config: WidgetInstance['config'],
  type: WidgetInstance['type'],
  scaleRatio: number
): Partial<WidgetInstance['config']> => {
  const currentFontSize = config.fontSize || (type === 'subAlert' ? 18 : 14);
  const currentImageSize = config.imageSize || 80;

  const newFontSize = Math.max(10, Math.min(60, Math.round(currentFontSize * scaleRatio)));
  const newImageSize = Math.max(10, Math.min(600, Math.round(currentImageSize * scaleRatio)));

  return {
    fontSize: newFontSize,
    imageSize: newImageSize,
  };
};
