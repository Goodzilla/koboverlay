import React, { useState, useEffect } from 'react';
import { Tv, Sparkles, ShieldCheck, Zap, ArrowRight, Layers, CheckCircle } from 'lucide-react';

export const Landing: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [existingToken, setExistingToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('koboverlay_active_token');
    if (saved) {
      setExistingToken(saved);
    }
  }, []);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenToUse = tokenInput.trim() || existingToken || 'demo-streamer-token';
    localStorage.setItem('koboverlay_active_token', tokenToUse);
    window.location.href = `/studio?token=${encodeURIComponent(tokenToUse)}`;
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

        {/* Header Action Button (Single context-aware button) */}
        {existingToken ? (
          <a
            href={`/studio?token=${encodeURIComponent(existingToken)}`}
            className="studio-btn studio-btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Go to My Studio <ArrowRight size={14} />
          </a>
        ) : (
          <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Open-Source Overlay Engine</span>
        )}
      </header>

      {/* Main Hero Container */}
      <main style={{ flex: 1, maxWidth: '960px', width: '100%', margin: '0 auto', padding: '60px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {/* Hero Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
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

          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, color: '#ffffff' }}>
            Lightweight, Customizable Overlays for Live Streamers
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#a1a1aa', maxWidth: '600px', lineHeight: 1.6 }}>
            Design sub alerts, goal bars, and custom sponsor graphics in a real-time studio editor. Connect your streamer token below to get started.
          </p>
        </div>

        {/* Single Primary Connection Card */}
        <div
          style={{
            background: '#121215',
            border: '1px solid #27272a',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Connect Streamer Studio</h2>
            <p style={{ fontSize: '0.88rem', color: '#a1a1aa' }}>
              Enter your Channel Name or Token to launch your personalized studio canvas.
            </p>
          </div>

          <form onSubmit={handleConnect} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="e.g. streamer-token or channel name..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="studio-input"
              style={{ flex: 1, minWidth: '240px', padding: '12px 16px', fontSize: '0.95rem' }}
            />
            <button
              type="submit"
              className="studio-btn studio-btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700 }}
            >
              Connect & Open Studio <ArrowRight size={16} />
            </button>
          </form>

          {existingToken && (
            <div style={{ fontSize: '0.8rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <CheckCircle size={14} /> Currently saved session: <strong>{existingToken}</strong>
            </div>
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

      {/* Footer */}
      <footer style={{ padding: '20px', borderTop: '1px solid #27272a', textAlign: 'center', fontSize: '0.8rem', color: '#71717a' }}>
        KobOverlay Studio • Open-Source Streamer Overlay Platform
      </footer>
    </div>
  );
};
