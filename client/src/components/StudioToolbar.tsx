import React, { useState } from 'react';
import { Undo, Redo, Grid, Copy, Check, ExternalLink, CheckCircle2, Tv } from 'lucide-react';

interface StudioToolbarProps {
  token: string;
  canUndo: boolean;
  canRedo: boolean;
  gridSnap: boolean;
  historyLength: number;
  onUndo: () => void;
  onRedo: () => void;
  onToggleGridSnap: () => void;
  onResetAllLayouts: () => void;
}

export const StudioToolbar: React.FC<StudioToolbarProps> = ({
  token,
  canUndo,
  canRedo,
  gridSnap,
  historyLength,
  onUndo,
  onRedo,
  onToggleGridSnap,
  onResetAllLayouts,
}) => {
  const [copied, setCopied] = useState(false);
  const overlayUrl = `${window.location.origin}/overlay/${token}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header
      style={{
        height: '52px',
        background: '#121215',
        borderBottom: '1px solid #27272a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tv size={20} color="#6366f1" />
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
            StreamPulse <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1' }}>Studio</span>
          </span>
        </div>

        <div style={{ height: '16px', width: '1px', background: '#27272a' }} />

        {/* History Stack Controls (Undo / Redo) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            className="studio-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl + Z)"
            style={{ padding: '6px 10px' }}
          >
            <Undo size={14} />
          </button>

          <button
            className="studio-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl + Shift + Z)"
            style={{ padding: '6px 10px' }}
          >
            <Redo size={14} />
          </button>

          {historyLength > 0 && (
            <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>
              History: {historyLength} steps
            </span>
          )}
        </div>

        <div style={{ height: '16px', width: '1px', background: '#27272a' }} />

        {/* Grid Snap Toggle */}
        <button
          className={`studio-btn ${gridSnap ? 'studio-btn-active' : ''}`}
          onClick={onToggleGridSnap}
          title="Toggle 10px Grid Snap"
          style={{ padding: '6px 10px' }}
        >
          <Grid size={14} />
          <span style={{ fontSize: '0.8rem' }}>Grid Snap {gridSnap ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* OBS URL & Autosave Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Autosave Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981' }}>
          <CheckCircle2 size={14} />
          <span>Autosaved</span>
        </div>

        <div style={{ height: '16px', width: '1px', background: '#27272a' }} />

        {/* Copy OBS Browser Source URL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button className="studio-btn studio-btn-primary" onClick={handleCopyUrl} style={{ padding: '6px 12px' }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied OBS URL' : 'Copy OBS URL'}</span>
          </button>

          <a
            href={overlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="studio-btn"
            style={{ padding: '6px 10px', textDecoration: 'none' }}
            title="Open Overlay Browser Window"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </header>
  );
};
