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
  Upload,
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
    imageSize?: number;
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    borderRadius?: number;
    currentSubs?: number;
    targetSubs?: number;
    alertDuration?: number;
    customTextTemplate?: string;
  };
}

interface WidgetTreeProps {
  widgets: WidgetInstance[];
  selectedWidgetId: string | null;
  onSelectWidget: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDuplicateWidget: (id: string) => void;
  onDeleteWidget: (id: string) => void;
  onResetWidgetSize: (id: string) => void;
  onUpdateWidgetConfig: (id: string, newConfig: Partial<WidgetInstance['config']>, newLabel?: string) => void;
  onOpenAddModal: () => void;
}

export const LayerTree: React.FC<WidgetTreeProps> = ({
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

  const handleFileUpload = (widgetId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        onUpdateWidgetConfig(widgetId, { imageUrl: base64Url });
      };
      reader.readAsDataURL(file);
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
                    title={isVisible ? 'Hide Widget' : 'Show Widget'}
                  >
                    {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Accordion Chevron Expander */}
                  <div style={{ color: '#71717a', display: 'flex' }}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </div>
              </div>

              {/* Accordion Body (Per-Widget Inspector & Actions) */}
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
                  {/* Action Bar (Duplicate, Delete) */}
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
                      onClick={() => onDeleteWidget(widget.id)}
                      style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                      title="Delete Widget"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>

                  {/* Form Controls by Widget Type */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* 1. Widget Layer Label (Sidebar & Dragbar Identifier) */}
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                        Widget Layer Name (Sidebar & Dragbar)
                      </label>
                      <input
                        type="text"
                        value={widget.label}
                        onChange={(e) => onUpdateWidgetConfig(widget.id, {}, e.target.value)}
                        className="studio-input"
                        placeholder="e.g. Top Right Sub Goal"
                      />
                    </div>

                    {/* 2. Display Text (On Stream Content) */}
                    {widget.type !== 'customImage' && (
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                          Display Text (On Stream Content)
                        </label>
                        <input
                          type="text"
                          value={widget.config.title !== undefined ? widget.config.title : 'Monthly Sub Goal'}
                          onChange={(e) => onUpdateWidgetConfig(widget.id, { title: e.target.value })}
                          className="studio-input"
                          placeholder="e.g. Monthly Sub Goal"
                        />
                      </div>
                    )}

                    {/* Text Color & Font Size Controls */}
                    {widget.type !== 'customImage' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                            Text Color
                          </label>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input
                              type="color"
                              value={widget.config.textColor || '#ffffff'}
                              onChange={(e) => onUpdateWidgetConfig(widget.id, { textColor: e.target.value })}
                              style={{ width: '28px', height: '26px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                            />
                            <input
                              type="text"
                              value={widget.config.textColor || '#ffffff'}
                              onChange={(e) => onUpdateWidgetConfig(widget.id, { textColor: e.target.value })}
                              className="studio-input"
                              style={{ fontSize: '0.75rem' }}
                            />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa' }}>Font Size</label>
                            <span style={{ fontSize: '0.7rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                              {widget.config.fontSize || (widget.type === 'subAlert' ? 18 : 14)}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="36"
                            value={widget.config.fontSize || (widget.type === 'subAlert' ? 18 : 14)}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { fontSize: Number(e.target.value) })}
                            style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Image / GIF Upload & Media URL */}
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                        {widget.type === 'subGoal' ? 'Optional Custom Icon (Upload or Link)' : 'Custom Media / GIF (Upload or Link)'}
                      </label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="https://example.com/image.png"
                          value={widget.config.imageUrl || ''}
                          onChange={(e) => onUpdateWidgetConfig(widget.id, { imageUrl: e.target.value })}
                          className="studio-input"
                          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', flex: 1 }}
                        />

                        <input
                          type="file"
                          accept="image/*"
                          id={`file_upload_${widget.id}`}
                          onChange={(e) => handleFileUpload(widget.id, e)}
                          style={{ display: 'none' }}
                        />
                        <label
                          htmlFor={`file_upload_${widget.id}`}
                          className="studio-btn studio-btn-primary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          title="Upload Media from your computer"
                        >
                          <Upload size={12} /> Upload
                        </label>
                      </div>
                    </div>

                    {/* Image Size Slider (when custom image is set or for alert) */}
                    {(widget.type === 'subAlert' || widget.config.imageUrl) && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa' }}>Media Height (Image / GIF)</label>
                          <span style={{ fontSize: '0.7rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                            {widget.config.imageSize !== undefined ? widget.config.imageSize : 80}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="600"
                          value={widget.config.imageSize !== undefined ? widget.config.imageSize : 80}
                          onChange={(e) => onUpdateWidgetConfig(widget.id, { imageSize: Number(e.target.value) })}
                          style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
                        />
                      </div>
                    )}

                    {/* Background Color & Transparent Toggle */}
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                        Background Color
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={widget.config.backgroundColor === 'transparent' ? '#18181b' : widget.config.backgroundColor || '#18181b'}
                          onChange={(e) => onUpdateWidgetConfig(widget.id, { backgroundColor: e.target.value })}
                          style={{ width: '32px', height: '28px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          value={widget.config.backgroundColor || '#18181b'}
                          onChange={(e) => onUpdateWidgetConfig(widget.id, { backgroundColor: e.target.value })}
                          className="studio-input"
                          style={{ fontSize: '0.75rem', flex: 1 }}
                        />
                        <button
                          type="button"
                          className={`studio-btn ${widget.config.backgroundColor === 'transparent' ? 'studio-btn-active' : ''}`}
                          onClick={() =>
                            onUpdateWidgetConfig(widget.id, {
                              backgroundColor: widget.config.backgroundColor === 'transparent' ? '#18181b' : 'transparent',
                            })
                          }
                          style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                        >
                          Transparent
                        </button>
                      </div>
                    </div>

                    {/* Border Radius Options */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa' }}>Border Radius</label>
                        <span style={{ fontSize: '0.7rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                          {widget.config.borderRadius !== undefined ? widget.config.borderRadius : 10}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={widget.config.borderRadius !== undefined ? widget.config.borderRadius : 10}
                        onChange={(e) => onUpdateWidgetConfig(widget.id, { borderRadius: Number(e.target.value) })}
                        style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
                      />
                    </div>

                    {/* Accent Color Picker (for subGoal & subAlert) */}
                    {widget.type !== 'customImage' && (
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                          Primary Fill / Accent Color
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

                    {/* Sub Alert Dynamic Text Template */}
                    {widget.type === 'subAlert' && (
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                          Alert Text Template ({'{username}'}, {'{months}'}, {'{tier}'})
                        </label>
                        <input
                          type="text"
                          placeholder="{username} subscribed for {months} months ({tier})"
                          value={widget.config.customTextTemplate || ''}
                          onChange={(e) => onUpdateWidgetConfig(widget.id, { customTextTemplate: e.target.value })}
                          className="studio-input"
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                    )}

                    {/* Sub Goal Current & Target Subs */}
                    {widget.type === 'subGoal' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                            Current Subs
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
                            Target Subs
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
