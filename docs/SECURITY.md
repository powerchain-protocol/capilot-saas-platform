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
- deterministic credit quotes hashed with SHA-256 before reservation
- atomic PostgreSQL reservation/settlement transitions for completed chat responses
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

The memory store is not an automatic production fallback. Production also fails closed when API-key enforcement is enabled without configured SHA-256 key hashes.

## API keys

External HTTP v1 requests use `X-Api-Key`. Production stores only SHA-256 digests in `POWERCHAIN_API_KEY_HASHES`; the raw key belongs in a secrets manager or deployment environment. The frontend's `POWERCHAIN_API_KEY` is server-only and is injected by the same-origin API proxy. Logs redact `x-api-key`, cookies, authorization headers, and set-cookie values.

Solana signing material is explicitly out of repository scope. `wallets/solana/keypairs.json` contains only public registry metadata and must remain free of private key arrays, seeds, or mnemonics.


## Credit-account integrity

PWRC credits are internal usage accounting. PostgreSQL reservations lock the quote and credit account row before moving value from `available` to `reserved`. Successful completed responses atomically persist the assistant message, move `reserved` to `spent`, append a settlement ledger entry, and persist a non-transferable receipt. AI/provider failures release the reservation through a compensating ledger entry.

The receipt contains no signing secret and does not represent transferable financial value.

## Unbilled preview guard

The standalone `/v1/ai/generate` diagnostic endpoint is controlled by `ALLOW_UNBILLED_AI_PREVIEW` and defaults off in production. This prevents callers from using the preview endpoint as a bypass around persisted-chat credit reservation and settlement.

## Stale credit reservation recovery

The server periodically releases PWRC reservations left behind by crashed or abandoned response attempts after a configurable recovery window. PostgreSQL reconciliation uses `FOR UPDATE SKIP LOCKED`, adjusts the account under lock, appends a compensating release ledger record, and marks the quote released. The canonical quote payload and hash are not modified.
