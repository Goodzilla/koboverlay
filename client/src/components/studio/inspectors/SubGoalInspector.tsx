import React from 'react';
import { LayoutGrid, BarChart3, Type, Palette, Upload, Sliders, Eye, EyeOff } from 'lucide-react';
import { WidgetInstance } from '../../LayerTree';
import { InspectorSection } from '../../common/InspectorSection';

interface SubGoalInspectorProps {
  widget: WidgetInstance;
  onUpdateWidgetConfig: (id: string, newConfig: Partial<WidgetInstance['config']>, newLabel?: string) => void;
  onFileUpload: (widgetId: string, e: React.ChangeEvent<HTMLInputElement>, isAudio?: boolean) => void;
}

export const SubGoalInspector: React.FC<SubGoalInspectorProps> = ({
  widget,
  onUpdateWidgetConfig,
  onFileUpload,
}) => {
  const showProgressBar = widget.config.showProgressBar !== false;
  const showPercentage = widget.config.showPercentage !== false;

  return (
    <>
      {/* SECTION 1: GENERAL SETTINGS */}
      <InspectorSection title="General Settings" icon={<LayoutGrid size={14} color="#6366f1" />}>
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '4px' }}>
            Layer Label (Internal Identifier)
          </label>
          <input
            type="text"
            value={widget.label}
            onChange={(e) => onUpdateWidgetConfig(widget.id, {}, e.target.value)}
            className="studio-input"
            style={{ fontSize: '0.78rem' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '4px' }}>
            Display Title
          </label>
          <input
            type="text"
            value={widget.config.title || ''}
            onChange={(e) => onUpdateWidgetConfig(widget.id, { title: e.target.value })}
            className="studio-input"
            style={{ fontSize: '0.78rem' }}
          />
        </div>
      </InspectorSection>

      {/* SECTION 2: GOAL COUNTER & NUMERIC DATA */}
      <InspectorSection title="Goal Counter & Values" icon={<BarChart3 size={14} color="#6366f1" />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '4px' }}>
              Current Sub Count
            </label>
            <input
              type="number"
              min="0"
              value={widget.config.currentSubs !== undefined ? widget.config.currentSubs : 0}
              onChange={(e) => onUpdateWidgetConfig(widget.id, { currentSubs: Number(e.target.value) })}
              className="studio-input"
              style={{ fontSize: '0.78rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '4px' }}>
              Target Goal
            </label>
            <input
              type="number"
              min="1"
              value={widget.config.targetSubs !== undefined ? widget.config.targetSubs : 50}
              onChange={(e) => onUpdateWidgetConfig(widget.id, { targetSubs: Number(e.target.value) })}
              className="studio-input"
              style={{ fontSize: '0.78rem' }}
            />
          </div>
        </div>
      </InspectorSection>

      {/* SECTION 3: PROGRESS BAR & DISPLAY OPTIONS */}
      <InspectorSection title="Progress Bar & Display Options" icon={<Sliders size={14} color="#6366f1" />}>
        {/* Display Toggles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            className={`studio-btn ${showProgressBar ? 'studio-btn-active' : ''}`}
            onClick={() => onUpdateWidgetConfig(widget.id, { showProgressBar: !showProgressBar })}
            style={{ padding: '6px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            {showProgressBar ? <Eye size={12} /> : <EyeOff size={12} />}
            Progress Bar ({showProgressBar ? 'ON' : 'OFF'})
          </button>

          <button
            type="button"
            className={`studio-btn ${showPercentage ? 'studio-btn-active' : ''}`}
            onClick={() => onUpdateWidgetConfig(widget.id, { showPercentage: !showPercentage })}
            style={{ padding: '6px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            {showPercentage ? <Eye size={12} /> : <EyeOff size={12} />}
            Percentage % ({showPercentage ? 'ON' : 'OFF'})
          </button>
        </div>

        {/* Progress Bar Fill Color */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '4px' }}>
            Progress Fill Color
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
              style={{ fontSize: '0.78rem', flex: 1 }}
            />
          </div>
        </div>

        {/* Track Background Color */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '4px' }}>
            Track Background Color
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="color"
              value={widget.config.progressBarBgColor === 'transparent' ? '#000000' : widget.config.progressBarBgColor || 'rgba(0, 0, 0, 0.5)'}
              onChange={(e) => onUpdateWidgetConfig(widget.id, { progressBarBgColor: e.target.value })}
              style={{ width: '32px', height: '28px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={widget.config.progressBarBgColor || 'rgba(0, 0, 0, 0.5)'}
              onChange={(e) => onUpdateWidgetConfig(widget.id, { progressBarBgColor: e.target.value })}
              className="studio-input"
              style={{ fontSize: '0.78rem', flex: 1 }}
            />
            <button
              type="button"
              className={`studio-btn ${widget.config.progressBarBgColor === 'transparent' ? 'studio-btn-active' : ''}`}
              onClick={() =>
                onUpdateWidgetConfig(widget.id, {
                  progressBarBgColor: widget.config.progressBarBgColor === 'transparent' ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                })
              }
              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
            >
              Transparent
            </button>
          </div>
        </div>

        {/* Progress Bar Height Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8' }}>Progress Bar Height</label>
            <span style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
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
      </InspectorSection>

      {/* SECTION 4: TYPOGRAPHY & MEDIA */}
      <InspectorSection title="Typography & Media" icon={<Type size={14} color="#6366f1" />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '4px' }}>
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
                style={{ fontSize: '0.78rem' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8' }}>Font Size</label>
              <span style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {widget.config.fontSize || 14}px
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="36"
              value={widget.config.fontSize || 14}
              onChange={(e) => onUpdateWidgetConfig(widget.id, { fontSize: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '4px' }}>
            Optional Custom Icon (Upload or Link)
          </label>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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
              style={{ padding: '6px 10px', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              title="Upload Media from your computer"
            >
              <Upload size={12} /> Upload
            </label>
          </div>
        </div>

        {widget.config.imageUrl && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
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
        )}
      </InspectorSection>

      {/* SECTION 5: CARD CONTAINER STYLING */}
      <InspectorSection title="Card Container Styling" icon={<Palette size={14} color="#6366f1" />}>
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d8', display: 'block', marginBottom: '4px' }}>
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
              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
            >
              Transparent
            </button>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
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
    </>
  );
};
