import React, { useState, useEffect } from 'react';
import { Tv, Sparkles, ShieldCheck, Zap, ArrowRight, Layers, LogIn, X, CheckCircle } from 'lucide-react';

export const Landing: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [activeToken, setActiveToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('koboverlay_active_token');
    if (saved) {
      setActiveToken(saved);
    }
  }, []);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenToUse = tokenInput.trim() || activeToken || 'demo-streamer-token';
    localStorage.setItem('koboverlay_active_token', tokenToUse);
    window.location.href = `/studio?token=${encodeURIComponent(tokenToUse)}`;
  };

  const handleOpenLogin = () => {
    if (activeToken) {
      window.location.href = `/studio?token=${encodeURIComponent(activeToken)}`;
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f4f4f5', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
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
        {/* Aligned Logo Mark */}
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

        {/* Primary Connect Button Top Right */}
        <button className="studio-btn studio-btn-primary" onClick={handleOpenLogin} style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
          <LogIn size={15} /> {activeToken ? 'Go to My Studio' : 'Connect'}
        </button>
      </header>

      {/* Main Hero Container */}
      <main style={{ flex: 1, maxWidth: '960px', width: '100%', margin: '0 auto', padding: '70px 24px', display: 'flex', flexDirection: 'column', gap: '56px' }}>
        {/* Hero Section */}
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

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, color: '#ffffff' }}>
            Lightweight, Customizable Overlays for Live Streamers
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#a1a1aa', maxWidth: '620px', lineHeight: 1.6 }}>
            Design sub alerts, goal bars, and custom sponsor graphics in a real-time studio editor. Share access with your moderators and load seamlessly into OBS Studio.
          </p>

          <div style={{ marginTop: '10px' }}>
            <button
              className="studio-btn studio-btn-primary"
              onClick={handleOpenLogin}
              style={{ padding: '12px 28px', fontSize: '0.98rem', fontWeight: 700 }}
            >
              {activeToken ? 'Go to My Studio' : 'Connect Studio'} <ArrowRight size={16} />
            </button>
          </div>
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
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Moderator Access Sharing</h3>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              Streamers can generate a Share Mod Link so moderators can update overlays live on stream.
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

        {/* OBS Setup Steps Card */}
        <div style={{ background: '#0c0c0e', border: '1px solid #27272a', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>How OBS Studio Integration Works</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1' }}>STEP 1</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '2px' }}>Open KobOverlay Studio</div>
              <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '4px' }}>Position your widgets, set colors, and upload sponsor logos.</p>
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

      {/* Dedicated Login / Connect Modal */}
      {isLoginModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#121215',
              border: '1px solid #27272a',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={18} color="#6366f1" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Connect Studio</h3>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              Enter your streamer channel name or account token to open your personalized studio canvas.
            </p>

            {/* Login Form */}
            <form onSubmit={handleConnect} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>
                  Streamer Channel or Token
                </label>
                <input
                  type="text"
                  placeholder="e.g. streamer-name or demo-streamer-token"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="studio-input"
                  style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="studio-btn studio-btn-primary"
                style={{ padding: '12px', fontSize: '0.92rem', fontWeight: 700, width: '100%', justifyContent: 'center' }}
              >
                Launch Studio Canvas <ArrowRight size={16} />
              </button>
            </form>

            {activeToken && (
              <div style={{ fontSize: '0.8rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid #27272a', paddingTop: '14px' }}>
                <CheckCircle size={14} /> Saved session token: <strong>{activeToken}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ padding: '20px', borderTop: '1px solid #27272a', textAlign: 'center', fontSize: '0.8rem', color: '#71717a' }}>
        KobOverlay Studio • Open-Source Streamer Overlay Platform
      </footer>
    </div>
  );
};
