import express from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Helper for hashing passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// POST /api/auth/register
router.post('/register', async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email is already taken.' });
    }

    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        emailConfirmed: true, // Auto-confirmed in dev demo
        config: {
          create: {},
        },
      },
    });

    return res.json({
      success: true,
      message: 'Account registered successfully!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        overlayToken: user.overlayToken,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to register account.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required.' });
    }

    const passwordHash = hashPassword(password);
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user || user.passwordHash !== passwordHash) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        overlayToken: user.overlayToken,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to log in.' });
  }
});

// POST /api/auth/reset-password-request
router.post('/reset-password-request', async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ success: true, message: 'If an account exists, a reset link has been dispatched.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    return res.json({
      success: true,
      message: 'Password reset link sent to your email.',
      resetTokenDemo: resetToken,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Password reset request failed.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req: express.Request, res: express.Response) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset token.' });
    }

    const passwordHash = hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Password reset failed.' });
  }
});

export default router;
