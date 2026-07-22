# KobOverlay Technical Architecture & Developer Context

This document describes the technical architecture, real-time socket protocol, data schemas, and state synchronization flow for **KobOverlay**. It serves as an authoritative guide for AI coding assistants and human developers alike.

---

## High-Level System Architecture

```
                               +--------------------------------+
                               |   Streamer Dashboard (React)   |
                               +---------------+----------------+
                                               | REST / WebSocket (Test Events)
                                               v
+----------------------+  EventSub   +--------------------------------+
|   Twitch API / IRC   +------------>|  Express + Socket.io Server    |
+----------------------+             +---------------+----------------+
                                                     | Socket.io ('alert-trigger')
                                                     v
                               +--------------------------------+
                               |   OBS Browser Overlay (React)  |
                               +--------------------------------+
```

---

## Socket.io Real-Time Protocol

Client overlay instances join isolated room channels based on their unique `overlayToken`:

### 1. Room Joining
- **Event**: `join-overlay`
- **Payload**: `{ token: string }`
- **Behavior**: Server places the socket client into room `overlay:<token>`.

### 2. Alert Trigger Broadcast
- **Event**: `trigger-alert`
- **Payload**:
```typescript
interface AlertEvent {
  id: string;
  type: 'sub' | 'resub' | 'subgift' | 'bits' | 'raid';
  username: string;
  tier: 'Prime' | '1000' | '2000' | '3000';
  months?: number;
  amount?: number;
  message?: string;
  durationMs: number;
  primaryColor: string;
}
```

### 3. Sub Goal Progress Update
- **Event**: `update-sub-goal`
- **Payload**:
```typescript
interface SubGoalUpdate {
  title: string;
  currentSubs: number;
  targetSubs: number;
}
```

---

## Database Schema (Prisma)

- **`User`**: Represents the streamer account. Holds `overlayToken` (UUID) and Twitch channel metadata.
- **`OverlayConfig`**: Configuration settings for the overlay (colors, animation speeds, sound preferences, sub goal title, target subs, current subs).
- **`AlertHistory`**: Audit log of all alerts triggered for historical stream recap.

---

## State Synchronization & Queue Management

The OBS Overlay Client maintains an internal **Alert Queue Service**:
1. Incoming `trigger-alert` events are pushed to an array queue.
2. If no alert is currently playing, the queue pops the next alert and sets active display state.
3. Audio alert sound triggers upon entrance. Confetti animation triggers for sub events.
4. After `durationMs` elapses, the widget plays the exit animation, clears active state, and pops the next queued item.
