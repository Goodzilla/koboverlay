import React, { useEffect, useState, useRef } from 'react';
import { createOverlaySocket } from '../utils/socket';
import { SubAlertWidget, AlertData } from '../components/SubAlertWidget';
import { SubGoalWidget } from '../components/SubGoalWidget';
import { DraggableWidget, WidgetLayout } from '../components/DraggableWidget';

interface LayoutState {
  subGoal: WidgetLayout;
  subAlert: WidgetLayout;
}

const DEFAULT_LAYOUT: LayoutState = {
  subGoal: { x: 1300, y: 40, width: 380, height: 100 },
  subAlert: { x: 700, y: 380, width: 520, height: 260 },
};

export const Overlay: React.FC = () => {
  const [token, setToken] = useState<string>('demo-streamer-token');
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);
  const [alertQueue, setAlertQueue] = useState<AlertData[]>([]);

  // Layout positions state in PX
  const [layout, setLayout] = useState<LayoutState>(() => {
    const saved = localStorage.getItem(`streampulse_layout_px_${token}`);
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
  });

  // Sub Goal State
  const [goalData, setGoalData] = useState({
    title: 'Monthly Sub Goal',
    currentSubs: 14,
    targetSubs: 50,
  });

  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Set body transparent for OBS Browser Source
    document.body.classList.add('overlay-mode');

    // Extract token from URL path if present e.g. /overlay/custom-token
    const pathParts = window.location.pathname.split('/');
    const urlToken = pathParts[pathParts.length - 1];
    const activeToken = urlToken && urlToken !== 'overlay' ? urlToken : token;
    setToken(activeToken);

    // Read saved layout for this token
    const saved = localStorage.getItem(`streampulse_layout_px_${activeToken}`);
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
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

    // Listen for Sub Goal updates
    socket.on('sub-goal-updated', (data: { title: string; currentSubs: number; targetSubs: number }) => {
      setGoalData(data);
    });

    // Listen for real-time Layout position/size updates from Dashboard drag & drop!
    socket.on('layout-updated', (newLayout: LayoutState) => {
      console.log('📍 Real-time PX Layout Updated:', newLayout);
      setLayout(newLayout);
      localStorage.setItem(`streampulse_layout_px_${activeToken}`, JSON.stringify(newLayout));
    });

    return () => {
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
      {/* Sub Goal Bar Positioned & Resized dynamically in PX */}
      <DraggableWidget
        id="subGoal"
        label="Sub Goal"
        layout={layout.subGoal}
        defaultWidth={380}
        defaultHeight={100}
        isEditable={false}
        onLayoutChange={() => {}}
      >
        <SubGoalWidget
          title={goalData.title}
          currentSubs={goalData.currentSubs}
          targetSubs={goalData.targetSubs}
          primaryColor="#7c3aed"
        />
      </DraggableWidget>

      {/* Sub Alert Popup Positioned & Resized dynamically in PX */}
      <DraggableWidget
        id="subAlert"
        label="Sub Alert"
        layout={layout.subAlert}
        defaultWidth={520}
        defaultHeight={260}
        isEditable={false}
        onLayoutChange={() => {}}
      >
        <SubAlertWidget alert={currentAlert} onAnimationComplete={handleAlertComplete} />
      </DraggableWidget>
    </div>
  );
};
