import React from 'react';
import { LayoutGrid, Zap, Volume2, Type, Palette, Upload, Play } from 'lucide-react';
import { WidgetInstance } from '../../LayerTree';
import { InspectorSection } from '../../common/InspectorSection';

interface SubAlertInspectorProps {
  widget: WidgetInstance;
  onUpdateWidgetConfig: (id: string, newConfig: Partial<WidgetInstance['config']>, newLabel?: string) => void;
  onToggleMute: (id: string) => void;
  onPlaySoundPreview: (url?: string, volume?: number) => void;
  onFileUpload: (widgetId: string, e: React.ChangeEvent<HTMLInputElement>, isAudio?: boolean) => void;
}

export const SubAlertInspector: React.FC<SubAlertInspectorProps> = ({
  widget,
  onUpdateWidgetConfig,
  onToggleMute,
  onPlaySoundPreview,
  onFileUpload,
}) => {
  const isMuted = widget.layout.muted === true;
  const eventType = widget.config.triggerEventType || 'all';

  const getSuggestedTemplate = () => {
    switch (eventType) {
      case 'sub':
        return '{username} subscribed ({tier})';
      case 'resub':
        return '{username} resubscribed for {months} months ({tier})';
      case 'subgift':
        return '{username} gifted {amount} subs ({tier})';
      case 'bits':
        return '{username} cheered {amount} Bits!';
      case 'raid':
        return '{username} raided with {amount} viewers!';
      default:
        return '{username} subscribed ({tier})';
    }
  };

  const getAvailableVarsText = () => {
    switch (eventType) {
      case 'sub':
        return '{username}, {tier}';
      case 'resub':
        return '{username}, {months}, {tier}';
      case 'subgift':
        return '{username}, {amount}, {tier}';
      case 'bits':
      case 'raid':
        return '{username}, {amount}';
      default:
        return '{username}, {amount}, {months}, {tier}';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* SECTION 1: GENERAL SETTINGS */}
      <InspectorSection title="General Settings" icon={<LayoutGrid size={14} color="#6366f1" />}>
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '5px' }}>
            Layer Label (Internal Identifier)
          </label>
          <input
            type="text"
            value={widget.label}
            onChange={(e) => onUpdateWidgetConfig(widget.id, {}, e.target.value)}
            className="studio-input"
            style={{ fontSize: '0.8rem' }}
          />
        </div>

        {/* Dynamic Alert Text Template with contextual placeholder */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '5px' }}>
            Alert Text Template
          </label>

          <input
            type="text"
            value={widget.config.customTextTemplate || ''}
            placeholder={getSuggestedTemplate()}
            onChange={(e) => onUpdateWidgetConfig(widget.id, { customTextTemplate: e.target.value })}
            className="studio-input"
            style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
          />

          <div style={{ fontSize: '0.68rem', color: '#71717a', marginTop: '5px', lineHeight: 1.3 }}>
            Available variables: <span style={{ color: '#818cf8', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{getAvailableVarsText()}</span>
          </div>
        </div>
      </InspectorSection>

      {/* SECTION 2: TRIGGER & TIER CONDITIONS */}
      <InspectorSection title="Event Triggers & Tier Rules" icon={<Zap size={14} color="#38bdf8" />} titleColor="#38bdf8">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '5px' }}>
              Event Type Filter
            </label>
            <select
              value={eventType}
              onChange={(e) => onUpdateWidgetConfig(widget.id, { triggerEventType: e.target.value as any })}
              className="studio-input"
              style={{ fontSize: '0.8rem' }}
            >
              <option value="all">All Events</option>
              <option value="sub">Single Subs</option>
              <option value="resub">Resubs</option>
              <option value="subgift">Gifted Subs</option>
              <option value="bits">Bits</option>
              <option value="raid">Raids</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '5px' }}>
              Sub Tier Filter
            </label>
            <select
              value={widget.config.triggerTier || 'all'}
              onChange={(e) => onUpdateWidgetConfig(widget.id, { triggerTier: e.target.value as any })}
              className="studio-input"
              style={{ fontSize: '0.8rem' }}
            >
              <option value="all">All Tiers</option>
              <option value="1000">Tier 1 Only</option>
              <option value="2000">Tier 2 Only</option>
              <option value="3000">Tier 3 Only</option>
              <option value="Prime">Prime Only</option>
            </select>
          </div>
        </div>
      </InspectorSection>

      {/* SECTION 3: ALERT SOUND EFFECT */}
      <InspectorSection title="Alert Sound Effect" icon={<Volume2 size={14} color="#38bdf8" />}>
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '5px' }}>
            Sound File (Upload MP3 / WAV or Link)
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="https://example.com/sound.mp3"
              value={widget.config.soundUrl || ''}
              onChange={(e) => onUpdateWidgetConfig(widget.id, { soundUrl: e.target.value })}
              className="studio-input"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', flex: 1 }}
            />
            <input
              type="file"
              accept="audio/*"
              id={`sound_upload_${widget.id}`}
              onChange={(e) => onFileUpload(widget.id, e, true)}
              style={{ display: 'none' }}
            />
            <label
              htmlFor={`sound_upload_${widget.id}`}
              className="studio-btn studio-btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              title="Upload Audio File from computer"
            >
              <Upload size={13} /> Upload Sound
            </label>
          </div>
        </div>

        {/* Volume Slider & Test Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8' }}>Sound Volume</label>
                {isMuted && (
                  <span style={{ fontSize: '0.62rem', color: '#f59e0b', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    MUTED (0%)
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: isMuted ? '#f59e0b' : '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {isMuted ? 0 : (widget.config.soundVolume !== undefined ? widget.config.soundVolume : 80)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : (widget.config.soundVolume !== undefined ? widget.config.soundVolume : 80)}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val === 0) {
                  onUpdateWidgetConfig(widget.id, { soundVolume: 0 });
                  if (!isMuted) onToggleMute(widget.id);
                } else {
                  onUpdateWidgetConfig(widget.id, { soundVolume: val, previousVolume: val });
                  if (isMuted) onToggleMute(widget.id);
                }
              }}
              style={{ width: '100%', accentColor: isMuted ? '#f59e0b' : '#38bdf8', cursor: 'pointer' }}
            />
          </div>

          <button
            type="button"
            className="studio-btn"
            onClick={() => onPlaySoundPreview(widget.config.soundUrl || 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', isMuted ? 0 : widget.config.soundVolume)}
            style={{ padding: '6px 12px', fontSize: '0.78rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)', width: '100%' }}
          >
            <Play size={13} /> Test Sound Preview
          </button>
        </div>
      </InspectorSection>

      {/* SECTION 4: TYPOGRAPHY & MEDIA */}
      <InspectorSection title="Typography & Media" icon={<Type size={14} color="#6366f1" />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '5px' }}>
              Text Color
            </label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input
                type="color"
                value={widget.config.textColor || '#ffffff'}
                onChange={(e) => onUpdateWidgetConfig(widget.id, { textColor: e.target.value })}
                style={{ width: '32px', height: '28px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={widget.config.textColor || '#ffffff'}
                onChange={(e) => onUpdateWidgetConfig(widget.id, { textColor: e.target.value })}
                className="studio-input"
                style={{ fontSize: '0.78rem' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8' }}>Font Size</label>
              <span style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {widget.config.fontSize || 18}px
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="36"
              value={widget.config.fontSize || 18}
              onChange={(e) => onUpdateWidgetConfig(widget.id, { fontSize: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '5px' }}>
            Custom Media / GIF (Upload or Link)
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="https://example.com/image.png"
              value={widget.config.imageUrl || ''}
              onChange={(e) => onUpdateWidgetConfig(widget.id, { imageUrl: e.target.value })}
              className="studio-input"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', flex: 1 }}
            />
            <input
              type="file"
              accept="image/*"
              id={`file_upload_${widget.id}`}
              onChange={(e) => onFileUpload(widget.id, e, false)}
              style={{ display: 'none' }}
            />
            <label
              htmlFor={`file_upload_${widget.id}`}
              className="studio-btn studio-btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              title="Upload Media from your computer"
            >
              <Upload size={13} /> Upload
            </label>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8' }}>Media Height (Image / GIF)</label>
            <span style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
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
      </InspectorSection>

      {/* SECTION 5: CARD CONTAINER STYLING */}
      <InspectorSection title="Card Container Styling" icon={<Palette size={14} color="#6366f1" />}>
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '5px' }}>
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
              style={{ fontSize: '0.78rem', flex: 1 }}
            />
            <button
              type="button"
              className={`studio-btn ${widget.config.backgroundColor === 'transparent' ? 'studio-btn-active' : ''}`}
              onClick={() =>
                onUpdateWidgetConfig(widget.id, {
                  backgroundColor: widget.config.backgroundColor === 'transparent' ? '#18181b' : 'transparent',
                })
              }
              style={{ padding: '4px 10px', fontSize: '0.72rem' }}
            >
              Transparent
            </button>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8' }}>Card Border Radius</label>
            <span style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
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
      </InspectorSection>
    </div>
  );
};
