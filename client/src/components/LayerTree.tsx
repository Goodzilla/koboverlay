import React, { useState } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Target,
  Sparkles,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  Plus,
  Upload,
  BarChart3,
  Palette,
  Type,
  LayoutGrid,
  Crosshair,
  Volume2,
  Play,
  Zap,
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
    soundUrl?: string;
    soundVolume?: number;
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
    // Alert Tiering / Trigger Conditions
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
  onDuplicateWidget,
  onDeleteWidget,
  onCenterWidget,
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

              {/* Accordion Body (Structured Inspector with Emphasized Hierarchy) */}
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
                  {/* Action Bar (Duplicate, Bring to Center, Delete) */}
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
                      className="studio-btn"
                      onClick={() => onDeleteWidget(widget.id)}
                      style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                      title="Delete Widget"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* SECTION 1: 📌 BASIC INFO & CONTENT */}
                  <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #27272a', paddingBottom: '6px' }}>
                      <LayoutGrid size={13} color="#6366f1" /> Content & Goal Info
                    </div>

                    {/* Display Text (On Stream) */}
                    {widget.type !== 'customImage' && (
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#818cf8', display: 'block', marginBottom: '4px' }}>
                          Display Text (On Stream Content)
                        </label>
                        <input
                          type="text"
                          value={widget.config.title !== undefined ? widget.config.title : 'Monthly Sub Goal'}
                          onChange={(e) => onUpdateWidgetConfig(widget.id, { title: e.target.value })}
                          className="studio-input"
                          style={{ fontWeight: 600 }}
                          placeholder="e.g. Monthly Sub Goal"
                        />
                      </div>
                    )}

                    {/* Sub Goal Current & Target Subs */}
                    {widget.type === 'subGoal' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#818cf8', display: 'block', marginBottom: '4px' }}>
                            Current Subs
                          </label>
                          <input
                            type="number"
                            value={widget.config.currentSubs || 0}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { currentSubs: Number(e.target.value) })}
                            className="studio-input"
                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#818cf8', display: 'block', marginBottom: '4px' }}>
                            Target Goal
                          </label>
                          <input
                            type="number"
                            value={widget.config.targetSubs || 50}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { targetSubs: Number(e.target.value) })}
                            className="studio-input"
                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Sub Alert Dynamic Text Template (Context-Aware Variables & Placeholder) */}
                    {widget.type === 'subAlert' && (() => {
                      const evtType = widget.config.triggerEventType || 'all';
                      let varsText = '{username}, {amount}, {months}, {tier}';
                      let placeholderText = '{username} subscribed for {months} months ({tier})';

                      if (evtType === 'raid') {
                        varsText = '{username}, {amount}';
                        placeholderText = '{username} raided with {amount} viewers!';
                      } else if (evtType === 'bits') {
                        varsText = '{username}, {amount}';
                        placeholderText = '{username} cheered {amount} Bits!';
                      } else if (evtType === 'subgift') {
                        varsText = '{username}, {amount}, {tier}';
                        placeholderText = '{username} gifted {amount} subs ({tier})';
                      } else if (evtType === 'resub') {
                        varsText = '{username}, {months}, {tier}';
                        placeholderText = '{username} subscribed for {months} months ({tier})';
                      } else if (evtType === 'sub') {
                        varsText = '{username}, {tier}';
                        placeholderText = '{username} subscribed ({tier})';
                      }

                      return (
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: '4px' }}>
                            Alert Text Template ({varsText})
                          </label>
                          <input
                            type="text"
                            placeholder={placeholderText}
                            value={widget.config.customTextTemplate || ''}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { customTextTemplate: e.target.value })}
                            className="studio-input"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                      );
                    })()}

                    {/* Widget Layer Identifier */}
                    <div>
                      <label style={{ fontSize: '0.68rem', fontWeight: 600, color: '#71717a', display: 'block', marginBottom: '4px' }}>
                        Widget Layer Name (Sidebar & Dragbar)
                      </label>
                      <input
                        type="text"
                        value={widget.label}
                        onChange={(e) => onUpdateWidgetConfig(widget.id, {}, e.target.value)}
                        className="studio-input"
                        style={{ fontSize: '0.75rem' }}
                        placeholder="e.g. Sub Goal Top Right"
                      />
                    </div>
                  </div>

                  {/* SECTION 2: ⚡ ALERT TRIGGER CONDITIONS & TIERS (For Sub Alert) */}
                  {widget.type === 'subAlert' && (
                    <div style={{ background: '#18181b', border: '1px solid #38bdf840', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #27272a', paddingBottom: '6px' }}>
                        <Zap size={13} color="#38bdf8" /> Alert Trigger Conditions & Tiers
                      </div>

                      {/* Event Type Filter */}
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                          Trigger Event Type
                        </label>
                        <select
                          className="studio-input"
                          value={widget.config.triggerEventType || 'all'}
                          onChange={(e) => onUpdateWidgetConfig(widget.id, { triggerEventType: e.target.value as any })}
                          style={{ fontSize: '0.75rem', cursor: 'pointer', background: '#09090b', color: '#ffffff' }}
                        >
                          <option value="all">All Events (General Alert)</option>
                          <option value="sub">Single Subscription (Sub)</option>
                          <option value="resub">Re-Subscription (Re-Sub)</option>
                          <option value="subgift">Gifted Subscriptions (Sub Gift)</option>
                          <option value="bits">Twitch Bits & Cheer</option>
                          <option value="raid">Stream Raid / Host</option>
                        </select>
                      </div>

                      {/* Min Amount (e.g. 5+ gift subs, 500+ bits, 20+ raiders) */}
                      {(widget.config.triggerEventType === 'subgift' || widget.config.triggerEventType === 'bits' || widget.config.triggerEventType === 'raid') && (
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                            Minimum Amount Required ({widget.config.triggerEventType === 'subgift' ? 'Gifted Subs' : widget.config.triggerEventType === 'bits' ? 'Bits' : 'Viewers'})
                          </label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 5"
                            value={widget.config.triggerMinAmount || 1}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { triggerMinAmount: Number(e.target.value) })}
                            className="studio-input"
                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                          />
                        </div>
                      )}

                      {/* Min Months (For Re-subs) */}
                      {widget.config.triggerEventType === 'resub' && (
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                            Minimum Subscription Months (e.g. 6 or 12 months)
                          </label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 12"
                            value={widget.config.triggerMinMonths || 1}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { triggerMinMonths: Number(e.target.value) })}
                            className="studio-input"
                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                          />
                        </div>
                      )}

                      {/* Tier Filter */}
                      {(widget.config.triggerEventType === 'sub' || widget.config.triggerEventType === 'resub' || widget.config.triggerEventType === 'subgift' || widget.config.triggerEventType === 'all') && (
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                            Subscription Tier Filter
                          </label>
                          <select
                            className="studio-input"
                            value={widget.config.triggerTier || 'all'}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { triggerTier: e.target.value as any })}
                            style={{ fontSize: '0.75rem', cursor: 'pointer', background: '#09090b', color: '#ffffff' }}
                          >
                            <option value="all">All Tiers</option>
                            <option value="Prime">Prime Gaming Only</option>
                            <option value="1000">Tier 1 Only ($4.99)</option>
                            <option value="2000">Tier 2 Only ($9.99)</option>
                            <option value="3000">Tier 3 Only ($24.99)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 3: 📊 PROGRESS BAR STYLING (For Sub Goal) */}
                  {widget.type === 'subGoal' && (
                    <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #27272a', paddingBottom: '6px' }}>
                        <BarChart3 size={13} color="#6366f1" /> Progress Bar Styling
                      </div>

                      {/* Toggles */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.75rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={widget.config.showProgressBar !== false}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { showProgressBar: e.target.checked })}
                            style={{ accentColor: '#6366f1' }}
                          />
                          Show Bar
                        </label>

                        <label style={{ fontSize: '0.75rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={widget.config.showPercentage !== false}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { showPercentage: e.target.checked })}
                            style={{ accentColor: '#6366f1' }}
                          />
                          Show (%) Text
                        </label>
                      </div>

                      {widget.config.showProgressBar !== false && (
                        <>
                          {/* Progress Fill Color (Primary Foreground Fill) */}
                          <div>
                            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                              Bar Fill Color (Foreground)
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
                                style={{ fontSize: '0.75rem', flex: 1 }}
                              />
                            </div>
                          </div>

                          {/* Progress Track Color (Unfilled Background Track) */}
                          <div>
                            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                              Bar Track Color (Background Track)
                            </label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={widget.config.progressBarBgColor === 'rgba(0, 0, 0, 0.5)' ? '#000000' : widget.config.progressBarBgColor || '#000000'}
                                onChange={(e) => onUpdateWidgetConfig(widget.id, { progressBarBgColor: e.target.value })}
                                style={{ width: '32px', height: '28px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                value={widget.config.progressBarBgColor || 'rgba(0, 0, 0, 0.5)'}
                                onChange={(e) => onUpdateWidgetConfig(widget.id, { progressBarBgColor: e.target.value })}
                                className="studio-input"
                                style={{ fontSize: '0.75rem', flex: 1 }}
                              />
                            </div>
                          </div>

                          {/* Bar Height */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa' }}>Progress Bar Height</label>
                              <span style={{ fontSize: '0.7rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                                {widget.config.progressBarHeight !== undefined ? widget.config.progressBarHeight : 10}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="4"
                              max="30"
                              value={widget.config.progressBarHeight !== undefined ? widget.config.progressBarHeight : 10}
                              onChange={(e) => onUpdateWidgetConfig(widget.id, { progressBarHeight: Number(e.target.value) })}
                              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* SECTION 4: 🔊 SOUND CONFIGURATION (For Sub Alert) */}
                  {widget.type === 'subAlert' && (
                    <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #27272a', paddingBottom: '6px' }}>
                        <Volume2 size={13} color="#38bdf8" /> Alert Sound Effect
                      </div>

                      {/* Sound Upload & URL Link */}
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                          Sound File (Upload MP3 / WAV or Link)
                        </label>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="https://example.com/sound.mp3"
                            value={widget.config.soundUrl || ''}
                            onChange={(e) => onUpdateWidgetConfig(widget.id, { soundUrl: e.target.value })}
                            className="studio-input"
                            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', flex: 1 }}
                          />

                          <input
                            type="file"
                            accept="audio/*"
                            id={`sound_upload_${widget.id}`}
                            onChange={(e) => handleFileUpload(widget.id, e, true)}
                            style={{ display: 'none' }}
                          />
                          <label
                            htmlFor={`sound_upload_${widget.id}`}
                            className="studio-btn studio-btn-primary"
                            style={{ padding: '6px 10px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            title="Upload Audio File from computer"
                          >
                            <Upload size={12} /> Upload Sound
                          </label>
                        </div>
                      </div>

                      {/* Sound Volume Slider & Test Button */}
                      {widget.config.soundUrl && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa' }}>Sound Volume</label>
                              <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                                {widget.config.soundVolume !== undefined ? widget.config.soundVolume : 80}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={widget.config.soundVolume !== undefined ? widget.config.soundVolume : 80}
                              onChange={(e) => onUpdateWidgetConfig(widget.id, { soundVolume: Number(e.target.value) })}
                              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                            />
                          </div>

                          <button
                            type="button"
                            className="studio-btn"
                            onClick={() => handlePlaySoundPreview(widget.config.soundUrl, widget.config.soundVolume)}
                            style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                          >
                            <Play size={12} /> Test Sound Preview
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 5: 🔤 TYPOGRAPHY & MEDIA */}
                  <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #27272a', paddingBottom: '6px' }}>
                      <Type size={13} color="#6366f1" /> Typography & Media
                    </div>

                    {/* Text Color & Font Size */}
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

                    {/* Image / GIF Upload */}
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
                          onChange={(e) => handleFileUpload(widget.id, e, false)}
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

                    {/* Media Height Slider */}
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
                  </div>

                  {/* SECTION 6: 🎨 CARD CONTAINER STYLING */}
                  <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #27272a', paddingBottom: '6px' }}>
                      <Palette size={13} color="#6366f1" /> Card Container Styling
                    </div>

                    {/* Background Color */}
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                        Card Background Color
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

                    {/* Border Radius */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa' }}>Card Border Radius</label>
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
