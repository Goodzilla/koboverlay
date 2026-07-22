import React, { useEffect, useState, useRef } from 'react';
import { createOverlaySocket } from '../utils/socket';
import { SubAlertWidget, AlertData } from '../components/SubAlertWidget';
import { SubGoalWidget } from '../components/SubGoalWidget';
import { CustomImageWidget } from '../components/CustomImageWidget';
import { DraggableWidget, WidgetLayout } from '../components/DraggableWidget';
import { WidgetInstance } from '../components/LayerTree';

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

export const Overlay: React.FC = () => {
  const [token, setToken] = useState<string>('demo-streamer-token');
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);
  const [alertQueue, setAlertQueue] = useState<AlertData[]>([]);

  // Widget instances state
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    const saved = localStorage.getItem(`koboverlay_studio_${token}`);
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

    const socket = createOverlaySocket();

    socket.on('connect', () => {
      console.log(`🎬 OBS Overlay Socket connected to server`);
      socket.emit('join-overlay', { token: activeToken });
    });

    // Listen for incoming alerts from server
    socket.on('new-alert', (alert: AlertData) => {
      console.log('🔔 New Overlay Alert Received:', alert);
      playAlertAudio();
      setAlertQueue((prev) => [...prev, alert]);
    });

    // Listen for real-time widget layout & config updates from Studio Dashboard!
    socket.on('layout-updated', (data: { widgets: WidgetInstance[] }) => {
      if (data?.widgets) {
        console.log('📍 Real-time Widgets Updated:', data.widgets);
        setWidgets(data.widgets);
      }
    });

    return () => {
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

  const playAlertAudio = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (err) {}
  };

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
                        customTextTemplate: widget.config.customTextTemplate,
                      }
                    : null
                }
                onAnimationComplete={handleAlertComplete}
              />
            )}

            {widget.type === 'customImage' && (
              <CustomImageWidget
                imageUrl={widget.config.imageUrl}
                altText={widget.config.title}
                backgroundColor={widget.config.backgroundColor}
                borderRadius={widget.config.borderRadius}
              />
            )}
          </DraggableWidget>
        );
      })}
    </div>
  );
};
