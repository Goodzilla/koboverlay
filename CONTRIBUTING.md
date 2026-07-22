# Contributing to StreamPulse 🤝

Thank you for your interest in contributing to StreamPulse! We welcome contributions from developers, designers, and streamers of all experience levels.

---

## 🛠️ Project Structure

StreamPulse is structured as a full-stack monorepo:

```
/
├── server/             # Express API, Socket.io Server, Prisma Schema & Vitest unit tests
│   ├── prisma/         # Prisma DB schema & migrations
│   ├── src/            # Express controllers, socket rooms, services
│   └── tests/          # Vitest backend tests
├── client/             # React Vite Client (Dashboard & OBS Overlay)
│   ├── src/components  # Reusable UI & Overlay widgets
│   ├── src/pages       # Dashboard and OBS Overlay views
│   └── tests/          # Vitest client component tests
├── Dockerfile          # Multi-stage production container build
├── docker-compose.yml  # Local container orchestrator
└── README.md
```

---

## 📋 Rules for Contributions & AI Coding Assistants

When adding features or submitting pull requests:
1. **Always write unit tests** for new socket events, API endpoints, or React widgets (`npm test`).
2. **Keep overlay components lightweight** and free of heavy external dependencies to preserve low OBS CPU usage.
3. **Preserve dynamic CSS keyframes & glassmorphic styling**. Avoid bloated third-party CSS libraries.
4. **Update `ARCHITECTURE.md`** whenever modifying server-client event protocols or database models.
5. Ensure code builds cleanly without TypeScript or linter errors before committing.

---

## 🧪 Running Tests

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

## 🔁 Git Commit & Workflow

1. Create a feature branch: `git checkout -b feature/my-cool-alert`
2. Run test suites to ensure clean passage.
3. Commit with clear messages: `git commit -m "feat(overlay): add wheel spin trigger"`
4. Submit a Pull Request!
