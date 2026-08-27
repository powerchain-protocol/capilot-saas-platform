# PowerChain Copilot Frontend

**Canonical version: 1.0.0**

Production-oriented Next.js full-stack SaaS frontend for PowerChain Copilot: renewable infrastructure operations, AI-assisted analysis, governed approvals, assets, PWRC credits, and verified onchain workflows.

## Stack

- Next.js 16.3.3 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase/PostgreSQL production persistence via server-side REST
- Signed HttpOnly sessions
- Vercel-ready deployment

## UI/UX system

The canonical 1.0.0 frontend uses a white / light-gray / dark-green product system with responsive 44px+ interaction targets, focus-visible states, reduced-motion support, loading skeletons, mobile-safe navigation, accessible toast feedback, and the canonical PowerChain / light-gray COPILOT lockup.

The authenticated workspace includes interactive Copilot suggestions, asset search and filters, approval filters and mutations, user-friendly authentication states, and configuration-driven installation flows.

## Main routes

- `/` — marketing
- `/product/`
- `/pricing/`
- `/install/` — platform instructions
- `/setup/` — guided install/distribution source selector
- `/sign-in/`
- `/get-started/`
- `/dashboard/`
- `/dashboard/copilot/`
- `/dashboard/assets/`
- `/dashboard/approvals/`
- `/dashboard/settings/`
- `/docs/`, `/security/`, `/status/`, `/about/`

## Installation sources

Native distribution is configuration-driven:

- GitHub Releases
- Google Drive
- App Store
- Google Play
- Web app

Configure release URLs in `.env.local`. Native channels fail closed when a trusted URL is missing; the UI routes to an access-request workflow instead of presenting a fake download.

## Configuration

Canonical application configuration is under:

```text
config/
  app.ts
  site.ts
  navigation.ts
  install.ts
  rules.ts
  pricing.ts
  faq.ts
```

UI rules and install/security invariants live in `config/rules.ts`.

## Development

```bash
corepack enable
corepack prepare pnpm@11.24.0 --activate
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open `http://localhost:3000`.

## Quality gates

```bash
pnpm check:links
pnpm typecheck
pnpm lint
pnpm build
```

## Production requirements

Production is expected to configure:

- strong `SESSION_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- approved release/distribution URLs as applicable

The server persistence and session configuration are designed to fail closed in production when required security configuration is absent.

## Distribution

Vercel configuration is provided in `vercel.json`. `.vercel/`, build output, secrets, local stores, and generated release ZIPs are ignored by Git.
