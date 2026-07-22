import React, { useState, useEffect } from 'react';
import { Tv, Sparkles, ShieldCheck, Zap, Layers, LogIn, ArrowRight } from 'lucide-react';
import { TwitchLoginModal } from '../components/AuthModal';

interface KobUser {
  id: string;
  username: string;
  displayName: string;
  profileImage: string;
  overlayToken: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const Landing: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<KobUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Pick up JWT from redirect after Twitch OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const jwt = urlParams.get('jwt');
    const error = urlParams.get('error');

    if (error) {
      setAuthError(error);
      setIsAuthModalOpen(true);
      window.history.replaceState({}, '', '/');
      return;
    }

    if (jwt) {
      localStorage.setItem('koboverlay_jwt', jwt);
      window.history.replaceState({}, '', '/');
    }

    // Validate stored JWT against /api/auth/me
    const storedJwt = localStorage.getItem('koboverlay_jwt');
    if (storedJwt) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${storedJwt}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.id) {
            setCurrentUser(data as KobUser);
          } else {
            // Token invalid or expired — clear it
            localStorage.removeItem('koboverlay_jwt');
          }
        })
        .catch(() => localStorage.removeItem('koboverlay_jwt'));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('koboverlay_jwt');
    setCurrentUser(null);
  };

  const goToStudio = () => {
    const jwt = localStorage.getItem('koboverlay_jwt');
    window.location.href = `/studio?jwt=${encodeURIComponent(jwt || '')}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f4f4f5', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid #27272a',
          background: '#0c0c0e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Tv size={18} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1 }}>
            KobOverlay <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#818cf8' }}>Studio</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser ? (
            <>
              {/* Twitch avatar */}
              {currentUser.profileImage && (
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.displayName}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #6366f1' }}
                />
              )}
              <button
                className="studio-btn studio-btn-primary"
                onClick={goToStudio}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Go to Studio ({currentUser.displayName}) <ArrowRight size={14} />
              </button>
              <button className="studio-btn" onClick={handleSignOut} style={{ fontSize: '0.78rem' }}>
                Sign Out
              </button>
            </>
          ) : (
            <button
              className="studio-btn studio-btn-primary"
              onClick={() => { setAuthError(null); setIsAuthModalOpen(true); }}
              style={{ padding: '8px 18px', fontSize: '0.88rem' }}
            >
              <LogIn size={15} /> Sign In with Twitch
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: '960px', width: '100%', margin: '0 auto', padding: '80px 24px', display: 'flex', flexDirection: 'column', gap: '56px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <Sparkles size={12} /> Open-Source Real-time Stream Overlays
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, color: '#ffffff' }}>
            Lightweight, Customizable Overlays for Live Streamers
          </h1>

          <p style={{ fontSize: '1.08rem', color: '#a1a1aa', maxWidth: '640px', lineHeight: 1.6 }}>
            Design sub alerts, goal bars, and custom sponsor graphics in a real-time 1920x1080 studio editor. Share access securely with your moderators and load seamlessly into OBS Studio.
          </p>

          {!currentUser && (
            <button
              className="studio-btn studio-btn-primary"
              onClick={() => { setAuthError(null); setIsAuthModalOpen(true); }}
              style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 700, marginTop: '8px' }}
            >
              <LogIn size={16} /> Get Started — Sign in with Twitch
            </button>
          )}
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Zap size={20} color="#6366f1" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Zero OBS Render Lag</h3>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              Ultra-lightweight browser source output rendered via WebSockets at 60fps with zero frame drops.
            </p>
          </div>

          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <ShieldCheck size={20} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>1-Year Shared Mod Links</h3>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              Streamers generate 1-year max shared token links for moderators. Revoke access anytime from your studio.
            </p>
          </div>

          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Layers size={20} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Local Computer Uploads</h3>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              Upload custom sponsor logos, sub badges, or WebP/GIF animations directly from your computer.
            </p>
          </div>
        </div>

        {/* OBS Setup Steps */}
        <div style={{ background: '#0c0c0e', border: '1px solid #27272a', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>How OBS Studio Integration Works</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1' }}>STEP 1</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '2px' }}>Sign In with Twitch</div>
              <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '4px' }}>One click — no passwords. Sign in to position your widgets, set colors, and upload logos.</p>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1' }}>STEP 2</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '2px' }}>Copy OBS Browser Source URL</div>
              <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '4px' }}>
                Copy your unique URL: <code style={{ color: '#818cf8', fontFamily: 'var(--font-mono)' }}>https://your-domain/overlay/YOUR_TOKEN</code>
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1' }}>STEP 3</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '2px' }}>Paste into OBS Studio</div>
              <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '4px' }}>Add Browser Source → Set 1920x1080 resolution → Paste URL.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Twitch Login Modal */}
      <TwitchLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        error={authError}
      />

      <footer style={{ padding: '20px', borderTop: '1px solid #27272a', textAlign: 'center', fontSize: '0.8rem', color: '#71717a' }}>
        KobOverlay Studio • Open-Source Streamer Overlay Platform
      </footer>
    </div>
  );
};
