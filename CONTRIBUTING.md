# Contributing to PowerChain Copilot

Changes must preserve operational truth, tenant/workspace boundaries, explicit approval controls, and build quality.

## Requirements

- Node.js `24.20.0` LTS
- pnpm `11.23.0`
- PostgreSQL for backend integration testing

```bash
nvm use
corepack enable
corepack prepare pnpm@11.23.0 --activate
pnpm install
```

Review dependency lifecycle scripts before running:

```bash
pnpm approve-builds
```

## Development

```bash
pnpm dev
```

Individual apps:

```bash
pnpm dev:backend
pnpm dev:frontend
```

## Required checks

```bash
pnpm check:source
pnpm typecheck
pnpm lint
pnpm build
```

Frontend structural gates:

```bash
pnpm --filter @powerchain/capilot-frontend check
```

## TypeScript

- Keep `strict` enabled.
- Do not use explicit `any`.
- Parse untrusted JSON as `unknown` and narrow it.
- Type every externally callable function boundary and route parameter.
- Do not hide failures with broad `eslint-disable`, `@ts-ignore`, or unsafe casts.

## Architecture

1. Runtime API business logic belongs in `apps/backend/src/api/v1/`, not Next.js route handlers.
2. `apps/frontend/app/api/v1/[...path]/route.ts` is a thin same-origin proxy only.
3. New REST operations must be documented in `api/openapi/openapi.yaml` and the Postman collection when useful.
4. WebSocket operations belong under `/ws/v1` and require the same authenticated workspace boundary as HTTP routes.
5. PostgreSQL migrations belong in `apps/backend/src/storage/migrations/`; they do not belong in `utils/`.
6. IDs are immutable opaque identifiers. Slugs are readable locators and must not replace identity/authorization checks.
7. Provider keys must never enter frontend bundles or `NEXT_PUBLIC_*` values.
8. Copilot analysis cannot imply approval or execution.
9. Production must fail closed when persistence or required session configuration is missing.
10. Shared cross-app types/utilities belong in `packages/shared`; reusable AI domain code belongs in `packages/ai`.
11. Dashboard actions surfaced to Copilot/agents must be registered in `apps/dashboard/actions.json`.

## UI

- Use Lucide for interface icons; use official artwork for brand/platform marks.
- Preserve light/dark/system themes and theme-aware app icons.
- Maintain 44px minimum touch targets, keyboard focus, reduced motion, and semantic labels.
- Keep public pages in the Next.js `app/(pages)/` route group so URLs remain clean.

## Pull requests

Include what changed, affected routes/packages, migrations/environment changes, checks run, and screenshots for visible UI changes. Never commit credentials, private keys, wallet secrets, production data, `.env`, or local database files.
