# KobOverlay Deployment Guide

KobOverlay is optimized for low-cost ($0-$5/mo) or free deployment across modern PaaS platforms and single VPS environments.

---

## Prerequisites — Twitch Developer Application

Before deploying, you must register a Twitch Developer Application at [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps):

1. Click **Register Your Application**.
2. Set **Name** to `KobOverlay` (or your preferred name).
3. Add **OAuth Redirect URLs**:
   - `https://your-app.onrender.com/api/auth/twitch/callback` (production)
   - `http://localhost:4000/api/auth/twitch/callback` (local dev)
4. Set **Category** to `Other`.
5. Click **Create** and note your **Client ID** and **Client Secret**.

---

## Option 1: Render / Railway / Fly.io (PaaS - Recommended)

### Render Deployment (Free Tier)
1. Fork or push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New Web Service**.
3. Connect your GitHub repository.
4. Select **Docker** environment (Render automatically detects the root `Dockerfile`).
5. Set the following Environment Variables:

| Variable | Value |
| :--- | :--- |
| `PORT` | `4000` |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `file:./dev.db` |
| `JWT_SECRET` | any long random string |
| `TWITCH_CLIENT_ID` | your Twitch app Client ID |
| `TWITCH_CLIENT_SECRET` | your Twitch app Client Secret |
| `APP_URL` | `https://your-app.onrender.com` |
| `CLIENT_URL` | `https://your-app.onrender.com` |

6. Click **Deploy**. Render builds the container and provides your live HTTPS URL.

---

## Option 2: Docker / Single VPS ($4/mo on Hetzner / DigitalOcean)

KobOverlay includes a production `Dockerfile` and `docker-compose.yml`.

```bash
# Clone on your VPS
git clone https://github.com/Goodzilla/koboverlay.git
cd koboverlay

# Copy and fill in your environment variables
cp server/.env.example server/.env
# Edit server/.env with your values

# Launch container
docker-compose up -d --build
```

Your service will run on port `4000`, with SQLite persistent storage saved in `./server/prisma/data/dev.db`.

---

## Database Configuration

### SQLite (Default)
In `server/.env`:
```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL (Cloud DB like Neon / Supabase)
In `server/prisma/schema.prisma`, update provider to `postgresql`, then set in `server/.env`:
```env
DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/koboverlay?sslmode=require"
```
Then run:
```bash
npx prisma db push
```
