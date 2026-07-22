import React from 'react';
import { Play } from 'lucide-react';

interface SoundVolumeControlProps {
  volume: number;
  isMuted?: boolean;
  soundUrl?: string;
  onChangeVolume: (vol: number) => void;
  onToggleMute?: () => void;
  onPlayPreview?: () => void;
}

export const SoundVolumeControl: React.FC<SoundVolumeControlProps> = ({
  volume,
  isMuted = false,
  soundUrl,
  onChangeVolume,
  onToggleMute,
  onPlayPreview,
}) => {
  const currentVolume = isMuted ? 0 : volume;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val === 0) {
      onChangeVolume(0);
      if (!isMuted && onToggleMute) onToggleMute();
    } else {
      onChangeVolume(val);
      if (isMuted && onToggleMute) onToggleMute();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa' }}>Sound Volume</label>
            {isMuted && (
              <span
                style={{
                  fontSize: '0.62rem',
                  color: '#f59e0b',
                  fontWeight: 700,
                  background: 'rgba(245, 158, 11, 0.15)',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                MUTED (0%)
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.7rem', color: isMuted ? '#f59e0b' : '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            {currentVolume}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={currentVolume}
          onChange={handleSliderChange}
          style={{ width: '100%', accentColor: isMuted ? '#f59e0b' : '#38bdf8', cursor: 'pointer' }}
        />
      </div>

      {soundUrl && onPlayPreview && (
        <button
          type="button"
          className="studio-btn"
          onClick={onPlayPreview}
          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
        >
          <Play size={12} /> Test Sound Preview
        </button>
      )}
    </div>
  );
};
