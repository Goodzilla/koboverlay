import express from 'express';
import cors from 'cors';
import path from 'path';
import overlayRoutes from './routes/overlayRoutes';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'KobOverlay Server', timestamp: new Date() });
  });

  // REST API Routes
  app.use('/api/overlay', overlayRoutes);

  // Serve static client files in production
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send('StreamPulse Backend API Operational.');
      }
    });
  });

  return app;
}
