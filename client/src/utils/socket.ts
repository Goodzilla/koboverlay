/// <reference types="vite/client" />
import { io } from 'socket.io-client';

export const getServerUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_SERVER_URL;
  if (envUrl) {
    return envUrl;
  }
  // If running on Vite dev server (port 5173), connect directly to Express server on port 4000
  if (typeof window !== 'undefined' && window.location.port === '5173') {
    return 'http://localhost:4000';
  }
  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000';
};

export const createOverlaySocket = (token?: string) => {
  return io(getServerUrl(), {
    transports: ['websocket', 'polling'],
    auth: token ? { token } : undefined,
  });
};
