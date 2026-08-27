# Setup

## Requirements

- Node.js 24.20.0
- pnpm 11.23.0
- PostgreSQL 15+ recommended

## Install

```bash
test -f .nvmrc
nvm install
nvm use
if ! command -v corepack >/dev/null 2>&1; then npm install -g corepack@latest; fi
corepack enable
corepack install --global pnpm@11.23.0
pnpm install
```

The workspace uses pnpm 11 `allowBuilds` with `strictDepBuilds: true`. `unrs-resolver@1.12.2` and `sharp` are pre-approved; new build-script dependencies remain blocked until explicitly reviewed.

## PostgreSQL

```bash
createdb powerchain_copilot
export DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5432/powerchain_copilot'
pnpm db:migrate
```

## Environment

Development:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

Mainnet templates:

```bash
cp apps/backend/.env.mainnet.example apps/backend/.env
cp apps/frontend/.env.mainnet.example apps/frontend/.env.local
```

See `docs/ENVIRONMENTS.md` and `docs/AI_MODELS.md`.

Backend production-critical settings:

- `DATABASE_URL`
- `SESSION_SECRET` (minimum 32 characters)
- `CORS_ALLOWED_ORIGINS`
- provider keys for intentionally enabled adapters

Frontend connectivity settings:

- `POWERCHAIN_BACKEND_URL`
- `NEXT_PUBLIC_POWERCHAIN_WS_URL`

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
