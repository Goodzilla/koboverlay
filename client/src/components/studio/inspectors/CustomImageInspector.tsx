import React from 'react';
import { LayoutGrid, Type, Palette, Upload } from 'lucide-react';
import { WidgetInstance } from '../../LayerTree';

interface CustomImageInspectorProps {
  widget: WidgetInstance;
  onUpdateWidgetConfig: (id: string, newConfig: Partial<WidgetInstance['config']>, newLabel?: string) => void;
  onFileUpload: (widgetId: string, e: React.ChangeEvent<HTMLInputElement>, isAudio?: boolean) => void;
}

export const CustomImageInspector: React.FC<CustomImageInspectorProps> = ({
  widget,
  onUpdateWidgetConfig,
  onFileUpload,
}) => {
  return (
    <>
      {/* SECTION 1: GENERAL SETTINGS */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #27272a', paddingBottom: '6px' }}>
          <LayoutGrid size={13} color="#6366f1" /> General Settings
        </div>

        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
            Layer Label (Internal Identifier)
          </label>
          <input
            type="text"
            value={widget.label}
            onChange={(e) => onUpdateWidgetConfig(widget.id, {}, e.target.value)}
            className="studio-input"
            style={{ fontSize: '0.75rem' }}
          />
        </div>
      </div>

      {/* SECTION 5: TYPOGRAPHY & MEDIA */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #27272a', paddingBottom: '6px' }}>
          <Type size={13} color="#6366f1" /> Typography & Media
        </div>

        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
            Custom Media / GIF (Upload or Link)
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
              onChange={(e) => onFileUpload(widget.id, e, false)}
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
      </div>

      {/* SECTION 6: CARD CONTAINER STYLING */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #27272a', paddingBottom: '6px' }}>
          <Palette size={13} color="#6366f1" /> Card Container Styling
        </div>

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
    </>
  );
};
