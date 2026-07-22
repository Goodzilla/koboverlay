import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { SubAlertWidget, AlertData } from '../components/SubAlertWidget';
import { SubGoalWidget } from '../components/SubGoalWidget';

export const Overlay: React.FC = () => {
  const [token, setToken] = useState<string>('demo-streamer-token');
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);
  const [alertQueue, setAlertQueue] = useState<AlertData[]>([]);

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
    if (urlToken && urlToken !== 'overlay') {
      setToken(urlToken);
    }

    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log(`🎬 OBS Overlay Socket connected to server`);
      socket.emit('join-overlay', { token: urlToken || token });
    });

    // Listen for incoming alerts from server
    socket.on('new-alert', (alert: AlertData) => {
      console.log('🔔 New Overlay Alert Received:', alert);
      // Play audio chime
      playAlertAudio();
      setAlertQueue((prev) => [...prev, alert]);
    });

    // Listen for Sub Goal updates
    socket.on('sub-goal-updated', (data: { title: string; currentSubs: number; targetSubs: number }) => {
      console.log('🎯 Sub Goal Updated:', data);
      setGoalData(data);
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
      // Synthetic audio beep / chime via Web Audio API (no external asset file dependency required!)
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5 note

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (err) {
      // Ignore if browser restricts autoplay audio
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px',
        boxSizing: 'border-box',
      }}
    >
      {/* Sub Goal Widget Top Right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SubGoalWidget
          title={goalData.title}
          currentSubs={goalData.currentSubs}
          targetSubs={goalData.targetSubs}
          primaryColor="#7c3aed"
        />
      </div>

      {/* Sub Alert Widget Center Screen */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <SubAlertWidget alert={currentAlert} onAnimationComplete={handleAlertComplete} />
      </div>

      {/* Empty Spacer Bottom */}
      <div style={{ height: '40px' }} />
    </div>
  );
};
