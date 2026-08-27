# Setup

## Requirements

- Node.js 24.20.0
- pnpm 11.23.0
- PostgreSQL 15+ recommended

## Install

```bash
nvm use
corepack enable
corepack prepare pnpm@11.23.0 --activate
pnpm install
```

Review blocked lifecycle scripts before approving:

```bash
pnpm approve-builds
```

## PostgreSQL

```bash
createdb powerchain_copilot
export DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5432/powerchain_copilot'
pnpm db:migrate
```

## Environment

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

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
