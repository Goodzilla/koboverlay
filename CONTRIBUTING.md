# Contributing to KobOverlay

Thank you for your interest in contributing to KobOverlay. Contributions from developers, designers, and streamers of all experience levels are welcome.

---

## Project Structure

KobOverlay is structured as a full-stack monorepo:

```
/
├── server/             # Express API, Socket.io Server, Prisma Schema & Vitest unit tests
│   ├── prisma/         # Prisma DB schema & migrations
│   ├── src/
│   │   ├── routes/     # authRoutes (Twitch OAuth + JWT), tokenRoutes, overlayRoutes
│   │   ├── services/   # alertQueueService, twitchService
│   │   └── sockets/    # overlaySocket (Socket.io room management)
│   └── tests/          # Vitest backend tests
├── client/             # React Vite Client (Studio Dashboard & OBS Overlay)
│   ├── src/components/ # DraggableWidget, LayerTree, SubAlertWidget, SubGoalWidget, AuthModal
│   ├── src/pages/      # Landing (Twitch login), Dashboard (Studio), Overlay (OBS source)
│   └── tests/          # Vitest client component tests
├── Dockerfile          # Multi-stage production container build
├── docker-compose.yml  # Local container orchestrator
└── README.md
```

---

## Rules for Contributions & AI Coding Assistants

When adding features or submitting pull requests:

1. **All UI text and documentation must be in 100% English** at all times. No non-English strings in labels, buttons, tooltips, dropdowns, or placeholders.
2. **Never commit secrets**. `server/.env` is gitignored. Use `server/.env.example` as a template for documentation.
3. **Always write unit tests** for new socket events, API endpoints, or React widgets (`npm test`).
4. **Keep overlay components lightweight** and free of heavy external dependencies to preserve low OBS CPU usage.
5. **Preserve dynamic CSS keyframes & glassmorphic styling**. Avoid bloated third-party CSS libraries.
6. **Update `ARCHITECTURE.md`** whenever modifying server-client event protocols, database models, or the auth flow.
7. Ensure code builds cleanly without TypeScript errors before committing.

---

## Local Development Setup

See [README.md](./README.md) for the full setup guide including Twitch Developer Application creation.

---

## Running Tests

### Backend Server Tests
```bash
cd server
npm test
```

### Frontend Client Tests
```bash
cd client
npm test
```

---

## Git Commit & Workflow

1. Create a feature branch: `git checkout -b feature/my-cool-alert`
2. Run test suites to ensure clean passage.
3. Commit with clear messages: `git commit -m "feat(overlay): add wheel spin trigger"`
4. Submit a Pull Request.
