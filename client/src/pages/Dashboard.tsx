import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { createOverlaySocket } from '../utils/socket';
import { SubAlertWidget, AlertData } from '../components/SubAlertWidget';
import { SubGoalWidget } from '../components/SubGoalWidget';
import {
  Radio,
  Copy,
  Check,
  Play,
  Settings,
  Sparkles,
  Zap,
  Gift,
  ExternalLink,
  Sliders,
  Tv,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [token] = useState<string>('demo-streamer-token');
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Overlay Settings
  const [primaryColor, setPrimaryColor] = useState('#7c3aed');
  const [alertDuration, setAlertDuration] = useState(5000);
  const [goalTitle, setGoalTitle] = useState('Monthly Sub Goal');
  const [currentSubs, setCurrentSubs] = useState(14);
  const [targetSubs, setTargetSubs] = useState(50);

  // Active Preview State
  const [previewAlert, setPreviewAlert] = useState<AlertData | null>(null);

  useEffect(() => {
    // Initialize Socket.io connection to backend server
    const newSocket = createOverlaySocket();

    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('join-overlay', { token });
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const overlayUrl = `${window.location.origin}/overlay/${token}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerTestAlert = (type: 'sub' | 'resub' | 'subgift', tier: 'Prime' | '1000' | '2000' | '3000') => {
    const usernames = ['PixelNinja', 'CyberKnight', 'NeonStreamer', 'VortexPro', 'AuraGamer'];
    const randomUser = usernames[Math.floor(Math.random() * usernames.length)];
    const randomMonths = type === 'resub' ? Math.floor(Math.random() * 12) + 2 : 1;

    const alertPayload: Omit<AlertData, 'id'> = {
      type,
      username: randomUser,
      tier,
      months: randomMonths,
      message: type === 'resub' ? 'Loving the stream! Keep up the epic work 🔥' : undefined,
      durationMs: alertDuration,
      primaryColor,
    };

    // Emit to Socket.io so open OBS overlay browsers update live!
    if (socket && connected) {
      socket.emit('trigger-alert', { token, alert: alertPayload });
    }

    // Update local preview immediately
    setPreviewAlert({
      ...alertPayload,
      id: Math.random().toString(36).substring(2, 9),
    });
  };

  const handleIncrementSubGoal = () => {
    const newCount = currentSubs + 1;
    setCurrentSubs(newCount);

    if (socket && connected) {
      socket.emit('update-sub-goal', {
        token,
        title: goalTitle,
        currentSubs: newCount,
        targetSubs,
      });
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Top Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Tv size={32} color="#a855f7" />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900 }} className="gradient-text">
              StreamPulse
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '12px',
                background: 'rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(124, 58, 237, 0.4)',
                color: '#c084fc',
              }}
            >
              OPEN SOURCE v1.0
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Real-time OBS Browser Source Overlay & Streamer Control Panel
          </p>
        </div>

        {/* Server Connection Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            background: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${connected ? '#10b981' : '#ef4444'}`,
            fontSize: '0.85rem',
            fontWeight: 700,
            color: connected ? '#10b981' : '#ef4444',
          }}
        >
          <Radio size={16} className={connected ? 'animate-pulse' : ''} />
          {connected ? 'SOCKET ENGINE LIVE' : 'OFFLINE MODE'}
        </div>
      </header>

      {/* OBS URL Banner */}
      <section className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#06b6d4" />
          Your OBS Studio Browser Source Link
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
          Add this URL as a <strong>Browser Source</strong> in OBS Studio (Recommended Resolution: 1920x1080).
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" readOnly value={overlayUrl} className="input-field" style={{ fontFamily: 'monospace' }} />
          <button className="btn btn-primary" onClick={handleCopyUrl}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <a
            href={overlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={18} />
            Test Window
          </a>
        </div>
      </section>

      {/* Main Grid: Control Panel & Live Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        {/* Left Column: Test Event Generator & Customization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Test Event Simulator */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={20} color="#a855f7" />
              Test Event Simulator
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '18px' }}>
              Click any trigger below to test your sub alerts and goal counters live on stream or in OBS!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => triggerTestAlert('sub', '1000')}>
                <Zap size={16} /> Test Tier 1 Sub
              </button>
              <button className="btn btn-accent" onClick={() => triggerTestAlert('sub', 'Prime')}>
                <Sparkles size={16} /> Test Prime Sub
              </button>
              <button className="btn btn-secondary" onClick={() => triggerTestAlert('resub', '2000')}>
                <Zap size={16} /> Test 6-Mo Resub
              </button>
              <button className="btn btn-secondary" onClick={() => triggerTestAlert('subgift', '1000')}>
                <Gift size={16} /> Test Gift Sub
              </button>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' }}
                onClick={handleIncrementSubGoal}
              >
                +1 Increment Sub Goal Counter ({currentSubs}/{targetSubs})
              </button>
            </div>
          </div>

          {/* Overlay Settings */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={20} color="#ec4899" />
              Visual Customization
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Primary Accent Glow Color
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ width: '48px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                  />
                  <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Alert Display Duration ({alertDuration / 1000}s)
                </label>
                <input
                  type="range"
                  min={2000}
                  max={10000}
                  step={500}
                  value={alertDuration}
                  onChange={(e) => setAlertDuration(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#a855f7' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Sub Goal Title
                </label>
                <input type="text" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Current Subs
                  </label>
                  <input
                    type="number"
                    value={currentSubs}
                    onChange={(e) => setCurrentSubs(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Target Subs
                  </label>
                  <input
                    type="number"
                    value={targetSubs}
                    onChange={(e) => setTargetSubs(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Overlay Preview */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tv size={20} color="#06b6d4" />
            Live Overlay Preview
          </h2>

          <div
            style={{
              flex: 1,
              minHeight: '380px',
              borderRadius: '16px',
              background: 'radial-gradient(circle at center, #1b1535 0%, #0a0714 100%)',
              border: '2px dashed rgba(124, 58, 237, 0.4)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px',
              overflow: 'hidden',
            }}
          >
            {/* Sub Goal Widget Preview Top */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SubGoalWidget title={goalTitle} currentSubs={currentSubs} targetSubs={targetSubs} primaryColor={primaryColor} />
            </div>

            {/* Sub Alert Widget Preview Middle */}
            <div style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {previewAlert ? (
                <SubAlertWidget alert={previewAlert} onAnimationComplete={() => setPreviewAlert(null)} />
              ) : (
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>
                  Overlay Active • Waiting for stream events or test triggers...
                </div>
              )}
            </div>

            {/* Simulated OBS Resolution Tag */}
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#64748b',
                textAlign: 'right',
                letterSpacing: '1px',
              }}
            >
              SIMULATED OBS CANVAS 1920x1080
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
