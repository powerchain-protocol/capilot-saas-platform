# Setup

## Requirements

- Node.js 24.20.0
- pnpm 11.24.0
- PostgreSQL 15+ recommended

## Install

```bash
test -f .nvmrc
nvm install
nvm use
if ! command -v corepack >/dev/null 2>&1; then npm install -g corepack@latest; fi
corepack enable
corepack install --global pnpm@11.24.0
pnpm install
```

The workspace uses pnpm 11 `allowBuilds` with `strictDepBuilds: true`. `unrs-resolver@1.12.2` and `sharp` are pre-approved; new build-script dependencies remain blocked until explicitly reviewed.

## PostgreSQL / Supabase

Supabase local development is the default database workflow:

```bash
cp .env.example .env.local
pnpm supabase:start
pnpm db:migrate
pnpm db:check
```

`DATABASE_URL` targets the runtime pooler (`54329` locally). `DIRECT_URL` targets the direct database port (`54322`) and is preferred by the migration runner. A standalone PostgreSQL database is still supported by setting both variables to the appropriate PostgreSQL connection string.

## Environment

Development:

```bash
cp .env.example .env.local
```

Mainnet templates:

```bash
cp .env.mainnet.example .env.local
```

See `docs/ENVIRONMENTS.md` and `docs/AI_MODELS.md`.

Backend production-critical settings:

- `DATABASE_URL`
- `DIRECT_URL` (preferred migration connection)
- `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` when Supabase features are enabled
- `SESSION_SECRET` (minimum 32 characters)
- `CORS_ALLOWED_ORIGINS`
- provider keys for intentionally enabled adapters

Frontend connectivity settings:

- `POWERCHAIN_BACKEND_URL`
- `NEXT_PUBLIC_POWERCHAIN_WS_URL`
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for optional browser Realtime/Storage

## Development

```bash
pnpm dev
```

Run independently if needed:

```bash
pnpm dev:backend
pnpm dev:frontend
```

Open:

- frontend `http://localhost:3000`
- backend `http://localhost:8000`
- Swagger `http://localhost:8000/docs`
