import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { createOverlaySocket } from '../utils/socket';
import { useHistory } from '../utils/useHistory';
import { StudioToolbar } from '../components/StudioToolbar';
import { LayerTree, LayerItem } from '../components/LayerTree';
import { SubAlertWidget, AlertData } from '../components/SubAlertWidget';
import { SubGoalWidget } from '../components/SubGoalWidget';
import { DraggableWidget, WidgetLayout } from '../components/DraggableWidget';
import {
  Layers,
  Sliders,
  Play,
  Zap,
  Sparkles,
  Gift,
  Tv,
  RotateCcw,
  Check,
} from 'lucide-react';

export interface StudioState {
  primaryColor: string;
  alertDuration: number;
  goalTitle: string;
  currentSubs: number;
  targetSubs: number;
  layouts: {
    subGoal: WidgetLayout;
    subAlert: WidgetLayout;
  };
}

const DEFAULT_STUDIO_STATE: StudioState = {
  primaryColor: '#6366f1',
  alertDuration: 5000,
  goalTitle: 'Monthly Sub Goal',
  currentSubs: 14,
  targetSubs: 50,
  layouts: {
    subGoal: { x: 1300, y: 40, width: 360, height: 68, visible: true },
    subAlert: { x: 700, y: 380, width: 480, height: 80, visible: true },
  },
};

export const Dashboard: React.FC = () => {
  const [token] = useState<string>('demo-streamer-token');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Active Sidebar Tab: 'layers' | 'properties' | 'simulator'
  const [activeTab, setActiveTab] = useState<'layers' | 'properties' | 'simulator'>('layers');
  const [selectedLayerId, setSelectedLayerId] = useState<'subGoal' | 'subAlert' | null>('subGoal');
  const [gridSnap, setGridSnap] = useState(true);

  // History Stack Engine (Ctrl+Z and Ctrl+Shift+Z)
  const getInitialState = (): StudioState => {
    const saved = localStorage.getItem(`streampulse_studio_${token}`);
    return saved ? JSON.parse(saved) : DEFAULT_STUDIO_STATE;
  };

  const history = useHistory<StudioState>(getInitialState());

  const { state, set: setStudioState, undo, redo, canUndo, canRedo, historyLength } = history;

  // Active Preview Alert
  const [previewAlert, setPreviewAlert] = useState<AlertData | null>({
    id: 'demo-alert',
    type: 'sub',
    username: 'DemoGamer',
    tier: '1000',
    durationMs: 999999,
    primaryColor: state.primaryColor,
  });

  useEffect(() => {
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

  // Sync state changes with localStorage & WebSockets
  useEffect(() => {
    localStorage.setItem(`streampulse_studio_${token}`, JSON.stringify(state));

    if (socket && connected) {
      socket.emit('update-layout', { token, layout: state.layouts });
    }
  }, [state, socket, connected, token]);

  // Layout position & size update handler
  const handleLayoutChange = (widgetId: 'subGoal' | 'subAlert', newLayout: WidgetLayout) => {
    setStudioState((prev) => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [widgetId]: newLayout,
      },
    }));
  };

  // Toggle Layer Visibility
  const handleToggleVisibility = (widgetId: 'subGoal' | 'subAlert') => {
    setStudioState((prev) => {
      const current = prev.layouts[widgetId];
      return {
        ...prev,
        layouts: {
          ...prev.layouts,
          [widgetId]: {
            ...current,
            visible: current.visible === false ? true : false,
          },
        },
      };
    });
  };

  const handleResetAllLayouts = () => {
    setStudioState(DEFAULT_STUDIO_STATE);
  };

  // Trigger Simulated Sub Alert
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
      durationMs: state.alertDuration,
      primaryColor: state.primaryColor,
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
    const newCount = state.currentSubs + 1;
    setStudioState((prev) => ({ ...prev, currentSubs: newCount }));

    if (socket && connected) {
      socket.emit('update-sub-goal', {
        token,
        title: state.goalTitle,
        currentSubs: newCount,
        targetSubs: state.targetSubs,
      });
    }
  };

  const layers: LayerItem[] = [
    { id: 'subGoal', label: 'Sub Goal Bar', type: 'goal', layout: state.layouts.subGoal },
    { id: 'subAlert', label: 'Sub Alert Popup', type: 'alert', layout: state.layouts.subAlert },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Toolbar */}
      <StudioToolbar
        token={token}
        canUndo={canUndo}
        canRedo={canRedo}
        gridSnap={gridSnap}
        historyLength={historyLength}
        onUndo={undo}
        onRedo={redo}
        onToggleGridSnap={() => setGridSnap(!gridSnap)}
        onResetAllLayouts={handleResetAllLayouts}
      />

      {/* Main Studio Workspace Split */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar Panel */}
        <aside
          style={{
            width: '320px',
            background: '#121215',
            borderRight: '1px solid #27272a',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            userSelect: 'none',
          }}
        >
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #27272a', background: '#09090b' }}>
            <button
              onClick={() => setActiveTab('layers')}
              style={{
                flex: 1,
                padding: '10px 0',
                background: activeTab === 'layers' ? '#121215' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'layers' ? '2px solid #6366f1' : 'none',
                color: activeTab === 'layers' ? '#ffffff' : '#71717a',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Layers size={14} /> Layers
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              style={{
                flex: 1,
                padding: '10px 0',
                background: activeTab === 'properties' ? '#121215' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'properties' ? '2px solid #6366f1' : 'none',
                color: activeTab === 'properties' ? '#ffffff' : '#71717a',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sliders size={14} /> Properties
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              style={{
                flex: 1,
                padding: '10px 0',
                background: activeTab === 'simulator' ? '#121215' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'simulator' ? '2px solid #6366f1' : 'none',
                color: activeTab === 'simulator' ? '#ffffff' : '#71717a',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Play size={14} /> Test
            </button>
          </div>

          {/* Sidebar Tab Content */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
            {/* Tab 1: Layer Tree */}
            {activeTab === 'layers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <LayerTree
                  layers={layers}
                  selectedLayerId={selectedLayerId}
                  onSelectLayer={(id) => setSelectedLayerId(id)}
                  onToggleVisibility={handleToggleVisibility}
                />

                <div style={{ borderTop: '1px solid #27272a', paddingTop: '16px' }}>
                  <button className="studio-btn" onClick={handleResetAllLayouts} style={{ width: '100%' }}>
                    <RotateCcw size={14} /> Reset Layout Positions
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Properties Inspector */}
            {activeTab === 'properties' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa' }}>Visual Inspector</div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#d4d4d8' }}>
                    Accent Highlight Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={state.primaryColor}
                      onChange={(e) => setStudioState((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      style={{ width: '36px', height: '32px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={state.primaryColor}
                      onChange={(e) => setStudioState((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      className="studio-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#d4d4d8' }}>
                    Sub Goal Title
                  </label>
                  <input
                    type="text"
                    value={state.goalTitle}
                    onChange={(e) => setStudioState((prev) => ({ ...prev, goalTitle: e.target.value }))}
                    className="studio-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#d4d4d8' }}>
                      Current Subs
                    </label>
                    <input
                      type="number"
                      value={state.currentSubs}
                      onChange={(e) => setStudioState((prev) => ({ ...prev, currentSubs: Number(e.target.value) }))}
                      className="studio-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#d4d4d8' }}>
                      Target Subs
                    </label>
                    <input
                      type="number"
                      value={state.targetSubs}
                      onChange={(e) => setStudioState((prev) => ({ ...prev, targetSubs: Number(e.target.value) }))}
                      className="studio-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#d4d4d8' }}>
                    Alert Duration ({state.alertDuration / 1000}s)
                  </label>
                  <input
                    type="range"
                    min={2000}
                    max={10000}
                    step={500}
                    value={state.alertDuration}
                    onChange={(e) => setStudioState((prev) => ({ ...prev, alertDuration: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: '#6366f1' }}
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Test Event Simulator */}
            {activeTab === 'simulator' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa' }}>Test Event Triggers</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button className="studio-btn studio-btn-primary" onClick={() => triggerTestAlert('sub', '1000')}>
                    <Zap size={14} /> Test Tier 1 Sub
                  </button>
                  <button className="studio-btn" onClick={() => triggerTestAlert('sub', 'Prime')}>
                    <Sparkles size={14} /> Test Prime Sub
                  </button>
                  <button className="studio-btn" onClick={() => triggerTestAlert('resub', '2000')}>
                    <Zap size={14} /> Test 6-Month Resub
                  </button>
                  <button className="studio-btn" onClick={() => triggerTestAlert('subgift', '1000')}>
                    <Gift size={14} /> Test Gift Sub
                  </button>
                </div>

                <div style={{ borderTop: '1px solid #27272a', paddingTop: '12px' }}>
                  <button className="studio-btn studio-btn-active" onClick={handleIncrementSubGoal} style={{ width: '100%' }}>
                    +1 Sub Goal ({state.currentSubs}/{state.targetSubs})
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Canvas Viewport (Outer Area - Dark Background Only) */}
        <main
          className="canvas-viewport-bg"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Scaled 1920x1080 Movable Work Area (Grid Lines apply ONLY here) */}
          <div
            className={`canvas-workspace-bg ${gridSnap ? 'canvas-grid-lines' : ''}`}
            style={{
              width: '100%',
              maxHeight: '100%',
              aspectRatio: '16 / 9',
              borderRadius: '8px',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              overflow: 'hidden',
            }}
          >
            {/* Sub Goal Draggable Widget */}
            <DraggableWidget
              id="subGoal"
              label="Sub Goal Bar"
              layout={state.layouts.subGoal}
              defaultWidth={360}
              defaultHeight={68}
              isEditable={true}
              isSelected={selectedLayerId === 'subGoal'}
              gridSnap={gridSnap}
              onSelect={() => setSelectedLayerId('subGoal')}
              onLayoutChange={(newLayout) => handleLayoutChange('subGoal', newLayout)}
            >
              <SubGoalWidget
                title={state.goalTitle}
                currentSubs={state.currentSubs}
                targetSubs={state.targetSubs}
                primaryColor={state.primaryColor}
              />
            </DraggableWidget>

            {/* Sub Alert Draggable Widget */}
            <DraggableWidget
              id="subAlert"
              label="Sub Alert Popup"
              layout={state.layouts.subAlert}
              defaultWidth={480}
              defaultHeight={80}
              isEditable={true}
              isSelected={selectedLayerId === 'subAlert'}
              gridSnap={gridSnap}
              onSelect={() => setSelectedLayerId('subAlert')}
              onLayoutChange={(newLayout) => handleLayoutChange('subAlert', newLayout)}
            >
              <SubAlertWidget alert={previewAlert} />
            </DraggableWidget>

            {/* Viewport Specs Footer Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '12px',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#52525b',
                fontFamily: 'var(--font-mono)',
                pointerEvents: 'none',
              }}
            >
              1920×1080 CANVAS • CTRL+Z UNDO READY
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
