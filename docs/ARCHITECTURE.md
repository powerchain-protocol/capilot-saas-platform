# PowerChain Copilot Architecture

## Runtime topology

```text
Browser / PWA
    │
    ├─ Next.js frontend · apps/frontend · :3000
    │      ├─ app/(pages)/       public/auth/legal/install routes
    │      ├─ app/(dashboard)/   authenticated workspace routes
    │      └─ /api/v1/*          thin same-origin HTTP proxy
    │
    └──────────── HTTP ───────────────┐
                                     ▼
                          Fastify backend · apps/backend · :8000
                                     │
             ┌───────────────────────┼─────────────────────────┐
             ▼                       ▼                         ▼
        PostgreSQL               AI/providers             WebSocket hub
        pg Pool                  Solana/Pyth/etc.          /ws/v1/chat/:id
```

The frontend does not duplicate business logic. Authentication, sessions, authorization, storage, AI/provider access, and mutations are authoritative in `apps/backend`.

## API v1

```text
apps/backend/src/api/v1/
├── auth/
├── sessions/
├── middlewares/
├── ai/
├── chat/
├── messages/
├── assets/
├── approvals/
├── dashboard/
├── profile/
├── contact/
├── services/
├── market/
├── network/
└── health/
```

All externally visible REST resources remain versioned under `/api/v1`.

## Frontend route organization

Public URL paths do not include organizational route-group names:

```text
app/(pages)/faq/page.tsx        → /faq
app/(pages)/contact/page.tsx    → /contact
app/(dashboard)/dashboard/...   → /dashboard/...
```

This avoids the legacy Pages Router while still grouping route sources coherently.

## Identity

Opaque IDs use stable prefixes:

- `usr_` user
- `wsp_` workspace
- `mem_` membership
- `ses_` session
- `ast_` asset
- `apr_` approval
- `act_` activity
- `cht_` chat
- `msg_` message
- `cnt_` contact request

Readable resources also receive slugs. Authorization always uses immutable identity plus workspace ownership; slug matching is a locator convenience, not an access-control primitive.

## Sessions

A signed `pc_session` HttpOnly cookie contains a short session claim referencing a persisted session record. The backend validates both:

1. cookie HMAC and expiry
2. persisted session id, workspace/user/role match, revocation state, and expiry

Remember Me produces a 30-day persistent cookie/session. Standard sign-in uses a session cookie with a 12-hour server expiry.

## Storage

Production requires PostgreSQL through `DATABASE_URL`. Development can use the memory adapter only when `ALLOW_MEMORY_FALLBACK=true` and `NODE_ENV` is not production.

Migrations are located at:

```text
apps/backend/src/storage/migrations/
```

Database schemas do not belong in frontend utilities or generic `utils/` directories.

## Realtime

Chat events are published to authenticated rooms through:

```text
/ws/v1/chat/:id
```

The browser transport in `apps/frontend/lib/powerchain/ws.ts` falls back to polling `GET /api/v1/chat/:id` when WebSocket connectivity is unavailable.

## AI boundary

Copilot receives authenticated workspace asset context. It may analyze and recommend, but it cannot convert analysis into approval, dispatch, wallet signature, treasury action, or settlement completion. Provider errors may fall back to deterministic representative analysis only when explicitly allowed by backend configuration.
