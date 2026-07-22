import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const APP_URL = process.env.APP_URL || 'http://localhost:4000';
// CLIENT_URL is where the React app lives — same as APP_URL in production,
// but http://localhost:5173 in local dev (Vite dev server)
const CLIENT_URL = process.env.CLIENT_URL || APP_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'koboverlay_dev_secret';
const JWT_EXPIRY = '24h';

// GET /api/auth/twitch
// Redirects the browser to the Twitch OAuth authorization page
router.get('/twitch', (_req, res) => {
  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID,
    redirect_uri: `${APP_URL}/api/auth/twitch/callback`,
    response_type: 'code',
    scope: 'user:read:email',
  });

  res.redirect(`https://id.twitch.tv/oauth2/authorize?${params.toString()}`);
});

// GET /api/auth/twitch/callback
// Twitch redirects here after the user authorizes the app
router.get('/twitch/callback', async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.redirect(`${APP_URL}/?error=twitch_auth_denied`);
  }

  try {
    // Exchange authorization code for access token
    const tokenRes = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${APP_URL}/api/auth/twitch/callback`,
      }),
    });

    const tokenData = await tokenRes.json() as { access_token: string };

    if (!tokenData.access_token) {
      return res.redirect(`${APP_URL}/?error=twitch_token_failed`);
    }

    // Fetch Twitch user profile
    const userRes = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });

    const userData = await userRes.json() as {
      data: Array<{
        id: string;
        login: string;
        display_name: string;
        email?: string;
        profile_image_url: string;
      }>;
    };

    const twitchUser = userData.data[0];
    if (!twitchUser) {
      return res.redirect(`${APP_URL}/?error=twitch_user_failed`);
    }

    // Upsert user record — create on first login, update on return
    const user = await prisma.user.upsert({
      where: { twitchId: twitchUser.id },
      create: {
        twitchId: twitchUser.id,
        username: twitchUser.login,
        twitchDisplayName: twitchUser.display_name,
        twitchProfileImage: twitchUser.profile_image_url,
        email: twitchUser.email || null,
        config: { create: {} },
      },
      update: {
        username: twitchUser.login,
        twitchDisplayName: twitchUser.display_name,
        twitchProfileImage: twitchUser.profile_image_url,
        email: twitchUser.email || null,
      },
    });

    // Issue signed JWT
    const jwtPayload = {
      userId: user.id,
      overlayToken: user.overlayToken,
      username: user.username,
      displayName: user.twitchDisplayName,
      profileImage: user.twitchProfileImage,
    };

    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    // Redirect to the client app (Vite dev: 5173, production: same origin as API)
    res.redirect(`${CLIENT_URL}/studio?jwt=${encodeURIComponent(token)}`);
  } catch (err: any) {
    console.error('Twitch OAuth callback error:', err);
    res.redirect(`${APP_URL}/?error=server_error`);
  }
});

// GET /api/auth/me
// Returns the current user decoded from the Authorization: Bearer <jwt> header
// Used by the client on page load to rehydrate the session
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      overlayToken: string;
      username: string;
      displayName: string;
      profileImage: string;
    };

    return res.json({
      id: decoded.userId,
      overlayToken: decoded.overlayToken,
      username: decoded.username,
      displayName: decoded.displayName,
      profileImage: decoded.profileImage,
    });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
});

export default router;
