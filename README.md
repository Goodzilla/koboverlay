# 🚀 StreamPulse - Open-Source Streamer Overlay & Alert Platform

StreamPulse is a lightweight, high-performance, real-time overlay platform for live streamers (Twitch / YouTube / Kick). It delivers customizable, glassmorphic OBS Studio browser overlays including **Subscriber Alerts**, **Resub Badges**, **Sub Goal Counters**, and an integrated **Test Event Simulator**.

Designed for easy open-source self-hosting and low-cost deployment ($0–$5/mo on Render, Railway, Fly.io, or VPS).

---

## ✨ Features

- 🎭 **OBS Studio Browser Source Overlay**: Transparent, ultra-low latency real-time overlays (`/overlay/:overlayToken`).
- 🔔 **Dynamic Sub Alerts**: Animated entrance/exit alert banners with customizable colors, duration, audio sound effects, and tier badges.
- 🎯 **Sub Goal Counter Widget**: Smoothly animated progress bar for tracking subscriber goals live on stream.
- ⚙️ **Streamer Dashboard**: Easy-to-use control panel to customize alert visuals, copy secret OBS browser source URLs, and manage stream settings.
- 🧪 **Built-in Event Simulator**: Test your sub alerts, resubs, and goal increments offline without needing a live stream subscriber!
- ⚡ **Alert Queue Engine**: Prevents alert overlap by sequencing multiple events smoothly.
- 🐳 **Docker & PaaS Ready**: One-click deployment options for Render, Railway, Fly.io, or any $4/mo VPS.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript, Lucide Icons, Canvas-Confetti, Vanilla CSS Keyframe Animations.
- **Backend**: Node.js, Express, Socket.io (WebSockets), TypeScript, Zod.
- **Database**: Prisma ORM with SQLite (zero setup) & PostgreSQL support.
- **Testing**: Vitest for unit & component tests.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/streampulse.git
cd streampulse

# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 2. Database & Environment Setup
```bash
# In /server
cd server
npx prisma db push
npx prisma db seed # (optional test data)
```

### 3. Run Development Servers
```bash
# Terminal 1: Run Backend API & Socket Server (port 4000)
cd server
npm run dev

# Terminal 2: Run Frontend Dashboard & Overlay Client (port 5173)
cd client
npm run dev
```

Open your browser at `http://localhost:5173` to access the Streamer Dashboard!

---

## 🎬 How to Use in OBS Studio

1. Open the **Streamer Dashboard** at `http://localhost:5173`.
2. Copy your unique **OBS Browser Source URL** (e.g., `http://localhost:5173/overlay/demo-streamer-token`).
3. Open **OBS Studio** -> Add Source -> **Browser Source**.
4. Set URL to the copied overlay link.
5. Set Width: `1920`, Height: `1080`.
6. Check **"Shutdown source when not visible"** (optional).
7. In the Dashboard, click **"Test Tier 1 Sub Alert"** to see it trigger live in OBS Studio!

---

## 📄 Documentation & Guides

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Deep-dive technical architecture, AI context, and event lifecycle.
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Open-source contribution guidelines & testing workflows.
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploying to Render, Railway, Fly.io, or Docker.

---

## 📜 License

MIT License. Open source and free for streamers worldwide.
