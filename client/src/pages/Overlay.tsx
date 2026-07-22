import React, { useEffect, useState, useRef } from 'react';
import { createOverlaySocket } from '../utils/socket';
import { SubAlertWidget, AlertData } from '../components/SubAlertWidget';
import { SubGoalWidget } from '../components/SubGoalWidget';
import { CustomImageWidget } from '../components/CustomImageWidget';
import { DraggableWidget } from '../components/DraggableWidget';
import { WidgetInstance } from '../components/LayerTree';

const DEFAULT_WIDGETS: WidgetInstance[] = [
  {
    id: 'subGoal_default',
    type: 'subGoal',
    label: 'Sub Goal Bar',
    layout: { x: 720, y: 40, width: 480, height: 74, visible: true },
    config: {
      title: 'SUB GOAL',
      currentSubs: 18,
      targetSubs: 50,
      primaryColor: '#6366f1',
      backgroundColor: '#18181b',
      textColor: '#ffffff',
      fontSize: 16,
      showProgressBar: true,
      progressBarBgColor: '#000000',
      progressBarHeight: 10,
      showPercentage: true,
    },
  },
  {
    id: 'subAlert_default',
    type: 'subAlert',
    label: 'Sub Alert Popup',
    layout: { x: 720, y: 160, width: 480, height: 90, visible: true },
    config: {
      title: 'NEW SUBSCRIBER!',
      primaryColor: '#38bdf8',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      fontSize: 20,
      soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
      soundVolume: 80,
    },
  },
];

export const Overlay: React.FC = () => {
  const [token, setToken] = useState<string>('demo-streamer-token');
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);
  const [alertQueue, setAlertQueue] = useState<AlertData[]>([]);

  // Scale factors to ensure 100% pixel perfection with 1920x1080 studio canvas
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth || 1920,
    height: window.innerHeight || 1080,
  });

  // Widget instances state
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    const savedV2 = localStorage.getItem('koboverlay_studio_v2');
    if (savedV2) {
      try {
        const parsed = JSON.parse(savedV2);
        if (parsed.widgets) return parsed.widgets;
      } catch (err) {}
    }
    const saved = localStorage.getItem(`koboverlay_studio_demo-streamer-token`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.widgets) return parsed.widgets;
      } catch (err) {}
    }
    return DEFAULT_WIDGETS;
  });

  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Set body & html transparent for OBS Browser Source
    document.documentElement.classList.add('overlay-mode');
    document.body.classList.add('overlay-mode');

    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth || 1920,
        height: window.innerHeight || 1080,
      });
    };
    window.addEventListener('resize', handleResize);

    // Extract token from URL path if present e.g. /overlay/custom-token
    const pathParts = window.location.pathname.split('/');
    const urlToken = pathParts[pathParts.length - 1];
    const activeToken = urlToken && urlToken !== 'overlay' ? urlToken : token;
    setToken(activeToken);

    const saved = localStorage.getItem(`koboverlay_studio_${activeToken}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.widgets) setWidgets(parsed.widgets);
      } catch (err) {}
    }

    const socket = createOverlaySocket(activeToken);

    socket.on('connect', () => {
      console.log(`🎬 OBS Overlay Socket connected to server with token: ${activeToken}`);
      socket.emit('join-overlay', { token: activeToken });
    });

    // Listen for incoming alerts from server
    socket.on('new-alert', (alert: AlertData) => {
      console.log('🔔 New Overlay Alert Received:', alert);
      setAlertQueue((prev) => [...prev, alert]);
    });

    // Listen for real-time widget layout & config updates from Studio Dashboard!
    socket.on('layout-updated', (data: any) => {
      if (data?.widgets) {
        console.log('📍 Real-time Layout Updated:', data.widgets);
        setWidgets(data.widgets);
      } else if (Array.isArray(data)) {
        setWidgets(data);
      }
    });

    socket.on('config-updated', (data: any) => {
      if (data?.widgets) {
        console.log('⚙️ Real-time Config Updated:', data.widgets);
        setWidgets(data.widgets);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      document.documentElement.classList.remove('overlay-mode');
      document.body.classList.remove('overlay-mode');
      socket.disconnect();
    };
  }, []);

  // Alert Queue Engine
  useEffect(() => {
    if (!currentAlert && alertQueue.length > 0 && !isProcessingRef.current) {
      isProcessingRef.current = true;
      const nextAlert = alertQueue[0];
      setAlertQueue((prev) => prev.slice(1));
      setCurrentAlert(nextAlert);
    }
  }, [alertQueue, currentAlert]);

  const handleAlertComplete = () => {
    setCurrentAlert(null);
    isProcessingRef.current = false;
  };

  const scaleX = viewportSize.width / 1920;
  const scaleY = viewportSize.height / 1080;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      {/* 1920x1080 Viewport Container scaled to match OBS browser window */}
      <div
        style={{
          width: '1920px',
          height: '1080px',
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          transform: `scale(${scaleX}, ${scaleY})`,
          pointerEvents: 'none',
        }}
      >
        {/* Dynamic Widget Renderer for OBS Browser Source */}
        {widgets.map((widget) => {
          if (widget.layout.visible === false) return null;

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
              isEditable={false}
              onLayoutChange={() => {}}
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
                    currentAlert
                      ? {
                          ...currentAlert,
                          primaryColor: widget.config.primaryColor || currentAlert.primaryColor,
                          backgroundColor: widget.config.backgroundColor || '#18181b',
                          textColor: widget.config.textColor,
                          fontSize: widget.config.fontSize,
                          borderRadius: widget.config.borderRadius,
                          imageUrl: widget.config.imageUrl || currentAlert.imageUrl,
                          imageSize: widget.config.imageSize || currentAlert.imageSize,
                          soundUrl: widget.config.soundUrl || currentAlert.soundUrl,
                          soundVolume: widget.config.soundVolume !== undefined ? widget.config.soundVolume : currentAlert.soundVolume,
                          customTextTemplate: widget.config.customTextTemplate,
                        }
                      : null
                  }
                  muted={widget.layout.muted === true}
                  onAnimationComplete={handleAlertComplete}
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
      </div>
    </div>
  );
};
