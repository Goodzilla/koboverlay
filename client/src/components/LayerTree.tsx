import React, { useState } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  RotateCcw,
  Target,
  Sparkles,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { WidgetLayout } from './DraggableWidget';

export interface WidgetInstance {
  id: string;
  type: 'subGoal' | 'subAlert' | 'customImage';
  label: string;
  layout: WidgetLayout;
  config: {
    title?: string;
    imageUrl?: string;
    primaryColor?: string;
    currentSubs?: number;
    targetSubs?: number;
    alertDuration?: number;
  };
}

interface LayerTreeProps {
  widgets: WidgetInstance[];
  selectedWidgetId: string | null;
  onSelectWidget: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDuplicateWidget: (id: string) => void;
  onDeleteWidget: (id: string) => void;
  onResetWidgetSize: (id: string) => void;
  onUpdateWidgetConfig: (id: string, newConfig: Partial<WidgetInstance['config']>) => void;
  onOpenAddModal: () => void;
}

export const LayerTree: React.FC<LayerTreeProps> = ({
  widgets,
  selectedWidgetId,
  onSelectWidget,
  onToggleVisibility,
  onDuplicateWidget,
  onDeleteWidget,
  onResetWidgetSize,
  onUpdateWidgetConfig,
  onOpenAddModal,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(selectedWidgetId);

  const toggleAccordion = (id: string) => {
    onSelectWidget(id);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getWidgetIcon = (type: WidgetInstance['type']) => {
    if (type === 'subGoal') return <Target size={14} color="#6366f1" />;
    if (type === 'subAlert') return <Sparkles size={14} color="#38bdf8" />;
    return <ImageIcon size={14} color="#10b981" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Sidebar Header & Add Widget Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>
          <Layers size={14} color="#6366f1" />
          <span>Canvas Layers ({widgets.length})</span>
        </div>

        <button className="studio-btn studio-btn-primary" onClick={onOpenAddModal} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
          <Plus size={13} /> Add Widget
        </button>
      </div>

      {/* Accordion Layer List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {widgets.map((widget) => {
          const isSelected = selectedWidgetId === widget.id;
          const isExpanded = expandedId === widget.id || isSelected;
          const isVisible = widget.layout.visible !== false;

          return (
            <div
              key={widget.id}
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
                onClick={() => toggleAccordion(widget.id)}
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Eye Visibility Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(widget.id);
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

                  {/* Accordion Chevron Expander */}
                  <div style={{ color: '#71717a', display: 'flex' }}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </div>
              </div>

              {/* Accordion Body (Per-Widget Properties Inspector & Quick Actions) */}
              {isExpanded && (
                <div
                  style={{
                    padding: '12px',
                    borderTop: '1px solid #27272a',
                    background: '#121215',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Action Bar (Duplicate, Delete, Reset) */}
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
                      onClick={() => onResetWidgetSize(widget.id)}
                      style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem' }}
                      title="Reset Widget Size to Default PX"
                    >
                      <RotateCcw size={12} /> Reset Size
                    </button>
                    <button
                      className="studio-btn"
                      onClick={() => onDeleteWidget(widget.id)}
                      style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                      title="Delete Widget"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Form Controls by Widget Type */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Common Title/Label Input */}
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                        Title / Label
                      </label>
                      <input
                        type="text"
                        value={widget.config.title || widget.label}
                        onChange={(e) => onUpdateWidgetConfig(widget.id, { title: e.target.value })}
                        className="studio-input"
                      />
                    </div>

                    {/* Custom Image / GIF / Badge URL */}
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                        Custom Image / GIF URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/logo.png"
                        value={widget.config.imageUrl || ''}
                        onChange={(e) => onUpdateWidgetConfig(widget.id, { imageUrl: e.target.value })}
                        className="studio-input"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                      />
                    </div>

                    {/* Accent Color Picker (for subGoal & subAlert) */}
                    {widget.type !== 'customImage' && (
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                          Accent Color
                        </label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="color"
                            value={widget.config.primaryColor || '#6366f1'}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { primaryColor: e.target.value })}
                            style={{ width: '32px', height: '28px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                          />
                          <input
                            type="text"
                            value={widget.config.primaryColor || '#6366f1'}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { primaryColor: e.target.value })}
                            className="studio-input"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Sub Goal Specific Inputs */}
                    {widget.type === 'subGoal' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                            Current
                          </label>
                          <input
                            type="number"
                            value={widget.config.currentSubs || 0}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { currentSubs: Number(e.target.value) })}
                            className="studio-input"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                            Target
                          </label>
                          <input
                            type="number"
                            value={widget.config.targetSubs || 50}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { targetSubs: Number(e.target.value) })}
                            className="studio-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
