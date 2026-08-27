# PowerChain Copilot

PowerChain Copilot is a full-stack SaaS workspace for renewable infrastructure, operational AI, governed approvals, evidence-aware workflows, and onchain integration boundaries.

**Canonical release:** `1.0.0`

## Core features

- **Copilot chat** — persisted chats/messages with opaque IDs + human-readable slugs, managed AI, deterministic development fallback, saved prompts, suggested actions, WebSocket updates, and HTTP polling fallback.
- **Command Center** — authenticated workspace metrics, renewable assets, activity, approvals, service health, and responsive desktop/mobile navigation.
- **Renewable assets** — solar, wind, storage, EV, and metering entities with operational status and verification state.
- **Governed actions** — role-aware approval mutations and a canonical action registry at `apps/dashboard/actions.json`.
- **Session security** — signed HttpOnly cookies, optional 30-day Remember Me, persisted/revocable sessions, workspace membership, role context, and masked IP display.
- **PostgreSQL storage** — `pg` connection pooling, parameterized queries, explicit migrations, and a memory adapter restricted to development fallback.
- **API v1** — Fastify backend with exact-origin CORS, rate limiting, request IDs, error envelopes, Swagger UI, OpenAPI 3.1, Postman collection, and same-origin frontend proxying.
- **Realtime** — authenticated `/ws/v1/chat/:id` WebSocket channel with browser polling fallback when realtime is unavailable.
- **Energy integrations** — Solana RPC/Helius health and server-only Pyth/Birdeye boundaries.
- **Cross-platform frontend** — responsive Next.js, PWA metadata, install/setup flows, light/dark/system themes, theme-aware PowerChain app icons, and Lucide interface icons.
- **Strict engineering gates** — TypeScript strict mode, ESLint `10.9.1`, explicit-`any` rejection, route/API/OpenAPI/action/asset checks, and Turbo build orchestration.

## Repository layout

```text
.
├── apps/
│   ├── frontend/                  # Next.js UI + same-origin /api/v1 proxy
│   │   ├── app/
│   │   │   ├── (pages)/           # marketing/auth/legal/install/status routes
│   │   │   ├── (dashboard)/       # authenticated dashboard routes
│   │   │   └── api/v1/[...path]/  # thin HTTP reverse proxy only
│   │   ├── context/
│   │   ├── constants/
│   │   ├── data/
│   │   ├── lib/powerchain/        # API, endpoints, WS, fallbacks
│   │   ├── storage/
│   │   └── store/
│   ├── backend/                   # Fastify API + PostgreSQL + WebSockets
│   │   └── src/
│   │       ├── api/v1/
│   │       │   ├── auth/
│   │       │   ├── sessions/
│   │       │   ├── middlewares/
│   │       │   ├── ai/
│   │       │   ├── chat/
│   │       │   └── messages/
│   │       ├── constants/
│   │       ├── context/
│   │       ├── data/
│   │       ├── storage/
│   │       ├── store/
│   │       ├── utils/
│   │       └── ws/
│   └── dashboard/                 # canonical action registry
├── packages/
│   ├── ai/
│   ├── shared/
│   └── sdk-typescript/             # typed API v1 client + WebSocket helper
├── api/
│   ├── openapi/                    # OpenAPI 3.1 YAML + JSON
│   ├── asyncapi/                   # WebSocket contract
│   ├── postman/                    # collection, environments, datasets, flows
│   ├── mocks/                      # local deterministic mock API + fixtures
│   ├── schemas/                    # JSON Schema contracts
│   ├── sdks/                       # SDK index/documentation
│   ├── swagger/
│   └── schema.sql
├── docs/
├── turbo.json
└── pnpm-workspace.yaml
```

> Next.js route groups such as `app/(pages)/faq/page.tsx` preserve the public URL `/faq`; the parentheses are organizational and do not become URL segments.


### Runtime ownership

- `apps/frontend` owns rendering, browser interaction, PWA/install UX, and the same-origin `/api/v1` proxy.
- `apps/backend` owns authentication, sessions, API policy, PostgreSQL, AI/provider execution, WebSockets, and authoritative mutations.
- `api/` owns portable developer contracts and tooling: OpenAPI, AsyncAPI, Postman environments/datasets/flows, deterministic mocks, JSON Schemas, SDK documentation, Swagger notes, and the schema snapshot.

The frontend does not contain a second database/repository implementation; this avoids drift between browser-facing code and the authoritative backend.

## Toolchain

- Node.js `24.20.0` LTS
- pnpm `11.23.0`
- Turborepo `2.10.11`
- Next.js `16.3.3`
- React `19.2.8`
- TypeScript `7.0.2`
- ESLint `10.9.1`
- Tailwind CSS `4.3.3`
- Lucide React `1.34.0`
- Fastify `5.12.1`
- PostgreSQL client `pg` `8.23.0`

## Quick start

### 1. Runtime and dependencies

```bash
nvm use
corepack enable
corepack prepare pnpm@11.23.0 --activate
pnpm install
```

If pnpm reports blocked lifecycle scripts, review them before approval:

```bash
pnpm approve-builds
```

### 2. PostgreSQL

Create a database and export the connection string:

```bash
createdb powerchain_copilot
export DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5432/powerchain_copilot'
pnpm db:migrate
```

The executable migration is:

```text
apps/backend/src/storage/migrations/0001_initial.sql
```

Database schemas/migrations intentionally live with the backend storage layer, **not** in `utils/`.

### 3. Environment files

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

For local development use the same hostname for frontend and backend (`localhost` is recommended) so the session cookie can also authenticate the WebSocket connection.

### 4. Run the monorepo

```bash
pnpm dev
```

Or run services separately:

```bash
pnpm dev:backend
pnpm dev:frontend
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`

## API

Canonical REST prefix:

```text
/api/v1
```

Primary groups:

```text
/api/v1/auth/*
/api/v1/sessions/*
/api/v1/ai/*
/api/v1/chat/*
/api/v1/messages/:id
/api/v1/assets
/api/v1/approvals/*
/api/v1/dashboard
/api/v1/services
/api/v1/market/price
/api/v1/network/solana
```

Realtime:

```text
/ws/v1/chat/:id
```

Artifacts:

- OpenAPI: `api/openapi/openapi.yaml`
- Postman: `api/postman/PowerChain-Copilot.postman_collection.json`
- Postman environments/datasets: `api/postman/environments/`, `api/postman/datasets/`
- AsyncAPI: `api/asyncapi/asyncapi.yaml`
- Local mock API: `pnpm api:mock` → `http://127.0.0.1:8010`
- TypeScript SDK: `packages/sdk-typescript/`
- Swagger: `http://localhost:8000/docs`

Browser code should use `apps/frontend/lib/powerchain/api.ts` rather than hard-coding endpoints. `apps/frontend/lib/powerchain/ws.ts` connects to WebSockets and automatically falls back to HTTP polling.

## ID and slug rules

Public entities use opaque prefixed identifiers:

```text
usr_<32 hex>
wsp_<32 hex>
cht_<32 hex>
msg_<32 hex>
```

Human-readable resources such as workspaces, assets, approvals, and chats also carry slugs. IDs remain the immutable identity; slugs are navigation/readability aids and can be resolved where supported.

## Production boundaries

- `DATABASE_URL` is required in production.
- `SESSION_SECRET` must contain at least 32 characters.
- Provider keys belong only in `apps/backend` environment variables.
- Production does not silently fall back to in-memory persistence.
- AI analysis never implies approval, dispatch, treasury execution, wallet signature, or settlement completion.
- Missing WebSocket connectivity falls back to HTTP polling; it does not invent realtime state.

## Quality gates

```bash
pnpm check:source
pnpm typecheck
pnpm lint
pnpm build
pnpm verify
```

Frontend structural checks:

```bash
pnpm --filter @powerchain/capilot-frontend check
```

The repository rejects explicit `any` and requires untrusted JSON/external responses to be narrowed from `unknown`.

## Vercel

The root Vercel configuration builds the Next.js frontend. The Fastify backend includes long-lived WebSocket connections and should be deployed on a runtime that supports persistent WebSocket upgrades. Configure `POWERCHAIN_BACKEND_URL` and `NEXT_PUBLIC_POWERCHAIN_WS_URL` for the deployed frontend.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Postman](docs/POSTMAN.md)
- [Mocks](docs/MOCKS.md)
- [Specifications](docs/SPECIFICATIONS.md)
- [SDK](docs/SDK.md)
- [API flows](docs/FLOWS.md)
- [Security](docs/SECURITY.md)
- [Setup](docs/SETUP.md)
- [Integrations](docs/INTEGRATIONS.md)
- [Contributing](CONTRIBUTING.md)
- [Contributors](CONTRIBUTORS.md)
- [Changelog](CHANGELOG.md)

## License

MIT. See [LICENSE](LICENSE).

## API v1 security

PowerChain exposes the external versioned API through `https://api.capilot.powerchain.energy/v1` with `https://capilot.powerchain.app/v1` configured as the app-gateway fallback. The browser application continues to use same-origin `/api/v1`, where the Next.js server proxy injects `X-Api-Key` without exposing it to browser JavaScript. User/workspace endpoints require both the API key and the signed HttpOnly session cookie.

Developer tooling includes OpenAPI 3.1, AsyncAPI 3.0, Postman datasets/flows, a deterministic mock API, the typed TypeScript SDK, and `pnpm api:generate` for a generated operation catalog. PWRC usage-credit and token-metadata APIs are included under `/v1/credits*` and `/v1/tokens*`.

Solana wallet configuration under `wallets/solana/` is public-key metadata only. Never commit private keys, mnemonic phrases, seed material, or signing arrays.
