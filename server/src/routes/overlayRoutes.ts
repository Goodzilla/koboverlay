import { Router } from 'express';
import { OverlayController } from '../controllers/overlayController';

const router = Router();

router.get('/info/:token', OverlayController.getOverlayInfo);
router.get('/config/:token', OverlayController.getOverlayInfo);
router.post('/config', OverlayController.updateOverlayConfig);
router.post('/test-alert', OverlayController.triggerTestAlert);
router.post('/twitch-webhook', OverlayController.handleTwitchWebhook);

export default router;

