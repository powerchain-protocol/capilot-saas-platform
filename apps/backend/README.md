# PowerChain Copilot Backend

Fastify API v1 for PowerChain Copilot `1.0.0`.

## Responsibilities

- PostgreSQL persistence through `pg`
- signed/revocable sessions
- authentication and workspace authorization
- assets, approvals, activity, chats, and messages
- managed AI with explicit deterministic development fallback
- Solana/Pyth/Birdeye adapters
- WebSocket chat events
- OpenAPI + Swagger UI
- exact-origin CORS and request security

## Run

```bash
cp .env.example .env
pnpm --filter @powerchain/capilot-backend dev
```

Swagger UI is served at `/docs`; API routes are under `/api/v1`; WebSockets are under `/ws/v1`.
