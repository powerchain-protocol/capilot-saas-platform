# PowerChain Copilot Setup

Canonical product version: **1.0.0**.

## Distribution sources

`/setup/` is the canonical installation entry point. Available sources are resolved from `config/install.ts` and constrained by `config/rules.ts`.

- **GitHub Releases** — public or approved signed artifacts and checksums.
- **Google Drive** — managed beta / enterprise distribution when `NEXT_PUBLIC_GOOGLE_DRIVE_RELEASE_URL` is configured.
- **App Store / Google Play** — managed mobile release channels when store URLs are configured.
- **Web** — authenticated browser application; no native installation required.

Missing native source URLs do not become fake download buttons. They route to the stored contact/access-request flow.

## Required environment

Copy `.env.example` to `.env.local` and configure production secrets and distribution URLs. Never commit production secrets or service-role credentials.

## Quality gates

Run:

```bash
pnpm check:links
pnpm check:actions
pnpm check:api
pnpm typecheck
pnpm lint
pnpm build
```


## API and integrations

The canonical browser API is `/api/v1/*`. Server-only provider adapters live in `lib/pyth.ts`, `lib/birdeye.ts`, `lib/helius.ts`, and `lib/rpc.ts`; credentials must never be exposed through `NEXT_PUBLIC_*` variables. Cross-origin access is same-origin by default and may be extended only with exact values in `CORS_ALLOWED_ORIGINS`.

For authenticated sessions, **Remember me** is opt-in. The current request IP is masked by default in Settings and is only revealed on explicit user action; the reference application does not persist raw IP addresses.
