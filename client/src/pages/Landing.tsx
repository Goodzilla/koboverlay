import React, { useState } from 'react';
import { Tv, Sparkles, ShieldCheck, Zap, Copy, ExternalLink, ArrowRight, Layers, CheckCircle } from 'lucide-react';

export const Landing: React.FC = () => {
  const [inputToken, setInputToken] = useState('');
  const [copiedObs, setCopiedObs] = useState(false);

  const handleLaunchNew = () => {
    window.location.href = '/studio';
  };

  const handleConnectToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken.trim()) {
      window.location.href = `/studio?token=${encodeURIComponent(inputToken.trim())}`;
    }
  };

  const sampleObsUrl = `${window.location.origin}/overlay/demo-streamer-token`;

  const copyObsUrl = () => {
    navigator.clipboard.writeText(sampleObsUrl);
    setCopiedObs(true);
    setTimeout(() => setCopiedObs(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f4f4f5', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="studio-btn studio-btn-primary" onClick={handleLaunchNew}>
            Open Studio <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '60px 24px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
        {/* Hero Title & CTAs */}
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

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, maxWidth: '800px', color: '#ffffff' }}>
            Lightweight, Customizable Overlays for Live Streamers
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#a1a1aa', maxWidth: '640px', lineHeight: 1.6 }}>
            Design sub alerts, goal bars, and custom sponsor graphics in a real-time 1920x1080 studio editor. Share access with your moderators and load seamlessly into OBS Studio.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
            <button
              className="studio-btn studio-btn-primary"
              onClick={handleLaunchNew}
              style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700 }}
            >
              Launch Studio Canvas <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Connect Token & Shared Mod Access Box */}
        <div
          style={{
            background: '#121215',
            border: '1px solid #27272a',
            borderRadius: '16px',
            padding: '32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            alignItems: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Left Column: Direct Connect by Token */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Connect Existing Studio</h3>
            <p style={{ fontSize: '0.88rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              Enter your streamer token or a moderator invite token to access your studio canvas.
            </p>

            <form onSubmit={handleConnectToken} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Enter streamer token (e.g. demo-streamer-token)"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                className="studio-input"
                style={{ flex: 1 }}
              />
              <button type="submit" className="studio-btn studio-btn-primary" style={{ padding: '8px 16px' }}>
                Join <ExternalLink size={14} />
              </button>
            </form>
          </div>

          {/* Right Column: Moderator Delegation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '1px solid #27272a', paddingLeft: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontWeight: 700, fontSize: '0.9rem' }}>
              <ShieldCheck size={18} /> Moderator Access Delegation
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              Streamers can generate a direct <strong>Share Mod Link</strong> inside the studio. Your moderators can edit layout positions, update text, and swap sponsor images live on stream without touching your OBS settings.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Zap size={20} color="#6366f1" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Zero OBS Render Lag</h4>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              Ultra-lightweight browser source output rendered via WebSockets at 60fps with zero frame drops.
            </p>
          </div>

          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Layers size={20} color="#38bdf8" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Studio Canvas & Undo</h4>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              1920x1080 resolution workspace with 20px grid snap alignment, Ctrl+Z history stack, and pixel coordinates.
            </p>
          </div>

          <div style={{ background: '#121215', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <CheckCircle size={20} color="#10b981" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Local Computer Uploads</h4>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              Upload custom sponsor logos, sub badges, or WebP/GIF animations directly from your computer.
            </p>
          </div>
        </div>

        {/* 3-Step OBS Integration */}
        <div style={{ background: '#0c0c0e', border: '1px solid #27272a', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textAlign: 'center' }}>3-Step OBS Studio Integration</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6366f1' }}>STEP 1</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Open KobOverlay Studio</div>
              <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Position your widgets, set colors, and upload sponsor logos.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6366f1' }}>STEP 2</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Copy OBS Browser Source URL</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input type="text" readOnly value={sampleObsUrl} className="studio-input" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }} />
                <button className="studio-btn" onClick={copyObsUrl} style={{ padding: '6px' }} title="Copy URL">
                  <Copy size={12} />
                </button>
              </div>
              {copiedObs && <span style={{ fontSize: '0.7rem', color: '#10b981' }}>Copied to clipboard!</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6366f1' }}>STEP 3</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Paste into OBS Studio</div>
              <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Add Browser Source -&gt; Set 1920x1080 -&gt; Paste URL. Done!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer style={{ padding: '20px', borderTop: '1px solid #27272a', textAlign: 'center', fontSize: '0.8rem', color: '#71717a' }}>
        KobOverlay Studio • Open-Source Streamer Overlay Platform
      </footer>
    </div>
  );
};
