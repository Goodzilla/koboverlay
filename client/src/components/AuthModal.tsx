import React from 'react';
import { X } from 'lucide-react';

interface TwitchLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  error?: string | null;
}

// Twitch brand purple
const TWITCH_PURPLE = '#9147ff';

export const TwitchLoginModal: React.FC<TwitchLoginModalProps> = ({ isOpen, onClose, error }) => {
  if (!isOpen) return null;

  const API_URL = import.meta.env.VITE_API_URL || '';

  const handleTwitchLogin = () => {
    window.location.href = `${API_URL}/api/auth/twitch`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#121215',
          border: '1px solid #27272a',
          borderRadius: '16px',
          padding: '32px 28px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
              Sign in to KobOverlay
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#71717a', margin: '4px 0 0 0' }}>
              Connect your Twitch account to access the studio
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', padding: '2px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.82rem',
            color: '#f87171',
          }}>
            {error === 'twitch_auth_denied' && 'Twitch authorization was cancelled.'}
            {error === 'twitch_token_failed' && 'Failed to connect to Twitch. Please try again.'}
            {error === 'twitch_user_failed' && 'Could not retrieve your Twitch profile. Please try again.'}
            {error === 'server_error' && 'A server error occurred. Please try again.'}
            {!['twitch_auth_denied', 'twitch_token_failed', 'twitch_user_failed', 'server_error'].includes(error) && error}
          </div>
        )}

        {/* Twitch Login Button */}
        <button
          onClick={handleTwitchLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: TWITCH_PURPLE,
            border: 'none',
            borderRadius: '10px',
            padding: '13px 20px',
            color: '#ffffff',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
            width: '100%',
            letterSpacing: '-0.2px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {/* Twitch Logo SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
          </svg>
          Continue with Twitch
        </button>

        {/* Fine print */}
        <p style={{ fontSize: '0.75rem', color: '#52525b', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
          By signing in you authorize KobOverlay to read your public Twitch profile (username, display name). No posting or channel management permissions are requested.
        </p>
      </div>
    </div>
  );
};
