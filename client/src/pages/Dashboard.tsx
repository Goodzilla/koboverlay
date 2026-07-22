import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { createOverlaySocket } from '../utils/socket';
import { SubAlertWidget, AlertData } from '../components/SubAlertWidget';
import { SubGoalWidget } from '../components/SubGoalWidget';
import { DraggableWidget, WidgetPosition } from '../components/DraggableWidget';
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
  Move,
  Lock,
  Unlock,
  RotateCcw,
} from 'lucide-react';

interface LayoutState {
  subGoal: WidgetPosition;
  subAlert: WidgetPosition;
}

const DEFAULT_LAYOUT: LayoutState = {
  subGoal: { x: 65, y: 5 },
  subAlert: { x: 30, y: 35 },
};

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

  // Interactive Layout Positioning State
  const [isEditMode, setIsEditMode] = useState(true);
  const [layout, setLayout] = useState<LayoutState>(() => {
    const saved = localStorage.getItem(`streampulse_layout_${token}`);
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
  });

  // Active Preview Alert State
  const [previewAlert, setPreviewAlert] = useState<AlertData | null>({
    id: 'demo-alert',
    type: 'sub',
    username: 'DemoGamer',
    tier: '1000',
    durationMs: 999999, // Keep visible in edit mode for positioning
    primaryColor: '#7c3aed',
  });

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

  const handleLayoutChange = (widgetId: 'subGoal' | 'subAlert', newPos: WidgetPosition) => {
    const updatedLayout = {
      ...layout,
      [widgetId]: newPos,
    };
    setLayout(updatedLayout);

    // Save locally
    localStorage.setItem(`streampulse_layout_${token}`, JSON.stringify(updatedLayout));

    // Broadcast live over WebSockets to OBS Studio!
    if (socket && connected) {
      socket.emit('update-layout', { token, layout: updatedLayout });
    }
  };

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
    localStorage.setItem(`streampulse_layout_${token}`, JSON.stringify(DEFAULT_LAYOUT));
    if (socket && connected) {
      socket.emit('update-layout', { token, layout: DEFAULT_LAYOUT });
    }
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

    if (socket && connected) {
      socket.emit('trigger-alert', { token, alert: alertPayload });
    }

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
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Top Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
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
              LAYOUT ENGINE ACTIVE
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Real-time OBS Browser Source Overlay & Interactive Drag-and-Drop Control Panel
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
      <section className="glass-panel" style={{ padding: '20px 24px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#06b6d4" />
          Your OBS Studio Browser Source Link
        </h2>
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

      {/* Main Grid: Left Controls & Right Drag-and-Drop Canvas */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '28px' }}>
        {/* Left Column: Test Event Simulator & Customization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Test Event Simulator */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={20} color="#a855f7" />
              Test Event Simulator
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => triggerTestAlert('sub', '1000')}>
                <Zap size={16} /> Tier 1 Sub
              </button>
              <button className="btn btn-accent" onClick={() => triggerTestAlert('sub', 'Prime')}>
                <Sparkles size={16} /> Prime Sub
              </button>
              <button className="btn btn-secondary" onClick={() => triggerTestAlert('resub', '2000')}>
                <Zap size={16} /> 6-Mo Resub
              </button>
              <button className="btn btn-secondary" onClick={() => triggerTestAlert('subgift', '1000')}>
                <Gift size={16} /> Gift Sub
              </button>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' }}
                onClick={handleIncrementSubGoal}
              >
                +1 Increment Sub Goal ({currentSubs}/{targetSubs})
              </button>
            </div>
          </div>

          {/* Visual Customization */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={20} color="#ec4899" />
              Visual Settings
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Primary Accent Glow Color
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ width: '44px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                  />
                  <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Sub Goal Title
                </label>
                <input type="text" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Current</label>
                  <input type="number" value={currentSubs} onChange={(e) => setCurrentSubs(Number(e.target.value))} className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Target</label>
                  <input type="number" value={targetSubs} onChange={(e) => setTargetSubs(Number(e.target.value))} className="input-field" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Drag-and-Drop Overlay Canvas */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Move size={20} color="#06b6d4" />
              Interactive Drag & Drop Canvas
            </h2>

            {/* Edit / Lock Toggle Controls */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={resetLayout} title="Reset to Default Positions">
                <RotateCcw size={16} /> Reset
              </button>
              <button
                className={`btn ${isEditMode ? 'btn-accent' : 'btn-secondary'}`}
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? <Unlock size={16} /> : <Lock size={16} />}
                {isEditMode ? 'Drag Mode ON' : 'Locked Mode'}
              </button>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
            💡 <strong>Click and drag elements</strong> anywhere on the 1920x1080 canvas below. Positions are saved automatically and synced live to your OBS Studio overlay!
          </p>

          {/* Interactive 1920x1080 Simulated Canvas */}
          <div
            style={{
              flex: 1,
              minHeight: '480px',
              borderRadius: '16px',
              background: 'radial-gradient(circle at center, #1e173b 0%, #0a0714 100%)',
              border: `2px ${isEditMode ? 'dashed #a855f7' : 'solid rgba(255,255,255,0.1)'}`,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
            }}
          >
            {/* Draggable Sub Goal Widget */}
            <DraggableWidget
              id="subGoal"
              label="Sub Goal Bar"
              position={layout.subGoal}
              isEditable={isEditMode}
              onPositionChange={(newPos) => handleLayoutChange('subGoal', newPos)}
            >
              <SubGoalWidget title={goalTitle} currentSubs={currentSubs} targetSubs={targetSubs} primaryColor={primaryColor} />
            </DraggableWidget>

            {/* Draggable Sub Alert Widget */}
            <DraggableWidget
              id="subAlert"
              label="Sub Alert Popup"
              position={layout.subAlert}
              isEditable={isEditMode}
              onPositionChange={(newPos) => handleLayoutChange('subAlert', newPos)}
            >
              <SubAlertWidget alert={previewAlert} />
            </DraggableWidget>

            {/* Canvas Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '1px',
                pointerEvents: 'none',
              }}
            >
              OBS CANVAS 1920x1080 • LIVE SOCKET SYNC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
