# 🌐 StreamPulse Deployment Guide

StreamPulse is optimized for low-cost ($0 - $5/mo) or free deployment across modern PaaS platforms and single VPS environments.

---

## 🟢 Option 1: Render / Railway / Fly.io (PaaS - Recommended)

### Render Deployment (Free Tier)
1. Fork or push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New Web Service**.
3. Connect your GitHub repository.
4. Select **Docker** environment (Render will automatically detect the root `Dockerfile`).
5. Set Environment Variables:
   - `PORT`: `4000`
   - `DATABASE_URL`: `file:./dev.db` (or attach a persistent disk volume `/data/dev.db`).
6. Click **Deploy**. Render will build the container and provide your live URL (e.g. `https://streampulse.onrender.com`).

---

## 🐳 Option 2: Docker / Single VPS ($4/mo on Hetzner / DigitalOcean)

StreamPulse includes a production `Dockerfile` and `docker-compose.yml`.

```bash
# Clone on your VPS
git clone https://github.com/your-username/streampulse.git
cd streampulse

# Launch container
docker-compose up -d --build
```

Your service will run on port `4000`, with SQLite persistent storage saved in `./server/prisma/data/dev.db`.

---

## 🗄️ Database Configuration

### SQLite (Default)
In `server/.env`:
```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL (Cloud DB like Neon / Supabase)
In `server/prisma/schema.prisma`, update provider to `postgresql`, then set in `server/.env`:
```env
DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/streampulse?sslmode=require"
```
Then run:
```bash
npx prisma db push
```
