# KobOverlay - Open-Source Streamer Overlay & Studio Platform

KobOverlay is a lightweight, high-performance, real-time overlay studio for live streamers (Twitch / YouTube / Kick). It delivers customizable, minimalist OBS Studio browser overlays including **Subscriber Alerts**, **Resub Badges**, **Sub Goal Counters**, and an integrated Figma/OBS-style Studio Editor with `Ctrl+Z` Undo/Redo history, Layer Tree management, 20px Grid Snapping, and built-in event simulation.

Designed for easy open-source self-hosting and low-cost deployment ($0-$5/mo on Render, Railway, Fly.io, or VPS).

---

## Features

- **OBS Studio Browser Source Overlay**: Transparent, ultra-low latency real-time overlays (`/overlay/:overlayToken`).
- **Pro Studio Canvas Editor**: Full-screen scaled 1920x1080 canvas workspace with 20px grid snapping and 60fps drag/resize engine.
- **Undo / Redo History Engine**: Full history stack supporting `Ctrl + Z` and `Ctrl + Shift + Z` hotkeys.
- **Sidebar Layer Tree**: Select, toggle visibility, duplicate, center, and delete canvas elements.
- **Dynamic Sub Alerts**: Minimalist animated alert banners with customizable colors, duration, audio sound effects, and tier-based trigger conditions.
- **Sub Goal Counter Widget**: Smooth progress bar for tracking subscriber goals live on stream.
- **Built-in Event Simulator**: Test sub alerts, resubs, bits, raids, and goal increments offline without a live stream.
- **Twitch OAuth Login**: One-click sign-in with your Twitch account — no passwords, no email required.
- **Docker & PaaS Ready**: One-click deployment options for Render, Railway, Fly.io, or any $4/mo VPS.

---

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Lucide Icons, Canvas-Confetti, Inter & JetBrains Mono Fonts.
- **Backend**: Node.js, Express, Socket.io (WebSockets), TypeScript, Zod, jsonwebtoken.
- **Database**: Prisma ORM with SQLite (zero setup) & PostgreSQL support.
- **Auth**: Twitch OAuth 2.0 + signed JWT sessions (24h expiry).
- **Testing**: Vitest for unit & component tests.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Twitch Developer Application (see below)

### 1. Create a Twitch Developer Application

1. Go to [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps) and click **Register Your Application**.
2. Fill in:
   - **Name**: KobOverlay (or any name)
   - **OAuth Redirect URLs**: Add both:
     - `http://localhost:4000/api/auth/twitch/callback` (local dev)
     - `https://your-render-url.onrender.com/api/auth/twitch/callback` (production)
   - **Category**: Other
3. Click **Create** and copy your **Client ID** and **Client Secret**.

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/Goodzilla/koboverlay.git
cd koboverlay

cd server && npm install
cd ../client && npm install
```

### 3. Environment Setup
```bash
# In /server, copy the example and fill in your values
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="any_long_random_string"
TWITCH_CLIENT_ID="your_client_id_from_twitch"
TWITCH_CLIENT_SECRET="your_client_secret_from_twitch"
APP_URL="http://localhost:4000"
CLIENT_URL="http://localhost:5173"
```

Then push the database schema:
```bash
cd server
npx prisma db push
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend API & Socket Server (port 4000)
cd server
npm run dev

# Terminal 2: Frontend Studio Editor (port 5173)
cd client
npm run dev
```

Open `http://localhost:5173` and click **Sign in with Twitch**.

---

## Deployment (Render — Free Tier)

1. Push the repository to GitHub.
2. Go to [dashboard.render.com](https://dashboard.render.com) -> **New Web Service** -> connect your repo.
3. Set **Environment** to **Docker**.
4. Set the following environment variables in Render:

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

5. Click **Deploy**. Render builds the Docker image and gives you a live HTTPS URL.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more options (Docker VPS, PostgreSQL).

---

## License

MIT License. Open source and free for streamers worldwide.
