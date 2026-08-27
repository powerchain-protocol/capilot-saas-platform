- Added `sharp 0.35.3` to the Next.js frontend runtime for production image optimization.
# Changelog

All notable changes to PowerChain Copilot are documented here. The product remains on the canonical `1.0.0` release line until an intentional release is cut.

## Runtime, network profiles and AI model routing

- Pinned the repository to Node.js `24.20.0` LTS through `.nvmrc`, `.node-version`, package engines, and a runtime check; pnpm remains `11.23.0` and setup docs use nvm `0.40.7`.
- Migrated pnpm build-script trust from removed `onlyBuiltDependencies` configuration to pnpm 11 `allowBuilds`, explicitly approving only `unrs-resolver@1.12.2` and `sharp` while keeping `strictDepBuilds` fail-closed.
- Added explicit `development` and `mainnet` profiles with Solana devnet/mainnet-beta and Sui devnet/mainnet selections plus production consistency validation.
- Added server-side provider/model routing for OpenAI, Anthropic, Gemini, DeepSeek, and Ollama with ordered fallback inside one governed AI request.
- Added sanitized `GET /v1/ai/models` and `GET /v1/network/profile` endpoints, frontend/SDK helpers, OpenAPI definitions, Postman requests, and mock responses.
- Added development/mainnet environment templates and `docs/ENVIRONMENTS.md` plus `docs/AI_MODELS.md`.

## Postman manifest refinement

- Added `api/postman/index.yaml` as the canonical human-readable Postman workspace/specification manifest.
- Updated the specification URL to the supplied workspace URL without the display-name segment.
- Extended API DX validation to prevent Postman workspace/specification identifiers and URLs from drifting.

## [1.0.0] - 2026-08-27

### Added

- pnpm + Turborepo monorepo with `apps/frontend`, `apps/backend`, `apps/dashboard`, `packages/ai`, and `packages/shared`.
- Node.js `24.20.0`, pnpm `11.23.0`, TypeScript `7.0.2`, and ESLint `10.9.1` toolchain pinning.
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

### Postman workspace linkage

- Linked the repository to the supplied PowerChain Postman workspace, dataset `6c7b04bd-20bf-45b8-8184-eba0156fa433`, specification `1e9bfbeb-cf59-4af3-a51f-25dce5bbe9c9`, and specification file `cc65a18c-43aa-41b0-8fee-bf8f6f18ebea`.
- Added `api/postman/remote.json` plus safe local validation, cloud-dataset inspection, specification snapshot pull, and explicit specification push commands.
- Kept repository OpenAPI as the deterministic build-time source while treating Postman Spec Hub as the collaboration/publishing target.
- Extended API DX validation so remote workspace identifiers and URLs cannot silently drift.

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

### Completed-response billing hardening

- Added deterministic 10,000 PWRC completed-response quotes with canonical payload hashing and five-minute expiry.
- Added atomic reservation and atomic response/settlement/receipt transactions with append-oriented ledger evidence.
- Added compensating reservation release for AI failures and settlement transaction failures so failed delivery does not intentionally consume credits.
- Added HTTP `402` insufficient-credit behavior before AI generation begins.
- Added quote and receipt APIs, OpenAPI schemas, Postman requests/datasets/flows, mock fixtures, TypeScript SDK methods, and `chat.receipt` AsyncAPI/WebSocket events.
- Added `docs/CREDITS.md` as the authoritative billing lifecycle and failure-semantics reference.
- Hardened repository check scripts so frontend audits are independent of the caller's working directory.
- Added an internal import-resolution audit for relative, frontend `@/`, and backend `@backend/` aliases.
- Added API DX drift validation covering API-key security, unique OpenAPI operation IDs, configured public API origins, and complete Postman HTTP-operation coverage.
- Closed the standalone AI-preview billing bypass by disabling `/v1/ai/generate` by default in production and rate-limiting it when explicitly enabled.
- Added bounded stale-reservation reconciliation with PostgreSQL row locking and compensating ledger releases for crash recovery.

### Runtime / pnpm workspace correction

- Moved the API generator from root `api-generator/` to `api/api-generator/` and updated all generator/check references.
- Moved the `unrs-resolver` override out of the deprecated `package.json#pnpm` block into `pnpm-workspace.yaml`.
- Kept Node `24.20.0` LTS as the `.nvmrc`/`.node-version` recommendation while widening the supported Node 24 engine floor to `24.19.0` so an existing `v24.19.0` checkout can install dependencies before upgrading.
- Added `pnpm setup:runtime` / `scripts/bootstrap.sh` for repeatable nvm + Corepack + pnpm activation.

### Runtime/bootstrap hardening

- Ensured `.nvmrc` and `.node-version` are committed at the repository root and both pin Node `24.20.0`.
- Unified root, frontend, and backend Node engine ranges at `>=24.19.0 <25` so Node `24.19.0` is no longer rejected by a nested workspace manifest.
- Replaced the legacy Corepack activation example with `corepack install --global pnpm@11.23.0` and added a Corepack-install fallback to `scripts/bootstrap.sh`.
- Added root runtime checks before `pnpm dev` and `pnpm build`.
- Removed the redundant Next.js `--turbopack` development flag; Next.js 16 uses Turbopack by default.
- Hardened the backend Node 24 TypeScript runtime with ESM package semantics, explicit `.ts` relative imports, and no-emit build validation to avoid generated-ESM extension failures.
- Release archives are now packaged with repository files at ZIP root so `.nvmrc` is visible immediately after extraction.
