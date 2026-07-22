import React from 'react';
import { Layers, Eye, EyeOff, Trash2, Copy, Target, Sparkles } from 'lucide-react';
import { WidgetLayout } from './DraggableWidget';

export interface LayerItem {
  id: 'subGoal' | 'subAlert';
  label: string;
  type: 'goal' | 'alert';
  layout: WidgetLayout;
}

interface LayerTreeProps {
  layers: LayerItem[];
  selectedLayerId: string | null;
  onSelectLayer: (id: 'subGoal' | 'subAlert') => void;
  onToggleVisibility: (id: 'subGoal' | 'subAlert') => void;
  onDuplicateLayer?: (id: 'subGoal' | 'subAlert') => void;
  onDeleteLayer?: (id: 'subGoal' | 'subAlert') => void;
}

export const LayerTree: React.FC<LayerTreeProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onDuplicateLayer,
  onDeleteLayer,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>
        <Layers size={14} color="#6366f1" />
        <span>Canvas Layers ({layers.length})</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {layers.map((layer) => {
          const isSelected = selectedLayerId === layer.id;
          const isVisible = layer.layout.visible !== false;

          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : '#18181b',
                border: `1px solid ${isSelected ? '#6366f1' : '#27272a'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                color: isVisible ? '#ffffff' : '#71717a',
              }}
            >
              {/* Item Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                {layer.type === 'goal' ? <Target size={14} color="#6366f1" /> : <Sparkles size={14} color="#38bdf8" />}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {layer.label}
                </span>
              </div>

              {/* Action Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(layer.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isVisible ? '#a1a1aa' : '#52525b',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                  }}
                  title={isVisible ? 'Hide Layer' : 'Show Layer'}
                >
                  {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                {onDuplicateLayer && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateLayer(layer.id);
                    }}
                    style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    title="Duplicate Layer"
                  >
                    <Copy size={13} />
                  </button>
                )}

                {onDeleteLayer && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(layer.id);
                    }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    title="Delete Layer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
