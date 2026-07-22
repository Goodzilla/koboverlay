import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { createOverlaySocket } from '../utils/socket';
import { useHistory } from '../utils/useHistory';
import { StudioToolbar } from '../components/StudioToolbar';
import { LayerTree, WidgetInstance } from '../components/LayerTree';
import { AddWidgetModal, WidgetType } from '../components/AddWidgetModal';
import { SubAlertWidget, AlertData } from '../components/SubAlertWidget';
import { SubGoalWidget } from '../components/SubGoalWidget';
import { CustomImageWidget } from '../components/CustomImageWidget';
import { DraggableWidget, WidgetLayout } from '../components/DraggableWidget';
import {
  Layers,
  Sliders,
  Play,
  Zap,
  Sparkles,
  Gift,
  RotateCcw,
  Plus,
  Crown,
  Users,
} from 'lucide-react';

export interface StudioState {
  primaryColor: string;
  alertDuration: number;
  widgets: WidgetInstance[];
}

const DEFAULT_WIDGETS: WidgetInstance[] = [
  {
    id: 'subGoal_default',
    type: 'subGoal',
    label: 'Sub Goal Bar',
    layout: { x: 1300, y: 40, width: 360, height: 68, visible: true },
    config: {
      title: 'Monthly Sub Goal',
      currentSubs: 14,
      targetSubs: 50,
      primaryColor: '#6366f1',
    },
  },
  {
    id: 'subAlert_default',
    type: 'subAlert',
    label: 'Sub Alert Popup',
    layout: { x: 700, y: 380, width: 480, height: 80, visible: true },
    config: {
      title: 'Sub Alert Popup',
      primaryColor: '#38bdf8',
      alertDuration: 5000,
    },
  },
];

const DEFAULT_STUDIO_STATE: StudioState = {
  primaryColor: '#6366f1',
  alertDuration: 5000,
  widgets: DEFAULT_WIDGETS,
};

import { ModTokenManagerModal } from '../components/ModTokenManagerModal';

export const Dashboard: React.FC = () => {
  // Resolve overlay token: from JWT redirect, stored JWT, or fall back to demo
  const [token] = useState<string>(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // JWT passed from Twitch OAuth redirect
    const jwtParam = urlParams.get('jwt');
    if (jwtParam) {
      localStorage.setItem('koboverlay_jwt', jwtParam);
      window.history.replaceState({}, '', '/studio');
    }

    // Decode overlayToken from stored JWT payload (middle segment, base64)
    const storedJwt = jwtParam || localStorage.getItem('koboverlay_jwt');
    if (storedJwt) {
      try {
        const payload = JSON.parse(atob(storedJwt.split('.')[1]));
        if (payload.overlayToken) return payload.overlayToken;
      } catch (e) {}
    }

    return 'demo-streamer-token';
  });

  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; displayName: string; profileImage: string; overlayToken: string } | null>(() => {
    const storedJwt = localStorage.getItem('koboverlay_jwt');
    if (!storedJwt) return null;
    try {
      const payload = JSON.parse(atob(storedJwt.split('.')[1]));
      return { id: payload.userId, username: payload.username, displayName: payload.displayName, profileImage: payload.profileImage, overlayToken: payload.overlayToken };
    } catch (e) { return null; }
  });

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Studio UI Controls
  const [activeTab, setActiveTab] = useState<'layers' | 'simulator'>('layers');
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>('subGoal_default');
  const [gridSnap, setGridSnap] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModManagerOpen, setIsModManagerOpen] = useState(false);

  // History Stack Engine (Ctrl+Z and Ctrl+Shift+Z)
  const getInitialState = (): StudioState => {
    const saved = localStorage.getItem(`koboverlay_studio_${token}`);
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

  // Sync state with localStorage & WebSockets
  useEffect(() => {
    localStorage.setItem(`koboverlay_studio_${token}`, JSON.stringify(state));

    if (socket && connected) {
      socket.emit('update-layout', { token, widgets: state.widgets });
    }
  }, [state, socket, connected, token]);

  // --- WIDGET MANAGEMENT HANDLERS ---
  const handleAddWidget = (type: WidgetType) => {
    const newId = `${type}_${Math.random().toString(36).substring(2, 7)}`;
    let defaultWidth = 360;
    let defaultHeight = 68;
    let defaultLabel = 'Sub Goal Bar';

    if (type === 'subAlert') {
      defaultWidth = 480;
      defaultHeight = 80;
      defaultLabel = 'Sub Alert Popup';
    } else if (type === 'customImage') {
      defaultWidth = 240;
      defaultHeight = 120;
      defaultLabel = 'Custom Logo / Image';
    }

    const newWidget: WidgetInstance = {
      id: newId,
      type,
      label: defaultLabel,
      layout: { x: 800, y: 300, width: defaultWidth, height: defaultHeight, visible: true },
      config: {
        title: defaultLabel,
        primaryColor: type === 'subAlert' ? '#38bdf8' : '#6366f1',
        imageUrl: type === 'customImage' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' : undefined,
        currentSubs: type === 'subGoal' ? 14 : undefined,
        targetSubs: type === 'subGoal' ? 50 : undefined,
      },
    };

    setStudioState((prev) => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }));

    setSelectedWidgetId(newId);
  };

  const handleDuplicateWidget = (id: string) => {
    const target = state.widgets.find((w) => w.id === id);
    if (!target) return;

    const dupId = `${target.type}_${Math.random().toString(36).substring(2, 7)}`;
    const duplicate: WidgetInstance = {
      ...target,
      id: dupId,
      label: `${target.label} (Copy)`,
      layout: {
        ...target.layout,
        x: Math.min(1800, target.layout.x + 30),
        y: Math.min(1000, target.layout.y + 30),
      },
    };

    setStudioState((prev) => ({
      ...prev,
      widgets: [...prev.widgets, duplicate],
    }));

    setSelectedWidgetId(dupId);
  };

  const handleDeleteWidget = (id: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== id),
    }));

    if (selectedWidgetId === id) {
      setSelectedWidgetId(null);
    }
  };

  const handleToggleVisibility = (id: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          layout: {
            ...w.layout,
            visible: w.layout.visible === false ? true : false,
          },
        };
      }),
    }));
  };

  const handleToggleMute = (id: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          layout: {
            ...w.layout,
            muted: w.layout.muted === true ? false : true,
          },
        };
      }),
    }));
  };

  const handleLayoutChange = (id: string, newLayout: WidgetLayout) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === id ? { ...w, layout: newLayout } : w)),
    }));
  };

  const handleResetWidgetSize = (id: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        let defW = 360;
        let defH = 68;
        if (w.type === 'subAlert') { defW = 480; defH = 80; }
        else if (w.type === 'customImage') { defW = 240; defH = 120; }
        return {
          ...w,
          layout: { ...w.layout, width: defW, height: defH },
        };
      }),
    }));
  };

  const handleUpdateWidgetConfig = (id: string, newConfig: Partial<WidgetInstance['config']>, newLabel?: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          label: newLabel !== undefined ? newLabel : w.label,
          config: { ...w.config, ...newConfig },
        };
      }),
    }));
  };

  const handleCenterWidget = (id: string) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        const centerX = Math.max(0, Math.round((1920 - w.layout.width) / 2));
        const centerY = Math.max(0, Math.round((1080 - w.layout.height) / 2));
        return {
          ...w,
          layout: {
            ...w.layout,
            x: centerX,
            y: centerY,
          },
        };
      }),
    }));
  };

  const handleScaleWidget = (id: string, scaleRatio: number) => {
    setStudioState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => {
        if (w.id !== id) return w;
        const currentFontSize = w.config.fontSize || (w.type === 'subAlert' ? 18 : 14);
        const currentImageSize = w.config.imageSize || 80;

        const newFontSize = Math.max(10, Math.min(60, Math.round(currentFontSize * scaleRatio)));
        const newImageSize = Math.max(10, Math.min(600, Math.round(currentImageSize * scaleRatio)));

        return {
          ...w,
          config: {
            ...w.config,
            fontSize: newFontSize,
            imageSize: newImageSize,
          },
        };
      }),
    }));
  };

  const handleResetAllLayouts = () => {
    setStudioState(DEFAULT_STUDIO_STATE);
    setSelectedWidgetId('subGoal_default');
  };
  const matchAlertToWidget = (
    type: 'sub' | 'resub' | 'subgift' | 'bits' | 'raid',
    tier: 'Prime' | '1000' | '2000' | '3000',
    amount: number = 1,
    months: number = 1
  ): WidgetInstance | null => {
    const alertWidgets = state.widgets.filter((w) => w.type === 'subAlert' && w.layout.visible !== false);
    if (alertWidgets.length === 0) return null;

    let bestMatch: WidgetInstance = alertWidgets[0];
    let maxScore = -1;

    for (const widget of alertWidgets) {
      const cfg = widget.config;
      let score = 0;

      // Event Type Matching
      const evtMatch = !cfg.triggerEventType || cfg.triggerEventType === 'all' || cfg.triggerEventType === type;
      if (!evtMatch) continue;
      if (cfg.triggerEventType === type) score += 10;

      // Tier Matching
      const tierMatch = !cfg.triggerTier || cfg.triggerTier === 'all' || cfg.triggerTier === tier;
      if (!tierMatch) continue;
      if (cfg.triggerTier === tier) score += 5;

      // Amount / Quantity Threshold
      if (cfg.triggerMinAmount && cfg.triggerMinAmount > 0) {
        if (amount < cfg.triggerMinAmount) continue;
        score += Math.min(20, cfg.triggerMinAmount);
      }

      // Month Threshold
      if (cfg.triggerMinMonths && cfg.triggerMinMonths > 0) {
        if (months < cfg.triggerMinMonths) continue;
        score += Math.min(20, cfg.triggerMinMonths);
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = widget;
      }
    }

    return bestMatch;
  };

  // Trigger Simulated Alert Event
  const triggerTestAlert = (
    type: 'sub' | 'resub' | 'subgift' | 'bits' | 'raid',
    tier: 'Prime' | '1000' | '2000' | '3000' = '1000',
    amount: number = 1,
    months: number = 1
  ) => {
    const usernames = ['PixelNinja', 'CyberKnight', 'NeonStreamer', 'VortexPro', 'AuraGamer', 'HyperDrive'];
    const randomUser = usernames[Math.floor(Math.random() * usernames.length)];

    const matchedWidget = matchAlertToWidget(type, tier, amount, months);

    const alertPayload: Omit<AlertData, 'id'> = {
      type,
      username: randomUser,
      tier,
      amount,
      months,
      message: type === 'resub' ? 'Loving the stream! Keep up the epic work 🔥' : type === 'bits' ? 'Take my bits! GG!' : undefined,
      durationMs: state.alertDuration,
      primaryColor: matchedWidget?.config.primaryColor || state.primaryColor,
      backgroundColor: matchedWidget?.config.backgroundColor || '#18181b',
      textColor: matchedWidget?.config.textColor,
      fontSize: matchedWidget?.config.fontSize,
      borderRadius: matchedWidget?.config.borderRadius,
      imageUrl: matchedWidget?.config.imageUrl,
      imageSize: matchedWidget?.config.imageSize,
      soundUrl: matchedWidget?.config.soundUrl,
      soundVolume: matchedWidget?.config.soundVolume,
      customTextTemplate: matchedWidget?.config.customTextTemplate,
    };

    if (socket && connected) {
      socket.emit('trigger-alert', { token, alert: alertPayload });
    }

    setPreviewAlert({
      ...alertPayload,
      id: Math.random().toString(36).substring(2, 9),
    });

    if (matchedWidget) {
      setSelectedWidgetId(matchedWidget.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Toolbar */}
      <StudioToolbar
        token={token}
        userId={currentUser?.id}
        canUndo={canUndo}
        canRedo={canRedo}
        gridSnap={gridSnap}
        historyLength={historyLength}
        onUndo={undo}
        onRedo={redo}
        onToggleGridSnap={() => setGridSnap(!gridSnap)}
        onResetAllLayouts={handleResetAllLayouts}
        onOpenModManager={() => setIsModManagerOpen(true)}
      />

      {/* Main Studio Workspace Split */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar Panel */}
        <aside
          style={{
            width: '340px',
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
              <Layers size={14} /> Widgets & Inspector
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

                <div style={{ borderTop: '1px solid #27272a', paddingTop: '16px' }}>
                  <button className="studio-btn" onClick={handleResetAllLayouts} style={{ width: '100%' }}>
                    <RotateCcw size={14} /> Reset Widget Positions
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'simulator' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ⚡ Simulate Stream Events
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Single Subs */}
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

                  {/* Gifted Subs Tiers */}
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa', marginTop: '6px' }}>GIFTED SUBS TIERS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button className="studio-btn" onClick={() => triggerTestAlert('subgift', '1000', 1)} style={{ fontSize: '0.72rem' }}>
                      <Gift size={12} color="#ec4899" /> 1 Gift Sub
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('subgift', '1000', 5)} style={{ fontSize: '0.72rem', borderColor: '#ec4899' }}>
                      <Gift size={12} color="#ec4899" /> 5x Gifted Subs
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('subgift', '1000', 20)} style={{ fontSize: '0.72rem', gridColumn: 'span 2', background: 'rgba(236, 72, 153, 0.15)', borderColor: '#ec4899' }}>
                      <Gift size={12} color="#ec4899" /> 20x MEGA Gift Bomb 🔥
                    </button>
                  </div>

                  {/* Re-subs */}
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa', marginTop: '6px' }}>RE-SUBS & TENURE</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button className="studio-btn" onClick={() => triggerTestAlert('resub', '1000', 1, 3)} style={{ fontSize: '0.72rem' }}>
                      <RotateCcw size={12} /> 3-Month Resub
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('resub', '2000', 1, 12)} style={{ fontSize: '0.72rem', borderColor: '#6366f1' }}>
                      <Crown size={12} color="#6366f1" /> 12-Month Resub
                    </button>
                  </div>

                  {/* Bits Cheer Tiers */}
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa', marginTop: '6px' }}>BITS & CHEER TIERS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button className="studio-btn" onClick={() => triggerTestAlert('bits', '1000', 100)} style={{ fontSize: '0.72rem' }}>
                      <Zap size={12} color="#eab308" /> 100 Bits
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('bits', '1000', 1000)} style={{ fontSize: '0.72rem', borderColor: '#eab308' }}>
                      <Zap size={12} color="#eab308" /> 1,000 Bits
                    </button>
                    <button className="studio-btn" onClick={() => triggerTestAlert('bits', '1000', 5000)} style={{ fontSize: '0.72rem', gridColumn: 'span 2', background: 'rgba(234, 179, 8, 0.15)', borderColor: '#eab308' }}>
                      <Zap size={12} color="#eab308" /> 5,000 SUPER Cheer 💎
                    </button>
                  </div>

                  {/* Raid */}
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa', marginTop: '6px' }}>STREAM RAIDS</div>
                  <button className="studio-btn" onClick={() => triggerTestAlert('raid', '1000', 50)} style={{ fontSize: '0.72rem', width: '100%' }}>
                    <Users size={12} color="#10b981" /> Raid 50 Viewers
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Canvas Viewport Area */}
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
          {/* Scaled 1920x1080 Movable Work Area */}
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
            {/* Dynamic Widget Renderer */}
            {state.widgets.map((widget) => {
              let defaultW = 360;
              let defaultH = 68;

              if (widget.type === 'subAlert') {
                defaultW = 480;
                defaultH = 80;
              } else if (widget.type === 'customImage') {
                defaultW = 240;
                defaultH = 120;
              }

              return (
                <DraggableWidget
                  key={widget.id}
                  id={widget.id}
                  label={widget.label}
                  layout={widget.layout}
                  defaultWidth={defaultW}
                  defaultHeight={defaultH}
                  isEditable={true}
                  isSelected={selectedWidgetId === widget.id}
                  gridSnap={gridSnap}
                  hasSound={widget.type === 'subAlert'}
                  onSelect={() => setSelectedWidgetId(widget.id)}
                  onLayoutChange={(newLayout) => handleLayoutChange(widget.id, newLayout)}
                  onScaleChange={(scaleRatio) => handleScaleWidget(widget.id, scaleRatio)}
                >
                  {widget.type === 'subGoal' && (
                    <SubGoalWidget
                      title={widget.config.title || 'Sub Goal'}
                      currentSubs={widget.config.currentSubs || 0}
                      targetSubs={widget.config.targetSubs || 50}
                      primaryColor={widget.config.primaryColor || '#6366f1'}
                      backgroundColor={widget.config.backgroundColor || '#18181b'}
                      textColor={widget.config.textColor}
                      fontSize={widget.config.fontSize}
                      borderRadius={widget.config.borderRadius}
                      imageUrl={widget.config.imageUrl}
                      showProgressBar={widget.config.showProgressBar}
                      progressBarBgColor={widget.config.progressBarBgColor}
                      progressBarHeight={widget.config.progressBarHeight}
                      showPercentage={widget.config.showPercentage}
                    />
                  )}

                  {widget.type === 'subAlert' && (
                    <SubAlertWidget
                      alert={
                        previewAlert
                          ? {
                              ...previewAlert,
                              primaryColor: widget.config.primaryColor || previewAlert.primaryColor,
                              backgroundColor: widget.config.backgroundColor || '#18181b',
                              textColor: widget.config.textColor,
                              fontSize: widget.config.fontSize,
                              borderRadius: widget.config.borderRadius,
                              imageUrl: widget.config.imageUrl,
                              imageSize: widget.config.imageSize,
                              soundUrl: widget.config.soundUrl,
                              soundVolume: widget.config.soundVolume,
                              customTextTemplate: widget.config.customTextTemplate,
                            }
                          : null
                      }
                    />
                  )}

                  {widget.type === 'customImage' && (
                    <CustomImageWidget
                      imageUrl={widget.config.imageUrl}
                      imageSize={widget.config.imageSize}
                      altText={widget.config.title}
                      backgroundColor={widget.config.backgroundColor}
                      borderRadius={widget.config.borderRadius}
                    />
                  )}
                </DraggableWidget>
              );
            })}

            {/* Viewport Specs Badge */}
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

      {/* Add Widget Picker Modal */}
      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWidget={handleAddWidget}
      />

      {/* Shared Mod Tokens Manager Modal */}
      <ModTokenManagerModal
        isOpen={isModManagerOpen}
        onClose={() => setIsModManagerOpen(false)}
        userId={currentUser?.id || 'demo-user-id'}
      />
    </div>
  );
};
