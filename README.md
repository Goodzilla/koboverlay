# KobOverlay - Open-Source Streamer Overlay & Studio Platform

KobOverlay is a lightweight, high-performance, real-time overlay studio for live streamers (Twitch / YouTube / Kick). It delivers customizable, minimalist OBS Studio browser overlays including **Subscriber Alerts**, **Resub Badges**, **Sub Goal Counters**, and an integrated Figma/OBS-style Studio Editor with `Ctrl+Z` Undo/Redo history, Layer Tree management, 20px Grid Snapping, and built-in event simulation.

Designed for easy open-source self-hosting and low-cost deployment ($0-$5/mo on Render, Railway, Fly.io, or VPS).


---

## Features

- **OBS Studio Browser Source Overlay**: Transparent, ultra-low latency real-time overlays (`/overlay/:overlayToken`).
- **Pro Studio Canvas Editor**: Full-screen scaled 1920x1080 canvas workspace with 20px grid snapping and 60fps drag/resize engine.
- **Undo / Redo History Engine**: Full history stack supporting `Ctrl + Z` and `Ctrl + Shift + Z` hotkeys.
- **Sidebar Layer Tree**: Select, toggle visibility, duplicate, and delete canvas elements.
- **Dynamic Sub Alerts**: Minimalist animated alert banners with customizable colors, duration, audio sound effects, and tier-based trigger conditions.
- **Sub Goal Counter Widget**: Smooth progress bar for tracking subscriber goals live on stream.
- **Built-in Event Simulator**: Test sub alerts, resubs, bits, raids, and goal increments offline without a live stream.
- **Docker & PaaS Ready**: One-click deployment options for Render, Railway, Fly.io, or any $4/mo VPS.

---

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Lucide Icons, Canvas-Confetti, Inter & JetBrains Mono Fonts.
- **Backend**: Node.js, Express, Socket.io (WebSockets), TypeScript, Zod.
- **Database**: Prisma ORM with SQLite (zero setup) & PostgreSQL support.
- **Testing**: Vitest for unit & component tests.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Goodzilla/koboverlay.git
cd koboverlay

# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 2. Environment Setup
```bash
# In /server, copy the example env file and edit as needed
cp .env.example .env

# Run database migration
npx prisma db push
```

### 3. Run Development Servers
```bash
# Terminal 1: Run Backend API & Socket Server (port 4000)
cd server
npm run dev

# Terminal 2: Run Frontend Studio Editor (port 5173)
cd client
npm run dev
```

Open your browser at `http://localhost:5173` to access the KobOverlay Studio.

---

## License

MIT License. Open source and free for streamers worldwide.
