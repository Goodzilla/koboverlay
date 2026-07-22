import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { createApp } from './app';
import { setupOverlaySockets } from './sockets/overlaySocket';

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupOverlaySockets(io);

server.listen(PORT, () => {
  console.log(`🚀 StreamPulse Server listening on port ${PORT}`);
  console.log(`📡 Socket.io Engine Active`);
});
