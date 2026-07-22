import React from 'react';
import {
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronRight,
  Copy,
  Crosshair,
  Trash2,
  Target,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { WidgetInstance } from '../LayerTree';
import { SubGoalInspector } from './inspectors/SubGoalInspector';
import { SubAlertInspector } from './inspectors/SubAlertInspector';
import { CustomImageInspector } from './inspectors/CustomImageInspector';

interface LayerItemProps {
  widget: WidgetInstance;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  onToggleVisibility: (id: string) => void;
  onToggleMute: (id: string) => void;
  onDuplicateWidget: (id: string) => void;
  onDeleteWidget: (id: string) => void;
  onCenterWidget: (id: string) => void;
  onUpdateWidgetConfig: (id: string, newConfig: Partial<WidgetInstance['config']>, newLabel?: string) => void;
  onPlaySoundPreview: (url?: string, volume?: number) => void;
}

export const LayerItem: React.FC<LayerItemProps> = ({
  widget,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  onToggleVisibility,
  onToggleMute,
  onDuplicateWidget,
  onDeleteWidget,
  onCenterWidget,
  onUpdateWidgetConfig,
  onPlaySoundPreview,
}) => {
  const isVisible = widget.layout.visible !== false;
  const isMuted = widget.layout.muted === true;

  const getWidgetIcon = (type: WidgetInstance['type']) => {
    if (type === 'subGoal') return <Target size={14} color="#6366f1" />;
    if (type === 'subAlert') return <Sparkles size={14} color="#38bdf8" />;
    return <ImageIcon size={14} color="#10b981" />;
  };

  const handleFileUpload = (widgetId: string, e: React.ChangeEvent<HTMLInputElement>, isAudio = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (isAudio) {
          onUpdateWidgetConfig(widgetId, { soundUrl: base64Url });
        } else {
          onUpdateWidgetConfig(widgetId, { imageUrl: base64Url });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        borderRadius: '8px',
        background: isSelected ? 'rgba(99, 102, 241, 0.08)' : '#18181b',
        border: `1px solid ${isSelected ? '#6366f1' : '#27272a'}`,
        overflow: 'hidden',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Accordion Item Header */}
      <div
        onClick={onToggleExpand}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          cursor: 'pointer',
          userSelect: 'none',
          color: isVisible ? '#ffffff' : '#71717a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          {getWidgetIcon(widget.type)}
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {widget.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Eye Visibility Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(widget.id);
            }}
            style={{
              background: isVisible ? 'none' : 'rgba(239,68,68,0.15)',
              border: isVisible ? 'none' : '1px solid rgba(239,68,68,0.4)',
              borderRadius: '4px',
              color: isVisible ? '#52525b' : '#ef4444',
              cursor: 'pointer',
              padding: '3px',
              display: 'flex',
              transition: 'all 0.15s ease',
            }}
            title={isVisible ? 'Hide widget on overlay' : 'Show widget on overlay'}
          >
            {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>

          {/* Mute Sound Toggle — only for widgets supporting sound */}
          {widget.type === 'subAlert' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute(widget.id);
              }}
              style={{
                background: isMuted ? 'rgba(245,158,11,0.15)' : 'none',
                border: isMuted ? '1px solid rgba(245,158,11,0.4)' : 'none',
                borderRadius: '4px',
                color: isMuted ? '#f59e0b' : '#52525b',
                cursor: 'pointer',
                padding: '3px',
                display: 'flex',
                transition: 'all 0.15s ease',
              }}
              title={isMuted ? 'Unmute widget sounds' : 'Mute widget sounds'}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          )}

          {/* Accordion Chevron Expander */}
          <div style={{ color: '#71717a', display: 'flex', marginLeft: '2px' }}>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        </div>
      </div>

      {/* Accordion Body */}
      {isExpanded && (
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid #27272a',
            background: '#121215',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action Bar */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="studio-btn"
              onClick={() => onDuplicateWidget(widget.id)}
              style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem' }}
              title="Duplicate Widget Instance"
            >
              <Copy size={12} /> Duplicate
            </button>
            <button
              className="studio-btn"
              onClick={() => onCenterWidget(widget.id)}
              style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem' }}
              title="Bring Lost Widget Back to Center of Canvas"
            >
              <Crosshair size={12} color="#6366f1" /> Center
            </button>
            <button
              className="studio-btn studio-btn-danger"
              onClick={() => onDeleteWidget(widget.id)}
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              title="Delete Widget"
            >
              <Trash2 size={12} />
            </button>
          </div>

          {/* Sub-Inspectors by Widget Type */}
          {widget.type === 'subGoal' && (
            <SubGoalInspector
              widget={widget}
              onUpdateWidgetConfig={onUpdateWidgetConfig}
              onFileUpload={handleFileUpload}
            />
          )}

          {widget.type === 'subAlert' && (
            <SubAlertInspector
              widget={widget}
              onUpdateWidgetConfig={onUpdateWidgetConfig}
              onToggleMute={onToggleMute}
              onPlaySoundPreview={onPlaySoundPreview}
              onFileUpload={handleFileUpload}
            />
          )}

          {widget.type === 'customImage' && (
            <CustomImageInspector
              widget={widget}
              onUpdateWidgetConfig={onUpdateWidgetConfig}
              onFileUpload={handleFileUpload}
            />
          )}
        </div>
      )}
    </div>
  );
};
