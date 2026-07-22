import { Server, Socket } from 'socket.io';
import { alertQueueManager, AlertPayload } from '../services/alertQueueService';

export function setupOverlaySockets(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // OBS Overlay joins its specific room via token
    socket.on('join-overlay', (data: { token: string }) => {
      const room = `overlay:${data.token}`;
      socket.join(room);
      console.log(`🎯 Socket ${socket.id} joined room ${room}`);
      
      socket.emit('joined-room', { room, success: true });
    });

    // Streamer triggers a test or live alert from Dashboard
    socket.on('trigger-alert', (data: { token: string; alert: Omit<AlertPayload, 'id' | 'timestamp'> }) => {
      const room = `overlay:${data.token}`;
      const queuedAlert = alertQueueManager.enqueue(data.alert);

      console.log(`🔔 Broadcasting alert to ${room}: ${queuedAlert.username} (${queuedAlert.type})`);
      io.to(room).emit('new-alert', queuedAlert);
    });

    // Streamer updates Sub Goal target or current count
    socket.on('update-sub-goal', (data: { token: string; title: string; currentSubs: number; targetSubs: number }) => {
      const room = `overlay:${data.token}`;
      console.log(`🎯 Updating Sub Goal in ${room}: ${data.currentSubs}/${data.targetSubs}`);

      io.to(room).emit('sub-goal-updated', {
        title: data.title,
        currentSubs: data.currentSubs,
        targetSubs: data.targetSubs,
      });
    });

    // Streamer updates overlay layout positions (drag & drop)
    socket.on('update-layout', (data: { token: string; layout: any }) => {
      const room = `overlay:${data.token}`;
      console.log(`📍 Updating layout positions in ${room}:`, data.layout);

      io.to(room).emit('layout-updated', data.layout);
    });

    // Streamer updates Overlay visual settings (primary color, sound, etc.)
    socket.on('update-overlay-config', (data: { token: string; config: any }) => {
      const room = `overlay:${data.token}`;
      io.to(room).emit('config-updated', data.config);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}
