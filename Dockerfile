# Multi-Stage Production Dockerfile for KobOverlay

# --- Stage 1: Build Frontend Client ---
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# --- Stage 2: Build Server ---
FROM node:18-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
COPY server/prisma ./prisma/
RUN npm ci
COPY server/ ./
RUN npx prisma generate
RUN npm run build

# --- Stage 3: Runner ---
FROM node:18-alpine AS runner
WORKDIR /app

# Install OpenSSL — required by Prisma on Alpine Linux
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/prisma ./server/prisma
COPY --from=client-builder /app/client/dist ./client/dist

WORKDIR /app/server
EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/server.js"]
