# PowerChain Copilot Frontend

**Canonical product version: 1.0.0**

Production-oriented Next.js full-stack SaaS for PowerChain Copilot: renewable infrastructure operations, AI-assisted analysis, governed approvals, assets, PWRC credits, provider integrations, and verified onchain workflows.

## Stack

- Next.js 16.3.3 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase/PostgreSQL production persistence through server-side REST
- Signed HttpOnly sessions
- Pyth / Birdeye / Helius / Solana RPC server adapters
- Vercel-ready deployment

## Product UI

The frontend uses PowerChain's white, light-gray, and dark-green design system with the canonical **PowerChain** wordmark and intentionally subdued light-gray **COPILOT** product label. The application includes responsive 44px+ touch targets, focus-visible states, reduced-motion support, loading skeletons, mobile-safe navigation, toast feedback, lazy-loaded marketing sections, and app/PWRC icon assets.

The authenticated workspace includes:

- Command Center overview
- Copilot chat with stored history and suggested prompts
- searchable/filterable operational assets
- role-gated Approval Center
- workspace settings
- current-session IP visibility with masked-by-default display
- configured provider status

## Main routes

```text
/
/product/
/pricing/
/install/
/setup/
/sign-in/
/get-started/
/dashboard/
/dashboard/copilot/
/dashboard/assets/
/dashboard/approvals/
/dashboard/settings/
/docs/
/security/
/status/
/about/
/legal/privacy/
/legal/terms/
/legal/cookies/
/legal/disclaimer/
```

## API v1

Canonical browser-facing API routes use:

```text
/api/v1/*
```

The typed frontend API surface lives in:

```text
apps/frontend/api/v1/
```

Legacy unversioned route modules remain as compatibility implementations, while frontend components target v1 endpoints.

See `docs/API.md`.

## Project organization

```text
apps/frontend/api/v1/   Browser API client + types
data/                   Legal, service, ecosystem data
utils/                  helpers, errors, formats, utility functions
lib/cache.ts            short-lived provider cache
lib/safe-actions.ts     safe async action boundary
lib/pyth.ts             Pyth adapter
lib/birdeye.ts          Birdeye adapter
lib/helius.ts           Helius adapter
lib/rpc.ts              Solana RPC adapter
cors/                   exact-origin CORS policy
components/services/    provider/service UI
config/                  application configuration and invariants
```

## Configurable top bar

The announcement bar is controlled only through `config/topbar.ts`:

```ts
export const topbarConfig = {
  enabled: true,
  badge: "NEW",
  message: "PowerChain Copilot 1.0.0 · AI operations for renewable infrastructure",
  href: "/product",
};
```

Change the message or set `enabled: false` without touching the navbar component.

## Authentication

- Passwords are hashed with scrypt.
- Standard sessions expire after 12 hours.
- Selecting **Remember me for 30 days** creates a persistent cookie with a 30-day signed-session lifetime.
- Without Remember me, the browser cookie is session-scoped.
- Session cookies are HttpOnly, `SameSite=Lax`, and `Secure` in production.
- Current IP is derived from the request and masked in the UI until explicitly revealed.
- Raw IP addresses are not persisted by the reference application database.

## Provider integrations

Provider secrets stay server-side.

- Pyth: explicit Hermes feed IDs
- Birdeye: optional authenticated market-data adapter
- Helius: optional Solana infrastructure adapter
- Solana RPC: configured production endpoint with development-only devnet fallback

Provider reads use short-lived TTL caching and request timeouts. See `docs/INTEGRATIONS.md`.

## CORS

API CORS is same-origin by default. Configure additional exact origins only when required:

```text
CORS_ALLOWED_ORIGINS=https://app.example.com,https://ops.example.com
```

Credentialed wildcard CORS is intentionally not supported. `proxy.ts` applies the policy uniformly to every `/api/v1/*` route and handles preflight requests.

## Installation sources

Native distribution remains configuration-driven:

- GitHub Releases
- Google Drive
- App Store
- Google Play
- Web app

Missing native release URLs fail closed into the access-request workflow rather than presenting fake downloads.

## Development

```bash
corepack enable
corepack prepare pnpm@11.24.0 --activate
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Quality gates

```bash
pnpm check:links
pnpm check:actions
pnpm typecheck
pnpm lint
pnpm build
```

## Production requirements

Production should configure at minimum:

- strong `SESSION_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- trusted `SOLANA_RPC_URL` or `HELIUS_RPC_URL`
- explicit Pyth feed IDs if Pyth is enabled
- Birdeye credentials if Birdeye is enabled
- approved release/distribution URLs
- final production legal text and subprocessor disclosures

Production data persistence and RPC behavior are designed to fail closed when required configuration is absent.

## Documentation

- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/INTEGRATIONS.md`
- `docs/SECURITY.md`
- `docs/SETUP.md`
- `PROGRESS.md`
