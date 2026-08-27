# PowerChain Copilot 1.0.0 — Progress

## Complete

- [x] pnpm + Turborepo monorepo
- [x] Next.js frontend in `apps/frontend`
- [x] Fastify backend in `apps/backend`
- [x] Dashboard action registry in `apps/dashboard`
- [x] PostgreSQL storage adapter and migration
- [x] Development memory persistence fallback
- [x] Signed/revocable session architecture
- [x] Remember Me and current-session security metadata
- [x] `/api/v1/auth/`
- [x] `/api/v1/sessions/`
- [x] `/api/v1/middlewares/`
- [x] `/api/v1/ai/`
- [x] `/api/v1/chat/`
- [x] `/api/v1/messages/:id`
- [x] assets, approvals, dashboard, profile, services, market, network, contact APIs
- [x] opaque prefixed IDs and readable slugs
- [x] WebSocket chat events
- [x] HTTP polling fallback for chat realtime
- [x] `lib/powerchain/api.ts`, endpoints, WS, and fallbacks
- [x] OpenAPI 3.1 + Swagger UI + Postman collection
- [x] route-group organization for public/dashboard pages
- [x] frontend context/constants/storage/store/data boundaries
- [x] currency, epoch, explorer, and health utilities
- [x] strict TypeScript + ESLint 10.9.1 + no-explicit-any policy
- [x] light/dark/system themes and app icons
- [x] responsive marketing/dashboard/install UX
- [x] explicit development/mainnet environment profiles with Solana/Sui network policy
- [x] multi-provider AI model registry and managed fallback routing
- [x] pnpm 11 `allowBuilds` migration for `unrs-resolver`/`sharp`
- [x] Node.js 24.20.0 runtime pin and runtime doctor
- [x] Supabase CLI-compatible `supabase/config.toml` and canonical timestamped migrations
- [x] `DATABASE_URL` runtime pooler + `DIRECT_URL` migration split
- [x] package-scoped Turbo env allowlists for Supabase/database/provider secrets
- [x] optional typed `@powerchain/supabase` browser/server integration boundary
- [x] root `.env.example` / `.env.mainnet.example` with Turbo env-file loading

## Release gates

- [ ] Install dependencies on Node 24.20.0 with pnpm 11.24.0 in a network-enabled environment
- [ ] Generate and commit `pnpm-lock.yaml`
- [ ] Link/configure the staging Supabase/PostgreSQL project and apply `supabase/migrations/`
- [ ] Run `pnpm verify`
- [ ] Exercise auth/session revocation and Remember Me integration tests
- [ ] Exercise WebSocket auth/reconnect/polling fallback tests
- [ ] Validate frontend preview deployment
- [ ] Deploy backend to a WebSocket-capable long-lived runtime
- [ ] Configure production `DATABASE_URL`, `DIRECT_URL`, Supabase keys (if enabled), strong `SESSION_SECRET`, allowed origins, and intended provider credentials


## API developer experience

- [x] Postman environments and Runner datasets
- [x] Postman request tests and captured session/chat/message/approval IDs
- [x] Postman example responses suitable for mock-server creation
- [x] Local deterministic mock API with representative fixtures
- [x] OpenAPI YAML + JSON mirrors
- [x] AsyncAPI WebSocket specification
- [x] JSON Schema contracts
- [x] TypeScript API/WS SDK
- [x] API flow, SDK, mock, specification, and Postman documentation

## API security and credits extension

Completed: API-key security scheme/runtime verification, `/v1` external alias, API generator, Postman API-key environment support, PWRC credits/ledger, token metadata, safe Solana public wallet registry, SDK extensions, and dual API-host configuration.

## Completed-response billing hardening

- [x] Persist deterministic server quote before reservation
- [x] Canonical quote payload + SHA-256 quote hash
- [x] Atomic available → reserved transition
- [x] HTTP 402 before AI generation on insufficient credits
- [x] Compensating release on AI/provider failure
- [x] Periodic compensating release for stale/abandoned reservations after process failure
- [x] Atomic delivered response + reserved → spent settlement
- [x] Append-oriented reservation/release/settlement ledger
- [x] Non-transferable receipt linked to quote hash and delivered response
- [x] `chat.receipt` realtime event
- [x] Quotes/receipts REST API, SDK, OpenAPI, Postman, mock and documentation coverage
- [x] CWD-independent frontend static quality gates
- [x] API DX contract-drift audit
- [x] Link canonical PowerChain Postman workspace dataset/specification IDs and add safe remote sync/verification commands.

- [x] Canonical `api/postman/index.yaml` manifest with supplied PowerChain workspace/specification URL and drift validation.

## Next.js / backend / Solana integration pass

- [x] Replace unsupported `lucide-react` `Github` export with `FaGithub` across installer, setup, install and marketing surfaces.
- [x] Disable Next.js telemetry in local, Turbo and Vercel build paths.
- [x] Add `@powerchain/supabase` to Next workspace transpilation and preserve private Supabase keys as backend-only Turbo environment state.
- [x] Add `/v1/health/live` and `/v1/health/ready` plus `/api/v1` aliases.
- [x] Add `/v1/ai/providers` sanitized provider-order/configuration endpoint.
- [x] Expand Solana read-only integration with network, account and transaction-confirmation snapshots.
- [x] Add frontend renewable/Solana/PowerChain AI context modules and wire runtime status into Settings.
- [x] Update OpenAPI, Postman, mocks, SDK and generated API catalog.
- [ ] Run dependency-backed `pnpm install --frozen-lockfile`, `pnpm verify`, and the production Next.js build under Node 24.20.0 once the lockfile/dependency tree is available.
