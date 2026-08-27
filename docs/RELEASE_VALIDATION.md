# Release validation — PowerChain Copilot 1.0.0

Validated in the artifact build environment on 2026-08-27.

## Passed

- Source architecture audit: **262 TS/TSX source files**, no detected explicit `any` annotations/casts.
- TypeScript parser scan: **262 implementation TS/TSX files**, **0 syntax diagnostics**.
- Internal import audit: **474** relative, frontend `@/`, and backend `@backend/` imports resolved.
- Internal route audit: **25 application page routes**, no dead literal internal routes.
- Interactive action audit: passed across **191 frontend TS/TSX files**.
- API/backend structure audit: **20 required architecture files** present.
- Public asset audit: **17 literal static asset references** resolve.
- OpenAPI coverage audit: **31 canonical HTTP/WebSocket paths** represented.
- API DX audit: **34 HTTP operations**, **34 Postman requests**, **34 unique operation IDs**.
- API generator stale-output check: **35 generated operations** current.
- OpenAPI `ApiKey` contract uses `X-Api-Key` and global API-key security.
- Schema snapshot audit: `20260827000200_credits.sql` and `20260827000300_credit_quotes_receipts.sql` exactly mirrored by `api/schema.sql`.
- Dashboard action-registry audit: **4 governed actions** registered.
- JSON parsing: passed across repository API/config artifacts.
- OpenAPI/AsyncAPI YAML parsing: passed.
- Deterministic mock API smoke tests: `/v1/health`, `/v1/credits`, `/v1/credits/quotes`, `/v1/credits/receipts`, and `/v1/tokens/pwrc` returned valid HTTP 200 JSON envelopes.
- Mock server and repository validation scripts pass JavaScript syntax checks.

## Billing hardening validated statically

- deterministic quote persisted before reservation
- canonical SHA-256 quote hash
- atomic available → reserved transition
- HTTP 402 before AI generation when credits are insufficient
- compensating release after AI/provider failure
- settlement-exception compensation path
- atomic assistant-response + reserved → spent settlement
- non-transferable receipt linked to quote/ledger/response evidence
- stale/abandoned reservation recovery loop using PostgreSQL row locks
- production unbilled-AI-preview guard

## Environment limitation

The artifact environment runs Node.js 22 and does not contain the project dependency tree. The repository supports Node.js >=24.19.0 <25, pins Node.js 24.20.0 in `.nvmrc`, and uses pnpm 11.24.0. Therefore a dependency-backed `pnpm install`, ESLint 10.9.1 execution, full `tsc --noEmit`, Turbo build, and Next.js production build are not claimed here and remain required before production release.

Run in a network-enabled Node 24.20.0 environment:

```bash
nvm use
corepack enable
corepack install --global pnpm@11.24.0
pnpm install
pnpm approve-builds
pnpm db:check
pnpm db:migrate
pnpm verify
```
