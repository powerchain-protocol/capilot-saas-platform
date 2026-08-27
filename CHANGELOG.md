# Changelog

All notable changes to PowerChain Copilot are documented here. The product remains on the canonical `1.0.0` release line until an intentional release is cut.

## [1.0.0] - 2026-08-27

### Added

- pnpm + Turborepo monorepo with `apps/frontend`, `apps/backend`, `apps/dashboard`, `packages/ai`, and `packages/shared`.
- Node.js `24.20.0` LTS, pnpm `11.23.0`, TypeScript `7.0.2`, and ESLint `10.9.1` toolchain pinning.
- Fastify `5.12.1` backend with exact-origin CORS, request IDs, secure error envelopes, Swagger UI, and OpenAPI 3.1.
- PostgreSQL persistence through `pg` `8.23.0`, connection pooling, parameterized queries, and canonical migration under `apps/backend/src/storage/migrations/`.
- Production fail-closed persistence with development-only memory fallback.
- Persisted/revocable session records, signed HttpOnly cookies, Remember Me, session inventory, current-session security metadata, and explicit session revocation.
- Canonical API groups for `/api/v1/auth`, `/sessions`, `/ai`, `/chat`, `/messages/:id`, `/assets`, `/approvals`, `/dashboard`, `/profile`, `/services`, `/market`, `/network`, and `/contact`.
- Opaque prefixed entity IDs plus readable workspace/asset/approval/chat slugs.
- Authenticated WebSocket chat events at `/ws/v1/chat/:id` with frontend HTTP polling fallback.
- `apps/frontend/lib/powerchain/` API client, endpoint registry, WebSocket transport, and fallback layer.
- Root `api/` documentation workspace with canonical OpenAPI, Postman collection, Swagger notes, and PostgreSQL schema snapshot.
- Postman environments, Collection Runner datasets, request tests, captured IDs, example responses, and portable API flow recipes.
- Deterministic local mock API and fixtures for frontend, SDK, Postman, and failure-state development.
- AsyncAPI 3.0 realtime specification plus portable JSON Schemas for API envelopes, chat events, and flow manifests.
- First-party `@powerchain/copilot-sdk` TypeScript client with typed REST methods and browser WebSocket helper.
- Next.js route groups for public pages and dashboard pages without changing public URLs.
- Frontend `context/`, `constants/`, `data/`, `storage/`, `store/`, `utils/epoch.ts`, and explorer/currency definitions.
- Light/dark/system themes with persisted preference and theme-aware PowerChain app icons.
- Lucide interface icons, shadcn-style primitives, toast feedback, responsive marketing/dashboard/install surfaces, and accessible loading/error states.
- Copilot chat realtime status, explicit persisted chat IDs, saved prompts, settings, and governed AI boundary messaging.
- Solana RPC, Helius, Pyth, and Birdeye server-side adapters.
- Action registry, route/API/OpenAPI/asset/source architecture audits, and explicit-`any` rejection.

### Changed

- Moved authoritative API business logic out of the Next.js application and into `apps/backend`.
- Replaced duplicated frontend API route implementations with one same-origin `/api/v1/[...path]` proxy.
- Moved database schema ownership away from frontend/Supabase utility placement into the backend storage/migration boundary.
- Reorganized public routes into `app/(pages)/` and dashboard routes into `app/(dashboard)/` while preserving `/faq`, `/contact`, `/dashboard`, and other canonical URLs.
- Replaced frontend server-side session coupling with an authenticated session API gate.
- Updated README, contribution rules, API documentation, setup guidance, and deployment notes for the split frontend/backend architecture.

### Security

- Provider credentials are backend-only.
- Production requires `DATABASE_URL` and a strong `SESSION_SECRET`.
- Credentialed wildcard CORS is not used.
- Session records can be revoked independently of cookie expiry.
- IP display remains masked unless the authenticated user explicitly requests reveal.
- WebSocket channels verify the same workspace/user session boundary as HTTP chat routes.
- AI analysis remains separate from approval, dispatch, wallet signature, treasury, and settlement execution.

### API key, credits, tokens and generation

- Added OpenAPI `ApiKey` security scheme using `X-Api-Key` and combined API-key/session protection for workspace operations.
- Added external `/v1` backend alias and configured `api.capilot.powerchain.energy` plus `capilot.powerchain.app` API origins.
- Added server-only API-key injection in the Next.js same-origin proxy and SHA-256 hash verification in Fastify.
- Added deterministic API generator with stale-output checks and a frontend `use-api-generator` catalog hook.
- Added PWRC credit-account and credit-ledger APIs, PostgreSQL migration `0002_credits.sql`, frontend credit UI/hook/types, and SDK methods.
- Added token-metadata endpoints and typed PWRC token configuration.
- Added public-key-only Solana wallet registry files with explicit secret-material exclusions.
- Updated Postman, OpenAPI, AsyncAPI, mock server, SDK, README, architecture, API, security, and flow documentation.
