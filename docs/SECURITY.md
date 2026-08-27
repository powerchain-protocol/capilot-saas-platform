# Security Model

## Trust boundaries

- Browser UI is untrusted input.
- Next.js `/api/v1/*` is a transport proxy, not an authorization boundary.
- Fastify backend is the authoritative API policy boundary.
- PostgreSQL is the durable state boundary.
- AI/provider output is untrusted analysis until reviewed.

## Sessions

- HttpOnly, SameSite=Lax session cookie
- HMAC-signed session claim
- persisted server session record
- explicit expiry and revocation
- optional 30-day Remember Me
- current session inventory and revoke endpoint
- masked request IP by default

## API

- exact-origin CORS allowlist
- no credentialed `*` origin
- request IDs
- body-size limit
- rate limiting on sensitive public/mutation routes
- role checks on approval mutation
- parameterized PostgreSQL queries
- generic production error messages for unexpected failures

## WebSockets

WebSocket chat rooms require the same session cookie and workspace/user ownership check as HTTP chat routes. A user cannot join another user's chat by guessing an ID or slug.

## Provider credentials

OpenAI, Birdeye, Helius, RPC, and related secrets remain backend-only. They must not be exposed through `NEXT_PUBLIC_*` values.

## Production fail-closed rules

Production startup fails when:

- `DATABASE_URL` is missing
- `SESSION_SECRET` is shorter than 32 characters

The memory store is not an automatic production fallback.
