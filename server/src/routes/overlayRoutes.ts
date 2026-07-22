import { Router } from 'express';
import { OverlayController } from '../controllers/overlayController';

const router = Router();

router.get('/info/:token', OverlayController.getOverlayInfo);
router.post('/test-alert', OverlayController.triggerTestAlert);
router.post('/twitch-webhook', OverlayController.handleTwitchWebhook);

export default router;
