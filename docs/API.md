# PowerChain Copilot API v1

Canonical application API prefix:

```text
/api/v1
```

The browser client lives under `apps/frontend/api/v1/` so UI code does not scatter endpoint strings throughout components.

## Authenticated workspace endpoints

```text
GET    /api/v1/dashboard
GET    /api/v1/assets
GET    /api/v1/approvals
POST   /api/v1/approvals/:id
GET    /api/v1/copilot
POST   /api/v1/copilot
PATCH  /api/v1/profile
GET    /api/v1/auth/session
POST   /api/v1/auth/sign-in
POST   /api/v1/auth/sign-out
POST   /api/v1/auth/register
POST   /api/v1/auth/demo
```

## Infrastructure endpoints

```text
GET /api/v1/health
GET /api/v1/services
GET /api/v1/market/price
GET /api/v1/network/solana
GET /api/v1/security/session
```

`/api/v1/security/session` returns a masked current request IP by default. `?reveal=1` reveals it to the currently authenticated session. The reference implementation does not persist raw IP addresses to the application database.

## CORS

Same-origin requests are allowed by default. Additional exact origins are configured with `CORS_ALLOWED_ORIGINS`. Cross-origin credentialed endpoints must never use wildcard origins.

CORS helpers live in `/cors/` and are used by infrastructure-facing v1 routes.

## Compatibility

The original unversioned handlers remain present as implementation modules for compatibility, while the frontend now targets `/api/v1`. New integration work should use the v1 routes.


## API boundary

`proxy.ts` applies the exact-origin CORS policy to every `/api/v1/*` request, including compatibility routes, and terminates OPTIONS preflight consistently. Credentialed mutation requests are accepted only from the same origin or an origin explicitly listed in `CORS_ALLOWED_ORIGINS`.
