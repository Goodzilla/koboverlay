import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Grid,
  Copy,
  Check,
  RotateCcw,
  Tv,
  Users,
  Home,
} from 'lucide-react';

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
  const [copiedObs, setCopiedObs] = useState(false);
  const [copiedMod, setCopiedMod] = useState(false);

  const obsUrl = `${window.location.origin}/overlay/${token}`;
  const modUrl = `${window.location.origin}/studio?token=${token}`;

  const copyObsUrl = () => {
    navigator.clipboard.writeText(obsUrl);
    setCopiedObs(true);
    setTimeout(() => setCopiedObs(false), 2000);
  };

  const copyModUrl = () => {
    navigator.clipboard.writeText(modUrl);
    setCopiedMod(true);
    setTimeout(() => setCopiedMod(false), 2000);
  };

  return (
    <header
      style={{
        height: '52px',
        background: '#0c0c0e',
        borderBottom: '1px solid #27272a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Left: Perfectly Aligned Logo & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a
          href="/"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          title="Return to KobOverlay Home"
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Tv size={16} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1 }}>
            KobOverlay <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#818cf8' }}>Studio</span>
          </span>
        </a>

        <div style={{ height: '18px', width: '1px', background: '#27272a' }} />

        {/* History Engine Controls (Ctrl+Z / Ctrl+Shift+Z) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            className="studio-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo Last Action (Ctrl + Z)"
            style={{ padding: '6px 10px' }}
          >
            <Undo2 size={14} />
          </button>
          <button
            className="studio-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo Action (Ctrl + Shift + Z)"
            style={{ padding: '6px 10px' }}
          >
            <Redo2 size={14} />
          </button>
          <span style={{ fontSize: '0.7rem', color: '#71717a', marginLeft: '4px', fontFamily: 'var(--font-mono)' }}>
            History: {historyLength}
          </span>
        </div>

        {/* Grid Snap Toggle */}
        <button
          className={`studio-btn ${gridSnap ? 'studio-btn-active' : ''}`}
          onClick={onToggleGridSnap}
          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          title="Toggle 20px Visual Grid Alignment"
        >
          <Grid size={13} /> Grid Snap {gridSnap ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Right: Mod Share & OBS URL Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Share Mod Access Link */}
        <button
          className="studio-btn"
          onClick={copyModUrl}
          style={{
            background: copiedMod ? 'rgba(16, 185, 129, 0.15)' : '#18181b',
            borderColor: copiedMod ? '#10b981' : '#27272a',
            color: copiedMod ? '#10b981' : '#ffffff',
            fontSize: '0.75rem',
            padding: '6px 12px',
          }}
          title="Copy Moderator Editing Link to invite mods"
        >
          {copiedMod ? <Check size={13} /> : <Users size={13} />}
          {copiedMod ? 'Mod Link Copied!' : 'Share Mod Link'}
        </button>

        {/* Copy OBS URL */}
        <button
          className="studio-btn studio-btn-primary"
          onClick={copyObsUrl}
          style={{
            background: copiedObs ? '#10b981' : '#6366f1',
            borderColor: copiedObs ? '#10b981' : '#6366f1',
            fontSize: '0.75rem',
            padding: '6px 12px',
          }}
          title="Copy OBS Browser Source URL"
        >
          {copiedObs ? <Check size={13} /> : <Copy size={13} />}
          {copiedObs ? 'OBS URL Copied!' : 'Copy OBS URL'}
        </button>
      </div>
    </header>
  );
};
