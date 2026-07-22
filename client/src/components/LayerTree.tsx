import React, { useState } from 'react';
import { Layers, Plus } from 'lucide-react';
import { WidgetLayout } from './DraggableWidget';
import { LayerItem } from './studio/LayerItem';

export interface WidgetInstance {
  id: string;
  type: 'subGoal' | 'subAlert' | 'customImage';
  label: string;
  layout: WidgetLayout;
  config: {
    title?: string;
    imageUrl?: string;
    imageSize?: number;
    soundUrl?: string;
    soundVolume?: number;
    previousVolume?: number;
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    borderRadius?: number;
    currentSubs?: number;
    targetSubs?: number;
    alertDuration?: number;
    customTextTemplate?: string;
    showProgressBar?: boolean;
    progressBarBgColor?: string;
    progressBarHeight?: number;
    showPercentage?: boolean;
    triggerEventType?: 'all' | 'sub' | 'resub' | 'subgift' | 'bits' | 'raid';
    triggerMinAmount?: number;
    triggerMinMonths?: number;
    triggerTier?: 'all' | 'Prime' | '1000' | '2000' | '3000';
  };
}

interface WidgetTreeProps {
  widgets: WidgetInstance[];
  selectedWidgetId: string | null;
  onSelectWidget: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleMute: (id: string) => void;
  onDuplicateWidget: (id: string) => void;
  onDeleteWidget: (id: string) => void;
  onCenterWidget: (id: string) => void;
  onResetWidgetSize?: (id: string) => void;
  onUpdateWidgetConfig: (id: string, newConfig: Partial<WidgetInstance['config']>, newLabel?: string) => void;
  onOpenAddModal: () => void;
}

export const LayerTree: React.FC<WidgetTreeProps> = ({
  widgets,
  selectedWidgetId,
  onSelectWidget,
  onToggleVisibility,
  onToggleMute,
  onDuplicateWidget,
  onDeleteWidget,
  onCenterWidget,
  onUpdateWidgetConfig,
  onOpenAddModal,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(selectedWidgetId);

  const toggleAccordion = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      onSelectWidget(id);
      setExpandedId(id);
    }
  };

  const handlePlaySoundPreview = (url?: string, volume = 80) => {
    if (!url) return;
    try {
      const audio = new Audio(url);
      audio.volume = volume / 100;
      audio.play().catch((err) => console.log('Audio preview blocked:', err));
    } catch (e) {
      console.error('Audio preview error:', e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Sidebar Header & Add Widget Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>
          <Layers size={14} color="#6366f1" />
          <span>Canvas Widgets ({widgets.length})</span>
        </div>

        <button className="studio-btn studio-btn-primary" onClick={onOpenAddModal} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
          <Plus size={13} /> Add Widget
        </button>
      </div>

      {/* Accordion Widget List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {widgets.map((widget) => {
          const isSelected = selectedWidgetId === widget.id;
          const isExpanded = expandedId === widget.id;

          return (
            <LayerItem
              key={widget.id}
              widget={widget}
              isSelected={isSelected}
              isExpanded={isExpanded}
              onSelect={() => onSelectWidget(widget.id)}
              onToggleExpand={() => toggleAccordion(widget.id)}
              onToggleVisibility={onToggleVisibility}
              onToggleMute={onToggleMute}
              onDuplicateWidget={onDuplicateWidget}
              onDeleteWidget={onDeleteWidget}
              onCenterWidget={onCenterWidget}
              onUpdateWidgetConfig={onUpdateWidgetConfig}
              onPlaySoundPreview={handlePlaySoundPreview}
            />
          );
        })}
      </div>
    </div>
  );
};
