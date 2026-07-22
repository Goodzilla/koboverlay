import { useState, useCallback } from 'react';
import { WidgetInstance } from '../components/LayerTree';
import { WidgetLayout } from '../components/DraggableWidget';
import { DEFAULT_STUDIO_STATE } from '../constants/studio';
import { WIDGET_DEFAULT_DIMENSIONS } from '../constants/widgets';
import { centerWidgetInCanvas, scaleWidgetConfig } from '../utils/layoutMath';
import { useHistory } from '../utils/useHistory';

export function useStudioState() {
  const { state, set: setStudioState, undo, redo, canUndo, canRedo } = useHistory(DEFAULT_STUDIO_STATE);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>('subGoal_default');

  const handleAddWidget = useCallback((type: 'subGoal' | 'subAlert' | 'customImage') => {
    const dim = WIDGET_DEFAULT_DIMENSIONS[type] || { width: 360, height: 68 };
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newId = `${type}_${randomSuffix}`;
    const defaultLabel = type === 'subGoal' ? 'Sub Goal' : type === 'subAlert' ? 'Sub Alert' : 'Custom Image';

    const newWidget: WidgetInstance = {
      id: newId,
      type,
      label: defaultLabel,
      layout: { x: 800, y: 300, width: dim.width, height: dim.height, visible: true },
      config: {
        title: defaultLabel,
        primaryColor: type === 'subAlert' ? '#38bdf8' : '#6366f1',
        imageUrl: type === 'customImage' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' : undefined,
        currentSubs: type === 'subGoal' ? 14 : undefined,
        targetSubs: type === 'subGoal' ? 50 : undefined,
      },
    };

    setStudioState((prev) => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }));
    setSelectedWidgetId(newId);
  }, [setStudioState]);

  const handleDuplicateWidget = useCallback((id: string) => {
    const target = state.widgets.find((w) => w.id === id);
    if (!target) return;

    const dupId = `${target.type}_${Math.random().toString(36).substring(2, 7)}`;
    const duplicate: WidgetInstance = {
      ...target,
      id: dupId,
      label: `${target.label} (Copy)`,
      layout: {
        ...target.layout,
        x: Math.min(1800, target.layout.x + 30),
        y: Math.min(1000, target.layout.y + 30),
      },
    };

    setStudioState((prev) => ({
      ...prev,
      widgets: [...prev.widgets, duplicate],
    }));
    setSelectedWidgetId(dupId);
  }, [state.widgets, setStudioState]);

  const handleDeleteWidget = useCallback((id: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== id),
    }));

    if (selectedWidgetId === id) {
      setSelectedWidgetId(null);
    }
  }, [selectedWidgetId, setStudioState]);

  const handleToggleVisibility = useCallback((id: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          layout: {
            ...w.layout,
            visible: w.layout.visible === false ? true : false,
          },
        };
      }),
    }));
  }, [setStudioState]);

  const handleToggleMute = useCallback((id: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          layout: {
            ...w.layout,
            muted: w.layout.muted === true ? false : true,
          },
        };
      }),
    }));
  }, [setStudioState]);

  const handleLayoutChange = useCallback((id: string, newLayout: WidgetLayout) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === id ? { ...w, layout: newLayout } : w)),
    }));
  }, [setStudioState]);

  const handleResetWidgetSize = useCallback((id: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        const dim = WIDGET_DEFAULT_DIMENSIONS[w.type] || { width: 360, height: 68 };
        return {
          ...w,
          layout: { ...w.layout, width: dim.width, height: dim.height },
        };
      }),
    }));
  }, [setStudioState]);

  const handleUpdateWidgetConfig = useCallback((id: string, newConfig: Partial<WidgetInstance['config']>, newLabel?: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          label: newLabel !== undefined ? newLabel : w.label,
          config: { ...w.config, ...newConfig },
        };
      }),
    }));
  }, [setStudioState]);

  const handleCenterWidget = useCallback((id: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        const centerPos = centerWidgetInCanvas(w);
        return {
          ...w,
          layout: { ...w.layout, x: centerPos.x, y: centerPos.y },
        };
      }),
    }));
  }, [setStudioState]);

  const handleScaleWidget = useCallback((id: string, scaleRatio: number) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        const scaledConfig = scaleWidgetConfig(w.config, w.type, scaleRatio);
        return {
          ...w,
          config: { ...w.config, ...scaledConfig },
        };
      }),
    }));
  }, [setStudioState]);

  const handleResetAllLayouts = useCallback(() => {
    setStudioState(DEFAULT_STUDIO_STATE);
    setSelectedWidgetId('subGoal_default');
  }, [setStudioState]);

  return {
    state,
    setStudioState,
    selectedWidgetId,
    setSelectedWidgetId,
    undo,
    redo,
    canUndo,
    canRedo,
    handleAddWidget,
    handleDuplicateWidget,
    handleDeleteWidget,
    handleToggleVisibility,
    handleToggleMute,
    handleLayoutChange,
    handleResetWidgetSize,
    handleUpdateWidgetConfig,
    handleCenterWidget,
    handleScaleWidget,
    handleResetAllLayouts,
  };
}
