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
pnpm typecheck
pnpm lint
pnpm build
```
