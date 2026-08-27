# PowerChain Supabase

This directory is the canonical Supabase/PostgreSQL deployment surface for PowerChain Copilot `1.0.0`.

## Ownership

- `migrations/` is the **single source of executable database migrations**.
- `api/schema.sql` is a review/documentation snapshot, not a second migration source.
- Runtime services connect through `DATABASE_URL`; migration tooling prefers `DIRECT_URL`.
- Supabase Auth is disabled locally because PowerChain's server-issued session/revocation model remains authoritative.
- Supabase Realtime and Storage are optional integration surfaces.

## Local

```bash
pnpm supabase:start
pnpm supabase:status
pnpm db:migrate
pnpm db:check
```

The local default database URL is `postgresql://postgres:postgres@127.0.0.1:54322/postgres`. The local pooler is on port `54329`.

## Hosted Supabase

Use the Supabase pooler connection string for `DATABASE_URL` when appropriate for the deployment runtime and a direct/session connection for `DIRECT_URL` when applying migrations. Keep both values server-only.

Preferred keys:

```dotenv
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Legacy `*_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are accepted as compatibility aliases, but new deployments should use publishable/secret keys. Never expose `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` through `NEXT_PUBLIC_*`.
