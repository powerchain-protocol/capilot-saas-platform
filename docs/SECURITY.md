# Security Model

## Authentication

- Signed HttpOnly session cookie
- `SameSite=Lax`
- secure cookie in production
- 12-hour standard signed session
- optional 30-day remembered session only after explicit user selection
- scrypt password hashing

## Request protection

- same-origin checks on mutation endpoints
- IP-keyed in-memory rate limiting using hashed transient keys
- workspace-scoped authorization
- role gates on approval mutations
- no raw IP persistence in the reference application database
- request/response security headers

## API providers

Pyth, Birdeye, Helius, Solana RPC, Supabase service-role credentials, and AI provider credentials remain server-side.

## CORS

Cross-origin access is deny-by-default except same-origin traffic and exact origins configured through `CORS_ALLOWED_ORIGINS`.

## Execution boundary

Copilot analysis never grants execution authority. Sensitive operational, wallet, treasury, or blockchain actions should remain behind policy, evidence, simulation where applicable, explicit approval, and signature authorization.


## Cross-origin mutations

Mutation handlers accept requests from the application origin by default. A cross-origin mutation is accepted only when its exact origin is configured in `CORS_ALLOWED_ORIGINS`; wildcard credentialed origins are not supported. The `/api/v1` proxy applies matching response and preflight headers.
