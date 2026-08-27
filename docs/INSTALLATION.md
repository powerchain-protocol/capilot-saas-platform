# Installation surfaces

PowerChain Copilot 1.0.0 exposes one canonical installation flow across Web/PWA, iOS, Android, macOS, and Windows.

## Rules

- Native releases must come from configured signed channels.
- Missing native release URLs fail closed into an access-request flow; the UI never exposes fake download actions.
- Web access remains available through the authenticated SaaS application.
- The PWA service worker never caches `/api/*` requests, authentication responses, approvals, AI responses, or transaction state.
- Offline UI is informational only. It never fabricates telemetry, balances, approvals, receipts, or execution status.

## Frontend structure

```text
apps/frontend/
├── components/installer/
│   ├── desktop.tsx
│   ├── mobile.tsx
│   ├── pwa.tsx
│   ├── pwa-register.tsx
│   └── install-method-card.tsx
├── integrations/pages/
│   ├── loading.tsx
│   ├── 404.tsx
│   ├── not-found.tsx
│   └── error.boundary.tsx
├── storage/
└── store/
```

## PWA

`public/sw.js` caches only the minimal shell assets required to explain offline state. API routes are explicitly excluded from service-worker caching.
