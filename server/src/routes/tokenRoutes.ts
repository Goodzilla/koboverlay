import express from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/tokens/create-mod-token
// Streamer creates a 1-year max shared token for mods
router.post('/create-mod-token', async (req: express.Request, res: express.Response) => {
  try {
    const { userId, label } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const tokenString = `mod_${crypto.randomBytes(16).toString('hex')}`;
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year max expiry

    const sharedToken = await prisma.sharedModToken.create({
      data: {
        userId,
        token: tokenString,
        label: label || 'Moderator Shared Link',
        expiresAt: oneYearFromNow,
      },
    });

    return res.json({
      success: true,
      sharedToken: {
        id: sharedToken.id,
        token: sharedToken.token,
        label: sharedToken.label,
        createdAt: sharedToken.createdAt,
        expiresAt: sharedToken.expiresAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create shared mod token.' });
  }
});

// GET /api/tokens/my-mod-tokens/:userId
// Lists streamer's active emitted shared tokens
router.get('/my-mod-tokens/:userId', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const tokens = await prisma.sharedModToken.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, tokens });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch shared tokens.' });
  }
});

// DELETE /api/tokens/revoke-mod-token/:id
// Revokes / deletes shared token instantly from emitter account
router.delete('/revoke-mod-token/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    await prisma.sharedModToken.update({
      where: { id },
      data: { revoked: true },
    });

    return res.json({ success: true, message: 'Shared mod token revoked successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to revoke mod token.' });
  }
});

// GET /api/tokens/verify-mod-token/:token
// Direct bypass check: verifies shared token is valid, unexpired, and unrevoked
router.get('/verify-mod-token/:token', async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.params;

    // Check if it's a shared mod token
    const sharedToken = await prisma.sharedModToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (sharedToken) {
      if (sharedToken.revoked) {
        return res.status(403).json({ valid: false, reason: 'This shared token has been revoked by the streamer.' });
      }
      if (new Date() > sharedToken.expiresAt) {
        return res.status(403).json({ valid: false, reason: 'This shared mod token has expired (1 year limit).' });
      }

      return res.json({
        valid: true,
        type: 'mod',
        streamerUsername: sharedToken.user.username,
        overlayToken: sharedToken.user.overlayToken,
      });
    }

    // Check if it's a user overlayToken directly
    const user = await prisma.user.findUnique({
      where: { overlayToken: token },
    });

    if (user) {
      return res.json({
        valid: true,
        type: 'owner',
        streamerUsername: user.username,
        overlayToken: user.overlayToken,
      });
    }

    return res.status(404).json({ valid: false, reason: 'Token not found or invalid.' });
  } catch (err: any) {
    return res.status(500).json({ valid: false, reason: err.message || 'Verification failed.' });
  }
});

export default router;
