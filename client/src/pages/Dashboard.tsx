import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { createOverlaySocket } from '../utils/socket';
import { useStudioState } from '../hooks/useStudioState';
import { useAlertFeed } from '../hooks/useAlertFeed';
import { StudioToolbar } from '../components/StudioToolbar';
import { StudioCanvas } from '../components/studio/StudioCanvas';
import { RightAlertSidebar } from '../components/studio/RightAlertSidebar';
import { LayerTree } from '../components/LayerTree';
import { AddWidgetModal, WidgetType } from '../components/AddWidgetModal';
import { ModTokenManagerModal } from '../components/ModTokenManagerModal';
import { AlertData } from '../components/SubAlertWidget';
import {
  Sliders,
  Play,
  RotateCcw,
  Zap,
  Sparkles,
  Crown,
  Gift,
  Users,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Resolve overlay token & current user from URL / LocalStorage JWT
  const [token] = useState<string>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwtParam = urlParams.get('jwt');
    if (jwtParam) {
      localStorage.setItem('koboverlay_jwt', jwtParam);
      window.history.replaceState({}, '', '/studio');
    }

    const storedJwt = jwtParam || localStorage.getItem('koboverlay_jwt');
    if (storedJwt) {
      try {
        const payload = JSON.parse(atob(storedJwt.split('.')[1]));
        if (payload.overlayToken) return payload.overlayToken;
      } catch (e) {}
    }
    return 'demo-streamer-token';
  });

  const [currentUser] = useState<{ id: string; username: string; displayName: string; profileImage: string; overlayToken: string } | null>(() => {
    const storedJwt = localStorage.getItem('koboverlay_jwt');
    if (!storedJwt) return null;
    try {
      const payload = JSON.parse(atob(storedJwt.split('.')[1]));
      return { id: payload.userId, username: payload.username, displayName: payload.displayName, profileImage: payload.profileImage, overlayToken: payload.overlayToken };
    } catch (e) {
      return null;
    }
  });

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Custom Hooks
  const {
    state,
    selectedWidgetId,
    setSelectedWidgetId,
    undo,
    redo,
    canUndo,
    canRedo,
    handleAddWidget,
    handleDuplicateWidget,
    handleDeleteWidget,
    handleToggleVisibility,
    handleToggleMute,
    handleLayoutChange,
    handleResetWidgetSize,
    handleUpdateWidgetConfig,
    handleCenterWidget,
    handleScaleWidget,
    handleResetAllLayouts,
  } = useStudioState();

  const {
    alertQueue,
    setAlertQueue,
    alertHistory,
    triggerTestAlert,
    handleAlertComplete,
    handleSkipAlert,
    handleClearQueue,
    handleReplayAlert,
    handleClearHistory,
  } = useAlertFeed(state.widgets);

  // UI State
  const [activeTab, setActiveTab] = useState<'layers' | 'simulator'>('layers');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModTokenModalOpen, setIsModTokenModalOpen] = useState(false);
  const [gridSnap, setGridSnap] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  // Socket Connection Setup
  useEffect(() => {
    const sock = createOverlaySocket(token);
    setSocket(sock);

    sock.on('connect', () => setConnected(true));
    sock.on('disconnect', () => setConnected(false));

    sock.on('new-alert', (alert: AlertData) => {
      setAlertQueue((prev) => [...prev, alert]);
      setIsRightSidebarOpen(true);
    });

    return () => {
      sock.disconnect();
    };
  }, [token, setAlertQueue]);

  // Sync Studio State to Server
  useEffect(() => {
    if (socket && connected) {
      socket.emit('update-config', {
        widgets: state.widgets,
      });
    }
  }, [socket, connected, state.widgets]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#09090b', color: '#ffffff' }}>
      {/* Studio Top Toolbar — KobOverlay Studio */}
      <StudioToolbar
        token={token}
        userId={currentUser?.id}
        canUndo={canUndo}
        canRedo={canRedo}
        gridSnap={gridSnap}
        historyLength={0}
        alertQueueCount={alertQueue.length}
        isRightSidebarOpen={isRightSidebarOpen}
        onUndo={undo}
        onRedo={redo}
        onToggleGridSnap={() => setGridSnap(!gridSnap)}
        onResetAllLayouts={handleResetAllLayouts}
        onOpenModManager={() => setIsModTokenModalOpen(true)}
        onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />

      {/* Main Studio Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Left Sidebar Panel */}
        <aside
          style={{
            width: '420px',
            background: '#121215',
            borderRight: '1px solid #27272a',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #27272a' }}>
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
              <Sliders size={14} /> Widgets & Inspector
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

          {/* Sidebar Content Area */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
            {activeTab === 'layers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <LayerTree
                  widgets={state.widgets}
                  selectedWidgetId={selectedWidgetId}
                  onSelectWidget={(id) => setSelectedWidgetId(id)}
                  onToggleVisibility={handleToggleVisibility}
                  onToggleMute={handleToggleMute}
                  onDuplicateWidget={handleDuplicateWidget}
                  onDeleteWidget={handleDeleteWidget}
                  onCenterWidget={handleCenterWidget}
                  onResetWidgetSize={handleResetWidgetSize}
                  onUpdateWidgetConfig={handleUpdateWidgetConfig}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />

              </div>
            )}

            {activeTab === 'simulator' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '10px 12px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>Smart Alert Simulator</div>
                  <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '2px', lineHeight: 1.4 }}>
                    Triggers live overlay alerts with real-time tier matching & sound previews.
                  </div>
                </div>

                {/* Single Subs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa' }}>SUBSCRIBE EVENTS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button className="studio-btn studio-btn-primary" onClick={() => triggerTestAlert('sub', '1000', 1)} style={{ fontSize: '0.72rem' }}>
                      <Zap size={12} /> Tier 1 Sub
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('sub', 'Prime', 1)} style={{ fontSize: '0.72rem' }}>
                      <Sparkles size={12} color="#a855f7" /> Prime Sub
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('sub', '3000', 1)} style={{ fontSize: '0.72rem', gridColumn: 'span 2' }}>
                      <Crown size={12} color="#f59e0b" /> Tier 3 Sub ($24.99)
                    </button>
                  </div>
                </div>

                {/* Gifted Subs Tiers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa' }}>GIFTED SUBS TIERS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button className="studio-btn" onClick={() => triggerTestAlert('subgift', '1000', 1)} style={{ fontSize: '0.72rem' }}>
                      <Gift size={12} color="#ec4899" /> 1 Gift Sub
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('subgift', '1000', 5)} style={{ fontSize: '0.72rem', borderColor: '#ec4899' }}>
                      <Gift size={12} color="#ec4899" /> 5x Gifted Subs
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('subgift', '1000', 20)} style={{ fontSize: '0.72rem', gridColumn: 'span 2', background: 'rgba(236, 72, 153, 0.15)', borderColor: '#ec4899' }}>
                      <Gift size={12} color="#ec4899" /> 20x Gifted Subs
                    </button>
                  </div>
                </div>

                {/* Re-subs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa' }}>RE-SUBS & TENURE</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button className="studio-btn" onClick={() => triggerTestAlert('resub', '1000', 1, 3)} style={{ fontSize: '0.72rem' }}>
                      <RotateCcw size={12} /> 3-Month Resub
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('resub', '2000', 1, 12)} style={{ fontSize: '0.72rem', borderColor: '#6366f1' }}>
                      <Crown size={12} color="#6366f1" /> 12-Month Resub
                    </button>
                  </div>
                </div>

                {/* Bits Cheer Tiers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa' }}>BITS & CHEER TIERS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button className="studio-btn" onClick={() => triggerTestAlert('bits', '1000', 100)} style={{ fontSize: '0.72rem' }}>
                      <Zap size={12} color="#eab308" /> 100 Bits
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('bits', '1000', 1000)} style={{ fontSize: '0.72rem', borderColor: '#eab308' }}>
                      <Zap size={12} color="#eab308" /> 1,000 Bits
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('bits', '1000', 5000)} style={{ fontSize: '0.72rem', gridColumn: 'span 2', background: 'rgba(234, 179, 8, 0.15)', borderColor: '#eab308' }}>
                      <Zap size={12} color="#eab308" /> 5,000 Bits
                    </button>
                  </div>
                </div>

                {/* Stream Raids */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa' }}>STREAM RAIDS</div>
                  <button className="studio-btn" onClick={() => triggerTestAlert('raid', '1000', 50)} style={{ fontSize: '0.72rem', width: '100%' }}>
                    <Users size={12} color="#10b981" /> Raid 50 Viewers
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Live Studio Canvas Container */}
        <StudioCanvas
          widgets={state.widgets}
          selectedWidgetId={selectedWidgetId}
          gridSnap={gridSnap}
          alertQueue={alertQueue}
          onSelectWidget={setSelectedWidgetId}
          onLayoutChange={handleLayoutChange}
          onScaleWidget={handleScaleWidget}
          onAlertComplete={handleAlertComplete}
        />

        {/* Expandable Right Sidebar for Alert Queue & History */}
        <RightAlertSidebar
          queue={alertQueue}
          history={alertHistory}
          isOpen={isRightSidebarOpen}
          onToggleOpen={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          onSkipAlert={handleSkipAlert}
          onClearQueue={handleClearQueue}
          onReplayAlert={handleReplayAlert}
          onClearHistory={handleClearHistory}
        />
      </div>

      {/* Modals */}
      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWidget={(type: WidgetType) => {
          handleAddWidget(type);
          setIsAddModalOpen(false);
        }}
      />

      <ModTokenManagerModal
        isOpen={isModTokenModalOpen}
        onClose={() => setIsModTokenModalOpen(false)}
        userId={currentUser?.id || 'demo-user'}
      />
    </div>
  );
};
