# PowerChain Copilot

PowerChain Copilot is a full-stack SaaS workspace for renewable infrastructure, operational AI, governed approvals, evidence-aware workflows, and onchain integration boundaries.

**Canonical release:** `1.0.0`

## Core features

- **Copilot chat** — persisted chats/messages with opaque IDs + human-readable slugs, managed AI, deterministic development fallback, saved prompts, suggested actions, WebSocket updates, HTTP polling fallback, and atomic PWRC completed-response billing.
- **Command Center** — authenticated workspace metrics, renewable assets, activity, approvals, service health, and responsive desktop/mobile navigation.
- **Renewable assets** — solar, wind, storage, EV, and metering entities with operational status and verification state.
- **Governed actions** — role-aware approval mutations and a canonical action registry at `apps/dashboard/actions.json`.
- **Session security** — signed HttpOnly cookies, optional 30-day Remember Me, persisted/revocable sessions, workspace membership, role context, and masked IP display.
- **PostgreSQL storage** — `pg` connection pooling, parameterized queries, explicit migrations, and a memory adapter restricted to development fallback.
- **API v1** — Fastify backend with `X-Api-Key`, exact-origin CORS, request IDs, error envelopes, Swagger UI, OpenAPI 3.1, Postman coverage, generated operation catalog, and same-origin frontend proxying.
- **Realtime** — authenticated `/ws/v1/chat/:id` WebSocket channel with browser polling fallback when realtime is unavailable.
- **Environment profiles** — explicit `development` and `mainnet` modes with Solana devnet/mainnet-beta and Sui devnet/mainnet fail-closed network policy.
- **AI model routing** — server-side OpenAI, Anthropic, Gemini, DeepSeek, and Ollama model configuration with ordered fallback inside a single governed PWRC reservation.
- **Energy integrations** — Solana RPC/Helius health and server-only Pyth/Birdeye boundaries.
- **Cross-platform frontend** — responsive Next.js, PWA metadata, install/setup flows, light/dark/system themes, theme-aware PowerChain app icons, and Lucide interface icons.
- **Strict engineering gates** — TypeScript strict mode, ESLint `10.9.1`, explicit-`any` rejection, route/action/asset/API/OpenAPI/Postman checks that are cwd-independent, and Turbo build orchestration.

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

- Node.js `24.20.0`
- pnpm `11.24.0`
- nvm `0.40.7` for local Node activation
- Turborepo `2.10.11`
- Next.js `16.3.3`
- React `19.2.8`
- TypeScript `7.0.2`
- ESLint `10.9.1`
- Tailwind CSS `4.3.3`
- Lucide React `1.34.0`
- Fastify `5.12.1`
- PostgreSQL client `pg` `8.23.0`

Node `26.8.1` is the current release, but this repository intentionally pins the latest Node 24 LTS (`24.20.0`) so local, CI, and Vercel runtimes stay aligned.

## Quick start

### 1. Runtime and dependencies

```bash
# Install nvm v0.40.7 if nvm is not already installed.
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
. "$HOME/.nvm/nvm.sh"

# Run these commands from the repository root.
# .nvmrc is committed at ./.nvmrc and pins the preferred runtime.
pwd
test -f .nvmrc
nvm install
nvm use

# Some Node/nvm installations do not ship a Corepack binary.
if ! command -v corepack >/dev/null 2>&1; then npm install -g corepack@latest; fi
corepack enable
corepack install --global pnpm@11.24.0

node --version
pnpm --version
pnpm install
```

pnpm 11 uses the `allowBuilds` map in `pnpm-workspace.yaml`. The reviewed native/build dependencies are explicitly allowed:

```yaml
strictDepBuilds: true
allowBuilds:
  unrs-resolver: true
  sharp: true
```

This resolves `ERR_PNPM_IGNORED_BUILDS` for the pinned `unrs-resolver@1.12.2` without enabling lifecycle scripts globally. If a future dependency introduces a build script, review it first and then run `pnpm approve-builds`.

### 2. PostgreSQL / Supabase

Local Supabase is the default database workflow; standalone PostgreSQL remains supported:

```bash
pnpm supabase:start
cp .env.example .env.local
pnpm db:migrate
pnpm db:check
```

`DATABASE_URL` is the pooled runtime connection. `DIRECT_URL` is preferred for migrations so schema changes do not run through a transaction pooler.

Executable migrations are ordered under:

```text
supabase/migrations/
├── 20260827000100_initial.sql
├── 20260827000200_credits.sql
└── 20260827000300_credit_quotes_receipts.sql
```

`supabase/migrations/` is the single executable migration owner. `api/schema.sql` remains a review snapshot rather than a duplicate migration source.

### 3. Environment files

Development:

```bash
cp .env.example .env.local
```

Mainnet deployment template:

```bash
cp .env.mainnet.example .env.local
```

Package-specific examples remain available under `apps/backend/` and `apps/frontend/` for isolated service development.

Development defaults to `POWERCHAIN_ENV=development`, Solana `devnet`, and Sui `devnet`. Mainnet uses `POWERCHAIN_ENV=mainnet`, Solana `mainnet-beta`, and Sui `mainnet`; production validation rejects mismatched network settings and demo/memory fallbacks.

For local development use the same hostname for frontend and backend (`localhost` is recommended) so the session cookie can also authenticate the WebSocket connection. See `docs/ENVIRONMENTS.md` and `docs/AI_MODELS.md`.

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

## Postman workspace integration

PowerChain Copilot is linked to the PowerChain Postman workspace through `api/postman/index.yaml` and `api/postman/remote.json`, including the cloud dataset `6c7b04bd-20bf-45b8-8184-eba0156fa433` and Spec Hub specification `1e9bfbeb-cf59-4af3-a51f-25dce5bbe9c9`. Repository OpenAPI remains deterministic and network-independent; Postman sync is explicit through `pnpm postman:*` commands. Canonical specification: <https://crimson-crescent-8585.postman.co/workspace/55a50a8b-cdb7-46f5-807e-3494d0262565/specification/1e9bfbeb-cf59-4af3-a51f-25dce5bbe9c9/file/cc65a18c-43aa-41b0-8fee-bf8f6f18ebea>. See `api/postman/index.yaml` and `api/postman/REMOTE.md`.

## API

External REST prefix:

```text
https://api.capilot.powerchain.energy/v1
```

The browser uses the same-origin gateway `/api/v1`; Fastify exposes both `/v1` and the internal compatibility alias `/api/v1`.

Primary groups:

```text
/api/v1/auth/*
/api/v1/sessions/*
/api/v1/ai/* (`GET /ai/models`, development-only preview when enabled)
/api/v1/chat/*
/api/v1/messages/:id
/api/v1/assets
/api/v1/approvals/*
/api/v1/dashboard
/api/v1/services
/api/v1/market/price
/api/v1/network/profile
/api/v1/network/solana
/api/v1/credits
/api/v1/credits/ledger
/api/v1/credits/quotes
/api/v1/credits/receipts
/api/v1/tokens
/api/v1/tokens/pwrc
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


## PWRC completed-response billing

Copilot chat uses a server-authoritative internal credit lifecycle. A successful completed response follows:

```text
canonical quote payload
  → SHA-256 quote hash
  → persist quote
  → atomic reservation
  → AI generation
  → atomic assistant-message + settlement commit
  → append-only ledger movement
  → non-transferable receipt
```

The receipt links the quote hash, reservation ledger entry, settlement ledger entry, and delivered response message. It is audit evidence only and is **not a transferable financial token**. AI/provider failure releases the reservation with a compensating ledger entry. Insufficient credits return HTTP `402` and do not start AI generation.

Detailed lifecycle, failure semantics, schemas, and reconciliation guidance: [`docs/CREDITS.md`](docs/CREDITS.md).

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
pnpm check:api-dx
pnpm check:schema
pnpm check:imports
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

## Development and build

The canonical root commands validate the Node runtime before starting Turbo:

```bash
pnpm dev       # frontend + backend development tasks
pnpm build     # production build/typecheck tasks
pnpm verify    # full repository quality gate
```

The Next.js frontend uses `next dev` (Turbopack is the Next.js 16 default). The backend runs directly from TypeScript on Node 24 using native type stripping, and all backend relative imports use explicit `.ts` specifiers so ESM development does not depend on extension guessing. The backend `build` task is a strict no-emit TypeScript validation gate; deployment executes the same checked TypeScript source under the pinned Node 24 runtime.

## Runtime troubleshooting

The repository commits `.nvmrc` and `.node-version` at the repository root with the preferred Node `24.20.0` runtime. All workspace package engines consistently accept Node `>=24.19.0 <25`, so an existing `v24.19.0` checkout is not rejected during installation. Run `nvm install && nvm use` from the directory that contains `package.json`, `pnpm-workspace.yaml`, and `.nvmrc` to move to the preferred runtime.

```bash
# From the repository root
nvm install 24.20.0
nvm use 24.20.0

# If Corepack is not present in this Node installation
npm install -g corepack@latest
corepack enable
corepack install --global pnpm@11.24.0

pnpm install
```

Or run the repository bootstrap after nvm is installed/loaded:

```bash
pnpm setup:runtime
```

pnpm project settings, including the `unrs-resolver` override and trusted dependency builds, live in `pnpm-workspace.yaml`. Do not add a top-level `pnpm.overrides` block back to `package.json`.

The API generator is organized with the API contracts at `api/api-generator/`:

```bash
pnpm api:generate
pnpm api:generate:check
```


## Supabase integration

Supabase is an optional production integration and the canonical migration layout now follows the Supabase CLI convention under `supabase/`. Runtime PostgreSQL traffic uses `DATABASE_URL`; migration tooling prefers `DIRECT_URL` so migrations are not forced through a transaction pooler. Supabase browser configuration uses publishable keys only. Secret/service-role keys remain backend-only and are intentionally excluded from root Turbo `globalEnv` and frontend task env allowlists.

```bash
pnpm supabase:doctor
pnpm supabase:start
pnpm db:migrate
pnpm db:check
```

The existing PowerChain session/revocation model remains authoritative; enabling Supabase Auth requires a deliberate migration rather than silently introducing a second authentication authority.

## Vercel / Next.js 16 deployment

The frontend is deployed from the monorepo with Turbo filtering:

```bash
NEXT_TELEMETRY_DISABLED=1 pnpm turbo build --filter=@powerchain/capilot-frontend
```

`vercel.json` installs pnpm `11.24.0`, targets `apps/frontend/.next`, uses `fra1`, and marks `/api/*` responses `no-store`. The frontend also disables Next telemetry through its cross-platform `scripts/run-next.mjs` wrapper.

GitHub is a brand icon and is intentionally imported from `react-icons/fa6` (`FaGithub`), not from `lucide-react`. This avoids the static-export failure seen with `lucide-react@1.34.0` under Turbopack.

## API v1 runtime surfaces

Both `/api/v1/*` and `/v1/*` register the same backend modules. New read-only operational endpoints include:

```text
GET /v1/health/live
GET /v1/health/ready
GET /v1/ai/models
GET /v1/ai/providers
GET /v1/network/profile
GET /v1/network/solana
GET /v1/network/solana/accounts/:address
GET /v1/network/solana/transactions/:signature
```

Solana account and transaction endpoints are authenticated, rate-limited and restricted to fixed read methods; they never expose the configured RPC URL, API keys, arbitrary JSON-RPC forwarding, wallet signing, or transaction dispatch.

Frontend AI domain composition lives under:

```text
apps/frontend/ai/providers.tsx
apps/frontend/ai/generic/renewables/
apps/frontend/ai/solana/solana.tsx
apps/frontend/ai/powerchain/powerchain.tsx
apps/frontend/ai/powerchain/powerchan.tsx   # compatibility alias
```
