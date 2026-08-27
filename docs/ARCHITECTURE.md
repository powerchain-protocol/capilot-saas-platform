# PowerChain Copilot SaaS Architecture

## Application path

```text
Browser / PWA
  ↓
Next.js App Router
  ↓
apps/frontend/api/v1 client
  ↓
/api/v1 route
  ↓
Signed HttpOnly session
  ↓
Workspace + role authorization
  ↓
Repository / provider boundary
  ├─ Supabase/PostgreSQL
  ├─ Pyth
  ├─ Birdeye
  ├─ Helius / Solana RPC
  └─ managed AI adapter
```

## Application organization

```text
config/              editable product configuration and rules
data/                static product/legal/service data
utils/               pure shared helpers and formatting
components/services/ provider and service UI
apps/frontend/api/v1 typed browser API client
app/api/v1/          versioned HTTP API
cors/                exact-origin CORS helpers
lib/                  provider/cache/safe-action modules
lib/server/           auth, repository, storage, HTTP and security internals
```

## Copilot path

```text
User message
  ↓
POST /api/v1/copilot
  ↓
Session + workspace scope
  ↓
Persist user message
  ↓
Load workspace assets
  ↓
Managed AI adapter when configured
  └─ deterministic demo adapter otherwise
  ↓
Persist assistant message
  ↓
Append activity record
  ↓
Return structured actions
```

Copilot does not mutate approval state. Approval writes require an explicit authorized user action.

## Approval path

```text
Pending approval
  ↓
Approve / Request changes
  ↓
POST /api/v1/approvals/:id
  ↓
Same-origin + rate limit
  ↓
Signed session
  ↓
Role gate: owner | admin | operator
  ↓
Workspace-scoped mutation
  ↓
Append activity
```

## Provider boundary

```text
UI
 ↓
/api/v1/market/* or /api/v1/network/*
 ↓
safeAction
 ↓
cache.ts
 ↓
Pyth | Birdeye | Helius | Solana RPC
```

Secrets remain server-side. Provider reads have finite timeouts and short-lived caching. The cache is never treated as durable evidence.

## Session boundary

A standard sign-in creates a 12-hour signed token in a browser-session cookie. **Remember me** creates a 30-day persistent cookie only after explicit user selection. Current IP visibility is masked by default and derived from the active request; raw IPs are not stored in the reference application database.

## Production fail-closed configuration

Production mutations require:

- `SESSION_SECRET` of at least 32 characters
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Production Solana network calls require an explicit RPC configuration. Development may use the public devnet fallback.
